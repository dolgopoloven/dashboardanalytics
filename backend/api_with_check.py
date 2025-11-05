# backend/api_with_check.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from real_client import RealRnovatioClient
import random
from datetime import datetime

app = FastAPI(title="Medical Analytics - Real Data Ready")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

real_client = RealRnovatioClient()

def get_enhanced_fallback_data():
    """Улучшенные демо-данные"""
    base = random.randint(170, 230)
    return {
        "total_appointments": base,
        "completed": int(base * 0.74),
        "upcoming": int(base * 0.21),
        "refused": int(base * 0.05),
        "revenue": {
            "months": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
            "amounts": [random.randint(450000, 750000) for _ in range(6)]
        },
        "timestamp": datetime.now().isoformat(),
        "data_source": "fallback"
    }

@app.get("/")
async def root():
    return {"message": "Medical Analytics API - Ready for Real Data"}

@app.get("/api/connection-status")
async def get_connection_status():
    """Статус подключения к реальному API"""
    return real_client.test_connection()

@app.get("/api/real/data")
async def get_real_data():
    """Попытка получить реальные данные"""
    result = real_client.get_real_data()
    
    if result["using_fallback"]:
        # Возвращаем демо-данные с информацией о статусе
        fallback_data = get_enhanced_fallback_data()
        fallback_data["connection_status"] = result["status"]
        return fallback_data
    
    # Возвращаем реальные данные когда они появятся
    return result

@app.get("/api/clinics")
async def get_clinics():
    """Информация о клиниках"""
    return [
        {
            "id": 1,
            "name": "Клиника Центр", 
            "status": "active",
            "doctors": 14,
            "monthly_capacity": 350
        },
        {
            "id": 2,
            "name": "Клиника Север",
            "status": "active", 
            "doctors": 9,
            "monthly_capacity": 220
        }
    ]