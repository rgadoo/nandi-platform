from fastapi import APIRouter, Body, Depends, Request, HTTPException
from fastapi.security.api_key import APIKey
from app.models.chat import ChatRequest, ChatResponse
from app.services.ai_service import generate_response
from app.api.dependencies import api_key_dependency, get_limiter
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["chat"])
limiter = get_limiter()


@router.post("/chat/generate", response_model=ChatResponse)
@limiter.limit("10/minute")
async def generate_chat_response(
    request: Request,
    chat_request: ChatRequest = Body(...),
    api_key: APIKey = Depends(api_key_dependency())
):
    """
    Generate an AI response based on user message and selected persona
    
    This endpoint:
    - Processes the user message
    - Applies persona-specific prompts
    - Evaluates question quality (1-10 scale)
    - Returns AI response with quality score
    
    The quality score is used by the points system to calculate karma points.
    """
    return await generate_response(chat_request) 