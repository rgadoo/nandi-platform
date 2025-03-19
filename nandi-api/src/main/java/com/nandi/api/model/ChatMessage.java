package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage extends PanacheEntity {
    
    public enum MessageType {
        USER, AI
    }
    
    public enum Persona {
        KARMA, DHARMA, ATMA
    }
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public MessageType type;
    
    @Column(nullable = false, length = 2000)
    public String content;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public Persona persona;
    
    @ManyToOne
    public User user;
    
    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();
    
    // Default constructor
    public ChatMessage() {}
    
    // Constructor with parameters
    public ChatMessage(MessageType type, String content, Persona persona, User user) {
        this.type = type;
        this.content = content;
        this.persona = persona;
        this.user = user;
    }
} 