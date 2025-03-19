package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "companion_types")
public class CompanionType extends PanacheEntity {
    
    @Column(nullable = false, unique = true)
    public String name;
    
    @Column(nullable = false, length = 1000)
    public String description;
    
    @Column(name = "image_url")
    public String imageUrl;
    
    @OneToMany(mappedBy = "type")
    public List<Companion> companions = new ArrayList<>();
    
    @OneToMany(mappedBy = "companionType")
    public List<InteractionType> interactionTypes = new ArrayList<>();
    
    // Default constructor
    public CompanionType() {}
    
    // Constructor with parameters
    public CompanionType(String name, String description, String imageUrl) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
    }
    
    // Find all available companion types
    public static List<CompanionType> findAvailableTypes() {
        return listAll();
    }
} 