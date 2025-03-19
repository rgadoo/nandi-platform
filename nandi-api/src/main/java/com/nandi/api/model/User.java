package com.nandi.api.model;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {
    
    @Column(nullable = false, unique = true)
    public String username;
    
    @Column(nullable = false)
    public String password;
    
    @Column
    public String email;
    
    @Column(name = "created_at")
    public LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "last_login")
    public LocalDateTime lastLogin;
    
    @OneToMany(mappedBy = "user")
    public List<ChatMessage> chatMessages = new ArrayList<>();
    
    @OneToMany(mappedBy = "user")
    public List<QuestProgress> questProgresses = new ArrayList<>();
    
    @OneToMany(mappedBy = "user")
    public List<Companion> companions = new ArrayList<>();
    
    // Default constructor
    public User() {}
    
    // Constructor with parameters
    public User(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
    
    // Find by username
    public static User findByUsername(String username) {
        return find("username", username).firstResult();
    }
} 