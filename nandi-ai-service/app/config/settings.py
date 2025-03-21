from pydantic_settings import BaseSettings
from pydantic import ValidationError
from typing import Optional
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

class Settings(BaseSettings):
    """Application settings that can be configured via environment variables."""
    
    # API config
    openai_api_key: str = ""
    api_key: str = "development_key"
    port: int = 8000
    environment: str = "development"
    log_level: str = "INFO"
    
    # Server options
    debug: Optional[bool] = True
    host: Optional[str] = "0.0.0.0"
    cors_origins: Optional[str] = "http://localhost:3000,http://localhost:8080"
    
    # OpenAI settings
    default_model: Optional[str] = "gpt-4"
    
    # Cache settings (included for future Redis integration)
    redis_host: Optional[str] = "localhost"
    redis_port: Optional[str] = "6379"
    redis_password: Optional[str] = ""
    redis_db: Optional[str] = "0"
    redis_ttl: Optional[str] = "604800"
    celery_broker_url: Optional[str] = "redis://localhost:6379/0"
    celery_result_backend: Optional[str] = "redis://localhost:6379/0"
    
    # Caching time-to-live in minutes
    cache_ttl_minutes: int = 30
    
    # Rate limits
    chat_rate_limit: str = "10/minute"
    points_rate_limit: str = "30/minute"
    
    model_config = {
        "env_file": ".env",
        "extra": "allow"
    }
    
    def get_cors_origins(self) -> list:
        """Parse the CORS origins string into a list."""
        if self.cors_origins:
            return [origin.strip() for origin in self.cors_origins.split(",")]
        return ["*"]
    
    def get_log_level(self) -> int:
        """Get the logging level as an integer constant."""
        return getattr(logging, self.log_level)


# Create settings instance
def get_settings() -> Settings:
    """Return application settings singleton."""
    try:
        return Settings(
            openai_api_key=os.getenv("OPENAI_API_KEY", ""),
            api_key=os.getenv("API_KEY", "development_key"),
            port=int(os.getenv("PORT", 8000)),
            environment=os.getenv("ENVIRONMENT", "development"),
            log_level=os.getenv("LOG_LEVEL", "INFO")
        )
    except ValidationError as e:
        logging.error(f"Error loading environment variables: {e}")
        raise

# Create a singleton instance
settings = get_settings() 