# Nandi Database Setup

This directory contains the database setup for the Nandi platform, including schema definitions and scripts.

## Schema Overview

The Nandi platform uses PostgreSQL for persistent storage and Redis for caching. The database schema includes:

- **Users**: Stores user account information
- **Anonymous Sessions**: Tracks non-authenticated user sessions
- **Chat Messages**: Stores all chat interactions between users and AI personas
- **Chat Sessions**: Groups related messages into sessions for analytics
- **Points History**: Records points earned by users through various activities

## Quick Start

### Running with Docker

1. Make sure you have Docker and Docker Compose installed
2. From the project root, run:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379
- PGAdmin (PostgreSQL web interface) on port 5050

### Accessing PGAdmin

1. Open [http://localhost:5050](http://localhost:5050) in your browser
2. Login with:
   - Email: admin@nandi.com
   - Password: admin
3. Add a new server connection:
   - Name: Nandi DB
   - Host: postgres (use the Docker service name, not localhost)
   - Port: 5432
   - Database: nandi_db
   - Username: nandi
   - Password: nandi_password

## Manual Database Setup

If you prefer not to use Docker or need to set up the database manually:

1. Install PostgreSQL 14+ and Redis 7+
2. Create a database named `nandi_db`
3. Run the `nandi_schema.sql` script to set up tables

```bash
psql -U your_user -d nandi_db -f nandi_schema.sql
```

## Schema Migration

For future schema migrations, we'll use:
1. Numbered SQL scripts in the `/migrations` folder
2. Liquibase or Flyway for automated migrations (coming soon)

## Database Diagrams

### Entity Relationship Diagram

```
Users ----< Chat Messages
   ^          ^
   |          |
   |          |
Chat Sessions |
   ^          |
   |          |
   |          |
Anonymous Sessions
        ^
        |
        |
Points History
```

### Key Relationships

- A user can have many chat messages and chat sessions
- An anonymous session can have many chat messages and chat sessions
- Each chat message belongs to either a user or an anonymous session
- Each chat session belongs to either a user or an anonymous session
- Points history records are linked to users

## Connection Parameters

- **PostgreSQL**:
  - Host: localhost (or postgres in Docker)
  - Port: 5432
  - Database: nandi_db
  - Username: nandi
  - Password: nandi_password

- **Redis**:
  - Host: localhost (or redis in Docker)
  - Port: 6379
  - Password: nandi_redis_password

## Testing Your Connection

Test PostgreSQL connection:

```bash
psql -h localhost -p 5432 -U nandi -d nandi_db
```

Test Redis connection:

```bash
redis-cli -h localhost -p 6379
AUTH nandi_redis_password
PING
```

## Convenience Scripts

This directory includes helper scripts to make it easier to interact with the databases.

### PostgreSQL Query Script

The `query.sh` script allows you to run SQL queries against the PostgreSQL database without having to manually connect:

```bash
# Usage
./query.sh "YOUR SQL QUERY HERE"

# Examples
./query.sh "SELECT * FROM users;"
./query.sh "INSERT INTO anonymous_sessions (session_id, temporary_points) VALUES ('anon_test', 10);"
./query.sh "SELECT calculate_points(8, 600, 1) AS total_points;"
```

Script contents:
```bash
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
```

### Redis CLI Script

The `redis-cli.sh` script simplifies interacting with the Redis cache:

```bash
# Usage for commands
./redis-cli.sh COMMAND [ARGUMENTS]

# Direct CLI access
./redis-cli.sh exec

# Examples
./redis-cli.sh PING
./redis-cli.sh SET mykey "Hello World"
./redis-cli.sh GET mykey
./redis-cli.sh TTL mykey
```

Script contents:
```bash
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
```

## Points Calculation

The schema includes a PostgreSQL function to calculate points based on the implementation plan:

```sql
-- Function to calculate points based on user inputs
CREATE OR REPLACE FUNCTION calculate_points(
    quality_score INTEGER,
    session_duration INTEGER,
    consecutive_days INTEGER
) 
RETURNS INTEGER AS $$
DECLARE
    base_points INTEGER;
    time_points INTEGER;
    consistency_bonus INTEGER;
    total_points INTEGER;
BEGIN
    -- Base points from quality score
    base_points := quality_score * 3;
    
    -- Time-based points (1 point per minute up to 30)
    time_points := LEAST(session_duration / 60, 30);
    
    -- Consistency bonus
    consistency_bonus := consecutive_days * 5;
    
    -- Combine all point sources
    total_points := base_points + time_points + consistency_bonus;
    
    -- Cap at reasonable maximum
    RETURN LEAST(total_points, 100);
END;
$$ LANGUAGE plpgsql;
```

This function is used in the points calculation system to award points based on:
- Question quality (1-10 scale)
- Session duration (in seconds)
- User consistency (consecutive days of activity)

## Next Steps

After setting up the database, you can:

1. Seed it with test data (see `seed_data.sql` - coming soon)
2. Connect your Quarkus API to the database
3. Establish Redis cache connections from your application 