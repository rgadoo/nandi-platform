package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quests")
public class Quest extends PanacheEntity {
    
    @Column(nullable = false)
    public String title;
    
    @Column(nullable = false, length = 1000)
    public String description;
    
    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "quest", cascade = CascadeType.ALL)
    public List<Question> questions = new ArrayList<>();
    
    @OneToMany(mappedBy = "quest")
    public List<QuestProgress> progresses = new ArrayList<>();
    
    // Default constructor
    public Quest() {}
    
    // Constructor with parameters
    public Quest(String title, String description) {
        this.title = title;
        this.description = description;
    }
    
    // Find active quests
    public static List<Quest> findActiveQuests() {
        return listAll();
    }
} 