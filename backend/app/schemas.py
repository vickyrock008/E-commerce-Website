# app/schemas.py

from pydantic import BaseModel, EmailStr
from typing import List, Optional
import datetime

# --- Schemas for Users ---
class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    is_active: int
    role: str
    class Config:
        from_attributes = True
        
#
# ▼▼▼ THESE SCHEMAS WERE MISSING ▼▼▼
#
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class GoogleToken(BaseModel):
    token: str
#
# ▲▲▲ END OF MISSING SCHEMAS ▲▲▲
#

# --- Schemas for Password Reset ---
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# --- Schemas for Products ---
class ProductBase(BaseModel):
    name: str
    price: float
    description: Optional[str] = None
    # ✨ Make image optional, it will be handled by the form
    image: Optional[str] = None
    category_id: int

class ProductCreate(ProductBase):
    stock: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    # ✨ Also allow image to be updated
    image: Optional[str] = None
    category_id: Optional[int] = None
    # ✨ Allow stock to be updated via this form
    stock: Optional[int] = None

class ProductOut(ProductBase):
    id: int
    stock: int
    class Config:
        from_attributes = True

class AddStock(BaseModel):
    amount: int

# --- Schemas for Categories ---
class CategoryBase(BaseModel):
    name: str
    slug: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None

class CategoryOut(CategoryBase):
    id: int
    products: List[ProductOut] = []
    class Config:
        from_attributes = True

# --- Schemas for Checkout & Orders ---
class CheckoutItem(BaseModel):
    product_id: int
    qty: int

class OrderCreate(BaseModel):
    user_id: int
    items: List[CheckoutItem]
    customer_name: str
    customer_phone: str
    customer_address: str

class OrderItemOut(BaseModel):
    product_name: str
    qty: int
    subtotal: float
    class Config:
        from_attributes = True

class OrderOut(BaseModel):
    id: int
    order_uid: str
    total: float
    status: str
    is_archived: bool
    created_at: datetime.datetime
    items: List[OrderItemOut] = []
    customer: UserOut
    customer_name: str
    customer_phone: str
    customer_address: str

    class Config:
        from_attributes = True

class OrderUpdate(BaseModel):
    status: str

# --- Schemas for Contact Submissions ---
class ContactSubmissionCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str

class ContactSubmissionOut(ContactSubmissionCreate):
    id: int
    submitted_at: datetime.datetime
    class Config:
        from_attributes = True