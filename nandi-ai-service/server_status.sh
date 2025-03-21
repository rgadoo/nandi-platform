#!/bin/bash
# Nandi AI Service Status Script
# This script checks if the Nandi AI service is running

PORT=5005

echo "Nandi AI Service Status"
echo "----------------------"

# Check if port is in use
if lsof -i :$PORT > /dev/null 2>&1; then
  PID=$(lsof -t -i :$PORT)
  CMD=$(ps -p $PID | grep -v "COMMAND" | awk '{$1=""; print $0}')
  
  echo "✅ Nandi AI Service is RUNNING"
  echo "PID: $PID"
  echo "Command: $CMD"
  echo "Port: $PORT"
  
  # Check uptime on macOS
  PROC_START=$(ps -p $PID | tail -n 1 | awk '{print $4}')
  echo "Started at: $PROC_START"
  
  # Check logs
  if [ -f "server.log" ]; then
    LOG_SIZE=$(du -h server.log | cut -f1)
    LOG_UPDATED=$(stat -f "%Sm" server.log)
    echo "Log file: server.log ($LOG_SIZE, last updated: $LOG_UPDATED)"
    
    # Display recent log entries
    echo ""
    echo "Recent log entries:"
    echo "------------------"
    tail -n 5 server.log
  else
    echo "No log file found"
  fi
  
  # Check API health if curl is available
  if command -v curl > /dev/null; then
    echo ""
    echo "API Health:"
    echo "-----------"
    curl -s http://localhost:$PORT/health | python3 -m json.tool
  fi
  
else
  echo "❌ Nandi AI Service is NOT RUNNING on port $PORT"
  
  # Check if there's a Python process that might be the server
  PYTHON_PID=$(ps aux | grep "[p]ython.*server\.py" | awk '{print $2}')
  
  if [ -n "$PYTHON_PID" ]; then
    echo "However, found Python process that might be the server:"
    echo "PID: $PYTHON_PID"
    echo "Command: $(ps -p $PYTHON_PID | grep -v "COMMAND" | awk '{$1=""; print $0}')"
    echo "This process is not listening on port $PORT"
  fi
fi 