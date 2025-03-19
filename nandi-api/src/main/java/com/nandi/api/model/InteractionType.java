package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "interaction_types")
public class InteractionType extends PanacheEntity {
    
    @Column(nullable = false)
    public String name;
    
    @Column(nullable = false, length = 1000)
    public String description;
    
    @ManyToOne
    public CompanionType companionType;
    
    @Column(name = "happiness_effect")
    public int happinessEffect;
    
    @Column(name = "energy_effect")
    public int energyEffect;
    
    @Column(name = "wisdom_effect")
    public int wisdomEffect;
    
    @OneToMany(mappedBy = "interactionType")
    public List<Interaction> interactions = new ArrayList<>();
    
    // Default constructor
    public InteractionType() {}
    
    // Constructor with parameters
    public InteractionType(String name, String description, CompanionType companionType,
                          int happinessEffect, int energyEffect, int wisdomEffect) {
        this.name = name;
        this.description = description;
        this.companionType = companionType;
        this.happinessEffect = happinessEffect;
        this.energyEffect = energyEffect;
        this.wisdomEffect = wisdomEffect;
    }
    
    // Find interaction types by companion type
    public static List<InteractionType> findByCompanionType(Long companionTypeId) {
        return list("companionType.id", companionTypeId);
    }
} 