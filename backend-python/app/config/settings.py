from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "Techspark Technologies API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "techspark_db"
    
    # Company Info
    COMPANY_NAME: str = "Techspark Technologies"
    COMPANY_EMAIL: str = "kevinkisaa001@gmail.com"
    WHATSAPP_NUMBER: str = "254726894129"
    PHONE_NUMBER: str = "254743455893"
    LOCATION: str = "Nairobi, Kenya"
    ADDRESS: str = "Pioneer House, 6th Floor, Moi Avenue, CBD, Nairobi, 00100"
    BUSINESS_HOURS: str = "Mon-Fri: 8am-8pm, Sat: 9am-6pm, Sun: 10am-4pm"
    EMERGENCY_SUPPORT: str = "Available 24/7"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # EmailJS
    EMAILJS_SERVICE_ID: str = "service_nqhj4sp"
    EMAILJS_TEMPLATE_ID: str = "template_dbkxcig"
    EMAILJS_PUBLIC_KEY: str = "tFEXD5O8VFvJyvYO6"
    EMAILJS_PRIVATE_KEY: str = "e3t_wFuvonptk_3J6E-UJ"
    
    model_config = ConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()
