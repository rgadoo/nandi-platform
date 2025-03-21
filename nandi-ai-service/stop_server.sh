#!/bin/bash
# Nandi AI Service Stop Script
# This script finds and stops the Nandi AI server running on port 5005

PORT=5005

echo "Stopping Nandi AI Service"
echo "------------------------"

# Find any process using port 5005
PIDS=$(lsof -t -i :$PORT 2>/dev/null)

if [ -z "$PIDS" ]; then
  echo "No process found running on port $PORT"
  
  # Try finding by Python server.py pattern as a fallback
  PIDS=$(ps aux | grep "[p]ython.*server\.py" | awk '{print $2}')
  
  if [ -z "$PIDS" ]; then
    echo "No Nandi AI Service process found"
    exit 0
  fi
fi

# Kill each process
for PID in $PIDS; do
  echo "Found process $PID using port $PORT"
  
  # Kill the process
  echo "Stopping process $PID..."
  kill -9 $PID 2>/dev/null
  
  # Verify process was stopped
  sleep 0.2
  if ps -p $PID > /dev/null 2>&1; then
    echo "WARNING: Process $PID could not be stopped"
  else
    echo "Process $PID successfully stopped"
  fi
done

# Find any remaining Python processes that might be related
PYTHON_PIDS=$(ps aux | grep "[p]ython.*server\.py" | awk '{print $2}')
if [ -n "$PYTHON_PIDS" ]; then
  echo "Found additional Python processes that might be related"
  for PID in $PYTHON_PIDS; do
    echo "Stopping additional process $PID..."
    kill -9 $PID 2>/dev/null
  done
fi

# Check if port is now free
if lsof -i :$PORT > /dev/null 2>&1; then
  echo "WARNING: Port $PORT is still in use. Some processes may not have been stopped."
  exit 1
else
  echo "Port $PORT is now free."
  echo "Nandi AI Service has been stopped"
fi 