from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, List

class PersonaType(str, Enum):
    KARMA = "karma"
    DHARMA = "dharma"
    ATMA = "atma"

class ChatRequest(BaseModel):
    message: str = Field(..., description="User message")
    persona: PersonaType = Field(..., description="Selected persona")
    context: Optional[List[dict]] = Field(default=None, description="Previous context")

class ChatResponse(BaseModel):
    message: str = Field(..., description="AI response message") 