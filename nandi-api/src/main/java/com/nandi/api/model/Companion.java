package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "companions")
public class Companion extends PanacheEntity {
    
    @ManyToOne
    public User user;
    
    @ManyToOne
    public CompanionType type;
    
    @Column(nullable = false)
    public String name;
    
    @Column
    public int happiness = 50;
    
    @Column
    public int energy = 50;
    
    @Column
    public int wisdom = 10;
    
    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "last_interaction")
    public LocalDateTime lastInteraction = LocalDateTime.now();
    
    @OneToMany(mappedBy = "companion")
    public List<Interaction> interactions = new ArrayList<>();
    
    // Default constructor
    public Companion() {}
    
    // Constructor with parameters
    public Companion(User user, CompanionType type, String name) {
        this.user = user;
        this.type = type;
        this.name = name;
    }
} 