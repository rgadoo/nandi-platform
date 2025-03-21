import pytest
import asyncio
from unittest.mock import patch, MagicMock
from app.models.chat import ChatRequest, Persona
from app.models.points import SessionMetricsRequest
from app.services.ai_service import generate_response
from app.services.points_service import calculate_session_points, get_points_calculations


@pytest.mark.asyncio
@patch("app.services.ai_service.client.chat.completions.create")
@patch("app.services.ai_service.get_from_cache")
async def test_generate_response(mock_get_cache, mock_create):
    """Test the generate_response service function."""
    # Mock cache miss
    mock_get_cache.return_value = None
    
    # Mock OpenAI response
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(
            message=MagicMock(
                content="Mindfulness is about being present. [QUALITY:7:Good question about mindfulness]"
            )
        )
    ]
    mock_create.return_value = mock_response
    
    # Create a request
    request = ChatRequest(
        message="What is mindfulness?",
        persona=Persona.KARMA,
        session_id="test_session"
    )
    
    # Call the function
    result = await generate_response(request)
    
    # Check the result
    assert result is not None
    assert "Mindfulness is about being present" in result.message
    assert result.qualityScore == 7
    assert "Good question about mindfulness" in result.scoreReason
    assert result.id.startswith("chat-response-")
    
    # Verify mock calls
    mock_get_cache.assert_called_once()
    mock_create.assert_called_once()


@pytest.mark.asyncio
@patch("app.services.ai_service.get_from_cache")
async def test_generate_response_from_cache(mock_get_cache):
    """Test the generate_response function with a cache hit."""
    # Mock cached response
    mock_cached = MagicMock()
    mock_cached.message = "Cached mindfulness response"
    mock_get_cache.return_value = mock_cached
    
    # Create a request
    request = ChatRequest(
        message="What is mindfulness?",
        persona=Persona.KARMA,
        session_id="test_session"
    )
    
    # Call the function
    result = await generate_response(request)
    
    # Check the result
    assert result is mock_cached
    mock_get_cache.assert_called_once()


@pytest.mark.asyncio
async def test_calculate_session_points():
    """Test the calculate_session_points function."""
    # Create a request
    request = SessionMetricsRequest(
        persona=Persona.DHARMA,
        durationSeconds=720,  # 12 minutes
        messageCount=12
    )
    
    # Call the function
    result = await calculate_session_points(request)
    
    # Check the result
    assert result is not None
    assert result.pointsEarned == 77  # 60 (base) + 12 (duration) + 5 (streak)
    assert result.totalPoints == 1077  # 1000 (mock total) + 77
    assert result.breakdown == {
        "base": 60,  # 5 points * 12 messages
        "duration": 12,  # 12 minutes
        "streak": 5  # Default streak bonus
    }


def test_get_points_calculations():
    """Test the get_points_calculations function."""
    # Call the function
    result = get_points_calculations()
    
    # Check the result
    assert result is not None
    assert result["base_points_per_question"] == 5
    assert result["time_points_per_minute"] == 1
    assert "quality_multipliers" in result
    assert "streak_bonus" in result
    assert "milestone_bonuses" in result 