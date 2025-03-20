#!/bin/bash

# Redis Cache Monitor
# A simple script to monitor and explore Redis cache contents

# Check if a pattern is provided
if [ "$#" -lt 1 ]; then
    PATTERN="*"
else
    PATTERN="$1"
fi

echo "===== Redis Cache Monitor ====="
echo "Pattern: $PATTERN"
echo ""

# Get all keys matching pattern
KEYS=$(docker exec nandi-redis redis-cli -a nandi_redis_password --no-auth-warning KEYS "$PATTERN")

if [ -z "$KEYS" ]; then
    echo "No keys found matching pattern: $PATTERN"
    exit 0
fi

# For each key, get type and details
echo "Found $(echo "$KEYS" | wc -l | xargs) keys:"
echo "------------------------"

for KEY in $KEYS; do
    # Get the type of the key
    TYPE=$(docker exec nandi-redis redis-cli -a nandi_redis_password --no-auth-warning TYPE "$KEY")
    TTL=$(docker exec nandi-redis redis-cli -a nandi_redis_password --no-auth-warning TTL "$KEY")
    
    echo "KEY: $KEY"
    echo "TYPE: $TYPE"
    
    if [ "$TTL" -eq -1 ]; then
        echo "TTL: No expiration"
    elif [ "$TTL" -eq -2 ]; then
        echo "TTL: Key does not exist"
    else
        echo "TTL: $TTL seconds"
    fi
    
    # Get the value based on type
    if [ "$TYPE" = "string" ]; then
        VALUE=$(docker exec nandi-redis redis-cli -a nandi_redis_password --no-auth-warning GET "$KEY")
        # Check if it's likely JSON
        if [[ $VALUE == {* ]]; then
            echo "VALUE (JSON):"
            echo "$VALUE" | python3 -m json.tool || echo "$VALUE"
        else
            echo "VALUE: $VALUE"
        fi
    elif [ "$TYPE" = "list" ]; then
        LENGTH=$(docker exec nandi-redis redis-cli -a nandi_redis_password --no-auth-warning LLEN "$KEY")
        echo "LIST LENGTH: $LENGTH"
        if [ "$LENGTH" -lt 10 ]; then
            VALUES=$(docker exec nandi-redis redis-cli -a nandi_redis_password --no-auth-warning LRANGE "$KEY" 0 -1)
            echo "VALUES: $VALUES"
        else
            VALUES=$(docker exec nandi-redis redis-cli -a nandi_redis_password --no-auth-warning LRANGE "$KEY" 0 9)
            echo "VALUES (first 10): $VALUES"
        fi
    elif [ "$TYPE" = "hash" ]; then
        echo "HASH FIELDS:"
        docker exec nandi-redis redis-cli -a nandi_redis_password --no-auth-warning HGETALL "$KEY"
    fi
    
    echo "------------------------"
done 