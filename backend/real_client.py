# backend/real_client.py
import os
import requests
from dotenv import load_dotenv

load_dotenv()

class RealRnovatioClient:
    def __init__(self):
        self.base_url = "https://app.rnova.org/api/public"
        self.api_key = os.getenv("RNOVATIO_API_KEY")
        self.is_configured = bool(self.api_key and self.api_key == "67f.....0f4")
        
    def test_connection(self):
        """Проверка подключения к API"""
        if not self.is_configured:
            return {
                "status": "not_configured",
                "message": "API ключ не настроен. Используются демо-данные."
            }
        
        try:
            response = requests.post(
                f"{self.base_url}/getClinics",
                data={"api_key": self.api_key},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("error") == 0:
                    return {
                        "status": "connected", 
                        "message": "Успешное подключение к API",
                        "clinics_count": len(result.get("data", []))
                    }
                else:
                    return {
                        "status": "api_error",
                        "message": f"Ошибка API: {result.get('data', {}).get('desc', 'Unknown error')}"
                    }
            else:
                return {
                    "status": "http_error",
                    "message": f"HTTP ошибка: {response.status_code}"
                }
                
        except Exception as e:
            return {
                "status": "connection_error",
                "message": f"Ошибка подключения: {str(e)}"
            }
    
    def get_real_data(self):
        """Получение реальных данных"""
        connection_status = self.test_connection()
        
        if connection_status["status"] != "connected":
            return {
                "data": None,
                "status": connection_status,
                "using_fallback": True
            }
        
        # Здесь будет код для получения реальных данных
        # Пока возвращаем заглушку
        return {
            "data": {
                "message": "Реальные данные будут здесь после настройки API ключа"
            },
            "status": connection_status,
            "using_fallback": False
        }