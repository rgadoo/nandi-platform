package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Response object containing the AI service's chat response")
public class ChatResponse {
    @Schema(description = "Unique identifier for the response")
    private String id;

    @Schema(description = "The generated message content")
    private String message;

    @Schema(description = "Timestamp when the response was generated")
    private String timestamp;

    @Schema(description = "Quality score of the response (0-100)")
    @JsonProperty("quality_score")
    private Integer qualityScore;

    @Schema(description = "Reason for the quality score")
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