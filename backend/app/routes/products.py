# app/routes/products.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, models
from ..database import get_db
from ..security import require_admin_user

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
@router.post("/", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db=db, product=product)

@router.put("/{product_id}", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = crud.update_product(db, product_id=product_id, product_update=product)
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
    return db_product