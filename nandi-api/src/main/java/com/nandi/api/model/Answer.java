package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "answers")
public class Answer extends PanacheEntity {
    
    @ManyToOne
    public QuestProgress progress;
    
    @ManyToOne
    public Question question;
    
    @Column(nullable = false, length = 2000)
    public String content;
    
    @Column(name = "submitted_at")
    public LocalDateTime submittedAt = LocalDateTime.now();
    
    // Default constructor
    public Answer() {}
    
    // Constructor with parameters
    public Answer(QuestProgress progress, Question question, String content) {
        this.progress = progress;
        this.question = question;
        this.content = content;
    }
} 