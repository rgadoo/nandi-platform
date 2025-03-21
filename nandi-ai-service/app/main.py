from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import logging
import uvicorn

from app.config.settings import settings
from app.core.security import process_api_key_header, log_exceptions
from app.api.dependencies import limiter, API_TAGS_METADATA
from app.api.routes import chat, health, points
from app.api.endpoints import admin

# Configure logging
logging.basicConfig(
    level=settings.get_log_level(),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("nandi_service.log")
    ]
)
logger = logging.getLogger(__name__)

# Log startup information
logger.info(f"Starting Nandi AI Service in {settings.environment} environment")
if settings.environment == "development":
    logger.info("Development mode: API key validation is relaxed")


def create_application() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        FastAPI: The configured FastAPI application
    """
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
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        openapi_tags=API_TAGS_METADATA,
        swagger_ui_parameters={"defaultModelsExpandDepth": -1}
    )
    
    # Setup limiter
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
    
    # Add middlewares
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.get_cors_origins(),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Add custom middlewares
    app.middleware("http")(process_api_key_header)
    app.middleware("http")(log_exceptions)
    
    # Include routers
    app.include_router(health.router)
    app.include_router(chat.router)
    app.include_router(points.router)
    app.include_router(admin.router)
    
    return app


app = create_application()


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development"
    ) 