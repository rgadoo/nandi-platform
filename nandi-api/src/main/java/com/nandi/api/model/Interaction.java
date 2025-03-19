package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "interactions")
public class Interaction extends PanacheEntity {
    
    @ManyToOne
    public Companion companion;
    
    @ManyToOne
    public InteractionType interactionType;
    
    @Column(length = 2000)
    public String wisdom;
    
    @Column(name = "interaction_time")
    public LocalDateTime interactionTime = LocalDateTime.now();
    
    // Default constructor
    public Interaction() {}
    
    // Constructor with parameters
    public Interaction(Companion companion, InteractionType interactionType, String wisdom) {
        this.companion = companion;
        this.interactionType = interactionType;
        this.wisdom = wisdom;
    }
} 