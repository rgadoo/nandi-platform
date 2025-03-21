from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, List
from datetime import datetime


class Persona(str, Enum):
    """AI persona types for spiritual guidance."""
    KARMA = "karma"  # Focus on mindfulness and cause-effect relationships
    DHARMA = "dharma"  # Focus on purpose, duty, and righteous living
    ATMA = "atma"  # Focus on self-realization and consciousness
    

class MessageRole(str, Enum):
    """Role of a conversation message."""
    USER = "user"
    ASSISTANT = "assistant"


class ConversationMessage(BaseModel):
    """A message in a conversation chain."""
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
    """Evaluation of question quality."""
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
    """Request model for the chat generation endpoint."""
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


class ChatResponse(BaseModel):
    """Response model for the chat generation endpoint."""
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
    
    @classmethod
    def create(cls, message: str, quality_score: int, quality_reason: str) -> "ChatResponse":
        """Factory method to create a ChatResponse with auto-generated fields."""
        import uuid
        return cls(
            message=message,
            id=f"chat-response-{uuid.uuid4().hex[:12]}",
            timestamp=datetime.utcnow().isoformat() + "Z",
            qualityScore=quality_score,
            scoreReason=quality_reason
        ) 