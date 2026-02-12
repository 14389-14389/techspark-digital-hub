from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from datetime import datetime
import os
from dotenv import load_dotenv

from app.config.database import init_database
from app.routes import (
    contact_routes, 
    gallery_routes, 
    admin_routes,
    admin_contacts_routes,
    admin_services_routes,
    admin_quotes_routes,
    admin_settings_routes,
    service_request_routes  # ✅ ADD THIS - MISSING!
)

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("\n" + "="*50)
    print("🚀 Techspark Technologies Backend")
    print("="*50)
    
    # Initialize database
    await init_database()
    
    print("✅ FastAPI server ready")
    print("✅ Gallery API loaded")
    print("✅ Admin API loaded")
    print("✅ Admin Contacts API loaded")
    print("✅ Admin Services API loaded")
    print("✅ Admin Quotes API loaded")
    print("✅ Admin Settings API loaded")
    print("✅ Service Request API loaded")  # ✅ ADD THIS
    print("="*50 + "\n")
    yield
    # Shutdown
    print("👋 Shutting down...")

# Create FastAPI app
app = FastAPI(
    title="Techspark Technologies API",
    version="1.0.0",
    description="Complete Technology Solutions - Development, Repairs, CCTV",
    lifespan=lifespan
)

# ✅ CORS - ALLOW ALL FRONTEND PORTS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite default
        "http://localhost:3000",      # React default
        "http://localhost:8080",      # Your frontend port
        "http://192.168.100.17:8080", # Your network URL
        "http://localhost:8000",      # Backend itself
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(contact_routes.router)
app.include_router(gallery_routes.router)
app.include_router(admin_routes.router)
app.include_router(admin_contacts_routes.router)
app.include_router(admin_services_routes.router)
app.include_router(admin_quotes_routes.router)
app.include_router(admin_settings_routes.router)
app.include_router(service_request_routes.router)  # ✅ ADD THIS - MISSING!

@app.get("/")
async def root():
    """Company Information"""
    return {
        "company": os.getenv("COMPANY_NAME", "Techspark Technologies"),
        "tagline": "Complete Technology Solutions",
        "services": ["Development", "Repairs", "CCTV & Security", "IT & Network", "Consultancy"],
        "contact": {
            "email": os.getenv("COMPANY_EMAIL", "kevinkisaa001@gmail.com"),
            "whatsapp": f"+{os.getenv('WHATSAPP_NUMBER', '254726894129')}",
            "phone": f"+{os.getenv('PHONE_NUMBER', '254743455893')}",
            "location": os.getenv("LOCATION", "Nairobi, Kenya"),
            "address": os.getenv("ADDRESS", "Pioneer House, 6th Floor, Moi Avenue, CBD, Nairobi, 00100"),
            "hours": os.getenv("BUSINESS_HOURS", "Mon-Fri: 8am-8pm, Sat: 9am-6pm, Sun: 10am-4pm"),
            "emergency": os.getenv("EMERGENCY_SUPPORT", "Available 24/7"),
            "gps": os.getenv("GPS_COORDINATES", "-1.2864° S, 36.8172° E")
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/api/health")
async def api_health():
    """API Health check"""
    return {
        "status": "operational",
        "message": "Techspark Technologies API is running",
        "database": "connected",
        "gallery": "loaded",
        "admin": "loaded",
        "contacts_api": "loaded",
        "services_api": "loaded",
        "quotes_api": "loaded",
        "settings_api": "loaded",
        "service_request_api": "loaded",  # ✅ ADD THIS
        "timestamp": datetime.utcnow().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)