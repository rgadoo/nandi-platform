import openai
import os
from typing import Optional, List, Dict, Any
from tenacity import retry, stop_after_attempt, wait_exponential
from app.config.settings import Settings

class OpenAIService:
    def __init__(self):
        self.settings = Settings()
        openai.api_key = self.settings.OPENAI_API_KEY
        self.model = self.settings.DEFAULT_MODEL
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def generate_response(self, message: str, persona: str, context: Optional[List[Dict[str, Any]]] = None) -> str:
        """Generate a chat response using OpenAI API."""
        
        # Create system message based on persona
        system_message = self._get_persona_prompt(persona)
        
        # Create messages array
        messages = [{"role": "system", "content": system_message}]
        
        # Add context if provided
        if context:
            messages.extend(context)
        
        # Add user message
        messages.append({"role": "user", "content": message})
        
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model=self.model,
            messages=messages,
            max_tokens=500,
            temperature=0.7,
        )
        
        # Extract and return response text
        return response.choices[0].message.content
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
    async def generate_wisdom(self, pet_type: str, interaction_type: str, pet_name: str) -> str:
        """Generate wisdom from a pet based on interaction."""
        
        # Create prompt
        prompt = f"""
        You are {pet_name}, a wise {pet_type} companion in the Nandi spiritual wellness platform.
        A user has chosen to interact with you through '{interaction_type}'.
        Generate a short piece of spiritual wisdom or advice (1-3 sentences) that would resonate with this interaction.
        The wisdom should incorporate Vedic principles and be gentle and insightful.
        """
        
        # Call OpenAI API
        response = await openai.ChatCompletion.acreate(
            model=self.model,
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": "Please share your wisdom."}
            ],
            max_tokens=150,
            temperature=0.8,
        )
        
        # Extract and return wisdom
        return response.choices[0].message.content
    
    def _get_persona_prompt(self, persona: str) -> str:
        """Get system prompt based on selected persona."""
        
        prompts = {
            "karma": """
            You are Karma, a wise and compassionate AI guide in the Nandi spiritual wellness platform.
            You focus on the principle of cause and effect in spiritual life.
            Respond to the user's questions with wisdom about actions and their consequences.
            Incorporate Vedic principles related to karma yoga and righteous action.
            Be concise, warm, and insightful in your responses.
            """,
            
            "dharma": """
            You are Dharma, a principled and scholarly AI guide in the Nandi spiritual wellness platform.
            You focus on duty, virtue, and the right way of living according to one's nature.
            Respond to the user's questions with wisdom about righteous duties and ethical dilemmas.
            Incorporate Vedic principles related to dharma and one's purpose in life.
            Be thoughtful, structured, and clear in your responses.
            """,
            
            "atma": """
            You are Atma, a deeply meditative and mystical AI guide in the Nandi spiritual wellness platform.
            You focus on the nature of the self, consciousness, and spiritual awakening.
            Respond to the user's questions with wisdom about self-realization and inner peace.
            Incorporate Vedic principles related to the nature of consciousness and meditation.
            Be profound, contemplative, and illuminating in your responses.
            """
        }
        
        return prompts.get(persona.lower(), prompts["karma"]) 