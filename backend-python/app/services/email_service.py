import httpx
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    """EmailJS service for sending notifications"""
    
    @staticmethod
    async def send_contact_notification(name: str, email: str, phone: str, subject: str, message: str):
        """Send contact form notification to admin"""
        
        service_id = os.getenv("EMAILJS_SERVICE_ID", "service_nqhj4sp")
        template_id = os.getenv("EMAILJS_TEMPLATE_ID", "template_dbkxcig")
        user_id = os.getenv("EMAILJS_PUBLIC_KEY", "tFEXD5O8VFvJyvYO6")
        access_token = os.getenv("EMAILJS_PRIVATE_KEY", "e3t_wFuvonptk_3J6E-UJ")
        
        template_params = {
            "user_name": name,
            "user_email": email,
            "user_phone": phone or "Not provided",
            "subject": subject,
            "message": message
        }
        
        payload = {
            "service_id": service_id,
            "template_id": template_id,
            "user_id": user_id,
            "accessToken": access_token,
            "template_params": template_params
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.emailjs.com/api/v1.0/email/send",
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    print(f"✅ Email sent successfully")
                    return True
                else:
                    print(f"❌ EmailJS error: {response.text}")
                    return False
                    
        except Exception as e:
            print(f"❌ Email service error: {e}")
            return False
