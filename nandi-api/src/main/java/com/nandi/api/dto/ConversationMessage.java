package com.nandi.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ConversationMessage {
    @NotNull(message = "Role must be specified")
    private MessageRole role;

    @NotBlank(message = "Content cannot be empty")
    private String content;

    public MessageRole getRole() {
        return role;
    }

    public void setRole(MessageRole role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
} 