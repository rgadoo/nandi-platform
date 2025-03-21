from fastapi import APIRouter, Body, Depends, Request, HTTPException
from fastapi.security.api_key import APIKey
from app.models.points import SessionMetricsRequest, PointsResponse
from app.services.points_service import calculate_session_points, get_points_calculations
from app.api.dependencies import api_key_dependency, get_limiter
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["session"])
limiter = get_limiter()


@router.post("/session/metrics", response_model=PointsResponse)
@limiter.limit("30/minute")
async def session_metrics(
    request: Request,
    session_request: SessionMetricsRequest = Body(...),
    api_key: APIKey = Depends(api_key_dependency())
):
    """
    Calculate points earned from a chat session
    
    This endpoint:
    - Takes session metrics (duration, message count, persona)
    - Calculates points based on predefined rules
    - Returns total points earned and breakdown
    """
    try:
        return await calculate_session_points(session_request)
    except Exception as e:
        logger.error(f"Error calculating points: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating points: {str(e)}"
        )


@router.get("/points/calculations")
@limiter.limit("30/minute")
async def points_calculations(
    request: Request,
    api_key: APIKey = Depends(api_key_dependency())
):
    """
    Get the constants used in points calculations
    
    Returns the base values used to calculate points for the client
    """
    return get_points_calculations() 