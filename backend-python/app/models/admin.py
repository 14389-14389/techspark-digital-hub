from datetime import datetime, timedelta
from typing import Optional
from beanie import Document
from pydantic import Field, EmailStr
from passlib.context import CryptContext
from jose import jwt
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class Admin(Document):
    """Admin user model"""
    
    email: EmailStr = Field(..., unique=True)
    username: str = Field(..., min_length=3, max_length=50, unique=True)
    full_name: str = Field(..., min_length=1, max_length=100)
    hashed_password: str = Field(...)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    class Settings:
        name = "admins"
        indexes = [
            "email",
            "username"
        ]
    
    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Verify password"""
        return pwd_context.verify(plain_password, hashed_password)
    
    @classmethod
    def get_password_hash(cls, password: str) -> str:
        """Hash password"""
        return pwd_context.hash(password)
    
    def create_access_token(self) -> str:
        """Create JWT access token"""
        to_encode = {
            "sub": str(self.id),
            "email": self.email,
            "username": self.username,
            "exp": datetime.utcnow() + timedelta(days=7)
        }
        secret_key = os.getenv("SECRET_KEY", "techspark_super_secret_key_2026")
        algorithm = os.getenv("ALGORITHM", "HS256")
        
        return jwt.encode(to_encode, secret_key, algorithm=algorithm)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "admin@techspark.co.ke",
                "username": "techspark_admin",
                "full_name": "Techspark Admin",
                "password": "SecurePassword123!"
            }
        }