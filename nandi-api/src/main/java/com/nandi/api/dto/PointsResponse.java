package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.Map;

@Schema(description = "Response object containing points calculation results")
public class PointsResponse {
    @Schema(description = "Total points earned in the session")
    @JsonProperty("points_earned")
    private Integer pointsEarned;

    @Schema(description = "Total points across all sessions")
    @JsonProperty("total_points")
    private Integer totalPoints;

    @Schema(description = "Breakdown of points by category")
    private Map<String, Integer> breakdown;

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