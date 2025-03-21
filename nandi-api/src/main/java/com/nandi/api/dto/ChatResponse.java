package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ChatResponse {
    private String id;
    private String message;
    private String timestamp;

    @JsonProperty("quality_score")
    private Integer qualityScore;

    @JsonProperty("score_reason")
    private String scoreReason;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Integer getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(Integer qualityScore) {
        this.qualityScore = qualityScore;
    }

    public String getScoreReason() {
        return scoreReason;
    }

    public void setScoreReason(String scoreReason) {
        this.scoreReason = scoreReason;
    }
} 