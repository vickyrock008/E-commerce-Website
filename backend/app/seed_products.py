from app.database import SessionLocal
from app.models import Product, Category

def run():
    db = SessionLocal()

    # Clear old data to prevent duplicates
    db.query(Product).delete()
    db.query(Category).delete()
    db.commit()

    # Create Categories
    mutton_cat = Category(name="Mutton", slug="mutton")
    chicken_cat = Category(name="Chicken", slug="chicken")
    beef_cat = Category(name="Beef", slug="beef")
    
    db.add_all([mutton_cat, chicken_cat, beef_cat])
    db.commit()

    # Create Products and link them to categories by their new IDs
    products_to_add = [
        Product(name="Chicken Breast", price=250, category_id=chicken_cat.id, description="Juicy and tender chicken breast."),
        Product(name="Mutton Curry Cut", price=550, category_id=mutton_cat.id, description="Perfect for rich and flavorful curries."),
        Product(name="Chicken Wings", price=200, category_id=chicken_cat.id, description="Great for grilling or frying."),
        Product(name="Mutton Chops", price=650, category_id=mutton_cat.id, description="Thick, succulent mutton chops."),
        Product(name="Beef Steak", price=750, category_id=beef_cat.id, description="A premium cut of beef, perfect for searing."),
    ]
    
    db.add_all(products_to_add)
    db.commit()
    db.close()
    print("✅ Seeded categories and products.")

if __name__ == "__main__":
    run()