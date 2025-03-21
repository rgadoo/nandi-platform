from pydantic import BaseModel, Field
from typing import Dict, Optional
from .chat import Persona


class SessionMetricsRequest(BaseModel):
    """Request model for session metrics calculation."""
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


class PointsResponse(BaseModel):
    """Response model for points calculation endpoints."""
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


class PointsCalculation(BaseModel):
    """Model for points calculation constants."""
    base_points_per_question: int = 5
    time_points_per_minute: int = 1
    quality_multipliers: Dict[str, float] = {
        "low": 0.5,
        "medium": 1.0,
        "high": 1.5
    }
    streak_bonus: int = 5
    milestone_bonuses: Dict[str, int] = {
        "5_questions": 10,
        "10_questions": 20,
        "25_questions": 50
    } 