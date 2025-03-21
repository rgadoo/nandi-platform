from fastapi import HTTPException, Security, status, Depends
from fastapi.security.api_key import APIKeyHeader
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# API key header with auto_error=True for better OpenAPI documentation
api_key_header = APIKeyHeader(name="x-api-key", auto_error=False)

async def validate_api_key(api_key: str = Security(api_key_header)) -> str:
    """
    Validate the API key provided in the x-api-key header.
    Returns the API key if valid, otherwise raises an HTTPException.
    """
    if api_key is None:
        logger.warning("API key is missing")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key is missing",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    
    if settings.environment == "development":
        # In development, allow any valid string as an API key for easier testing
        return api_key
    
    if api_key != settings.api_key:
        logger.warning("Invalid API key provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    
    return api_key

async def validate_admin_api_key(api_key: str = Depends(validate_api_key)) -> str:
    """
    Validate the API key for admin endpoints.
    This is a more strict validation that requires an exact match even in development mode.
    """
    if api_key != settings.api_key:
        logger.warning("Invalid admin API key provided")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin API key",
            headers={"WWW-Authenticate": "ApiKey"},
        )
    
    return api_key 