from fastapi import APIRouter, HTTPException, status, Depends, Form
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

from app.models.quote import Quote
from app.models.admin import Admin
from app.routes.admin_routes import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Quotes"])

@router.get("/quotes")
async def get_all_quotes(
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    current_admin: Admin = Depends(get_current_admin)
):
    """Get all quote requests with filters"""
    query = {}
    if status:
        query["status"] = status
    
    total = await Quote.find(query).count()
    quotes = await Quote.find(query)\
        .sort(-Quote.created_at)\
        .skip(skip)\
        .limit(limit)\
        .to_list()
    
    return {
        "total": total,
        "quotes": [
            {
                "id": str(q.id),
                "name": q.name,
                "email": q.email,
                "phone": q.phone,
                "service_category": q.service_category,
                "project_description": q.project_description,
                "budget_range": q.budget_range,
                "status": q.status,
                "quoted_amount": q.quoted_amount,
                "created_at": q.created_at.isoformat()
            } for q in quotes
        ]
    }

@router.get("/quotes/{quote_id}")
async def get_quote_detail(
    quote_id: str,
    current_admin: Admin = Depends(get_current_admin)
):
    """Get single quote by ID"""
    quote = await Quote.get(quote_id)
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found"
        )
    
    return {
        "id": str(quote.id),
        "name": quote.name,
        "email": quote.email,
        "phone": quote.phone,
        "service_category": quote.service_category,
        "project_description": quote.project_description,
        "budget_range": quote.budget_range,
        "status": quote.status,
        "quoted_amount": quote.quoted_amount,
        "created_at": quote.created_at.isoformat()
    }

@router.put("/quotes/{quote_id}/status")
async def update_quote_status(
    quote_id: str,
    status: str = Form(...),
    quoted_amount: Optional[float] = Form(None),
    current_admin: Admin = Depends(get_current_admin)
):
    """Update quote status and amount"""
    quote = await Quote.get(quote_id)
    
    if not quote:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Quote not found"
        )
    
    quote.status = status
    if quoted_amount is not None:
        quote.quoted_amount = quoted_amount
    
    await quote.save()
    
    return {"message": f"Quote status updated to {status}"}