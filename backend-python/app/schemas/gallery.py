from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List
from app.models.gallery import ServiceCategory

class GalleryImageBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    image_url: str
    service_category: ServiceCategory
    service_subcategory: Optional[str] = Field(None, max_length=100)
    featured: bool = False
    display_order: int = 0

class GalleryImageCreate(GalleryImageBase):
    pass

class GalleryImageUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=500)
    service_category: Optional[ServiceCategory] = None
    service_subcategory: Optional[str] = Field(None, max_length=100)
    featured: Optional[bool] = None
    display_order: Optional[int] = None

class GalleryImageResponse(GalleryImageBase):
    id: str
    image_public_id: Optional[str]
    uploaded_at: datetime
    views: int
    likes: int
    
    class Config:
        from_attributes = True

class GalleryCategoryResponse(BaseModel):
    name: str
    label: str
    icon: str
    image_count: int