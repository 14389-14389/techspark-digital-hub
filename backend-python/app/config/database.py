from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from dotenv import load_dotenv

load_dotenv()

async def init_database():
    """Initialize MongoDB connection with all models"""
    try:
        # MongoDB connection string
        mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        db_name = os.getenv("MONGODB_DB_NAME", "techspark_db")
        
        # Create MongoDB client
        client = AsyncIOMotorClient(mongo_url)
        database = client[db_name]
        
        # Import ALL models here
        from app.models.contact import Contact
        from app.models.service_request import ServiceRequest
        from app.models.quote import Quote
        from app.models.gallery import GalleryImage  # ✅ ADDED
        from app.models.admin import Admin           # ✅ ADDED
        
        # Initialize Beanie with ALL document models
        await init_beanie(
            database=database,
            document_models=[
                Contact,
                ServiceRequest,
                Quote,
                GalleryImage,  # ✅ ADDED
                Admin,         # ✅ ADDED
            ]
        )
        
        print("MongoDB Atlas connected successfully!")
        print(f"Database: {db_name}")
        print(f"Models loaded: Contact, ServiceRequest, Quote, GalleryImage, Admin")
        
        return database
        
    except Exception as e:
        print(f"❌ MongoDB Atlas connection failed: {e}")
        print(f"🔧 Please check your connection string and network")
        raise e