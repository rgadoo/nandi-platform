import pytest
import os

def test_environment_variables():
    """Test that environment variables are loaded correctly."""
    assert os.environ.get("ENVIRONMENT") == "test"
    assert os.environ.get("API_KEY") == "test-api-key"
    assert os.environ.get("OPENAI_API_KEY") == "test-key"
    
def test_simple_assertion():
    """Test that pytest is working properly."""
    assert 1 == 1
    assert "test" == "test"
    assert True is True 