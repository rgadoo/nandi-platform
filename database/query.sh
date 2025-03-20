#!/bin/bash

# Simple script to run SQL queries against the Nandi database

# Check if SQL query is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <sql_query>"
    echo "Example: $0 'SELECT * FROM users;'"
    exit 1
fi

# Compose the SQL query from all arguments
SQL_QUERY="$*"

# Run the query
docker exec nandi-postgres psql -U nandi -d nandi_db -c "${SQL_QUERY}" | cat

# Exit with the status of the last command
exit $? 