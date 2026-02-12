from datetime import datetime
from typing import Optional, ClassVar, List
from beanie import Document
from pydantic import Field, EmailStr

class Quote(Document):
    """Quote request model for CCTV and other services"""
    
    # Class variables - MUST be annotated with ClassVar
    SERVICE_CATEGORIES: ClassVar[List[str]] = ["cctv", "development", "repairs", "network", "consultancy", "other"]
    
    # Model fields (all MUST have type annotations)
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    service_category: str = Field(...)
    project_description: str = Field(..., max_length=2000)
    site_address: Optional[str] = None
    preferred_date: Optional[datetime] = None
    budget_range: Optional[str] = None
    status: str = Field(default="pending")
    quoted_amount: Optional[float] = None
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "quotes"
        
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Michael Otieno",
                "email": "michael@example.com",
                "phone": "0722123456",
                "service_category": "cctv",
                "project_description": "Need 4 CCTV cameras for home, night vision required",
                "site_address": "Westlands, Nairobi",
                "budget_range": "50,000 - 80,000 KES"
            }
        }
