from fastapi import Depends
from app.core.security import get_api_key
from fastapi.security.api_key import APIKey
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.config.settings import settings
from typing import List, Dict, Any

# Setup rate limiter
limiter = Limiter(key_func=get_remote_address)

# API documentation settings
API_TAGS_METADATA: List[Dict[str, Any]] = [
    {
        "name": "health",
        "description": "System health checks and monitoring endpoints",
    },
    {
        "name": "chat",
        "description": "Chat with AI personas (Karma/Dharma/Atma)",
    },
    {
        "name": "points",
        "description": "Points calculation and session metrics",
    },
    {
        "name": "admin",
        "description": "Administrative endpoints for system configuration and maintenance",
    }
]

# Common dependencies
def api_key_dependency():
    """Dependency for routes that require API key authentication."""
    return Depends(get_api_key)


def get_limiter():
    """Get the rate limiter instance."""
    return limiter 