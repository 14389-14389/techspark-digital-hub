from datetime import datetime, timedelta
from typing import Optional
from beanie import Document
from pydantic import Field
import secrets
import hashlib

class PasswordReset(Document):
    """Password reset token model"""
    
    admin_id: str = Field(...)
    email: str = Field(...)
    token: str = Field(...)
    token_hash: str = Field(...)
    expires_at: datetime = Field(...)
    used: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "password_resets"
        indexes = [
            "token_hash",
            "expires_at"
        ]
    
    @classmethod
    def generate_token(cls) -> str:
        """Generate a secure random token"""
        return secrets.token_urlsafe(32)
    
    @classmethod
    def hash_token(cls, token: str) -> str:
        """Hash token for storage"""
        return hashlib.sha256(token.encode()).hexdigest()
    
    @classmethod
    async def create_reset_token(cls, admin_id: str, email: str) -> str:
        """Create a new password reset token"""
        await cls.find(cls.admin_id == admin_id).delete()
        token = cls.generate_token()
        token_hash = cls.hash_token(token)
        reset = cls(
            admin_id=admin_id,
            email=email,
            token=token,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )
        await reset.insert()
        return token
    
    @classmethod
    async def verify_token(cls, token: str) -> Optional['PasswordReset']:
        """Verify a reset token"""
        token_hash = cls.hash_token(token)
        reset = await cls.find_one(
            cls.token_hash == token_hash,
            cls.used == False,
            cls.expires_at > datetime.utcnow()
        )
        return reset
    
    async def mark_used(self):
        """Mark token as used"""
        self.used = True
        await self.save()
