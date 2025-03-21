package com.nandi.api.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public class PointsResponse {
    
    @JsonProperty("points_earned")
    private Integer pointsEarned;
    
    @JsonProperty("total_points")
    private Integer totalPoints;
    
    private Map<String, Integer> breakdown;
    
    // Default constructor
    public PointsResponse() {}
    
    // Constructor with all fields
    public PointsResponse(Integer pointsEarned, Integer totalPoints, Map<String, Integer> breakdown) {
        this.pointsEarned = pointsEarned;
        this.totalPoints = totalPoints;
        this.breakdown = breakdown;
    }
    
    // Getters and Setters
    public Integer getPointsEarned() {
        return pointsEarned;
    }
    
    public void setPointsEarned(Integer pointsEarned) {
        this.pointsEarned = pointsEarned;
    }
    
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
} 