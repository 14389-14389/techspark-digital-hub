import asyncio
import httpx
import json

async def test_service_api():
    print("1️⃣ Testing Service Request API...")
    
    url = "http://localhost:8000/api/services"
    data = {
        "name": "Test Client",
        "email": "test@example.com",
        "phone": "0726894129",
        "service_type": "laptop",
        "brand": "HP",
        "model": "Pavilion",
        "issue_description": "Screen is cracked",
        "priority": "normal"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            print(f"📤 POST {url}")
            response = await client.post(url, json=data)
            print(f"📥 Status: {response.status_code}")
            print(f"📥 Response: {response.text[:200]}")
            
            if response.status_code == 201:
                print("✅ API test passed!")
                return True
            else:
                print("❌ API test failed!")
                return False
        except Exception as e:
            print(f"❌ Error: {e}")
            return False

async def test_admin_api():
    print("\n2️⃣ Testing Admin Login...")
    
    login_url = "http://localhost:8000/api/admin/login"
    login_data = {
        "username": "techspark_admin",
        "password": "Admin123!"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(login_url, json=login_data)
            print(f"📥 Login Status: {response.status_code}")
            
            if response.status_code == 200:
                token = response.json()["access_token"]
                print("✅ Login successful!")
                
                print("\n3️⃣ Testing Admin Service Requests API...")
                headers = {"Authorization": f"Bearer {token}"}
                services_url = "http://localhost:8000/api/admin/service-requests?skip=0&limit=50"
                
                response = await client.get(services_url, headers=headers)
                print(f"📥 Services Status: {response.status_code}")
                print(f"📥 Services Response: {response.text[:200]}")
            else:
                print("❌ Login failed!")
        except Exception as e:
            print(f"❌ Error: {e}")

async def main():
    await test_service_api()
    await test_admin_api()

if __name__ == "__main__":
    asyncio.run(main())
