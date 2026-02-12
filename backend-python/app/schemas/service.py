from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class ServiceRequestBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(..., max_length=20)
    service_type: str
    device_type: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    issue_description: str = Field(..., max_length=2000)
    preferred_date: Optional[datetime] = None
    address: Optional[str] = None
    priority: str = "normal"

class ServiceRequestCreate(ServiceRequestBase):
    pass

class ServiceRequestResponse(ServiceRequestBase):
    id: str
    status: str
    estimated_cost: Optional[float] = None
    estimated_days: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True