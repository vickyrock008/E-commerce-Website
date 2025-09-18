# app/crud.py

from sqlalchemy.orm import Session, joinedload
from . import models, schemas
import re
import datetime
import secrets

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def search_products(db: Session, query: str):
    return db.query(models.Product).filter(
        models.Product.name.ilike(f"%{query}%") |
        models.Product.description.ilike(f"%{query}%")
    ).all()

def create_product(db: Session, product: schemas.ProductCreate):
    product_data = product.model_dump()
    slug = product.name.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    db_product = models.Product(**product_data, slug=slug)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_update: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if db_product:
        update_data = product_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def add_stock_to_product(db: Session, product_id: int, stock_data: schemas.AddStock):
    db_product = get_product(db, product_id)
    if db_product:
        db_product.stock += stock_data.amount
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product

def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(name=category.name, slug=category.slug)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category_update: schemas.CategoryUpdate):
    db_category = get_category(db, category_id)
    if db_category:
        update_data = category_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    db_category = get_category(db, category_id)
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_password_reset_token(db: Session, user: models.User):
    token = secrets.token_urlsafe(32)
    expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    user.reset_token = token
    user.reset_token_expires = expires
    db.commit()
    db.refresh(user)
    return token

def get_user_by_reset_token(db: Session, token: str):
    return db.query(models.User).filter(
        models.User.reset_token == token,
        models.User.reset_token_expires > datetime.datetime.utcnow()
    ).first()

def update_user_password(db: Session, user: models.User, new_password: str):
    user.hashed_password = models.get_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    return user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_order_for_email(db: Session, order_id: int):
    return db.query(models.Order).options(
        joinedload(models.Order.customer),
        joinedload(models.Order.items)
    ).filter(models.Order.id == order_id).first()

def create_order(db: Session, order_data: schemas.OrderCreate, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user: return None

    total = 0.0
    order_items_to_create = []

    for it in order_data.items:
        prod = get_product(db, it.product_id)
        if not prod or prod.stock < it.qty: return None
        subtotal = prod.price * it.qty
        total += subtotal
        order_items_to_create.append({
            "product_id": prod.id, "product_name": prod.name, "qty": it.qty,
            "subtotal": subtotal, "product_instance": prod,
        })

    order = models.Order(
        customer_id=user.id, total=total, customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone, customer_address=order_data.customer_address
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item_data in order_items_to_create:
        item = models.OrderItem(
            order_id=order.id, product_id=item_data["product_id"], product_name=item_data["product_name"],
            qty=item_data["qty"], subtotal=item_data["subtotal"]
        )
        db.add(item)
        product_instance = item_data["product_instance"]
        product_instance.stock -= item_data["qty"]

    db.commit()
    db.refresh(order)
    return order

def create_order(db: Session, order_data: schemas.OrderCreate, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user: return None

    total = 0.0
    order_items_to_create = []

    for it in order_data.items:
        prod = get_product(db, it.product_id)
        if not prod or prod.stock < it.qty: return None
        subtotal = prod.price * it.qty
        total += subtotal
        order_items_to_create.append({
            "product_id": prod.id, "product_name": prod.name, "qty": it.qty,
            "subtotal": subtotal, "product_instance": prod,
        })

    # ✨ 4. Generate the professional, unique order ID
    date_str = datetime.datetime.utcnow().strftime('%Y%m%d')
    random_str = secrets.token_hex(3).upper()
    unique_order_id = f"ORD-{date_str}-{random_str}"

    order = models.Order(
        # ✨ 5. Save the new ID to the database
        order_uid=unique_order_id,
        customer_id=user.id, total=total, customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone, customer_address=order_data.customer_address
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    # ... (the rest of the function remains the same) ...
    for item_data in order_items_to_create:
        item = models.OrderItem(
            order_id=order.id, product_id=item_data["product_id"], product_name=item_data["product_name"],
            qty=item_data["qty"], subtotal=item_data["subtotal"]
        )
        db.add(item)
        product_instance = item_data["product_instance"]
        product_instance.stock -= item_data["qty"]

    db.commit()
    db.refresh(order)
    return order

def get_orders_by_user(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.customer_id == user_id).order_by(models.Order.created_at.desc()).all()


# ✨ THE FIX IS HERE ✨
def get_all_orders(db: Session, show_archived: bool = False):
    query = db.query(models.Order).options(joinedload(models.Order.customer))
    
    # We now have two separate conditions.
    if show_archived:
        # If the toggle is ON, only show archived orders.
        query = query.filter(models.Order.is_archived == True)
    else:
        # If the toggle is OFF, only show non-archived (active) orders.
        query = query.filter(models.Order.is_archived == False)
        
    return query.order_by(models.Order.created_at.desc()).all()


def update_order_status(db: Session, order_id: int, status_update: schemas.OrderUpdate):
    # This part is correct: it archives orders when they are delivered or cancelled.
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        new_status = status_update.status
        if new_status == "cancelled" and db_order.status != "cancelled":
            for item in db_order.items:
                product = get_product(db, item.product_id)
                if product: product.stock += item.qty
        
        db_order.status = new_status
        
        if new_status in ["delivered", "cancelled"]:
            db_order.is_archived = True
        else:
            db_order.is_archived = False
        
        db.commit()
        db.refresh(db_order)
    return db_order

def cancel_order_by_user(db: Session, order_id: int, user_id: int):
    db_order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.customer_id == user_id,
        models.Order.status == "pending"
    ).first()
    if not db_order: return None
    for item in db_order.items:
        product = get_product(db, item.product_id)
        if product: product.stock += item.qty
    db_order.status = "cancelled"
    db_order.is_archived = True
    db.commit()
    db.refresh(db_order)
    return db_order

def create_contact_submission(db: Session, submission: schemas.ContactSubmissionCreate):
    db_submission = models.ContactSubmission(**submission.model_dump())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

def get_contact_submissions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ContactSubmission).order_by(models.ContactSubmission.submitted_at.desc()).offset(skip).limit(limit).all()