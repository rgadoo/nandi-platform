package com.nandi.api.dto;

public class PointsCalculations {
    private int baseQualityPoints;
    private int baseEngagementPoints;
    private int baseDurationPoints;
    private int maxQualityScore;
    private int maxMessageCount;
    private int maxDurationSeconds;

    public int getBaseQualityPoints() {
        return baseQualityPoints;
    }

    public void setBaseQualityPoints(int baseQualityPoints) {
        this.baseQualityPoints = baseQualityPoints;
    }

    public int getBaseEngagementPoints() {
        return baseEngagementPoints;
    }

    public void setBaseEngagementPoints(int baseEngagementPoints) {
        this.baseEngagementPoints = baseEngagementPoints;
    }

    public int getBaseDurationPoints() {
        return baseDurationPoints;
    }

    public void setBaseDurationPoints(int baseDurationPoints) {
        this.baseDurationPoints = baseDurationPoints;
    }

    public int getMaxQualityScore() {
        return maxQualityScore;
    }

    public void setMaxQualityScore(int maxQualityScore) {
        this.maxQualityScore = maxQualityScore;
    }

    public int getMaxMessageCount() {
        return maxMessageCount;
    }

    public void setMaxMessageCount(int maxMessageCount) {
        this.maxMessageCount = maxMessageCount;
    }

    public int getMaxDurationSeconds() {
        return maxDurationSeconds;
    }

    public void setMaxDurationSeconds(int maxDurationSeconds) {
        this.maxDurationSeconds = maxDurationSeconds;
    }
} 