package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ChatRequest {
    @NotBlank(message = "Message cannot be empty")
    private String message;

    @NotNull(message = "Persona must be specified")
    private Persona persona;

    @NotBlank(message = "Session ID cannot be empty")
    @JsonProperty("session_id")
    private String sessionId;

    private List<ConversationMessage> context;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public List<ConversationMessage> getContext() {
        return context;
    }

    public void setContext(List<ConversationMessage> context) {
        this.context = context;
    }
} 