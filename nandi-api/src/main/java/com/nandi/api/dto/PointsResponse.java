package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class PointsResponse {
    private Integer pointsEarned;
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