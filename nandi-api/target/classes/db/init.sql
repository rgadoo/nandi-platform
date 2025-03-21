-- Create custom types
CREATE TYPE message_type AS ENUM ('USER', 'AI');
CREATE TYPE persona AS ENUM ('KARMA', 'DHARMA', 'ATMA');
CREATE TYPE auth_provider AS ENUM ('LOCAL', 'GOOGLE', 'FACEBOOK', 'APPLE', 'TWITTER');
CREATE TYPE points_source AS ENUM ('CHAT', 'QUEST', 'MEDITATION', 'DAILY_LOGIN', 'STREAK');

-- Create Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    auth_provider auth_provider DEFAULT 'LOCAL',
    provider_id VARCHAR(255),
    profile_image_url VARCHAR(255),
    total_points INTEGER DEFAULT 0,
    last_login_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create Anonymous Sessions Table
CREATE TABLE anonymous_sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temporary_points INTEGER DEFAULT 0
);

-- Create Chat Sessions Table
CREATE TABLE chat_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    anonymous_session_id VARCHAR(100) REFERENCES anonymous_sessions(session_id) ON DELETE CASCADE,
    persona persona NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    active BOOLEAN DEFAULT true,
    duration_seconds INTEGER,
    message_count INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    average_quality_score DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT user_or_anonymous_session CHECK (
        (user_id IS NOT NULL AND anonymous_session_id IS NULL) OR
        (user_id IS NULL AND anonymous_session_id IS NOT NULL)
    )
);

-- Create Chat Messages Table
CREATE TABLE chat_messages (
    id BIGSERIAL PRIMARY KEY,
    type message_type NOT NULL,
    content TEXT NOT NULL,
    persona persona NOT NULL,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    anonymous_session_id VARCHAR(100) REFERENCES anonymous_sessions(session_id) ON DELETE CASCADE,
    chat_session_id BIGINT REFERENCES chat_sessions(id) ON DELETE CASCADE,
    quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT user_or_anonymous_session CHECK (
        (user_id IS NOT NULL AND anonymous_session_id IS NULL) OR
        (user_id IS NULL AND anonymous_session_id IS NOT NULL)
    )
);

-- Create Points History Table
CREATE TABLE points_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    source points_source NOT NULL,
    points INTEGER NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_modtime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_chat_sessions_modtime
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_chat_messages_modtime
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_points_history_modtime
    BEFORE UPDATE ON points_history
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column(); 