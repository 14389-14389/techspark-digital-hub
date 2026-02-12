from datetime import datetime
from typing import Optional, ClassVar, List
from beanie import Document
from pydantic import Field, EmailStr

class ServiceRequest(Document):
    """Repair and service request model"""
    
    # Class variables
    SERVICE_TYPES: ClassVar[List[str]] = ["laptop", "smartphone", "tablet", "printer", "cctv", "network", "other"]
    STATUS_TYPES: ClassVar[List[str]] = ["pending", "diagnosing", "repairing", "completed", "collected"]
    PRIORITY_TYPES: ClassVar[List[str]] = ["low", "normal", "high", "urgent"]
    
    # Model fields
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    service_type: str = Field(...)
    device_type: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    issue_description: str = Field(..., max_length=2000)
    preferred_date: Optional[datetime] = None  # ✅ ADD THIS FIELD
    address: Optional[str] = None              # ✅ ADD THIS FIELD
    status: str = Field(default="pending")
    priority: str = Field(default="normal")
    estimated_cost: Optional[float] = None
    estimated_days: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "service_requests"
        
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Jane Smith",
                "email": "jane@example.com",
                "phone": "0743455893",
                "service_type": "laptop",
                "brand": "HP",
                "model": "Pavilion",
                "issue_description": "Screen is cracked and battery not charging",
                "preferred_date": "2026-02-15T10:00:00",
                "address": "Nairobi, Kenya",
                "priority": "high"
            }
        }