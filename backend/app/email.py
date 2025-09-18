from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pathlib import Path
from datetime import datetime
import asyncio
from .config import settings
from .database import SessionLocal
from . import crud

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME, MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM, MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER, MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS, USE_CREDENTIALS=True,
    VALIDATE_CERTS=True, TEMPLATE_FOLDER=Path(__file__).parent / 'templates',
)
fm = FastMail(conf)

def generate_items_html(items):
    html = ""
    for item in items:
        html += f"<tr><td>{item.product_name}</td><td>{item.qty}</td><td>₹{item.subtotal:.2f}</td></tr>"
    return html

async def send_order_confirmation_email(email_to: str, order_id: int):
    db = SessionLocal()
    try:
        order_details = crud.get_order_for_email(db, order_id)
        if not order_details:
            print(f"❌ Could not find order #{order_id} to send confirmation email.")
            return
        items_html = generate_items_html(order_details.items)
        template_body = { "customer_name": order_details.customer_name, "order_uid": order_details.order_uid, "items_html": items_html, "total": f"{order_details.total:.2f}", "address": order_details.customer_address, "year": datetime.utcnow().year }
        message = MessageSchema(subject="Your Classic Meat & Products Order Confirmation", recipients=[email_to], template_body=template_body, subtype="html")
        await fm.send_message(message, template_name="order_confirmation.html")
        print(f"✅ Order confirmation email sent to {email_to} for order #{order_details.order_uid}")
    except Exception as e:
        print(f"❌ Failed to send order confirmation email. Error: {e}")
    finally:
        db.close()

async def send_new_order_admin_notification(order_id: int):
    db = SessionLocal()
    try:
        order_details = crud.get_order_for_email(db, order_id)
        if not order_details:
            print(f"❌ Could not find order #{order_id} to send admin notification.")
            return
        items_html = generate_items_html(order_details.items)
        template_body = { "customer_name": order_details.customer_name, "customer_phone": order_details.customer_phone, "order_uid": order_details.order_uid, "items_html": items_html, "total": f"{order_details.total:.2f}", "address": order_details.customer_address, }
        message = MessageSchema(subject=f"New Order Received! (#{order_details.order_uid})", recipients=[settings.ADMIN_EMAIL], template_body=template_body, subtype="html")
        await fm.send_message(message, template_name="new_order_admin_notification.html")
        print(f"✅ Admin notification sent for order #{order_details.order_uid}")
    except Exception as e:
        print(f"❌ Failed to send admin notification. Error: {e}")
    finally:
        db.close()

async def send_all_order_emails(customer_email: str, order_id: int):
    await send_order_confirmation_email(email_to=customer_email, order_id=order_id)
    print("--- Waiting 10 seconds before sending admin email... ---")
    await asyncio.sleep(10)
    await send_new_order_admin_notification(order_id=order_id)

async def send_order_delivered_email(email_to: str, order_id: int):
    db = SessionLocal()
    try:
        order_details = crud.get_order_for_email(db, order_id)
        if not order_details:
            print(f"❌ Could not find order #{order_id} to send delivered email.")
            return
        template_body = { "customer_name": order_details.customer_name, "order_uid": order_details.order_uid, "year": datetime.utcnow().year }
        message = MessageSchema(subject="Your Classic Meat & Products Order Has Been Delivered!", recipients=[email_to], template_body=template_body, subtype="html")
        await fm.send_message(message, template_name="order_delivered.html")
        print(f"✅ Order delivered email sent to {email_to} for order #{order_details.order_uid}")
    except Exception as e:
        print(f"❌ Failed to send delivered email. Error: {e}")
    finally:
        db.close()

async def send_order_cancelled_email(email_to: str, order_id: int):
    db = SessionLocal()
    try:
        order_details = crud.get_order_for_email(db, order_id)
        if not order_details:
            print(f"❌ Could not find order #{order_id} to send cancelled email.")
            return
        template_body = { "customer_name": order_details.customer_name, "order_uid": order_details.order_uid, "year": datetime.utcnow().year }
        message = MessageSchema(subject="Your Classic Meat & Products Order Has Been Cancelled", recipients=[email_to], template_body=template_body, subtype="html")
        await fm.send_message(message, template_name="order_cancelled.html")
        print(f"✅ Order cancelled email sent to {email_to} for order #{order_details.order_uid}")
    except Exception as e:
        print(f"❌ Failed to send cancelled email. Error: {e}")
    finally:
        db.close()
        
# ✨ ADD THIS NEW FUNCTION for the admin cancellation notification
async def send_order_cancelled_admin_notification(order_id: int):
    db = SessionLocal()
    try:
        order_details = crud.get_order_for_email(db, order_id)
        if not order_details:
            print(f"❌ Could not find order #{order_id} to send admin cancellation notification.")
            return

        template_body = { 
            "customer_name": order_details.customer_name, 
            "order_uid": order_details.order_uid, 
        }
        message = MessageSchema(
            subject=f"Notice: Order #{order_details.order_uid} has been cancelled",
            recipients=[settings.ADMIN_EMAIL],
            template_body=template_body,
            subtype="html"
        )
        await fm.send_message(message, template_name="order_cancelled_admin_notification.html")
        print(f"✅ Admin cancellation notification sent for order #{order_details.order_uid}")
    except Exception as e:
        print(f"❌ Failed to send admin cancellation notification. Error: {e}")
    finally:
        db.close()

async def send_password_reset_email(email_to: str, user_name: str, token: str):
    reset_link = f"http://localhost:5173/reset-password?token={token}"
    template_body = { "customer_name": user_name, "reset_link": reset_link, "year": datetime.utcnow().year }
    message = MessageSchema(subject="Your Password Reset Link for Classic Meat & Products", recipients=[email_to], template_body=template_body, subtype="html")
    try:
        await fm.send_message(message, template_name="password_reset.html")
        print(f"✅ Password reset email sent to {email_to}")
    except Exception as e:
        print(f"❌ Failed to send password reset email. Error: {e}")