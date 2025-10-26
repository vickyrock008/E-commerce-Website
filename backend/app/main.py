# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# ✨ 1. Import StaticFiles
from fastapi.staticfiles import StaticFiles
import os # Import os

from .database import engine, Base
from . import models
from .routes import products, checkout, categories, auth, users, orders, contact

# This line ensures all your tables are created when the app starts
models.Base.metadata.create_all(bind=engine) 

app = FastAPI(title="ButchersGuide Clone API")

# ✨ 2. Create the 'static/images' directory if it doesn't exist
# This is where your uploaded product images will be stored
os.makedirs("static/images", exist_ok=True)

# ✨ 3. Mount the 'static' directory to be served by FastAPI
# This makes any file in 'static' accessible via a URL
# e.g., http://localhost:8000/static/images/my-image.png
app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all the API routes from your application
app.include_router(products.router)
app.include_router(checkout.router)
app.include_router(categories.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(contact.router)

@app.get('/')
def root():
    return {"message": "ButchersGuide clone backend is running."}
