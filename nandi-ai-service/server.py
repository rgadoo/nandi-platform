from fastapi import FastAPI, HTTPException, Depends, Body, Header, Security, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError
from enum import Enum
from typing import Optional, List, Dict, Any
import uvicorn
import os
import openai
from openai import OpenAI
import json
import logging
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi.security.api_key import APIKeyHeader, APIKey
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
import traceback
from pydantic_settings import BaseSettings
import hashlib
from functools import lru_cache
import psutil
import platform
import sys

# Load environment variables
load_dotenv()

# Environment settings with validation
class Settings(BaseSettings):
    openai_api_key: str = ""
    api_key: str = "development_key"
    port: int = 8000
    environment: str = "development"
    log_level: str = "INFO"
    debug: Optional[bool] = True
    host: Optional[str] = "0.0.0.0"
    cors_origins: Optional[str] = "http://localhost:3000,http://localhost:8080"
    default_model: Optional[str] = "gpt-4"
    redis_host: Optional[str] = "localhost"
    redis_port: Optional[str] = "6379"
    redis_password: Optional[str] = ""
    redis_db: Optional[str] = "0"
    redis_ttl: Optional[str] = "604800"
    celery_broker_url: Optional[str] = "redis://localhost:6379/0"
    celery_result_backend: Optional[str] = "redis://localhost:6379/0"
    
    model_config = {
        "env_file": ".env",
        "extra": "allow"
    }

# Create settings instance
try:
    settings = Settings(
        openai_api_key=os.getenv("OPENAI_API_KEY", ""),
        api_key=os.getenv("API_KEY", "development_key"),
        port=int(os.getenv("PORT", 8000)),
        environment=os.getenv("ENVIRONMENT", "development"),
        log_level=os.getenv("LOG_LEVEL", "INFO")
    )
except ValidationError as e:
    print(f"Error loading environment variables: {e}")
    raise

# Configure OpenAI
openai.api_key = settings.openai_api_key

# Configure OpenAI client
client = OpenAI(api_key=settings.openai_api_key)

# Configure logging
log_level = getattr(logging, settings.log_level)
logging.basicConfig(
    level=log_level,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("nandi_service.log")
    ]
)
logger = logging.getLogger(__name__)

# Log startup information
startup_time = datetime.utcnow()
logger.info(f"Starting Nandi AI Service in {settings.environment} environment")
if settings.environment == "development":
    logger.info("Development mode: API key validation is relaxed")

# Define models for API documentation
class Persona(str, Enum):
    KARMA = "karma"
    DHARMA = "dharma"
    ATMA = "atma"

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class ConversationMessage(BaseModel):
    role: MessageRole
    content: str
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "role": "user",
                "content": "How can I practice mindfulness in my daily life?"
            }
        }
    }

class QualityScore(BaseModel):
    score: int = Field(..., ge=1, le=10, description="Quality score from 1-10")
    reason: str = Field(..., description="Explanation for the score")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "score": 7,
                "reason": "Good question that shows interest in practical spiritual growth"
            }
        }
    }

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    persona: Persona = Field(..., description="AI persona to respond with")
    session_id: Optional[str] = Field(None, description="Chat session ID")
    context: Optional[List[ConversationMessage]] = Field(None, description="Previous messages for context")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "How can I practice mindfulness in my daily life?",
                "persona": "karma",
                "session_id": "user_session_123",
                "context": []
            }
        }
    }

# Updated to match contract format
class ChatResponse(BaseModel):
    message: str = Field(..., description="AI response")
    id: str = Field(..., description="Unique response ID")
    timestamp: str = Field(..., description="Response timestamp in ISO format")
    qualityScore: int = Field(..., ge=1, le=10, description="Quality score from 1-10")
    scoreReason: str = Field(..., description="Explanation for the quality score")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "message": "Mindfulness can be practiced in daily life by bringing your full attention to simple activities like eating, walking, or even washing dishes. Start by dedicating a few minutes each day to focus solely on your breath.",
                "id": "chat-response-123456",
                "timestamp": "2023-07-10T15:30:45Z",
                "qualityScore": 7,
                "scoreReason": "Good question that shows interest in practical spiritual growth"
            }
        }
    }

# Session metrics request model
class SessionMetricsRequest(BaseModel):
    persona: Persona = Field(..., description="Persona used in the session")
    durationSeconds: int = Field(..., description="Session duration in seconds")
    messageCount: int = Field(..., description="Number of messages in the session")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "persona": "dharma",
                "durationSeconds": 720,
                "messageCount": 12
            }
        }
    }

# Points response model
class PointsResponse(BaseModel):
    pointsEarned: int = Field(..., description="Points earned in this session")
    totalPoints: int = Field(..., description="Total accumulated points")
    breakdown: Dict[str, int] = Field(..., description="Breakdown of points by category")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "pointsEarned": 42,
                "totalPoints": 1250,
                "breakdown": {
                    "base": 5,
                    "duration": 12,
                    "messages": 20,
                    "streak": 5
                }
            }
        }
    }

# Setup rate limiter
limiter = Limiter(key_func=get_remote_address)

# Import admin endpoints
from app.api.endpoints import admin

# API Tags metadata for Swagger UI
API_TAGS_METADATA = [
    {"name": "health", "description": "Health check endpoints"},
    {"name": "chat", "description": "Chat generation endpoints with quality scoring"},
    {"name": "session", "description": "Session metrics and points calculation"},
    {"name": "documents", "description": "Document storage and retrieval"},
    {"name": "admin", "description": "Administrative endpoints for system configuration and maintenance"}
]

# Create FastAPI app
app = FastAPI(
    title="Nandi AI Service",
    description="""
    AI/ML service for the Nandi Platform providing spiritual guidance through different personas.
    
    ## Features
    
    * Chat with AI personas (Karma/Lumina, Dharma/Nova, Atma/Solis)
    * Question quality evaluation for the points system
    * Response caching for improved performance
    
    ## Authentication
    
    Most endpoints require API key authentication via the `x-api-key` header.
    """,
    version="1.0.0",
    openapi_tags=API_TAGS_METADATA,
    docs_url="/docs",
    redoc_url="/redoc"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API key security
API_KEY = settings.api_key
API_KEY_NAME = "x-api-key"
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

async def get_api_key(
    api_key_header: str = Security(api_key_header),
):
    if api_key_header == API_KEY:
        return api_key_header
    raise HTTPException(
        status_code=403, detail="Could not validate API key"
    )

# Add middleware for API key validation exemption for docs and health endpoints
@app.middleware("http")
async def process_api_key_header(request: Request, call_next):
    # Skip API key validation for documentation and health check endpoints
    if request.url.path in ["/", "/docs", "/redoc", "/openapi.json", "/health", "/documents", "/api/session/metrics", "/api/points/calculations", "/api/test", "/api/chat/generate"]:
        return await call_next(request)
    
    # Check for API key in header
    api_key = request.headers.get(API_KEY_NAME)
    if not api_key or api_key != API_KEY:
        return JSONResponse(
            status_code=403,
            content={"detail": "Could not validate API key"}
        )
    
    return await call_next(request)

# Simple in-memory cache - consider using Redis for production
response_cache = {}
CACHE_TTL = timedelta(minutes=30)  # Cache TTL

def get_cache_key(persona, message):
    """Generate a deterministic cache key for a request"""
    key_data = f"{persona}:{message}".encode()
    return hashlib.md5(key_data).hexdigest()

@app.get("/", tags=["health"])
async def root():
    """
    Root endpoint for basic service information
    """
    return {"message": "Welcome to Nandi AI Service", "version": "1.0.0"}

@app.get("/health", tags=["health"])
async def health_check():
    """
    Health check endpoint for monitoring service status
    
    Returns detailed information about system health and resource usage
    """
    # Basic health check
    health_data = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": "1.0.0",
        "environment": settings.environment
    }
    
    # Detailed system info
    try:
        # Resource usage
        health_data["system"] = {
            "cpu_usage": psutil.cpu_percent(),
            "memory_usage": {
                "percent": psutil.virtual_memory().percent,
                "used_mb": round(psutil.virtual_memory().used / (1024 * 1024), 2),
                "total_mb": round(psutil.virtual_memory().total / (1024 * 1024), 2),
            },
            "disk_usage": {
                "percent": psutil.disk_usage('/').percent,
                "used_gb": round(psutil.disk_usage('/').used / (1024 * 1024 * 1024), 2),
                "total_gb": round(psutil.disk_usage('/').total / (1024 * 1024 * 1024), 2),
            },
            "platform": platform.platform(),
            "python_version": sys.version,
        }
        
        # Service stats
        health_data["service"] = {
            "cache_size": len(response_cache),
            "uptime_seconds": int((datetime.utcnow() - startup_time).total_seconds()),
        }
    except Exception as e:
        health_data["error"] = str(e)
    
    return health_data

@app.post("/api/chat/generate", response_model=ChatResponse, tags=["chat"])
@limiter.limit("10/minute")
async def generate_chat_response(
    request: Request,
    chat_request: ChatRequest = Body(...)
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
    request_id = str(uuid.uuid4())
    logger.info(f"Request ID: {request_id} - Processing chat request for persona: {chat_request.persona}")
    
    # Skip cache in development mode
    use_cache = settings.environment != "development"
    if use_cache and not chat_request.context:  # Only cache stateless requests
        cache_key = get_cache_key(chat_request.persona, chat_request.message)
        if cache_key in response_cache:
            cached_data, cache_time = response_cache[cache_key]
            # Check if cache is still valid
            if datetime.utcnow() - cache_time < CACHE_TTL:
                logger.info(f"Request ID: {request_id} - Returning cached response")
                return cached_data
    
    try:
        # Create persona-specific system messages
        persona_prompts = {
            "karma": """
            You are Karma, a spiritual guide focused on mindfulness and cause-effect relationships.
            Respond with wisdom about actions, consequences, and mindful living.
            Be compassionate, insightful, and practical in your guidance.
            """,
            "dharma": """
            You are Dharma, a guide focused on purpose, duty, and righteous living.
            Respond with wisdom about finding one's purpose and living in alignment with deeper values.
            Be direct, motivational, and focus on personal responsibility.
            """,
            "atma": """
            You are Atma, a contemplative guide focused on self-realization and consciousness.
            Respond with wisdom about the nature of self, awareness, and spiritual awakening.
            Be profound, reflective, and focus on inner transformation.
            """
        }
        
        # Quality evaluation prompt addition
        quality_prompt = """
        After responding to the user, evaluate the quality of their question on a scale from 1-10.
        Include this evaluation at the end of your response in the format [QUALITY:X:reason],
        where X is the score (1-10) and reason is a brief explanation.
        
        Score criteria:
        1-3: Simple questions with little depth or reflection
        4-7: Good questions showing some thought and personal relevance
        8-10: Excellent questions showing deep reflection, vulnerability, or spiritual insight
        
        Example: [QUALITY:8:Shows deep personal reflection on the nature of consciousness]
        """
        
        # Get the appropriate system prompt based on persona
        persona_str = chat_request.persona.lower()
        system_prompt = persona_prompts.get(persona_str, persona_prompts["karma"])
        
        # Prepare messages for OpenAI
        messages = [
            {"role": "system", "content": system_prompt + quality_prompt},
            {"role": "user", "content": chat_request.message}
        ]
        
        # Add conversation context if provided
        if chat_request.context:
            messages = [{"role": "system", "content": system_prompt + quality_prompt}]
            for msg in chat_request.context:
                messages.append({"role": msg.role.lower(), "content": msg.content})
            messages.append({"role": "user", "content": chat_request.message})
        
        # Call OpenAI API using modern client
        logger.info(f"Request ID: {request_id} - Calling OpenAI API")
        response = client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
        )
        
        # Extract response text
        response_text = response.choices[0].message.content.strip()
        
        # Extract quality score
        import re
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
        
        # Return in the format matching the API contract
        result = ChatResponse(
            message=clean_response,
            id=f"chat-response-{uuid.uuid4().hex[:12]}",
            timestamp=datetime.utcnow().isoformat() + "Z",
            qualityScore=quality_score,
            scoreReason=quality_reason
        )
        
        # Cache the result if appropriate
        if use_cache and not chat_request.context:
            cache_key = get_cache_key(chat_request.persona, chat_request.message)
            response_cache[cache_key] = (result, datetime.utcnow())
            
            # Cleanup old cache entries
            if len(response_cache) > 1000:  # Prevent unbounded growth
                now = datetime.utcnow()
                keys_to_delete = [
                    k for k, (_, t) in response_cache.items() 
                    if now - t > CACHE_TTL
                ]
                for k in keys_to_delete:
                    del response_cache[k]
        
        return result
    except Exception as e:
        logger.error(f"Request ID: {request_id} - Error generating response: {str(e)}\n{traceback.format_exc()}")
        # Fall back to mock response if there's an error
        persona_responses = {
            "karma": "Mindfulness can be practiced in daily life by bringing your full attention to simple activities like eating, walking, or even washing dishes. Start by dedicating a few minutes each day to focus solely on your breath.",
            "dharma": "Your dharma, or purpose, is discovered through aligning your actions with your deeper values. Consider what activities bring you a sense of meaning and contribution.",
            "atma": "The Self (Atma) is discovered through the practice of self-inquiry. Ask yourself 'Who am I?' and let the question dissolve your identification with transient thoughts."
        }
        
        # Return fallback response in the format matching the API contract
        return ChatResponse(
            message=f"{persona_responses.get(chat_request.persona, persona_responses['karma'])} (Note: Using fallback response due to API error: {str(e)})",
            id=f"chat-response-{uuid.uuid4().hex[:12]}",
            timestamp=datetime.utcnow().isoformat() + "Z",
            qualityScore=7,
            scoreReason="Good question showing interest in spiritual growth"
        )

@app.post("/api/session/metrics", response_model=PointsResponse, tags=["session"])
@limiter.limit("30/minute")
async def calculate_session_points(
    request: Request,
    session_request: SessionMetricsRequest = Body(...)
):
    """
    Calculate points earned from a chat session
    
    This endpoint:
    - Takes session metrics (duration, message count, persona)
    - Calculates points based on predefined rules
    - Returns total points earned and breakdown
    """
    try:
        # Points calculation logic
        # 1. Base points per message
        base_points = 5
        message_points = base_points * session_request.messageCount
        
        # 2. Duration points (1 point per minute, max 30)
        duration_minutes = session_request.durationSeconds / 60
        duration_points = min(int(duration_minutes), 30)
        
        # 3. Streak bonus (mock implementation)
        streak_bonus = 5  # Assuming a streak of 1 day
        
        # 4. Calculate total points
        total_earned = message_points + duration_points + streak_bonus
        
        # 5. Mock total accumulated points
        total_points = 1000 + total_earned
        
        # Return points response
        return PointsResponse(
            pointsEarned=int(total_earned),
            totalPoints=int(total_points),
            breakdown={
                "base": message_points,
                "duration": duration_points,
                "streak": streak_bonus
            }
        )
    except Exception as e:
        logger.error(f"Error calculating points: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating points: {str(e)}"
        )

@app.get("/api/points/calculations", tags=["session"])
@limiter.limit("30/minute")
async def get_points_calculations(
    request: Request
):
    """
    Get the constants used in points calculations
    
    Returns the base values used to calculate points for the client
    """
    return {
        "base_points_per_question": 5,
        "time_points_per_minute": 1,
        "quality_multipliers": {
            "low": 0.5,
            "medium": 1.0,
            "high": 1.5
        },
        "streak_bonus": 5,
        "milestone_bonuses": {
            "5_questions": 10,
            "10_questions": 20,
            "25_questions": 50
        }
    }

# Document model
class Document(BaseModel):
    text: str = Field(..., description="Document text content")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Document metadata")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "text": "This is a sample document with spiritual content.",
                "metadata": {
                    "title": "Introduction to Meditation",
                    "author": "Nandi Team",
                    "tags": ["meditation", "mindfulness"]
                }
            }
        }
    }

class DocumentResponse(BaseModel):
    id: str = Field(..., description="Document ID")
    timestamp: str = Field(..., description="Timestamp of document creation")
    status: str = Field(..., description="Processing status")
    
    model_config = {
        "json_schema_extra": {
            "example": {
                "id": "doc-123456",
                "timestamp": "2023-07-10T15:30:45Z",
                "status": "processed"
            }
        }
    }

@app.post("/documents", response_model=DocumentResponse, tags=["documents"])
@limiter.limit("30/minute")
async def upload_document(
    request: Request,
    document: Document = Body(...)
):
    """
    Upload a document for processing and indexing
    
    This endpoint:
    - Accepts document text and metadata
    - Processes the document (in future: embedding, indexing)
    - Returns a document ID for future reference
    """
    try:
        # Generate a document ID
        doc_id = f"doc-{uuid.uuid4().hex[:12]}"
        
        # In a real implementation, we would:
        # 1. Create embeddings for the document
        # 2. Store in a vector database
        # 3. Index for search/retrieval
        
        # For now, just log and return
        logger.info(f"Document uploaded: {doc_id} with {len(document.text)} characters")
        
        return DocumentResponse(
            id=doc_id,
            timestamp=datetime.utcnow().isoformat() + "Z",
            status="processed"
        )
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing document: {str(e)}"
        )

@app.get("/api/test", tags=["health"])
async def test():
    """
    Test endpoint to verify API functionality
    """
    return {"message": "API test endpoint is working"}

# Error handling middleware
@app.middleware("http")
async def log_exceptions(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        error_id = str(uuid.uuid4())
        logger.error(
            f"Error ID: {error_id} - Exception: {str(e)} - "
            f"Path: {request.url.path} - "
            f"Traceback: {traceback.format_exc()}"
        )
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal server error",
                "error_id": error_id,
                "message": str(e)
            }
        )

# Include admin router
app.include_router(admin.router)

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.environment == "development"
    ) 