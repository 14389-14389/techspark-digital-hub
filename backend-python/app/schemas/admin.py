from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from bson import ObjectId  # ✅ MUST HAVE THIS IMPORT

class AdminBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)
    full_name: str = Field(..., min_length=1, max_length=100)

class AdminCreate(AdminBase):
    password: str = Field(..., min_length=8)

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    id: str  # This will receive a string, not ObjectId
    email: EmailStr
    username: str
    full_name: str
    is_active: bool
    is_superuser: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    
    class Config:
        from_attributes = True
        # ✅ FIX: Properly handle ObjectId to string conversion
        json_encoders = {
            ObjectId: str
        }

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin: AdminResponse

class PasswordChange(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)