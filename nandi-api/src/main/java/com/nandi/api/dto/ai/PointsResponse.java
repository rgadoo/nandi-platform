package com.nandi.api.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class PointsResponse {
    
    @JsonProperty("total_points")
    private Integer totalPoints;
    
    private Map<String, Integer> breakdown;
    
    @JsonProperty("session_id")
    private String sessionId;
    
    // Default constructor
    public PointsResponse() {}
    
    // Constructor with all fields
    public PointsResponse(Integer totalPoints, Map<String, Integer> breakdown, String sessionId) {
        this.totalPoints = totalPoints;
        this.breakdown = breakdown;
        this.sessionId = sessionId;
    }
    
    // Getters and Setters
    public Integer getTotalPoints() {
        return totalPoints;
    }
    
    public void setTotalPoints(Integer totalPoints) {
        this.totalPoints = totalPoints;
    }
    
    public Map<String, Integer> getBreakdown() {
        return breakdown;
    }
    
    public void setBreakdown(Map<String, Integer> breakdown) {
        this.breakdown = breakdown;
    }
    
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
} 