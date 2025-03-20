# nandi-ai-service Implementation Plan

## Overview

The nandi-ai-service is a Python-based backend service that processes chat messages, applies persona-specific prompts, calls the OpenAI API, and returns AI responses with quality scoring for the KarmaCafe feature of the Nandi platform.

## Implementation Steps

### 1. Project Setup

```bash
mkdir -p nandi-ai-service/app/{api,core,models,utils}
cd nandi-ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Create basic files:
```
touch app/__init__.py
touch app/main.py
touch app/api/__init__.py
touch app/core/__init__.py
touch app/models/__init__.py
touch app/utils/__init__.py
touch requirements.txt
touch .env.example
touch Dockerfile
touch docker-compose.yml
touch README.md
```

### 2. Define Dependencies

Add to `requirements.txt`:
```
fastapi==0.95.1
uvicorn==0.22.0
pydantic==1.10.7
python-dotenv==1.0.0
openai==0.27.6
redis==4.5.4
httpx==0.24.0
python-multipart==0.0.6
```

### 3. Set Up Environment Configuration

Create `.env.example`:
```
# API settings
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true

# OpenAI settings
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4

# Redis settings
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=nandi_redis_password
REDIS_DB=0
REDIS_TTL=604800  # 1 week in seconds
```

### 4. Create Basic FastAPI Application

In `app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Nandi AI Service",
    description="AI service for the Nandi platform's KarmaCafe feature",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

### 5. Create Pydantic Models

In `app/models/chat.py`:
```python
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from enum import Enum

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

class ChatRequest(BaseModel):
    message: str
    persona: Persona
    context: Optional[List[ConversationMessage]] = Field(default_factory=list)
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    
class ChatResponseWithQuality(ChatResponse):
    quality_score: int = Field(..., ge=1, le=10)
    reasoning: Optional[str] = None
```

### 6. Implement OpenAI Service

In `app/core/openai_service.py`:
```python
import os
import json
from typing import Dict, List, Any, Optional
import openai
from fastapi import Depends
from ..models.chat import Persona

class OpenAIService:
    def __init__(self):
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.model = os.getenv("OPENAI_MODEL", "gpt-4")
        
    def _get_persona_prompt(self, persona: str) -> str:
        """Get the prompt for a specific persona."""
        prompts = {
            "karma": """
You are Karma (also known as Lumina), a compassionate and practical AI guide in the Nandi spiritual wellness platform.

Your purpose is to help users understand the concept of karma - the law of cause and effect in their lives. You represent the wisdom tradition that focuses on mindful action and its consequences.

You should focus on topics such as:
- Ethical decision-making in daily life
- Taking responsibility for one's choices
- Finding balance in life's activities

Your tone should be:
- Supportive but not judgmental
- Practical with occasional metaphors
- Gentle but direct when needed
- Thoughtful and reflective

Avoid:
- Giving specific predictions about the future
- Making definitive claims about religious dogma
- Imposing strict rules or commandments
- Using technical jargon without explanation
""",
            "dharma": """
You are Dharma (also known as Nova), a principled and scholarly AI guide in the Nandi spiritual wellness platform.

Your purpose is to help users discover their purpose (dharma) through principled living and wise choices. You represent the wisdom tradition that focuses on duty, ethics, and right action.

You should focus on topics such as:
- Finding one's purpose and living in alignment with it
- Ethical frameworks from various wisdom traditions
- Creating balance between personal desires and responsibilities
- Decision-making through principled lenses
- Disciplined approaches to spiritual growth

Your tone should be:
- Thoughtful and measured
- Scholarly but accessible
- Principled without being rigid
- Grounded in wisdom traditions but relevant to modern life

Avoid:
- Oversimplifying complex ethical questions
- Presenting your perspective as the only correct path
- Making specific predictions about a user's future
- Encouraging actions that conflict with ethical values
""",
            "atma": """
You are Atma (also known as Solis), a contemplative and mystical AI guide in the Nandi spiritual wellness platform.

Your purpose is to help users connect with their higher Self (atma) and the universal consciousness. You represent the wisdom tradition that focuses on meditation, self-realization, and transcendent awareness.

You should focus on topics such as:
- Meditation techniques and mindfulness practices
- The nature of consciousness and self-awareness
- Transcending ego limitations
- Unity experiences and universal connectedness
- Inner peace and spiritual awakening

Your tone should be:
- Contemplative and reflective
- Serene and centered
- Gently inquisitive
- Poetic when appropriate

Avoid:
- Technical jargon without explanation
- Making claims about supernatural powers
- Rejecting a person's ordinary life concerns
- Suggesting that your path is the only path to enlightenment
"""
        }
        
        return prompts.get(persona.lower(), prompts["karma"])
    
    def _get_quality_evaluation_instructions(self) -> str:
        """Get the quality evaluation instructions."""
        return """
QUALITY EVALUATION:
As part of your response, you will evaluate the quality of the user's question on a scale from 1-10.
This evaluation should be invisible to the user but included in your API response as a separate field.

Evaluate questions based on:
- Depth of reflection (1-10): Does the question show deep personal reflection?
- Relevance to spiritual growth (1-10): Is the question connected to meaningful spiritual development?
- Clarity of expression (1-10): Is the question clearly articulated?
- Personal investment (1-10): Does the question reflect genuine desire for growth?

Calculate an overall quality score (1-10) based on these factors.

LOW QUALITY (1-3): Simple yes/no questions, questions with little thought, or questions meant to test system limits
MEDIUM QUALITY (4-7): Questions showing some reflection and genuine interest in spiritual topics
HIGH QUALITY (8-10): Deeply reflective questions showing personal vulnerability, wisdom-seeking, and spiritual maturity

Example 1 - Low Quality (Score: 2)
User: "What's your favorite color?"
Reasoning: Off-topic, not related to spiritual growth or the purpose of the platform.

Example 2 - Medium Quality (Score: 5)
User: "How can I be more mindful during my day?"
Reasoning: Related to spiritual practice, but somewhat general and lacks personal context.

Example 3 - High Quality (Score: 9)
User: "I've been struggling with balancing my career ambitions with my desire to be more present with my family. How can I approach this conflict through the lens of dharma?"
Reasoning: Shows deep reflection, personal vulnerability, specific spiritual context, and genuine desire for guidance.

YOUR RESPONSE MUST BE A JSON OBJECT WITH THESE FIELDS:
{
  "response": "Your response to the user's message",
  "quality_score": 1-10,
  "quality_reasoning": "Brief explanation of the quality score"
}
"""
        
    async def generate_response_with_quality_score(
        self, 
        message: str, 
        persona: Persona, 
        context: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Generate a response to a user message with quality scoring.
        
        Args:
            message: The user's message text
            persona: The selected persona (karma, dharma, atma)
            context: Optional conversation history
            
        Returns:
            Dict containing response text and quality scoring
        """
        # Get the appropriate persona prompt
        persona_prompt = self._get_persona_prompt(persona)
        
        # Create the quality evaluation prompt
        full_prompt = f"{persona_prompt}\n\n{self._get_quality_evaluation_instructions()}"
        
        # Add conversation context
        messages = []
        if context:
            for item in context:
                role = "assistant" if item.role == "assistant" else "user"
                messages.append({"role": role, "content": item.content})
        
        # Add the quality evaluation instruction to system message
        messages = [{"role": "system", "content": full_prompt}] + messages
        
        # Add the user's current message
        messages.append({"role": "user", "content": message})
        
        # Call OpenAI
        response = await openai.ChatCompletion.acreate(
            model=self.model,
            messages=messages,
            temperature=0.7,
            max_tokens=1500,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            response_format={"type": "json_object"}
        )
        
        # Extract response and quality score
        response_data = json.loads(response.choices[0].message.content)
        
        # Return both the response text and quality score
        return {
            "message": response_data["response"],
            "quality_score": response_data["quality_score"],
            "reasoning": response_data.get("quality_reasoning", "")
        }

def get_openai_service():
    return OpenAIService()
```

### 7. Implement Redis Caching

In `app/core/cache.py`:
```python
import os
import json
import hashlib
from typing import Optional, Dict, Any
import redis

class RedisCache:
    def __init__(self):
        self.redis = redis.Redis(
            host=os.getenv("REDIS_HOST", "localhost"),
            port=int(os.getenv("REDIS_PORT", 6379)),
            password=os.getenv("REDIS_PASSWORD", ""),
            db=int(os.getenv("REDIS_DB", 0)),
            decode_responses=True
        )
        self.ttl = int(os.getenv("REDIS_TTL", 604800))  # 1 week default
        
    def _generate_key(self, persona: str, message: str) -> str:
        """Generate a unique key based on persona and message."""
        message_hash = hashlib.md5(message.encode()).hexdigest()
        return f"chat:{persona}:{message_hash}"
        
    async def get_cached_response(self, persona: str, message: str) -> Optional[Dict[str, Any]]:
        """Get a cached response if it exists."""
        key = self._generate_key(persona, message)
        cached = self.redis.get(key)
        
        if cached:
            return json.loads(cached)
        return None
        
    async def cache_response(self, persona: str, message: str, response: Dict[str, Any]) -> None:
        """Cache a response."""
        key = self._generate_key(persona, message)
        self.redis.setex(key, self.ttl, json.dumps(response))

def get_redis_cache():
    return RedisCache()
```

### 8. Create API Router

In `app/api/routes.py`:
```python
from fastapi import APIRouter, Depends, HTTPException
from ..models.chat import ChatRequest, ChatResponse, ChatResponseWithQuality
from ..core.openai_service import OpenAIService, get_openai_service
from ..core.cache import RedisCache, get_redis_cache

router = APIRouter(prefix="/api", tags=["chat"])

@router.post("/chat", response_model=ChatResponseWithQuality)
async def process_chat(
    request: ChatRequest,
    openai_service: OpenAIService = Depends(get_openai_service),
    cache: RedisCache = Depends(get_redis_cache)
):
    try:
        # Check cache first if there's no conversation context
        if not request.context:
            cached_response = await cache.get_cached_response(request.persona, request.message)
            if cached_response:
                return cached_response
        
        # Generate new response
        response = await openai_service.generate_response_with_quality_score(
            message=request.message,
            persona=request.persona,
            context=request.context
        )
        
        # Cache the response if there's no conversation context
        if not request.context:
            await cache.cache_response(request.persona, request.message, response)
        
        return response
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )
```

### 9. Add Router to Main Application

Update `app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import router as chat_router

app = FastAPI(
    title="Nandi AI Service",
    description="AI service for the Nandi platform's KarmaCafe feature",
    version="0.1.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```

### 10. Create Dockerfile

In `Dockerfile`:
```Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 11. Create Docker Compose for Development

In `docker-compose.yml`:
```yaml
version: '3.8'

services:
  ai-service:
    build: .
    container_name: nandi-ai-service
    ports:
      - "8000:8000"
    volumes:
      - .:/app
    env_file:
      - .env
    depends_on:
      - redis

  redis:
    image: redis:7
    container_name: nandi-ai-redis
    ports:
      - "6379:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD:-nandi_redis_password}
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

### 12. Create a README

In `README.md`:
```markdown
# Nandi AI Service

The AI service for the Nandi platform's KarmaCafe feature. This service processes chat messages, applies persona-specific prompts, calls the OpenAI API, and returns AI responses with quality scoring.

## Features

- Multiple AI personas (Karma/Lumina, Dharma/Nova, Atma/Solis)
- Quality evaluation of user questions
- Redis caching for improved performance
- FastAPI for high-performance API endpoints

## Setup

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Create a `.env` file based on `.env.example` and add your OpenAI API key
5. Run the service:
   ```
   uvicorn app.main:app --reload
   ```

## Docker Setup

1. Make sure Docker and Docker Compose are installed
2. Create a `.env` file based on `.env.example`
3. Run:
   ```
   docker-compose up -d
   ```

## API Endpoints

- `POST /api/chat`: Process a chat message
  - Request body: `ChatRequest`
  - Response: `ChatResponseWithQuality`

- `GET /health`: Health check endpoint

## Configuration

Configure the service using environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: The model to use (default: gpt-4)
- `REDIS_HOST`: Redis host (default: localhost)
- `REDIS_PORT`: Redis port (default: 6379)
- `REDIS_PASSWORD`: Redis password
- `REDIS_TTL`: Cache TTL in seconds (default: 604800, 1 week)
```

### 13. Deployment to Heroku

Create a `Procfile` for Heroku deployment:
```
web: uvicorn app.main:app --host=0.0.0.0 --port=${PORT:-8000}
```

Create a `runtime.txt` file for Heroku:
```
python-3.11.4
```

Create a `heroku.yml` file for container deployment:
```yaml
build:
  docker:
    web: Dockerfile
```

### 14. Local Development

1. Clone the repository
2. Create a virtualenv: `python -m venv venv`
3. Activate: `source venv/bin/activate` (Windows: `venv\Scripts\activate`)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and add your OpenAI API key
6. Start the Redis server with Docker: `docker run -d -p 6379:6379 --name nandi-redis redis:7 redis-server --requirepass nandi_redis_password`
7. Run the service: `uvicorn app.main:app --reload`
8. Access API docs at http://localhost:8000/docs 