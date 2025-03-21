import hashlib
from datetime import datetime, timedelta
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

# Simple in-memory cache - consider using Redis for production
response_cache = {}
CACHE_TTL = timedelta(minutes=settings.cache_ttl_minutes)


def get_cache_key(persona, message):
    """Generate a deterministic cache key for a request."""
    key_data = f"{persona}:{message}".encode()
    return hashlib.md5(key_data).hexdigest()


def get_from_cache(persona, message):
    """Get a cached response if available and valid."""
    if settings.environment == "development":
        return None  # Skip cache in development mode
        
    cache_key = get_cache_key(persona, message)
    if cache_key in response_cache:
        cached_data, cache_time = response_cache[cache_key]
        # Check if cache is still valid
        if datetime.utcnow() - cache_time < CACHE_TTL:
            return cached_data
    return None


def save_to_cache(persona, message, data):
    """Save a response to the cache."""
    if settings.environment == "development":
        return  # Skip cache in development mode
        
    cache_key = get_cache_key(persona, message)
    response_cache[cache_key] = (data, datetime.utcnow())
    
    # Cleanup old cache entries
    if len(response_cache) > 1000:  # Prevent unbounded growth
        cleanup_cache()


def cleanup_cache():
    """Remove expired entries from the cache."""
    now = datetime.utcnow()
    keys_to_delete = [
        k for k, (_, t) in response_cache.items() 
        if now - t > CACHE_TTL
    ]
    for k in keys_to_delete:
        del response_cache[k]
    
    if keys_to_delete:
        logger.info(f"Cleaned up {len(keys_to_delete)} expired cache entries") 