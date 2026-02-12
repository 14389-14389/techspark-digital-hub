from fastapi import APIRouter, HTTPException, status, Depends, Form
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.models.contact import Contact
from app.models.admin import Admin
from app.routes.admin_routes import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Contacts"])

@router.get("/contacts")
async def get_all_contacts(
    skip: int = 0,
    limit: int = 50,
    status_filter: Optional[str] = None,
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all contact submissions with filters"""
    query = {}
    if status_filter:
        query["status"] = status_filter
    
    total = await Contact.find(query).count()
    contacts = await Contact.find(query)\
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
                "created_at": c.created_at.isoformat()
            } for c in contacts
        ]
    }

@router.get("/contacts/{contact_id}")
async def get_contact_detail(
    contact_id: str,
    current_admin: Admin = Depends(get_current_admin)
):
    """Get single contact by ID"""
    contact = await Contact.get(contact_id)
    
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    
    return {
        "id": str(contact.id),
        "name": contact.name,
        "email": contact.email,
        "phone": contact.phone,
        "subject": contact.subject,
        "message": contact.message,
        "status": contact.status,
        "created_at": contact.created_at.isoformat()
    }

@router.put("/contacts/{contact_id}/status")
async def update_contact_status(
    contact_id: str,
    status: str = Form(...),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update contact status"""
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

@router.delete("/contacts/{contact_id}")
async def delete_contact(
    contact_id: str,
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete contact"""
    contact = await Contact.get(contact_id)
    
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    
    await contact.delete()
    return {"message": "Contact deleted successfully"}