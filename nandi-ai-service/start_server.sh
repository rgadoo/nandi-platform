#!/bin/bash
# Nandi AI Service Startup Script
# This script checks if port 5005 is in use and starts the server

PORT=5005
LOG_FILE="server.log"

echo "Nandi AI Service Startup"
echo "------------------------"

# Check if port is in use
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "Port $PORT is already in use"
    
    # Find processes using the port
    PIDS=$(lsof -t -i :$PORT 2>/dev/null)
    echo "Found process $PIDS using port $PORT"
    
    # Check if any of these are Python processes
    IS_PYTHON_PROCESS=false
    for PID in $PIDS; do
        if ps -p $PID -o command= | grep -q "python"; then
            IS_PYTHON_PROCESS=true
            COMMAND=$(ps -p $PID -o command=)
            echo "Process $PID is a Python process: $COMMAND"
            break
        fi
    done
    
    if [ "$IS_PYTHON_PROCESS" = false ]; then
        echo "WARNING: Process using port $PORT is not a Python process"
        COMMAND=$(ps -p $PID -o command=)
        echo "Process command: $COMMAND"
        echo "You may need to stop this process manually"
        exit 1
    fi
    
    # Ask if user wants to stop these processes
    read -p "Do you want to stop these processes and start a new server? (y/n): " RESPONSE
    if [[ "$RESPONSE" =~ ^[Yy]$ ]]; then
        # Stop the processes
        for PID in $PIDS; do
            echo "Stopping process $PID..."
            kill -9 $PID 2>/dev/null
        done
        
        # Wait a moment for the port to be released
        sleep 1
        
        # Verify port is free
        if lsof -i :$PORT > /dev/null 2>&1; then
            echo "Failed to free port $PORT. Please stop the processes manually."
            exit 1
        else
            echo "Port $PORT is now free"
        fi
    else
        echo "Exiting without starting server"
        exit 0
    fi
fi

# Start the server
echo "Starting Nandi AI Service on port $PORT..."
nohup python3 server.py > $LOG_FILE 2>&1 &

PID=$!
sleep 1

# Check if process is running
if ps -p $PID > /dev/null; then
    echo "Server started successfully with PID $PID"
    echo "Log file: $LOG_FILE"
    echo "To stop the server, run: kill -9 $PID"
    echo ""
    echo "Server log output:"
    echo "----------------"
    tail -10 $LOG_FILE
else
    echo "Failed to start the server. Check the log file for details: $LOG_FILE"
    exit 1
fi 