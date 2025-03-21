from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import get_api_key
from app.config.prompt_loader import prompt_manager
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["admin"], include_in_schema=True)

@router.post("/prompts/refresh", status_code=status.HTTP_200_OK)
async def refresh_prompts(api_key: str = Depends(get_api_key)):
    """
    Refresh prompts from the JSON configuration file.
    Requires admin API key for authentication.
    """
    try:
        prompt_manager.refresh()
        logger.info("Prompts refreshed successfully")
        return {"status": "success", "message": "Prompts refreshed successfully"}
    except Exception as e:
        logger.error(f"Error refreshing prompts: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error refreshing prompts: {str(e)}"
        ) 