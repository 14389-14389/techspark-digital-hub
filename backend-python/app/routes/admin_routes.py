from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import jwt
import os
from typing import List, Optional
from bson import ObjectId

from app.models.admin import Admin
from app.schemas.admin import AdminCreate, AdminLogin, AdminResponse, TokenResponse, PasswordChange
from app.models.contact import Contact
from app.models.gallery import GalleryImage, ServiceCategory
from app.models.service_request import ServiceRequest
from app.models.quote import Quote

router = APIRouter(prefix="/api/admin", tags=["Admin"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/login")

# Get SECRET_KEY from env
SECRET_KEY = os.getenv("SECRET_KEY", "techspark_super_secret_key_2026")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# ============ AUTHENTICATION ============

async def get_current_admin(token: str = Depends(oauth2_scheme)):
    """Get current admin from token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id = payload.get("sub")
        if admin_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    admin = await Admin.get(admin_id)
    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found"
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is disabled"
        )
    
    return admin

@router.post("/register", response_model=AdminResponse)
async def register_admin(admin_data: AdminCreate):
    """Register new admin (first run only - disable after creating first admin)"""
    # Check if any admin exists
    admin_count = await Admin.find_all().count()
    
    # Only allow registration if no admin exists (first admin)
    if admin_count > 0:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin registration is disabled. Contact super admin."
        )
    
    # Check if admin exists
    existing = await Admin.find_one(
        Admin.email == admin_data.email
    ) or await Admin.find_one(
        Admin.username == admin_data.username
    )
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Hash password
    hashed_password = Admin.get_password_hash(admin_data.password)
    
    # Create admin (first admin is superuser)
    admin = Admin(
        email=admin_data.email,
        username=admin_data.username,
        full_name=admin_data.full_name,
        hashed_password=hashed_password,
        is_superuser=True  # First admin is superuser
    )
    
    await admin.insert()
    
    # ✅ FIX: Convert ObjectId to string for response
    admin_dict = {
        "id": str(admin.id),
        "email": admin.email,
        "username": admin.username,
        "full_name": admin.full_name,
        "is_active": admin.is_active,
        "is_superuser": admin.is_superuser,
        "created_at": admin.created_at,
        "last_login": admin.last_login
    }
    
    return admin_dict

@router.post("/login", response_model=TokenResponse)
async def login_admin(login_data: AdminLogin):
    """Admin login"""
    # Find admin by username
    admin = await Admin.find_one(Admin.username == login_data.username)
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    # Verify password
    if not admin.verify_password(login_data.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is disabled"
        )
    
    # Update last login
    admin.last_login = datetime.utcnow()
    await admin.save()
    
    # Create access token
    access_token = admin.create_access_token()
    
    # ✅ FIX: Convert ObjectId to string for response
    admin_dict = {
        "id": str(admin.id),
        "email": admin.email,
        "username": admin.username,
        "full_name": admin.full_name,
        "is_active": admin.is_active,
        "is_superuser": admin.is_superuser,
        "created_at": admin.created_at,
        "last_login": admin.last_login
    }
    
    return TokenResponse(
        access_token=access_token,
        admin=admin_dict
    )

@router.get("/me", response_model=AdminResponse)
async def get_current_admin_info(current_admin: Admin = Depends(get_current_admin)):
    """Get current admin information"""
    # ✅ FIX: Convert ObjectId to string for response
    admin_dict = {
        "id": str(current_admin.id),
        "email": current_admin.email,
        "username": current_admin.username,
        "full_name": current_admin.full_name,
        "is_active": current_admin.is_active,
        "is_superuser": current_admin.is_superuser,
        "created_at": current_admin.created_at,
        "last_login": current_admin.last_login
    }
    
    return admin_dict

@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_admin: Admin = Depends(get_current_admin)
):
    """Change admin password"""
    # Verify current password
    if not current_admin.verify_password(password_data.current_password, current_admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Hash new password
    current_admin.hashed_password = Admin.get_password_hash(password_data.new_password)
    await current_admin.save()
    
    return {"message": "Password changed successfully"}

# ============ DASHBOARD STATS ============

@router.get("/dashboard/stats")
async def get_dashboard_stats(current_admin: Admin = Depends(get_current_admin)):
    """Get dashboard statistics"""
    try:
        # Get counts
        total_contacts = await Contact.find_all().count()
        total_gallery = await GalleryImage.find_all().count()
        total_repairs = await ServiceRequest.find_all().count()
        total_quotes = await Quote.find_all().count()
        
        # Get recent contacts
        recent_contacts = await Contact.find_all()\
            .sort(-Contact.created_at)\
            .limit(5)\
            .to_list()
        
        # Get recent gallery uploads
        recent_uploads = await GalleryImage.find_all()\
            .sort(-GalleryImage.uploaded_at)\
            .limit(5)\
            .to_list()
        
        # Get category counts for gallery
        categories = []
        for cat in ["cctv", "development", "repairs", "network", "consultancy"]:
            count = await GalleryImage.find(
                GalleryImage.service_category == cat
            ).count()
            categories.append({"name": cat, "count": count})
        
        return {
            "counts": {
                "contacts": total_contacts,
                "gallery_images": total_gallery,
                "service_requests": total_repairs,
                "quotes": total_quotes
            },
            "recent_contacts": [
                {
                    "id": str(c.id),
                    "name": c.name,
                    "email": c.email,
                    "subject": c.subject,
                    "created_at": c.created_at
                } for c in recent_contacts
            ],
            "recent_uploads": [
                {
                    "id": str(g.id),
                    "title": g.title,
                    "category": g.service_category,
                    "image_url": g.image_url,
                    "uploaded_at": g.uploaded_at
                } for g in recent_uploads
            ],
            "gallery_categories": categories
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get dashboard stats: {str(e)}"
        )

# ============ GALLERY MANAGEMENT ============

@router.get("/gallery")
async def get_all_gallery_images(
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all gallery images (admin view)"""
    images = await GalleryImage.find_all()\
        .sort(-GalleryImage.uploaded_at)\
        .to_list()
    
    return [
        {
            "id": str(img.id),
            "title": img.title,
            "description": img.description,
            "image_url": img.image_url,
            "category": img.service_category,
            "subcategory": img.service_subcategory,
            "featured": img.featured,
            "views": img.views,
            "likes": img.likes,
            "uploaded_at": img.uploaded_at
        } for img in images
    ]

@router.put("/gallery/{image_id}")
async def update_gallery_image(
    image_id: str,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    service_category: Optional[str] = Form(None),
    service_subcategory: Optional[str] = Form(None),
    featured: Optional[bool] = Form(None),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update gallery image details"""
    image = await GalleryImage.get(image_id)
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    if title:
        image.title = title
    if description is not None:
        image.description = description
    if service_category:
        image.service_category = service_category
    if service_subcategory is not None:
        image.service_subcategory = service_subcategory
    if featured is not None:
        image.featured = featured
    
    image.updated_at = datetime.utcnow()
    await image.save()
    
    return {"message": "Image updated successfully"}

@router.delete("/gallery/{image_id}")
async def delete_gallery_image(
    image_id: str,
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete gallery image"""
    image = await GalleryImage.get(image_id)
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    await image.delete()
    return {"message": "Image deleted successfully"}

# ============ CONTACT MANAGEMENT ============

@router.get("/contacts")
async def get_all_contacts(
    skip: int = 0,
    limit: int = 50,
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all contact submissions"""
    total = await Contact.find_all().count()
    contacts = await Contact.find_all()\
        .sort(-Contact.created_at)\
        .skip(skip)\
        .limit(limit)\
        .to_list()
    
    return {
        "total": total,
        "contacts": [
            {
                "id": str(c.id),
                "name": c.name,
                "email": c.email,
                "phone": c.phone,
                "subject": c.subject,
                "message": c.message,
                "status": c.status,
                "created_at": c.created_at
            } for c in contacts
        ]
    }

@router.put("/contacts/{contact_id}/status")
async def update_contact_status(
    contact_id: str,
    status: str = Form(...),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update contact status (new, read, replied, closed)"""
    contact = await Contact.get(contact_id)
    
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    
    contact.status = status
    contact.updated_at = datetime.utcnow()
    await contact.save()
    
    return {"message": f"Contact marked as {status}"}

# ============ SERVICE REQUEST MANAGEMENT ============

@router.get("/service-requests")
async def get_all_service_requests(
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all service/repair requests"""
    query = {}
    if status:
        query["status"] = status
    
    total = await ServiceRequest.find(query).count()
    requests = await ServiceRequest.find(query)\
        .sort(-ServiceRequest.created_at)\
        .skip(skip)\
        .limit(limit)\
        .to_list()
    
    return {
        "total": total,
        "requests": [
            {
                "id": str(r.id),
                "name": r.name,
                "email": r.email,
                "phone": r.phone,
                "service_type": r.service_type,
                "device_type": r.device_type,
                "issue_description": r.issue_description,
                "status": r.status,
                "priority": r.priority,
                "created_at": r.created_at
            } for r in requests
        ]
    }

@router.put("/service-requests/{request_id}/status")
async def update_service_request_status(
    request_id: str,
    status: str = Form(...),
    estimated_cost: Optional[float] = Form(None),
    estimated_days: Optional[int] = Form(None),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update service request status"""
    request = await ServiceRequest.get(request_id)
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service request not found"
        )
    
    request.status = status
    if estimated_cost is not None:
        request.estimated_cost = estimated_cost
    if estimated_days is not None:
        request.estimated_days = estimated_days
    
    request.updated_at = datetime.utcnow()
    await request.save()
    
    return {"message": f"Request status updated to {status}"}