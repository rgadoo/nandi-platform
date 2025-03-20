#!/bin/bash

# Simple script to run Redis commands against the Nandi Redis instance

# Check if Redis command is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <redis_command>"
    echo "Example: $0 PING"
    echo "Example: $0 SET mykey \"Hello World\""
    echo "Example: $0 GET mykey"
    exit 1
fi

# For direct command execution
if [ "$1" = "exec" ]; then
    shift
    docker exec -it nandi-redis redis-cli -a nandi_redis_password
    exit $?
fi

# Run the command
docker exec nandi-redis sh -c "redis-cli -a nandi_redis_password $*"

# Exit with the status of the last command
exit $? 