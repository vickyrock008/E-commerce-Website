from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # ✨ Add this line to load the database URL from .env
    DATABASE_URL: str

    # --- Mail Settings ---
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    ADMIN_EMAIL: str

    # --- Google OAuth ---
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str


    class Config:
        env_file = ".env"
        extra = "ignore"  # <-- ADD THIS LINE

settings = Settings()
