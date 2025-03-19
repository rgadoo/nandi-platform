#!/bin/bash

# Find processes running on port 3000
echo "Finding processes on port 3000..."
PORT_PROCESSES=$(lsof -i :3000 -t)

if [ -z "$PORT_PROCESSES" ]; then
  echo "No processes found running on port 3000."
  exit 0
fi

# Display the processes before terminating
echo "Found the following processes running on port 3000:"
ps -p $PORT_PROCESSES -o pid,user,command

# Kill the processes
echo "Terminating processes..."
for PID in $PORT_PROCESSES; do
  echo "Stopping process $PID"
  kill -15 $PID
  
  # Wait a moment to see if it stopped gracefully
  sleep 1
  
  # Check if it's still running and force kill if needed
  if ps -p $PID > /dev/null; then
    echo "Process $PID still running, force killing..."
    kill -9 $PID
  fi
done

# Verify port is now free
sleep 2
REMAINING=$(lsof -i :3000 -t)
if [ -z "$REMAINING" ]; then
  echo "Port 3000 is now free."
else
  echo "Warning: Some processes are still running on port 3000:"
  ps -p $REMAINING -o pid,user,command
fi 