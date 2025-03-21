import json
import os
import logging
from pathlib import Path

logger = logging.getLogger(__name__)

class PromptManager:
    """
    A utility class for loading and managing prompts from JSON configuration.
    """
    
    def __init__(self, prompts_file=None):
        """
        Initialize the PromptManager with the path to the prompts JSON file.
        
        Args:
            prompts_file: Path to prompts JSON file. If None, uses default path.
        """
        if prompts_file is None:
            # Use the default path relative to this file
            base_dir = Path(__file__).resolve().parent
            prompts_file = base_dir / "prompts.json"
            
        self.prompts_file = prompts_file
        self.prompts = {}
        self._load_prompts()
    
    def _load_prompts(self):
        """Load prompts from the JSON file."""
        try:
            with open(self.prompts_file, 'r') as f:
                self.prompts = json.load(f)
            logger.info(f"Successfully loaded prompts from {self.prompts_file}")
        except Exception as e:
            logger.error(f"Error loading prompts from {self.prompts_file}: {str(e)}")
            # Initialize with empty structure to prevent errors
            self.prompts = {
                "personas": {},
                "quality": {},
                "fallbacks": {}
            }
    
    def get_persona_prompt(self, persona):
        """
        Get the system prompt for a specific persona.
        
        Args:
            persona: The persona identifier (e.g., "karma", "dharma")
            
        Returns:
            str: The system prompt for the requested persona
        """
        try:
            return self.prompts.get("personas", {}).get(persona, {}).get("system_prompt", "")
        except Exception as e:
            logger.error(f"Error retrieving prompt for persona {persona}: {str(e)}")
            return ""
    
    def get_quality_prompt(self):
        """
        Get the quality evaluation prompt.
        
        Returns:
            str: The quality evaluation prompt
        """
        try:
            return self.prompts.get("quality", {}).get("evaluation_prompt", "")
        except Exception as e:
            logger.error(f"Error retrieving quality prompt: {str(e)}")
            return ""
    
    def get_fallback_response(self, persona):
        """
        Get the fallback response for a specific persona.
        
        Args:
            persona: The persona identifier (e.g., "karma", "dharma")
            
        Returns:
            str: The fallback response for the requested persona
        """
        try:
            return self.prompts.get("fallbacks", {}).get(persona, "")
        except Exception as e:
            logger.error(f"Error retrieving fallback response for persona {persona}: {str(e)}")
            return ""

    def refresh(self):
        """Reload prompts from the JSON file."""
        self._load_prompts()
        
# Create a singleton instance
prompt_manager = PromptManager() 