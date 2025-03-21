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
- OpenAI API key for AI response generation

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nandi.git
cd nandi/nandi-ai-service

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration, including your OpenAI API key
```

### Configuration

Make sure to update the `.env` file with your configuration:

```
# OpenAI API key for chat completions - REQUIRED
OPENAI_API_KEY=your_openai_api_key_here

# API key for authenticating requests
API_KEY=test123

# Server port
PORT=5005

# Environment (development/production)
ENVIRONMENT=development
```

### Running the Server

**Important**: Always run server commands from the `nandi-ai-service` directory.

```bash
# Make scripts executable (only needed once)
chmod +x *.sh

# Start the server
./start_server.sh

# Check server status
./server_status.sh

# Stop the server
./stop_server.sh

# Test API endpoints
./test_api.sh
```

The server will be available at http://localhost:5005 and Swagger documentation at http://localhost:5005/docs

## API Endpoints

### Chat Generation

```bash
# Example chat request
curl -X POST -H "Content-Type: application/json" \
  -d '{"message": "How can I practice mindfulness?", "persona": "karma"}' \
  http://localhost:5005/chat
```

### Health and Monitoring

```bash
# Health check
curl http://localhost:5005/health
```

### Session Metrics and Points

```bash
# Session metrics
curl -X POST -H "Content-Type: application/json" \
  -d '{"persona": "karma", "durationSeconds": 600, "messageCount": 10}' \
  http://localhost:5005/api/session/metrics
```

## Authentication

Most endpoints require API key authentication via the `x-api-key` header. For development purposes, some endpoints don't require authentication.

For protected endpoints, add the API key header to your requests:

```bash
curl -H "x-api-key: your_api_key" http://localhost:5005/protected-endpoint
```

## Prompt Management

Prompts for AI personas are managed through a JSON configuration file: `app/config/prompts.json`.

### Prompt Structure

The JSON structure includes:
- `personas`: System prompts for each persona (karma, dharma, atma)
- `quality`: Quality evaluation prompt
- `fallbacks`: Fallback responses for error handling

### Updating Prompts

To update prompts without restarting the server:

1. Edit the JSON file at `app/config/prompts.json`
2. Call the refresh endpoint:

```bash
curl -X POST -H "x-api-key: test123" http://localhost:5005/admin/prompts/refresh
```

You can also use the Swagger UI at http://localhost:5005/docs to test this endpoint.

## Development

- Set `ENVIRONMENT=development` in your `.env` file for development mode
- The server will automatically reload when code changes are detected
- Detailed logging is available in `nandi_service.log`
- View API documentation at http://localhost:5005/docs

## Troubleshooting

- If you get "command not found" errors, make sure the scripts are executable: `chmod +x *.sh`
- If the server won't start due to port conflicts, use `./stop_server.sh` to free the port
- Check `nandi_service.log` and `server.log` for detailed error messages
- Make sure your OpenAI API key is correctly set in the `.env` file