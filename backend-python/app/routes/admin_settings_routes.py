from fastapi import APIRouter, HTTPException, status, Depends, Form
from datetime import datetime
from bson import ObjectId

from app.models.admin import Admin
from app.schemas.admin import PasswordChange
from app.routes.admin_routes import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Settings"])

@router.get("/settings/profile")
async def get_admin_profile(
    current_admin: Admin = Depends(get_current_admin)
):
    """Get current admin profile"""
    return {
        "id": str(current_admin.id),
        "email": current_admin.email,
        "username": current_admin.username,
        "full_name": current_admin.full_name,
        "is_active": current_admin.is_active,
        "is_superuser": current_admin.is_superuser,
        "created_at": current_admin.created_at.isoformat(),
        "last_login": current_admin.last_login.isoformat() if current_admin.last_login else None
    }

@router.put("/settings/profile")
async def update_admin_profile(
    full_name: str = Form(...),
    email: str = Form(...),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update admin profile"""
    current_admin.full_name = full_name
    current_admin.email = email
    await current_admin.save()
    
    return {"message": "Profile updated successfully"}

@router.post("/settings/change-password")
async def change_admin_password(
    password_data: PasswordChange,
    current_admin: Admin = Depends(get_current_admin)
):
    """Change admin password"""
    if not current_admin.verify_password(password_data.current_password, current_admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_admin.hashed_password = Admin.get_password_hash(password_data.new_password)
    await current_admin.save()
    
    return {"message": "Password changed successfully"}