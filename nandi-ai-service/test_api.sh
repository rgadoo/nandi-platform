#!/bin/bash
# Nandi AI Service API Test Script

PORT=5005  # The port the server is running on
BASE_URL="http://localhost:$PORT"
API_KEY="development_key"

echo "Testing Nandi AI Service API on $BASE_URL"
echo "----------------------------------------"

# Test root endpoint
echo -n "Testing root endpoint: "
curl -s $BASE_URL/ | python3 -m json.tool

# Test health endpoint
echo -n "Testing health endpoint: "
curl -s $BASE_URL/health | python3 -m json.tool

# Test document upload endpoint
echo -n "Testing document upload endpoint: "
echo '{"text": "This is a test document for the Nandi AI service.", "metadata": {"title": "Test Document", "author": "Test User"}}' > test_doc.json
curl -s -X POST -H "Content-Type: application/json" -d @test_doc.json $BASE_URL/documents | python3 -m json.tool

# Test chat generation endpoint (Karma persona)
echo -n "Testing chat generation endpoint (Karma persona): "
curl -s -X POST -H "Content-Type: application/json" -H "x-api-key: $API_KEY" \
  -d '{"message": "What is mindfulness?", "persona": "karma", "session_id": "test-session", "context": []}' \
  $BASE_URL/api/chat/generate | python3 -m json.tool

# Test chat with Dharma persona
echo -n "Testing chat generation endpoint (Dharma persona): "
curl -s -X POST -H "Content-Type: application/json" -H "x-api-key: $API_KEY" \
  -d '{"message": "How do I find my purpose in life?", "persona": "dharma", "session_id": "test-session", "context": []}' \
  $BASE_URL/api/chat/generate | python3 -m json.tool

# Test chat with Atma persona
echo -n "Testing chat generation endpoint (Atma persona): "
curl -s -X POST -H "Content-Type: application/json" -H "x-api-key: $API_KEY" \
  -d '{"message": "What is the nature of consciousness?", "persona": "atma", "session_id": "test-session", "context": []}' \
  $BASE_URL/api/chat/generate | python3 -m json.tool

# Test session metrics endpoint
echo -n "Testing session metrics endpoint: "
curl -s -X POST -H "Content-Type: application/json" -d '{"persona": "karma", "durationSeconds": 600, "messageCount": 10}' $BASE_URL/api/session/metrics | python3 -m json.tool

# Test points calculations endpoint
echo -n "Testing points calculations endpoint: "
curl -s $BASE_URL/api/points/calculations | python3 -m json.tool

# Test API test endpoint
echo -n "Testing API test endpoint: "
curl -s $BASE_URL/api/test | python3 -m json.tool

echo "API testing complete!" 