package com.nandi.api.dto.ai;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ChatGenerateRequest {
    
    @NotBlank(message = "Message is required")
    private String userMessage;
    
    @NotNull(message = "Persona is required")
    private String persona;
    
    @JsonProperty("session_id")
    private String sessionId;
    
    private List<ConversationMessage> context;
    
    // Default constructor
    public ChatGenerateRequest() {}
    
    // Constructor with required fields
    public ChatGenerateRequest(String userMessage, String persona) {
        this.userMessage = userMessage;
        this.persona = persona;
    }
    
    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }
    
    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }
    
    public String getUserMessage() {
        return userMessage;
    }
    
    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }
    
    public String getPersona() {
        return persona;
    }
    
    public void setPersona(String persona) {
        this.persona = persona;
    }
    
    public List<ConversationMessage> getContext() {
        return context;
    }
    
    public void setContext(List<ConversationMessage> context) {
        this.context = context;
    }
    
    // Inner class for conversation messages
    public static class ConversationMessage {
        private String role;
        private String content;
        
        public ConversationMessage() {}
        
        public ConversationMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }
        
        public String getRole() {
            return role;
        }
        
        public void setRole(String role) {
            this.role = role;
        }
        
        public String getContent() {
            return content;
        }
        
        public void setContent(String content) {
            this.content = content;
        }
    }
} 