from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from pydantic import BaseModel, EmailStr
from datetime import datetime
import httpx
import os
from dotenv import load_dotenv

from app.models.admin import Admin
from app.models.password_reset import PasswordReset

load_dotenv()

router = APIRouter(prefix="/api/admin", tags=["Admin Password Reset"])

EMAILJS_SERVICE_ID = os.getenv("EMAILJS_SERVICE_ID")
EMAILJS_TEMPLATE_ID = os.getenv("EMAILJS_TEMPLATE_ID")
EMAILJS_PUBLIC_KEY = os.getenv("EMAILJS_PUBLIC_KEY")
EMAILJS_PRIVATE_KEY = os.getenv("EMAILJS_PRIVATE_KEY")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://techspark-digital-hub.vercel.app")

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

async def send_reset_email(email: str, reset_token: str, name: str):
    """Send password reset email via EmailJS"""
    try:
        reset_link = f"{FRONTEND_URL}/admin/reset-password?token={reset_token}"
        async with httpx.AsyncClient() as client:
            await client.post(
                "https://api.emailjs.com/api/v1.0/email/send",
                json={
                    "service_id": EMAILJS_SERVICE_ID,
                    "template_id": EMAILJS_TEMPLATE_ID,
                    "user_id": EMAILJS_PUBLIC_KEY,
                    "accessToken": EMAILJS_PRIVATE_KEY,
                    "template_params": {
                        "to_email": email,
                        "to_name": name,
                        "reset_link": reset_link,
                        "company_name": "Techspark Technologies"
                    }
                }
            )
    except Exception as e:
        print(f"Email error: {e}")

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, background_tasks: BackgroundTasks):
    """Request password reset email"""
    admin = await Admin.find_one(Admin.email == request.email)
    if not admin:
        return {"message": "If an account exists with this email, you will receive a password reset link."}
    
    reset_token = await PasswordReset.create_reset_token(str(admin.id), admin.email)
    background_tasks.add_task(send_reset_email, admin.email, reset_token, admin.full_name)
    return {"message": "If an account exists with this email, you will receive a password reset link."}

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest):
    """Reset password using token"""
    reset = await PasswordReset.verify_token(request.token)
    if not reset:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    admin = await Admin.get(reset.admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    admin.hashed_password = Admin.get_password_hash(request.new_password)
    await admin.save()
    await reset.mark_used()
    
    return {"message": "Password reset successfully"}
