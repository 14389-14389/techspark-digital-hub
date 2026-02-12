from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.models.service_request import ServiceRequest
from app.schemas.service import ServiceRequestCreate, ServiceRequestResponse

router = APIRouter(prefix="/api/services", tags=["Services"])

@router.post("", response_model=ServiceRequestResponse, status_code=status.HTTP_201_CREATED)  # ✅ REMOVED TRAILING SLASH
async def create_service_request(request_data: ServiceRequestCreate):
    """Create a new service/repair request"""
    try:
        service_request = ServiceRequest(
            name=request_data.name,
            email=request_data.email,
            phone=request_data.phone,
            service_type=request_data.service_type,
            device_type=request_data.device_type,
            brand=request_data.brand,
            model=request_data.model,
            issue_description=request_data.issue_description,
            preferred_date=request_data.preferred_date,
            address=request_data.address,
            priority=request_data.priority or "normal",
            status="pending"
        )
        
        await service_request.insert()
        
        # Convert ObjectId to string for response
        return {
            "id": str(service_request.id),
            "name": service_request.name,
            "email": service_request.email,
            "phone": service_request.phone,
            "service_type": service_request.service_type,
            "device_type": service_request.device_type,
            "brand": service_request.brand,
            "model": service_request.model,
            "issue_description": service_request.issue_description,
            "preferred_date": service_request.preferred_date,
            "address": service_request.address,
            "status": service_request.status,
            "priority": service_request.priority,
            "estimated_cost": service_request.estimated_cost,
            "estimated_days": service_request.estimated_days,
            "created_at": service_request.created_at,
            "updated_at": service_request.updated_at
        }
        
    except Exception as e:
        print(f"Error creating service request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create service request: {str(e)}"
        )