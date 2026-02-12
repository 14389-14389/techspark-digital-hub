from fastapi import APIRouter, HTTPException, status, Depends, Form, Query
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.models.service_request import ServiceRequest
from app.models.admin import Admin
from app.routes.admin_routes import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Services"])

@router.get("/service-requests")
async def get_all_service_requests(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    service_type: Optional[str] = Query(None),
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all service requests with filters"""
    try:
        # Build query
        query = {}
        if status:
            query["status"] = status
        if service_type:
            query["service_type"] = service_type
        
        # Get total count
        total = await ServiceRequest.find(query).count()
        
        # Get paginated results
        requests = await ServiceRequest.find(query)\
            .sort(-ServiceRequest.created_at)\
            .skip(skip)\
            .limit(limit)\
            .to_list()
        
        # Format response
        return {
            "total": total,
            "requests": [
                {
                    "id": str(r.id),
                    "name": r.name,
                    "email": r.email,
                    "phone": r.phone,
                    "service_type": r.service_type,
                    "device_type": r.device_type,
                    "brand": r.brand,
                    "model": r.model,
                    "issue_description": r.issue_description,
                    "status": r.status,
                    "priority": r.priority,
                    "estimated_cost": r.estimated_cost,
                    "estimated_days": r.estimated_days,
                    "created_at": r.created_at.isoformat() if r.created_at else None,
                    "updated_at": r.updated_at.isoformat() if r.updated_at else None
                } for r in requests
            ]
        }
    except Exception as e:
        print(f"Error fetching service requests: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch service requests: {str(e)}"
        )

@router.get("/service-requests/{request_id}")
async def get_service_request(
    request_id: str,
    current_admin: Admin = Depends(get_current_admin)
):
    """Get single service request by ID"""
    try:
        request = await ServiceRequest.get(request_id)
        
        if not request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service request not found"
            )
        
        return {
            "id": str(request.id),
            "name": request.name,
            "email": request.email,
            "phone": request.phone,
            "service_type": request.service_type,
            "device_type": request.device_type,
            "brand": request.brand,
            "model": request.model,
            "issue_description": request.issue_description,
            "status": request.status,
            "priority": request.priority,
            "estimated_cost": request.estimated_cost,
            "estimated_days": request.estimated_days,
            "created_at": request.created_at.isoformat() if request.created_at else None,
            "updated_at": request.updated_at.isoformat() if request.updated_at else None
        }
    except Exception as e:
        print(f"Error fetching service request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch service request: {str(e)}"
        )

@router.put("/service-requests/{request_id}/status")
async def update_service_request_status(
    request_id: str,
    status: str = Form(...),
    estimated_cost: Optional[float] = Form(None),
    estimated_days: Optional[int] = Form(None),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update service request status and estimates"""
    try:
        request = await ServiceRequest.get(request_id)
        
        if not request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service request not found"
            )
        
        # Update fields
        request.status = status
        if estimated_cost is not None:
            request.estimated_cost = estimated_cost
        if estimated_days is not None:
            request.estimated_days = estimated_days
        
        request.updated_at = datetime.utcnow()
        await request.save()
        
        return {"message": f"Request status updated to {status}"}
    except Exception as e:
        print(f"Error updating service request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update service request: {str(e)}"
        )

@router.delete("/service-requests/{request_id}")
async def delete_service_request(
    request_id: str,
    current_admin: Admin = Depends(get_current_admin)
):
    """Delete a service request"""
    try:
        request = await ServiceRequest.get(request_id)
        
        if not request:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service request not found"
            )
        
        await request.delete()
        return {"message": "Service request deleted successfully"}
    except Exception as e:
        print(f"Error deleting service request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete service request: {str(e)}"
        )