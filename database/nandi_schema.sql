-- Nandi Platform Database Schema
-- PostgreSQL Script

-- Drop tables if they exist (for clean reset)
DROP TABLE IF EXISTS points_history;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_sessions;
DROP TABLE IF EXISTS anonymous_sessions;
DROP TABLE IF EXISTS users;

-- Create custom types
CREATE TYPE message_type AS ENUM ('USER', 'AI');
CREATE TYPE persona AS ENUM ('KARMA', 'DHARMA', 'ATMA');
CREATE TYPE auth_provider AS ENUM ('LOCAL', 'GOOGLE', 'FACEBOOK', 'APPLE', 'TWITTER');
CREATE TYPE points_source AS ENUM ('CHAT', 'QUEST', 'MEDITATION', 'DAILY_LOGIN', 'STREAK');

-- Create Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    auth_provider auth_provider DEFAULT 'LOCAL',
    provider_id VARCHAR(255),
    profile_image_url VARCHAR(255),
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create Anonymous Sessions Table
CREATE TABLE anonymous_sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    temporary_points INTEGER DEFAULT 0
);

-- Create Chat Sessions Table
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    anonymous_session_id VARCHAR(100) REFERENCES anonymous_sessions(session_id) ON DELETE CASCADE,
    persona persona NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration_seconds INTEGER,
    message_count INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    
    CONSTRAINT user_or_anonymous_session CHECK (
        (user_id IS NOT NULL AND anonymous_session_id IS NULL) OR
        (user_id IS NULL AND anonymous_session_id IS NOT NULL)
    )
);

-- Create Chat Messages Table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    type message_type NOT NULL,
    content TEXT NOT NULL,
    persona persona NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    anonymous_session_id VARCHAR(100) REFERENCES anonymous_sessions(session_id) ON DELETE CASCADE,
    chat_session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quality_score INTEGER CHECK (quality_score >= 1 AND quality_score <= 10),
    
    CONSTRAINT user_or_anonymous_session CHECK (
        (user_id IS NOT NULL AND anonymous_session_id IS NULL) OR
        (user_id IS NULL AND anonymous_session_id IS NOT NULL)
    )
);

-- Create Points History Table
CREATE TABLE points_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    source points_source NOT NULL,
    points INTEGER NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster chat message retrieval
CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_anonymous_session_id ON chat_messages(anonymous_session_id);
CREATE INDEX idx_chat_messages_chat_session_id ON chat_messages(chat_session_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_anonymous_session_id ON chat_sessions(anonymous_session_id);
CREATE INDEX idx_points_history_user_id ON points_history(user_id);

-- Create or replace function to update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update 'updated_at' for users
CREATE TRIGGER update_users_modified
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

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

-- Function to update total points for a user
CREATE OR REPLACE FUNCTION update_total_points() 
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET total_points = total_points + NEW.points
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update total points whenever points history is updated
CREATE TRIGGER update_user_total_points
AFTER INSERT ON points_history
FOR EACH ROW
EXECUTE FUNCTION update_total_points();

-- Sample data for testing
INSERT INTO users (username, email, password_hash, is_email_verified, total_points)
VALUES 
('testuser', 'test@example.com', '$2a$12$K3JNi5cQe.2J1UhEWAFTUO7QqAXLIZ/bAUKvFN6QhkzqNkqQQYyJq', TRUE, 0),
('demouser', 'demo@example.com', '$2a$12$K3JNi5cQe.2J1UhEWAFTUO7QqAXLIZ/bAUKvFN6QhkzqNkqQQYyJq', TRUE, 50);

INSERT INTO anonymous_sessions (session_id, temporary_points)
VALUES ('anon_123456789', 15);

-- End of schema script 