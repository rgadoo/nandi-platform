package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.PrePersist;
import jakarta.persistence.JoinColumn;

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
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public MessageType type;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    public String content;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Persona persona;
    
    @Column(name = "quality_score")
    private Integer qualityScore;
    
    @Column(name = "quality_reason")
    private String qualityReason;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    public User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private ChatSession session;
    
    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
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