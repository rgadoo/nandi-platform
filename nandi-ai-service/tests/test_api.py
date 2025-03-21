import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from app.main import app
from app.models.chat import ChatResponse

client = TestClient(app)

# Test API key
TEST_API_KEY = "development_key"


def test_root_endpoint(client):
    """Test the root endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome to Nandi AI Service" in response.json()["message"]


def test_health_check(client):
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    assert "system" in response.json()
    assert "service" in response.json()


def test_api_test_endpoint(client):
    """Test the API test endpoint."""
    response = client.get("/api/test")
    assert response.status_code == 200
    assert response.json()["message"] == "API test endpoint is working"


@patch("app.services.ai_service.generate_response")
def test_chat_generate_endpoint(mock_generate, client, api_key_headers):
    """Test the chat generation endpoint."""
    # Mock the generate_response function
    mock_response = {
        "message": "Mindfulness is about being present in the moment.",
        "id": "chat-response-123456",
        "timestamp": "2023-07-10T15:30:45Z",
        "qualityScore": 7,
        "scoreReason": "Good question showing interest in spiritual growth"
    }
    mock_generate.return_value = mock_response
    
    # Make the request
    request_data = {
        "message": "What is mindfulness?",
        "persona": "karma",
        "session_id": "test_session_123",
        "context": []
    }
    
    response = client.post(
        "/api/chat/generate",
        json=request_data,
        headers=api_key_headers
    )
    
    assert response.status_code == 200
    assert response.json() == mock_response
    mock_generate.assert_called_once()


@patch("app.services.points_service.calculate_session_points")
def test_session_metrics_endpoint(mock_calculate, client, api_key_headers):
    """Test the session metrics endpoint."""
    # Mock the calculate_session_points function
    mock_response = {
        "pointsEarned": 77,
        "totalPoints": 1077,
        "breakdown": {
            "base": 60,
            "duration": 12,
            "streak": 5
        }
    }
    mock_calculate.return_value = mock_response
    
    # Make the request
    request_data = {
        "persona": "dharma",
        "durationSeconds": 720,
        "messageCount": 12
    }
    
    response = client.post(
        "/api/session/metrics",
        json=request_data,
        headers=api_key_headers
    )
    
    assert response.status_code == 200
    assert response.json() == mock_response
    mock_calculate.assert_called_once()


@patch("app.services.points_service.get_points_calculations")
def test_points_calculations_endpoint(mock_get_points, client, api_key_headers):
    """Test the points calculations endpoint."""
    # Mock the get_points_calculations function
    mock_response = {
        "base_points_per_question": 5,
        "time_points_per_minute": 1,
        "quality_multipliers": {
            "low": 0.5,
            "medium": 1.0,
            "high": 1.5
        },
        "streak_bonus": 5,
        "milestone_bonuses": {
            "5_questions": 10,
            "10_questions": 20,
            "25_questions": 50
        }
    }
    mock_get_points.return_value = mock_response
    
    # Make the request
    response = client.get(
        "/api/points/calculations",
        headers=api_key_headers
    )
    
    assert response.status_code == 200
    assert response.json() == mock_response
    mock_get_points.assert_called_once()


def test_api_key_required(client):
    """Test that API key is required for protected endpoints."""
    # Chat generate endpoint
    response = client.post(
        "/api/chat/generate",
        json={"message": "Test", "persona": "karma"}
    )
    assert response.status_code == 403
    
    # Session metrics endpoint
    response = client.post(
        "/api/session/metrics",
        json={"persona": "dharma", "durationSeconds": 720, "messageCount": 12}
    )
    assert response.status_code == 403
    
    # Points calculations endpoint
    response = client.get("/api/points/calculations")
    assert response.status_code == 403


def test_chat_generate_with_real_openai(client, api_key_headers, mock_openai):
    """Test the chat generation endpoint with the mocked OpenAI client."""
    request_data = {
        "message": "What is enlightenment?",
        "persona": "karma",
        "session_id": "test_session_345"
    }
    
    response = client.post(
        "/api/chat/generate",
        json=request_data,
        headers=api_key_headers
    )
    
    assert response.status_code == 200
    assert "id" in response.json()
    assert "timestamp" in response.json()
    assert "qualityScore" in response.json()
    assert "scoreReason" in response.json()
    
    mock_openai.assert_called_once() 