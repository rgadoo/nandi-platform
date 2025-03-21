package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SessionMetricsRequest {
    @NotNull(message = "Persona must be specified")
    private Persona persona;

    @NotNull(message = "Duration must be specified")
    @Min(value = 0, message = "Duration cannot be negative")
    private Integer durationSeconds;

    @NotNull(message = "Message count must be specified")
    @Min(value = 0, message = "Message count cannot be negative")
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