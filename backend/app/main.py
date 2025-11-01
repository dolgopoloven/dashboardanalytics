# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Dashboard Analytics API")

# CORS для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Dashboard Analytics API is running!"}

@app.get("/api/test-data")
async def test_data():
    """Тестовые данные для графика"""
    return {
        "months": ["Jan", "Feb", "Mar", "Apr", "May"],
        "sales": [100, 200, 150, 300, 250]
    }