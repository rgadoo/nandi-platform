# Config package initialization 
from app.config.settings import settings
from app.config.prompt_loader import prompt_manager

__all__ = ['settings', 'prompt_manager'] 