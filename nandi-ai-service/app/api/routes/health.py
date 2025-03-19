from fastapi import APIRouter

# Create router
router = APIRouter()

# Health check endpoint
@router.get("/")
async def health_check():
    return {"status": "healthy"}

# Check OpenAI connectivity
@router.get("/openai")
async def check_openai():
    # TODO: Implement actual OpenAI connectivity check
    return {"status": "connected"} 