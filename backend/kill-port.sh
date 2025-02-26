#!/bin/bash

PORT=5000
echo "Finding processes using port $PORT..."

# Find PID of process using port
PID=$(lsof -t -i:$PORT 2>/dev/null)

if [ -z "$PID" ]; then
  echo "No process found using port $PORT"
else
  echo "Process(es) found: $PID"
  echo "Killing process(es)..."
  
  for pid in $PID; do
    kill -9 $pid
    echo "Killed process $pid"
  done
  
  echo "All processes killed."
fi

# Check if port is free now
sleep 1
STILL_USED=$(lsof -t -i:$PORT 2>/dev/null)
if [ -z "$STILL_USED" ]; then
  echo "Port $PORT is now free."
else
  echo "Warning: Port $PORT is still in use by processes: $STILL_USED"
fi

# If lsof is not available, try with fuser
if ! command -v lsof &> /dev/null && command -v fuser &> /dev/null; then
  echo "Using fuser to check port $PORT..."
  fuser -k ${PORT}/tcp
  echo "Port $PORT should be free now."
fi
