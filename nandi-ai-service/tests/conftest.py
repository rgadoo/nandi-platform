import os
import sys
import pytest
from unittest.mock import patch
from dotenv import load_dotenv

# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Load test environment variables with override=True
test_env_path = os.path.join(os.path.dirname(__file__), '.env.test')
load_dotenv(test_env_path, override=True)

# Force set environment variables for testing
os.environ["ENVIRONMENT"] = "test"
os.environ["OPENAI_API_KEY"] = "test-key"
os.environ["API_KEY"] = "test-api-key"

# Import app after environment is set
from fastapi.testclient import TestClient
from server import app


@pytest.fixture
def client():
    """Return a TestClient for the FastAPI app."""
    with TestClient(app) as client:
        yield client


@pytest.fixture
def api_key_headers():
    """Return headers with API key."""
    return {"X-API-Key": "test-api-key"}


@pytest.fixture
def mock_openai():
    """Mock the OpenAI client."""
    with patch("openai.resources.chat.completions.Completions.create") as mock:
        mock.return_value.choices = [
            type("Choice", (), {
                "message": type("Message", (), {
                    "content": "Test response [QUALITY:8:Good test question]"
                })
            })
        ]
        yield mock 