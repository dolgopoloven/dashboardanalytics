from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Medical Analytics Dashboard")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Medical Analytics API is running!"}

@app.get("/api/test-data")
async def test_data():
    return {
        "months": ["Jan", "Feb", "Mar", "Apr", "May"],
        "sales": [100, 200, 150, 300, 250]
    }

@app.get("/api/analytics/appointments-stats")
async def get_appointments_stats():
    """Медицинская статистика для дашборда"""
    return {
        "total": 156,
        "by_status": {
            "completed": 112,
            "upcoming": 32,
            "refused": 12
        },
        "by_clinic": {
            "Клиника Центр": 89,
            "Клиника Север": 67
        },
        "revenue": {
            "months": ["Янв", "Фев", "Мар", "Апр", "Май", "Июн"],
            "amounts": [450000, 520000, 480000, 610000, 590000, 680000]
        },
        "services": {
            "Консультация": 45,
            "Диагностика": 38,
            "Лечение": 52,
            "Анализы": 21
        }
    }

@app.get("/api/clinics")
async def get_clinics():
    """Список клиник"""
    return [
        {"id": 1, "title": "Клиника Центр", "city": "Москва", "phone": "+7 (495) 123-45-67"},
        {"id": 2, "title": "Клиника Север", "city": "Москва", "phone": "+7 (495) 765-43-21"}
    ]
