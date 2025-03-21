#!/bin/bash

# Health Check Endpoint
echo "Testing Health Check Endpoint..."
curl http://localhost:9080/api/health

# Chat Generation Endpoint
echo -e "\n\nTesting Chat Generation Endpoint..."
curl -X POST http://localhost:9080/api/chat/generate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, how are you?",
    "persona": "karma",
    "session_id": "test-session-123",
    "context": []
  }'

# Session Metrics Endpoint
echo -e "\n\nTesting Session Metrics Endpoint..."
curl -X POST http://localhost:9080/api/session/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "persona": "karma",
    "durationSeconds": 300,
    "messageCount": 10
  }'

# Points Calculations Endpoint
echo -e "\n\nTesting Points Calculations Endpoint..."
curl http://localhost:9080/api/points/calculations

# AI Service Health Endpoint (direct)
echo -e "\n\nTesting AI Service Health Endpoint (direct)..."
curl http://localhost:8000/health

# Swagger UI (if enabled)
echo -e "\n\nTesting Swagger UI Endpoint..."
curl http://localhost:9080/q/swagger-ui/

# OpenAPI Specification
echo -e "\n\nTesting OpenAPI Specification Endpoint..."
curl http://localhost:9080/q/openapi 