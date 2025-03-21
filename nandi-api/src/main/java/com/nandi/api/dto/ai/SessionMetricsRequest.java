package com.nandi.api.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SessionMetricsRequest {
    
    @JsonProperty("session_id")
    private String sessionId;
    
    @NotNull(message = "Duration is required")
    @Min(value = 0, message = "Duration must be non-negative")
    private Integer durationSeconds;
    
    @NotNull(message = "Message count is required")
    @Min(value = 0, message = "Message count must be non-negative")
    @JsonProperty("message_count")
    private Integer messageCount;
    
    @NotNull(message = "Persona is required")
    private String persona;
    
    @JsonProperty("average_quality")
    private Double averageQuality;
    
    // Default constructor
    public SessionMetricsRequest() {}
    
    // Constructor with required fields
    public SessionMetricsRequest(String sessionId, Integer durationSeconds, Integer messageCount, String persona) {
        this.sessionId = sessionId;
        this.durationSeconds = durationSeconds;
        this.messageCount = messageCount;
        this.persona = persona;
    }
    
    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public Integer getDurationSeconds() {
        return durationSeconds;
    }
    
    public void setDurationSeconds(Integer durationSeconds) {
        this.durationSeconds = durationSeconds;
    }
    
    public Integer getMessageCount() {
        return messageCount;
    }
    
    public void setMessageCount(Integer messageCount) {
        this.messageCount = messageCount;
    }
    
    public String getPersona() {
        return persona;
    }
    
    public void setPersona(String persona) {
        this.persona = persona;
    }
    
    public Double getAverageQuality() {
        return averageQuality;
    }
    
    public void setAverageQuality(Double averageQuality) {
        this.averageQuality = averageQuality;
    }
} 