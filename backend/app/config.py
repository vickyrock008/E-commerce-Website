from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # --- Database ---
    DATABASE_URL: str

    # --- Application URLs ---
    FRONTEND_URL: str
    BACKEND_URL: str

    # --- Mail Settings ---
    # These are required for the SendGrid API
    MAIL_PASSWORD: str
    MAIL_FROM: str
    ADMIN_EMAIL: str
    


    # --- Google OAuth ---
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str


    class Config:
        env_file = ".env"

settings = Settings()
