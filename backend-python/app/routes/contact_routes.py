from fastapi import APIRouter, HTTPException, status
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, ContactResponse
from app.services.email_service import EmailService
from typing import List

router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact(contact_data: ContactCreate):
    """Submit contact form - sends email and saves to database"""
    try:
        # Create contact in database
        contact = Contact(
            name=contact_data.name,
            email=contact_data.email,
            phone=contact_data.phone,
            subject=contact_data.subject,
            message=contact_data.message
        )
        
        await contact.insert()
        
        # Send email notification
        await EmailService.send_contact_notification(
            name=contact_data.name,
            email=contact_data.email,
            phone=contact_data.phone,
            subject=contact_data.subject,
            message=contact_data.message
        )
        
        return contact
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit contact form: {str(e)}"
        )

@router.get("/", response_model=List[ContactResponse])
async def get_all_contacts():
    """Get all contact submissions"""
    contacts = await Contact.all().sort(-Contact.created_at).to_list()
    return contacts

@router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(contact_id: str):
    """Get single contact by ID"""
    contact = await Contact.get(contact_id)
    if not contact:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact not found"
        )
    return contact
