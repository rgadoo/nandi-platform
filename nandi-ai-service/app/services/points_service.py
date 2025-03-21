from app.models.points import SessionMetricsRequest, PointsResponse, PointsCalculation
import logging

logger = logging.getLogger(__name__)

# Default points calculation constants
POINTS_CALCULATION = PointsCalculation()


async def calculate_session_points(request: SessionMetricsRequest) -> PointsResponse:
    """
    Calculate points earned from a chat session.
    
    This function:
    - Takes session metrics (duration, message count, persona)
    - Calculates points based on predefined rules
    - Returns total points earned and breakdown
    """
    try:
        # 1. Base points per message
        base_points = POINTS_CALCULATION.base_points_per_question
        message_points = base_points * request.messageCount
        
        # 2. Duration points (1 point per minute, max 30)
        duration_minutes = request.durationSeconds / 60
        duration_points = min(int(duration_minutes), 30)
        
        # 3. Streak bonus (mock implementation)
        streak_bonus = POINTS_CALCULATION.streak_bonus
        
        # 4. Calculate total points
        total_earned = message_points + duration_points + streak_bonus
        
        # 5. Mock total accumulated points (in a real system, would be fetched from database)
        total_points = 1000 + total_earned
        
        # Return points response
        return PointsResponse(
            pointsEarned=int(total_earned),
            totalPoints=int(total_points),
            breakdown={
                "base": message_points,
                "duration": duration_points,
                "streak": streak_bonus
            }
        )
    except Exception as e:
        logger.error(f"Error calculating points: {str(e)}")
        raise


def get_points_calculations() -> dict:
    """
    Get the constants used in points calculations.
    
    Returns the base values used to calculate points for the client.
    """
    return {
        "base_points_per_question": POINTS_CALCULATION.base_points_per_question,
        "time_points_per_minute": POINTS_CALCULATION.time_points_per_minute,
        "quality_multipliers": POINTS_CALCULATION.quality_multipliers,
        "streak_bonus": POINTS_CALCULATION.streak_bonus,
        "milestone_bonuses": POINTS_CALCULATION.milestone_bonuses
    } 