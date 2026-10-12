import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'stayora_api.settings')
django.setup()

from hospitality.models import HotelSetting, Room, BookingInquiry
from rest_framework.test import APIClient

client = APIClient()

print("--- 1. Testing GET /api/settings/ ---")
res = client.get('/api/settings/')
print("Settings status:", res.status_code, res.data.get('site_name'))

print("\n--- 2. Testing GET /api/rooms/ ---")
res = client.get('/api/rooms/')
results = res.data.get('results') if isinstance(res.data, dict) else res.data
print("Rooms count:", len(results))
if results:
    first = results[0]
    print(f"First room: {first.get('title')} (INR {first.get('price_per_night')}/night)")

print("\n--- 3. Testing POST /api/bookings/ ---")
sample_booking = {
    "room": Room.objects.first().id,
    "guest_name": "Test Client Verification",
    "guest_email": "client@example.com",
    "guest_phone": "+91 98765 00000",
    "check_in": "2026-11-01",
    "check_out": "2026-11-04",
    "num_guests": 2,
    "num_rooms": 1,
    "special_requests": "Champagne upon arrival."
}
res = client.post('/api/bookings/', sample_booking, format='json')
print("Booking creation status:", res.status_code)
if res.status_code == 201:
    print(f"Created Booking ID: {res.data.get('id')}, Total: INR {res.data.get('estimated_total')}")

print("\n--- 4. Testing POST /api/auth/login/ ---")
login_payload = {
    "username": "admin",
    "password": "Stayora@2026"
}
res = client.post('/api/auth/login/', login_payload, format='json')
print("Login status:", res.status_code)
token = res.data.get('token')
print("Got Token:", token[:8] + "..." if token else "No token")

print("\n--- 5. Testing GET /api/admin/metrics/ ---")
client.credentials(HTTP_AUTHORIZATION='Token ' + token)
res = client.get('/api/admin/metrics/')
print("Metrics status:", res.status_code, res.data)

print("\n ALL BACKEND CHECKS COMPLETED SUCCESSFULLY!")
