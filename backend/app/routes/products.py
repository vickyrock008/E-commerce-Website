# app/routes/products.py

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, models
from ..database import get_db
from ..security import require_admin_user

# ✨ 1. Import necessary libraries for file handling
import shutil
import os
import uuid

router = APIRouter(prefix="/api/products", tags=["products"])

# --- Public Routes ---
@router.get("/search", response_model=List[schemas.ProductOut])
def search_for_products(query: Optional[str] = None, db: Session = Depends(get_db)):
    if not query:
        return []
    products = crud.search_products(db, query=query)
    return products

@router.get("/", response_model=List[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    products = crud.get_products(db)
    return products

@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id=product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# --- PROTECTED ADMIN ROUTES ---

# ✨ 2. Refactor create_product to handle multipart/form-data
@router.post("/", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def create_product(
    db: Session = Depends(get_db),
    # Get form fields
    name: str = Form(...),
    price: float = Form(...),
    description: Optional[str] = Form(None),
    stock: int = Form(...),
    category_id: int = Form(...),
    # Get the image file
    image: Optional[UploadFile] = File(None)
):
    image_path = None
    if image:
        # Define the path where the image will be saved
        save_path_dir = "static/images"
        # Create a unique filename
        filename = f"{uuid.uuid4()}_{image.filename}"
        image_path = os.path.join(save_path_dir, filename)
        
        # Save the file
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Store the web-accessible URL path
        image_path = f"/static/images/{filename}"

    # Create a pydantic schema from the form data
    product_data = schemas.ProductCreate(
        name=name,
        price=price,
        description=description,
        stock=stock,
        category_id=category_id,
        image=image_path  # Save the path to the DB
    )
    
    return crud.create_product(db=db, product=product_data)

# ✨ 3. Refactor update_product to also handle optional image uploads
@router.put("/{product_id}", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def update_product(
    product_id: int,
    db: Session = Depends(get_db),
    # Get form fields
    name: str = Form(...),
    price: float = Form(...),
    description: Optional[str] = Form(None),
    stock: int = Form(...),
    category_id: int = Form(...),
    # Get the (optional) new image file
    image: Optional[UploadFile] = File(None)
):
    # First, get the existing product
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    image_path = db_product.image  # Keep the old image path by default

    if image:
        # If a new image is uploaded, save it
        save_path_dir = "static/images"
        filename = f"{uuid.uuid4()}_{image.filename}"
        new_image_path = os.path.join(save_path_dir, filename)
        
        with open(new_image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Store the new web-accessible URL path
        image_path = f"/static/images/{filename}"
        
        # Optional: Delete the old image file from disk
        if db_product.image:
            old_image_disk_path = db_product.image.lstrip("/") # remove leading /
            if os.path.exists(old_image_disk_path):
                try:
                    os.remove(old_image_disk_path)
                except OSError as e:
                    print(f"Error deleting old file: {e}")


    # Create the update schema
    product_update_data = schemas.ProductUpdate(
        name=name,
        price=price,
        description=description,
        stock=stock,
        category_id=category_id,
        image=image_path # Save the new (or old) path
    )

    # Pass all fields to the update function
    db_product = crud.update_product(db, product_id=product_id, product_update=product_update_data)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

# ✨ NEW ROUTE TO ADD STOCK
@router.post("/{product_id}/add_stock", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def add_stock(product_id: int, stock_data: schemas.AddStock, db: Session = Depends(get_db)):
    db_product = crud.add_stock_to_product(db, product_id=product_id, stock_data=stock_data)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.delete_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Also delete the image file from disk
    if db_product.image:
        image_disk_path = db_product.image.lstrip("/") # remove leading /
        if os.path.exists(image_disk_path):
            try:
                os.remove(image_disk_path)
            except OSError as e:
                print(f"Error deleting file on product delete: {e}")

    return db_product
