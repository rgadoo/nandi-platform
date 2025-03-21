#!/bin/bash

# Health Check Endpoint
echo "Testing Health Check Endpoint..."
curl http://localhost:9080/q/health

# Chat Generation Endpoint
echo -e "\n\nTesting Chat Generation Endpoint..."
curl -X POST http://localhost:9080/api/chat/generate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello",
    "persona": "karma",
    "session_id": "test-session-1",
    "context": []
  }'

# Session Metrics Endpoint
echo -e "\n\nTesting Session Metrics Endpoint..."
curl -X POST http://localhost:9080/api/session/metrics \
  -H "Content-Type: application/json" \
  -d '{
    "persona": "karma",
    "duration_seconds": 300,
    "message_count": 5
  }'

# AI Service Health Endpoint
echo -e "\n\nTesting AI Service Health Endpoint..."
curl http://localhost:9080/api/health

# Swagger UI (if enabled)
echo -e "\n\nTesting Swagger UI Endpoint..."
curl http://localhost:9080/q/swagger-ui/

# OpenAPI Specification
echo -e "\n\nTesting OpenAPI Specification Endpoint..."
curl http://localhost:9080/q/openapi 