from fastapi import APIRouter
from app.api.routes import chat, wisdom, health

# Create API router
api_router = APIRouter()

# Include routers from modules
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(wisdom.router, prefix="/wisdom", tags=["wisdom"])
api_router.include_router(health.router, prefix="/health", tags=["health"]) 