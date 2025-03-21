package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

@Schema(description = "Request object for calculating session points")
public class SessionMetricsRequest {
    @Schema(description = "The persona used in the session")
    @NotNull(message = "Persona must be specified")
    private Persona persona;

    @Schema(description = "Duration of the session in seconds")
    @NotNull(message = "Duration must be specified")
    @Min(value = 0, message = "Duration cannot be negative")
    @JsonProperty("duration_seconds")
    private Integer durationSeconds;

    @Schema(description = "Number of messages in the session")
    @NotNull(message = "Message count must be specified")
    @Min(value = 0, message = "Message count cannot be negative")
    @JsonProperty("message_count")
    private Integer messageCount;

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
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
} 