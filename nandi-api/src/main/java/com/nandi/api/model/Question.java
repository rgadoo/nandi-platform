package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "questions")
public class Question extends PanacheEntity {
    
    @ManyToOne
    public Quest quest;
    
    @Column(nullable = false)
    public int sequence;
    
    @Column(nullable = false, length = 1000)
    public String text;
    
    @Column(length = 2000)
    public String guidance;
    
    // Default constructor
    public Question() {}
    
    // Constructor with parameters
    public Question(Quest quest, int sequence, String text, String guidance) {
        this.quest = quest;
        this.sequence = sequence;
        this.text = text;
        this.guidance = guidance;
    }
} 