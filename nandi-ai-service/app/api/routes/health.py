from fastapi import APIRouter, Request
from app.config.settings import settings
from app.core.cache import response_cache
import psutil
import platform
import sys
from datetime import datetime
import logging

logger = logging.getLogger(__name__)
router = APIRouter(tags=["health"])
startup_time = datetime.utcnow()


@router.get("/")
async def root():
    """
    Root endpoint for basic service information
    """
    return {"message": "Welcome to Nandi AI Service", "version": "1.0.0"}


@router.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring service status
    
    Returns detailed information about system health and resource usage
    """
    # Basic health check
    health_data = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "1.0.0",
        "environment": settings.environment
    }
    
    # Detailed system info
    try:
        # Resource usage
        health_data["system"] = {
            "cpu_usage": psutil.cpu_percent(),
            "memory_usage": {
                "percent": psutil.virtual_memory().percent,
                "used_mb": round(psutil.virtual_memory().used / (1024 * 1024), 2),
                "total_mb": round(psutil.virtual_memory().total / (1024 * 1024), 2),
            },
            "disk_usage": {
                "percent": psutil.disk_usage('/').percent,
                "used_gb": round(psutil.disk_usage('/').used / (1024 * 1024 * 1024), 2),
                "total_gb": round(psutil.disk_usage('/').total / (1024 * 1024 * 1024), 2),
            },
            "platform": platform.platform(),
            "python_version": sys.version,
        }
        
        # Service stats
        health_data["service"] = {
            "cache_size": len(response_cache),
            "uptime_seconds": int((datetime.utcnow() - startup_time).total_seconds()),
        }
    except Exception as e:
        health_data["error"] = str(e)
    
    return health_data


@router.get("/api/test")
async def test():
    """
    Test endpoint to verify API functionality
    """
    return {"message": "API test endpoint is working"} 