from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # --- Core Settings (from your Render env) ---
    DATABASE_URL: str
    ADMIN_EMAIL: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str

    # ✨ ADDED: These are in your Render env but not your config
    BACKEND_URL: str
    FRONTEND_URL: str

    # --- Mail Settings ---
    # These were already in your Render env
    MAIL_PASSWORD: str
    MAIL_FROM: str
    
    # ✨ FIXED: Added defaults for the 5 missing mail variables.
    # These defaults are for SendGrid (based on your browser tab).
    
    # SendGrid's required username is "apikey"
    MAIL_USERNAME: str = "apikey"
    
    # SendGrid's standard SMTP server
    MAIL_SERVER: str = "smtp.sendgrid.net"
    
    # SendGrid's standard port for STARTTLS
    MAIL_PORT: int = 587
    
    # Use STARTTLS (True) not SSL/TLS (False) for port 587
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False


    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
