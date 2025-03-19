#!/bin/bash

# Nandi Platform Service Management Script

set -e

# Default directories
FRONTEND_DIR="nandi-frontend"
API_DIR="nandi-api"
AI_SERVICE_DIR="nandi-ai-service"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print usage information
usage() {
  echo -e "${YELLOW}Nandi Platform Service Management${NC}"
  echo -e "Usage: $0 [command] [options]"
  echo ""
  echo "Commands:"
  echo "  start             Start all services"
  echo "  stop              Stop all services"
  echo "  status            Check status of all services"
  echo ""
  echo "Options:"
  echo "  --frontend-only   Only operate on frontend service"
  echo "  --backend-only    Only operate on backend services (API and AI)"
  echo "  --force           Force operation even if there are existing processes"
  echo ""
  echo "Examples:"
  echo "  $0 start                  # Start all services"
  echo "  $0 start --frontend-only  # Start only the frontend"
  echo "  $0 stop                   # Stop all services"
}

# Check if directories exist
check_directories() {
  local missing=0
  
  if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}Error: Frontend directory '$FRONTEND_DIR' not found${NC}"
    missing=1
  fi
  
  if [ ! -d "$API_DIR" ]; then
    echo -e "${RED}Error: API directory '$API_DIR' not found${NC}"
    missing=1
  fi
  
  if [ ! -d "$AI_SERVICE_DIR" ]; then
    echo -e "${RED}Error: AI Service directory '$AI_SERVICE_DIR' not found${NC}"
    missing=1
  fi
  
  if [ $missing -eq 1 ]; then
    exit 1
  fi
}

# Start services
start_services() {
  echo -e "${GREEN}Starting Nandi Platform services...${NC}"
  
  if [ "$FRONTEND_ONLY" = false ] && [ "$BACKEND_ONLY" = false ] || [ "$FRONTEND_ONLY" = true ]; then
    echo -e "${YELLOW}Starting Frontend...${NC}"
    cd "$FRONTEND_DIR"
    npm start &
    FRONTEND_PID=$!
    cd ..
    echo -e "${GREEN}Frontend started with PID: $FRONTEND_PID${NC}"
  fi
  
  if [ "$FRONTEND_ONLY" = false ] && [ "$BACKEND_ONLY" = false ] || [ "$BACKEND_ONLY" = true ]; then
    echo -e "${YELLOW}Starting API...${NC}"
    cd "$API_DIR"
    ./mvnw compile quarkus:dev &
    API_PID=$!
    cd ..
    echo -e "${GREEN}API started with PID: $API_PID${NC}"
    
    echo -e "${YELLOW}Starting AI Service...${NC}"
    cd "$AI_SERVICE_DIR"
    npm start &
    AI_SERVICE_PID=$!
    cd ..
    echo -e "${GREEN}AI Service started with PID: $AI_SERVICE_PID${NC}"
  fi
  
  echo -e "${GREEN}All services started!${NC}"
}

# Stop services
stop_services() {
  echo -e "${YELLOW}Stopping Nandi Platform services...${NC}"
  
  if [ "$FRONTEND_ONLY" = false ] && [ "$BACKEND_ONLY" = false ] || [ "$FRONTEND_ONLY" = true ]; then
    echo "Stopping Frontend..."
    pkill -f "react-scripts start" || echo "Frontend not running"
  fi
  
  if [ "$FRONTEND_ONLY" = false ] && [ "$BACKEND_ONLY" = false ] || [ "$BACKEND_ONLY" = true ]; then
    echo "Stopping API..."
    pkill -f "quarkus:dev" || echo "API not running"
    
    echo "Stopping AI Service..."
    pkill -f "node.*nandi-ai-service" || echo "AI Service not running"
  fi
  
  echo -e "${GREEN}All services stopped!${NC}"
}

# Check status of services
check_status() {
  echo -e "${YELLOW}Checking Nandi Platform services status...${NC}"
  
  # Check Frontend
  if pgrep -f "react-scripts start" > /dev/null; then
    echo -e "${GREEN}Frontend is running${NC}"
  else
    echo -e "${RED}Frontend is not running${NC}"
  fi
  
  # Check API
  if pgrep -f "quarkus:dev" > /dev/null; then
    echo -e "${GREEN}API is running${NC}"
  else
    echo -e "${RED}API is not running${NC}"
  fi
  
  # Check AI Service
  if pgrep -f "node.*nandi-ai-service" > /dev/null; then
    echo -e "${GREEN}AI Service is running${NC}"
  else
    echo -e "${RED}AI Service is not running${NC}"
  fi
}

# Main script logic

# Parse command
if [ "$#" -lt 1 ]; then
  usage
  exit 1
fi

COMMAND=$1
shift

# Parse options
FRONTEND_ONLY=false
BACKEND_ONLY=false
FORCE=false

while [ "$#" -gt 0 ]; do
  case "$1" in
    --frontend-only)
      FRONTEND_ONLY=true
      ;;
    --backend-only)
      BACKEND_ONLY=true
      ;;
    --force)
      FORCE=true
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      usage
      exit 1
      ;;
  esac
  shift
done

# Check if both frontend-only and backend-only are set
if [ "$FRONTEND_ONLY" = true ] && [ "$BACKEND_ONLY" = true ]; then
  echo -e "${RED}Error: Cannot use both --frontend-only and --backend-only at the same time${NC}"
  usage
  exit 1
fi

# Execute the appropriate command
case "$COMMAND" in
  start)
    check_directories
    start_services
    ;;
  stop)
    stop_services
    ;;
  status)
    check_status
    ;;
  *)
    echo -e "${RED}Unknown command: $COMMAND${NC}"
    usage
    exit 1
    ;;
esac

exit 0 