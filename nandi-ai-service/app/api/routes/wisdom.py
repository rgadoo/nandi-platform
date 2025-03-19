from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.openai_service import OpenAIService
from app.models.wisdom import WisdomRequest, WisdomResponse

# Create router
router = APIRouter()

# Get OpenAI service
def get_openai_service():
    return OpenAIService()

# Generate wisdom
@router.post("/generate", response_model=WisdomResponse)
async def generate_wisdom(
    request: WisdomRequest,
    openai_service: OpenAIService = Depends(get_openai_service)
):
    try:
        wisdom = await openai_service.generate_wisdom(
            pet_type=request.pet_type,
            interaction_type=request.interaction_type,
            pet_name=request.pet_name
        )
        return WisdomResponse(wisdom=wisdom)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating wisdom: {str(e)}"
        ) 