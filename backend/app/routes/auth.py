# app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
# ✨ 1. Add new imports
from google.oauth2 import id_token
from google.auth.transport import requests
from ..config import settings

from .. import schemas, models, crud
from ..database import get_db
from ..models import get_password_hash, verify_password
from ..security import create_access_token
from ..email import send_password_reset_email

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ✨ 2. ADD THIS NEW ENDPOINT
@router.post("/google", response_model=schemas.Token) # Assuming you have a Token schema, or use the same return as /token
def login_with_google(
    token_data: schemas.GoogleToken, 
    db: Session = Depends(get_db)
):
    try:
        # Verify the token with Google
        id_info = id_token.verify_oauth2_token(
            token_data.token, 
            requests.Request(), 
            settings.GOOGLE_CLIENT_ID
        )
        
        email = id_info["email"]
        name = id_info.get("name", "Google User")

    except ValueError:
        # Invalid token
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate Google token",
        )
    
    # Check if user already exists
    user = crud.get_user_by_email(db, email=email)
    
    if not user:
        # If user doesn't exist, create a new one
        # Note: We create them without a password since they use Google to log in
        user = models.User(
            email=email,
            name=name,
            hashed_password=""  # No password
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Create our own access token (just like in the /token endpoint)
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer", 
        "user": schemas.UserOut.from_orm(user)
    }


@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    #
    # ▼▼▼ THIS IS THE MISSING CODE ▼▼▼
    #
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
    #
    # ▲▲▲ END OF MISSING CODE ▲▲▲
    #

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    #
    # ▼▼▼ THIS IS THE MISSING CODE ▼▼▼
    #
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": schemas.UserOut.from_orm(user)
    }
    #
    # ▲▲▲ END OF MISSING CODE ▲▲▲
    #

@router.post("/forgot-password")
def forgot_password(
    request: schemas.ForgotPasswordRequest, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(db, email=request.email)
    if user:
        token = crud.create_password_reset_token(db, user=user)
        background_tasks.add_task(
            send_password_reset_email,
            email_to=user.email,
            user_name=user.name,
            token=token
        )
    return {"message": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_reset_token(db, token=request.token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    crud.update_user_password(db, user=user, new_password=request.new_password)
    return {"message": "Password updated successfully."}