from datetime import datetime
from typing import Optional
from beanie import Document
from pydantic import Field, EmailStr

class Contact(Document):
    """Contact form submission model"""
    
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., max_length=200)
    message: str = Field(..., max_length=2000)
    status: str = Field(default="new")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "contacts"
        
    class Config:
        json_schema_extra = {
            "example": {
                "name": "John Doe",
                "email": "john@example.com",
                "phone": "0726894129",
                "subject": "CCTV Installation",
                "message": "I need CCTV cameras for my office in Nairobi"
            }
        }
