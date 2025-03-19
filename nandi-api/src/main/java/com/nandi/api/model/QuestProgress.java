package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quest_progress")
public class QuestProgress extends PanacheEntity {
    
    public enum Status {
        IN_PROGRESS, COMPLETED
    }
    
    @ManyToOne
    public User user;
    
    @ManyToOne
    public Quest quest;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    public Status status = Status.IN_PROGRESS;
    
    @Column(name = "current_question")
    public Long currentQuestionId;
    
    @Column(name = "started_at")
    public LocalDateTime startedAt = LocalDateTime.now();
    
    @Column(name = "completed_at")
    public LocalDateTime completedAt;
    
    @OneToMany(mappedBy = "progress")
    public List<Answer> answers = new ArrayList<>();
    
    // Default constructor
    public QuestProgress() {}
    
    // Constructor with parameters
    public QuestProgress(User user, Quest quest) {
        this.user = user;
        this.quest = quest;
        if (!quest.questions.isEmpty()) {
            this.currentQuestionId = quest.questions.get(0).id;
        }
    }
} 