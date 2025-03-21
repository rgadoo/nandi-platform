package com.nandi.api.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ChatGenerateResponse {
    
    private String content;
    
    @JsonProperty("quality_score")
    private Integer qualityScore;
    
    @JsonProperty("score_reason")
    private String scoreReason;
    
    // Default constructor
    public ChatGenerateResponse() {}
    
    // Constructor with fields
    public ChatGenerateResponse(String content, Integer qualityScore, String scoreReason) {
        this.content = content;
        this.qualityScore = qualityScore;
        this.scoreReason = scoreReason;
    }
    
    // Getters and Setters
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    @JsonProperty("quality_score")
    public Integer getQualityScore() {
        return qualityScore;
    }
    
    public void setQualityScore(Integer qualityScore) {
        this.qualityScore = qualityScore;
    }
    
    @JsonProperty("score_reason")
    public String getScoreReason() {
        return scoreReason;
    }
    
    public void setScoreReason(String scoreReason) {
        this.scoreReason = scoreReason;
    }
} 