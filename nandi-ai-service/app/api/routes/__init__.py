# Routes package initialization 
from fastapi import APIRouter
from app.api.routes import chat, health, points
from app.api.endpoints import admin

# Create API router
api_router = APIRouter()

# Include route modules
api_router.include_router(chat.router)
api_router.include_router(health.router)
api_router.include_router(points.router)

# Include admin endpoints
api_router.include_router(admin.router) 