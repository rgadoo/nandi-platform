from fastapi import HTTPException, Security, Request, Depends
from fastapi.security.api_key import APIKeyHeader
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# API key security setup
API_KEY = settings.api_key
API_KEY_NAME = "x-api-key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

# Paths that don't require API key authentication
PUBLIC_PATHS = ["/", "/docs", "/redoc", "/openapi.json", "/health", "/admin/prompts/refresh"]


async def get_api_key(api_key_header: str = Security(api_key_header)):
    """Dependency for validating the API key."""
    if api_key_header == API_KEY:
        return api_key_header
    raise HTTPException(
        status_code=403, detail="Could not validate API key"
    )


async def process_api_key_header(request: Request, call_next):
    """Middleware for API key validation."""
    # Skip API key validation for documentation and health check endpoints
    if any(request.url.path.startswith(path) for path in PUBLIC_PATHS):
        return await call_next(request)
    
    # Check for API key in header
    api_key = request.headers.get(API_KEY_NAME)
    if not api_key or api_key != API_KEY:
        return HTTPException(
            status_code=403, detail="Could not validate API key"
        )
    
    return await call_next(request)


async def log_exceptions(request: Request, call_next):
    """Middleware for exception handling and logging."""
    import traceback
    import uuid
    
    try:
        return await call_next(request)
    except Exception as e:
        error_id = str(uuid.uuid4())
        logger.error(
            f"Error ID: {error_id} - Exception: {str(e)} - "
            f"Path: {request.url.path} - "
            f"Traceback: {traceback.format_exc()}"
        )
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "error_id": error_id,
                "message": str(e)
            }
        ) 