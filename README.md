# Nandi Platform

A holistic personal growth and spiritual wellness application, combining ancient wisdom with modern technology.

## Project Structure

The Nandi platform is organized as a monorepo with three main components:

- **nandi-frontend**: React-based user interface with various modules:
  - KarmaCafe: AI-powered chat for spiritual guidance
  - SoulQuest: Personalized spiritual quests and challenges
  - WisdomPets: Virtual companions that grow with your spiritual progress

- **nandi-api**: Backend REST API services built with Quarkus
  - Handles user authentication, data persistence, and business logic

- **nandi-ai-service**: AI service for generating responses and personalized content
  - Powers the conversation features in KarmaCafe and other modules

## Development Setup

### Prerequisites

- Node.js (v18+)
- Java JDK 17+ (for backend)
- Maven (for backend)

### Starting the Frontend

```bash
cd nandi-frontend
npm install
npm start
```

The frontend will be available at http://localhost:3000

### Starting the Backend

```bash
cd nandi-api
./mvnw compile quarkus:dev
```

The API will be available at http://localhost:8080

### Starting the AI Service

```bash
cd nandi-ai-service
npm install
npm start
```

The AI service will be available at http://localhost:3001

## Scripts

For convenience, you can use the provided scripts:

```bash
# Start all services
./scripts/server.sh start

# Start only the backend services
./scripts/server.sh start --backend-only

# Stop all services
./scripts/server.sh stop
```

## Contributing

1. Create a feature branch from main
2. Make your changes
3. Submit a pull request

## License

Copyright © 2024 Nandi Platform 