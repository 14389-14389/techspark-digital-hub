from datetime import datetime
from typing import Optional, List
from beanie import Document
from pydantic import Field
from enum import Enum

class ServiceCategory(str, Enum):
    ALL = "all"
    DEVELOPMENT = "development"
    REPAIRS = "repairs"
    CCTV = "cctv"
    NETWORK = "network"
    CONSULTANCY = "consultancy"

class GalleryImage(Document):
    """Gallery image model for service photos"""
    
    # Image details
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    image_url: str = Field(...)
    image_public_id: Optional[str] = None
    
    # Service category
    service_category: ServiceCategory = Field(default=ServiceCategory.ALL)
    service_subcategory: Optional[str] = Field(None, max_length=100)
    
    # Display settings
    featured: bool = Field(default=False)
    display_order: int = Field(default=0)
    
    # Metadata
    uploaded_by: Optional[str] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Stats
    views: int = Field(default=0)
    likes: int = Field(default=0)
    
    class Settings:
        name = "gallery_images"
        indexes = [
            "service_category",
            "featured",
            "uploaded_at"
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "Office CCTV Installation",
                "description": "4K Hikvision cameras installed at Westlands office",
                "image_url": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
                "service_category": "cctv",
                "service_subcategory": "ip-cameras",
                "featured": True,
                "display_order": 1
            }
        }