from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import datetime

app = FastAPI(title="Medical Analytics Dashboard - Realistic Data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_dynamic_data():
    """Генерация динамических данных, которые меняются при каждом обновлении"""
    base = random.randint(160, 240)  # Случайное базовое количество визитов
    
    return {
        "total": base,
        "by_status": {
            "completed": int(base * 0.72 + random.randint(-5, 5)),
            "upcoming": int(base * 0.22 + random.randint(-3, 3)),
            "refused": int(base * 0.06 + random.randint(-2, 2))
        },
        "by_clinic": {
            "Клиника Центр": int(base * 0.58 + random.randint(-5, 5)),
            "Клиника Север": int(base * 0.42 + random.randint(-5, 5))
        },
        "revenue": {
            "months": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
            "amounts": [
                450000 + random.randint(0, 50000),
                520000 + random.randint(0, 50000),
                480000 + random.randint(0, 50000),
                610000 + random.randint(0, 50000),
                590000 + random.randint(0, 50000),
                680000 + random.randint(0, 50000)
            ]
        },
        "services": {
            "Консультация": int(base * 0.34),
            "Диагностика": int(base * 0.26),
            "Лечение": int(base * 0.28),
            "Анализы": int(base * 0.12)
        },
        "timestamp": datetime.now().strftime("%H:%M:%S"),
        "source": "dynamic_simulation"
    }

@app.get("/")
async def root():
    return {"message": "Medical Analytics API - Dynamic Realistic Data"}

@app.get("/api/real/appointments-stats")
async def get_real_appointments_stats():
    """Динамические данные, которые меняются при каждом запросе"""
    return generate_dynamic_data()

@app.get("/api/real/clinics")
async def get_real_clinics():
    """Реалистичные данные клиник"""
    return [
        {
            "id": 1, 
            "title": "Клиника Центр", 
            "city": "Москва", 
            "phone": "+7 (495) 123-45-67",
            "address": "ул. Центральная, д. 1",
            "doctors_count": 14,
            "monthly_capacity": 350,
            "utilization": "78%"
        },
        {
            "id": 2, 
            "title": "Клиника Север", 
            "city": "Москва", 
            "phone": "+7 (495) 765-43-21",
            "address": "Северный пр-т, д. 25", 
            "doctors_count": 9,
            "monthly_capacity": 220,
            "utilization": "65%"
        }
    ]

@app.get("/api/real/financial-stats")
async def get_financial_stats():
    """Финансовая аналитика"""
    data = generate_dynamic_data()
    total_revenue = sum(data["revenue"]["amounts"])
    
    return {
        "total_revenue": total_revenue,
        "average_revenue": total_revenue / len(data["revenue"]["amounts"]),
        "revenue_growth": "12.5%",
        "most_profitable_service": "Лечение",
        "financial_health": "отличный"
    }