package com.nandi.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.List;

@Schema(description = "Request object for generating chat responses")
public class ChatRequest {
    @Schema(description = "The message to generate a response for")
    @NotBlank(message = "Message cannot be empty")
    private String message;

    @Schema(description = "The persona to use for generating the response")
    @NotNull(message = "Persona must be specified")
    private Persona persona;

    @Schema(description = "The ID of the chat session")
    @NotBlank(message = "Session ID cannot be empty")
    @JsonProperty("session_id")
    private String sessionId;

    @Schema(description = "The conversation context")
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