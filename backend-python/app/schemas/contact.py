from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class ContactBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=20)
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=2000)

class ContactCreate(ContactBase):
    pass

class ContactResponse(ContactBase):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
