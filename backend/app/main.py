# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from . import models
from .routes import products, checkout, categories, auth, users, orders, contact
import os

# This line ensures all your tables are created when the app starts
models.Base.metadata.create_all(bind=engine) 

app = FastAPI(title="ButchersGuide Clone API")

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