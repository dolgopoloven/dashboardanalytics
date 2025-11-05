from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from real_client import RealRnovatioClient
from datetime import datetime

app = FastAPI(title="Medical Analytics - Real Data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

real_client = RealRnovatioClient()

@app.get("/")
async def root():
    return {"message": "Medical Analytics API with Real Data from MИС Renovatio"}

@app.get("/api/connection-status")
async def get_connection_status():
    """Статус подключения к реальному API"""
    return real_client.test_connection()

@app.get("/api/real/data")
async def get_real_data():
    """Получение реальных данных из МИС"""
    result = real_client.get_real_data()
    return result

@app.get("/api/real/appointments")
async def get_real_appointments(days: int = 30):
    """Получить реальные визиты"""
    appointments = real_client.get_real_appointments(days)
    return {
        "appointments": appointments,
        "count": len(appointments),
        "period_days": days
    }

@app.get("/api/real/services")
async def get_real_services():
    """Получить реальные услуги"""
    services = real_client.get_real_services()
    return {
        "services": services,
        "count": len(services)
    }

@app.get("/api/real/clinics")
async def get_real_clinics():
    """Получить реальные клиники"""
    clinics = real_client.get_real_clinics()
    return {
        "clinics": clinics,
        "count": len(clinics)
    }