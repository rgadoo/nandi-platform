# Nandi AI Service

A spiritual guidance AI service featuring multiple personas (Karma, Dharma, and Atma) that provides mindfulness and spiritual insights through a REST API.

## Features

- 🧠 Multiple AI personas with distinct guidance styles
- ⭐ Question quality evaluation for gamification
- 🔐 API key authentication for security
- ⏱️ Rate limiting to prevent abuse
- 🚀 Response caching for improved performance
- 📊 Session metrics and points system
- 🔍 Detailed health monitoring

## Getting Started

### Prerequisites

- Python 3.9+
- Required packages: fastapi, uvicorn, openai, python-dotenv, etc.

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nandi.git
cd nandi/nandi-ai-service

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Running the Server

```bash
# Start the server
python server.py

# Or with custom port
PORT=5005 python server.py
```

### Server Management Scripts

Several scripts are provided to help manage the server:

```bash
# Start the server on port 5005 (kills any process already using the port)
./start_server.sh

# Check server status
./server_status.sh

# Stop the server
./stop_server.sh
```

## API Testing

You can test the API endpoints using the included test script:

```bash
# Make the script executable
chmod +x test_api.sh

# Run the tests
./test_api.sh
```

Or test individual endpoints with curl:

```bash
# Root endpoint
curl -s http://localhost:5005/ | python3 -m json.tool

# Health endpoint
curl -s http://localhost:5005/health | python3 -m json.tool

# Document upload
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"text": "Sample text", "metadata": {"title": "Test"}}' \
  http://localhost:5005/documents | python3 -m json.tool

# Session metrics
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"persona": "karma", "durationSeconds": 600, "messageCount": 10}' \
  http://localhost:5005/api/session/metrics | python3 -m json.tool

# Points calculations
curl -s http://localhost:5005/api/points/calculations | python3 -m json.tool

# API test endpoint
curl -s http://localhost:5005/api/test | python3 -m json.tool
```

## API Endpoints

### Chat Generation

```

## Authentication

Most endpoints require API key authentication via the `x-api-key` header. For development purposes, testing endpoints don't require authentication.

For protected endpoints, add the API key header to your requests:

```bash
curl -H "x-api-key: your_api_key" http://localhost:5005/protected-endpoint
```

## Prompt Management

Prompts for AI personas are managed through a JSON configuration file: `app/config/prompts.json`.

The JSON structure includes:
- `personas`: System prompts for each persona (karma, dharma, atma)
- `quality`: Quality evaluation prompt
- `fallbacks`: Fallback responses for error handling

To update prompts without restarting the server, edit the JSON file and then call the refresh endpoint:

```bash
curl -X POST -H "x-api-key: your_api_key" http://localhost:5005/admin/prompts/refresh
```

## Development

- Set `ENVIRONMENT=development` in your `.env` file for development mode
- The server will automatically reload when code changes are detected
- Detailed logging is available in `nandi_service.log`