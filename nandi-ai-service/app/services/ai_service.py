from openai import OpenAI
from app.config.settings import settings
from app.config.prompt_loader import prompt_manager
from app.models.chat import ChatRequest, ChatResponse, Persona
from app.core.cache import get_from_cache, save_to_cache
import re
import logging
import traceback
import uuid

logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=settings.openai_api_key)

# Removed hardcoded prompts - now using prompt_manager

async def generate_response(request: ChatRequest) -> ChatResponse:
    """
    Generate an AI response based on the user's message and selected persona.
    
    Returns a ChatResponse with the AI-generated text, quality score, and other metadata.
    """
    request_id = str(uuid.uuid4())
    logger.info(f"Request ID: {request_id} - Processing chat request for persona: {request.persona}")
    
    # Check cache for stateless requests
    if not request.context:
        cached_response = get_from_cache(request.persona, request.message)
        if cached_response:
            logger.info(f"Request ID: {request_id} - Returning cached response")
            return cached_response
    
    try:
        # Get the appropriate system prompt based on persona
        persona_str = request.persona.lower()
        system_prompt = prompt_manager.get_persona_prompt(persona_str)
        quality_prompt = prompt_manager.get_quality_prompt()
        
        # Use default if prompt not found
        if not system_prompt:
            logger.warning(f"Request ID: {request_id} - Prompt not found for persona: {persona_str}, using default")
            system_prompt = prompt_manager.get_persona_prompt("karma")
        
        # Prepare messages for OpenAI
        messages = [
            {"role": "system", "content": system_prompt + quality_prompt},
            {"role": "user", "content": request.message}
        ]
        
        # Add conversation context if provided
        if request.context:
            messages = [{"role": "system", "content": system_prompt + quality_prompt}]
            for msg in request.context:
                messages.append({"role": msg.role.lower(), "content": msg.content})
            messages.append({"role": "user", "content": request.message})
        
        # Call OpenAI API
        logger.info(f"Request ID: {request_id} - Calling OpenAI API")
        response = client.chat.completions.create(
            model=settings.default_model,
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
        )
        
        # Extract response text
        response_text = response.choices[0].message.content.strip()
        
        # Extract quality score
        quality_pattern = r"\[QUALITY:(\d+):([^\]]+)\]"
        match = re.search(quality_pattern, response_text)
        
        quality_score = 5
        quality_reason = "Question quality could not be evaluated"
        
        if match:
            quality_score = int(match.group(1))
            quality_reason = match.group(2).strip()
        
        # Clean response text by removing quality marker
        clean_response = re.sub(r"\[QUALITY:\d+:[^\]]+\]", "", response_text).strip()
        
        logger.info(f"Request ID: {request_id} - Successfully generated response with quality score: {quality_score}")
        
        # Create response object
        result = ChatResponse.create(
            message=clean_response,
            quality_score=quality_score,
            quality_reason=quality_reason
        )
        
        # Cache the result if appropriate
        if not request.context:
            save_to_cache(request.persona, request.message, result)
        
        return result
    except Exception as e:
        logger.error(f"Request ID: {request_id} - Error generating response: {str(e)}\n{traceback.format_exc()}")
        
        # Get fallback response from prompt_manager
        fallback_message = prompt_manager.get_fallback_response(request.persona)
        if not fallback_message:
            fallback_message = prompt_manager.get_fallback_response("karma")
            
        fallback_message = f"{fallback_message} (Note: Using fallback response due to API error: {str(e)})"
        
        # Return fallback response
        return ChatResponse.create(
            message=fallback_message,
            quality_score=7,
            quality_reason="Good question showing interest in spiritual growth"
        ) 