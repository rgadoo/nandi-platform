import os
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

# Get API key from environment
API_KEY = os.environ.get("API_KEY", "development_key")

# API key header scheme
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def get_api_key(api_key: str = Depends(api_key_header)):
    """
    Dependency to validate API key from request headers.
    
    Args:
        api_key: The API key from request header
        
    Returns:
        The validated API key
        
    Raises:
        HTTPException: If API key is invalid
    """
    if not api_key or api_key != API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Invalid or missing API key"
        )
    return api_key 