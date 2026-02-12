from fastapi import APIRouter, HTTPException, status, UploadFile, File, Form, Query
from typing import List, Optional
from datetime import datetime
import base64
import uuid

from app.models.gallery import GalleryImage, ServiceCategory
from app.schemas.gallery import GalleryImageCreate, GalleryImageResponse, GalleryImageUpdate, GalleryCategoryResponse

router = APIRouter(prefix="/api/gallery", tags=["Gallery"])

# Service categories for filtering
SERVICE_CATEGORIES = [
    {"name": "all", "label": "All Services", "icon": "LayoutGrid"},
    {"name": "development", "label": "Web & Mobile Development", "icon": "Code2"},
    {"name": "repairs", "label": "Repairs & Maintenance", "icon": "Wrench"},
    {"name": "cctv", "label": "CCTV & Security", "icon": "Camera"},
    {"name": "network", "label": "IT & Network", "icon": "Network"},
    {"name": "consultancy", "label": "Consultancy", "icon": "Headset"},
]

@router.get("/categories", response_model=List[GalleryCategoryResponse])
async def get_gallery_categories():
    """Get all gallery categories with image counts"""
    categories = []
    
    for cat in SERVICE_CATEGORIES:
        if cat["name"] == "all":
            count = await GalleryImage.find_all().count()
        else:
            count = await GalleryImage.find(
                GalleryImage.service_category == cat["name"]
            ).count()
        
        categories.append({
            **cat,
            "image_count": count
        })
    
    return categories

@router.get("/", response_model=List[GalleryImageResponse])
async def get_gallery_images(
    category: str = Query("all", description="Filter by service category"),
    featured: Optional[bool] = Query(None, description="Filter featured only"),
    limit: int = Query(50, le=100),
    skip: int = Query(0)
):
    """Get gallery images with optional filtering"""
    query = {}
    
    if category != "all":
        query["service_category"] = category
    if featured is not None:
        query["featured"] = featured
    
    images = await GalleryImage.find(query)\
        .sort(-GalleryImage.featured, -GalleryImage.uploaded_at)\
        .skip(skip)\
        .limit(limit)\
        .to_list()
    
    # ✅ FIX: Convert ObjectId to string for each image
    return [
        {
            "id": str(img.id),
            "title": img.title,
            "description": img.description,
            "image_url": img.image_url,
            "image_public_id": img.image_public_id,
            "service_category": img.service_category,
            "service_subcategory": img.service_subcategory,
            "featured": img.featured,
            "display_order": img.display_order,
            "uploaded_at": img.uploaded_at,
            "views": img.views,
            "likes": img.likes
        }
        for img in images
    ]

@router.get("/{image_id}", response_model=GalleryImageResponse)
async def get_gallery_image(image_id: str):
    """Get single gallery image by ID"""
    image = await GalleryImage.get(image_id)
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    # Increment view count
    image.views += 1
    await image.save()
    
    # ✅ FIX: Convert ObjectId to string
    return {
        "id": str(image.id),
        "title": image.title,
        "description": image.description,
        "image_url": image.image_url,
        "image_public_id": image.image_public_id,
        "service_category": image.service_category,
        "service_subcategory": image.service_subcategory,
        "featured": image.featured,
        "display_order": image.display_order,
        "uploaded_at": image.uploaded_at,
        "views": image.views,
        "likes": image.likes
    }

@router.post("/", response_model=GalleryImageResponse, status_code=status.HTTP_201_CREATED)
async def create_gallery_image(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    service_category: ServiceCategory = Form(...),
    service_subcategory: Optional[str] = Form(None),
    featured: bool = Form(False),
    display_order: int = Form(0),
    image: UploadFile = File(...)
):
    """Create new gallery image with upload"""
    try:
        # Read image file and convert to base64
        image_data = await image.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        mime_type = image.content_type or 'image/jpeg'
        image_url = f"data:{mime_type};base64,{base64_image}"
        
        # Generate unique ID for the image
        image_id = str(uuid.uuid4())
        
        # Create gallery image
        gallery_image = GalleryImage(
            title=title,
            description=description,
            image_url=image_url,
            image_public_id=image_id,
            service_category=service_category,
            service_subcategory=service_subcategory,
            featured=featured,
            display_order=display_order
        )
        
        await gallery_image.insert()
        
        # ✅ FIX: Convert ObjectId to string for response
        return {
            "id": str(gallery_image.id),
            "title": gallery_image.title,
            "description": gallery_image.description,
            "image_url": gallery_image.image_url,
            "image_public_id": gallery_image.image_public_id,
            "service_category": gallery_image.service_category,
            "service_subcategory": gallery_image.service_subcategory,
            "featured": gallery_image.featured,
            "display_order": gallery_image.display_order,
            "uploaded_at": gallery_image.uploaded_at,
            "views": gallery_image.views,
            "likes": gallery_image.likes
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )

@router.post("/{image_id}/like")
async def like_gallery_image(image_id: str):
    """Increment like count for image"""
    image = await GalleryImage.get(image_id)
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    image.likes += 1
    await image.save()
    
    return {"likes": image.likes}

@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_gallery_image(image_id: str):
    """Delete gallery image"""
    image = await GalleryImage.get(image_id)
    
    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    
    await image.delete()
    return None