from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.services.openai_service import OpenAIService
from app.models.chat import ChatRequest, ChatResponse

# Create router
router = APIRouter()

# Get OpenAI service
def get_openai_service():
    return OpenAIService()

# Generate chat response
@router.post("/generate", response_model=ChatResponse)
async def generate_chat_response(
    request: ChatRequest,
    openai_service: OpenAIService = Depends(get_openai_service)
):
    try:
        response = await openai_service.generate_response(
            message=request.message,
            persona=request.persona
        )
        return ChatResponse(message=response)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        ) 