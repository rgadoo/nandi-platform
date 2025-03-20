# KarmaCafe API Integration Guide

This document outlines how to integrate the Python-based nandi-ai-service with the Java Quarkus backend API for the Nandi platform's KarmaCafe feature.

## Architecture Overview

The integration follows this flow:
1. User sends a chat message via the React frontend
2. The frontend calls the Quarkus API endpoint
3. The Quarkus API forwards the request to the nandi-ai-service
4. The nandi-ai-service processes the request and returns a response with quality scoring
5. The Quarkus API persists the chat message with its quality score
6. The response is returned to the frontend

## Integration Components

### 1. Create AI Service Client in Quarkus

Create a new class for the AI service client:

```java
package com.nandi.api.client;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.nandi.api.dto.ChatMessageRequest;
import com.nandi.api.dto.ChatMessageResponse;

@Path("/api")
@RegisterRestClient(configKey = "ai-service")
public interface AIServiceClient {

    @POST
    @Path("/chat")
    @Produces(MediaType.APPLICATION_JSON)
    ChatMessageResponse processChat(ChatMessageRequest request);
}
```

### 2. Configure AI Service Connection

In your `application.properties` file, add:

```properties
# AI Service configuration
quarkus.rest-client.ai-service.url=http://localhost:8000
quarkus.rest-client.ai-service.scope=javax.inject.Singleton
quarkus.rest-client.ai-service.connect-timeout=5000
quarkus.rest-client.ai-service.read-timeout=30000
```

For production, you'll want to externalize this configuration.

### 3. Create DTO Classes

Create the necessary Data Transfer Objects:

```java
package com.nandi.api.dto;

import java.util.List;

import com.nandi.api.model.ChatMessage.Persona;

public class ChatMessageRequest {
    private String message;
    private Persona persona;
    private List<ConversationMessage> context;
    private String sessionId;

    // Getters and setters
}

public class ConversationMessage {
    private String role; // "user" or "assistant"
    private String content;

    // Getters and setters
}

public class ChatMessageResponse {
    private String message;
    private int qualityScore;
    private String reasoning;

    // Getters and setters
}
```

### 4. Create Chat Service Layer

Implement a service to handle the communication with the AI service:

```java
package com.nandi.api.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.transaction.Transactional;

import org.eclipse.microprofile.rest.client.inject.RestClient;

import com.nandi.api.client.AIServiceClient;
import com.nandi.api.dto.ChatMessageRequest;
import com.nandi.api.dto.ChatMessageResponse;
import com.nandi.api.dto.ConversationMessage;
import com.nandi.api.model.ChatMessage;
import com.nandi.api.model.ChatMessage.MessageType;
import com.nandi.api.model.ChatMessage.Persona;
import com.nandi.api.model.User;
import com.nandi.api.repository.ChatMessageRepository;
import com.nandi.api.repository.UserRepository;

@ApplicationScoped
public class ChatService {

    @Inject
    @RestClient
    AIServiceClient aiService;

    @Inject
    ChatMessageRepository chatMessageRepository;

    @Inject
    UserRepository userRepository;

    @Transactional
    public ChatMessage processUserMessage(Long userId, String message, Persona persona) {
        // Get the user
        User user = userRepository.findById(userId);
        
        // Create and save the user message
        ChatMessage userMessage = new ChatMessage(MessageType.USER, message, persona, user);
        userMessage.setCreatedAt(LocalDateTime.now());
        chatMessageRepository.persist(userMessage);
        
        // Get the conversation context (last 10 messages for this user with this persona)
        List<ChatMessage> recentMessages = chatMessageRepository.findRecentByUserAndPersona(
                userId, persona, 10);
        
        // Convert recent messages to the format expected by the AI service
        List<ConversationMessage> context = recentMessages.stream()
                .map(msg -> {
                    ConversationMessage ctxMsg = new ConversationMessage();
                    ctxMsg.setRole(msg.getType() == MessageType.USER ? "user" : "assistant");
                    ctxMsg.setContent(msg.getContent());
                    return ctxMsg;
                })
                .collect(Collectors.toList());
        
        // Create the request
        ChatMessageRequest request = new ChatMessageRequest();
        request.setMessage(message);
        request.setPersona(persona);
        request.setContext(context);
        
        // Call the AI service
        ChatMessageResponse response = aiService.processChat(request);
        
        // Create and save the AI response message
        ChatMessage aiMessage = new ChatMessage(MessageType.AI, response.getMessage(), persona, user);
        aiMessage.setCreatedAt(LocalDateTime.now());
        aiMessage.setQualityScore(response.getQualityScore());
        aiMessage.setQualityReasoning(response.getReasoning());
        chatMessageRepository.persist(aiMessage);
        
        return aiMessage;
    }
}
```

### 5. Update the ChatMessage Entity

Add fields for the quality score and reasoning:

```java
package com.nandi.api.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "chat_messages")
public class ChatMessage extends BaseEntity {
    
    // Existing code...
    
    @Column(name = "quality_score")
    private Integer qualityScore;
    
    @Column(name = "quality_reasoning", length = 1000)
    private String qualityReasoning;
    
    // Add getters and setters
    
    public Integer getQualityScore() {
        return qualityScore;
    }
    
    public void setQualityScore(Integer qualityScore) {
        this.qualityScore = qualityScore;
    }
    
    public String getQualityReasoning() {
        return qualityReasoning;
    }
    
    public void setQualityReasoning(String qualityReasoning) {
        this.qualityReasoning = qualityReasoning;
    }
}
```

### 6. Create REST Controller Endpoint

Create a controller to expose the chat functionality:

```java
package com.nandi.api.controller;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.nandi.api.dto.UserChatRequest;
import com.nandi.api.model.ChatMessage;
import com.nandi.api.model.ChatMessage.Persona;
import com.nandi.api.service.ChatService;

@Path("/api/users/{userId}/chat")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ChatController {

    @Inject
    ChatService chatService;

    @POST
    public Response sendMessage(
            @PathParam("userId") Long userId,
            @Valid UserChatRequest request) {
        
        ChatMessage response = chatService.processUserMessage(
                userId, 
                request.getMessage(), 
                request.getPersona());
        
        return Response.ok(response).build();
    }
}

// DTO for the user chat request
class UserChatRequest {
    private String message;
    private Persona persona;
    
    // Getters and setters
}
```

### 7. Add Repository Method

Create a method in the ChatMessageRepository:

```java
package com.nandi.api.repository;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;

import com.nandi.api.model.ChatMessage;
import com.nandi.api.model.ChatMessage.Persona;

import io.quarkus.hibernate.orm.panache.PanacheRepository;

@ApplicationScoped
public class ChatMessageRepository implements PanacheRepository<ChatMessage> {

    public List<ChatMessage> findRecentByUserAndPersona(Long userId, Persona persona, int limit) {
        return find("user.id = ?1 and persona = ?2 order by createdAt desc", userId, persona)
                .page(0, limit)
                .list();
    }
}
```

### 8. Add Points System Integration

Update the ChatService to calculate and update points:

```java
@Transactional
public ChatMessage processUserMessage(Long userId, String message, Persona persona) {
    // Existing code...
    
    // Call the AI service
    ChatMessageResponse response = aiService.processChat(request);
    
    // Create and save the AI response message
    ChatMessage aiMessage = new ChatMessage(MessageType.AI, response.getMessage(), persona, user);
    aiMessage.setCreatedAt(LocalDateTime.now());
    aiMessage.setQualityScore(response.getQualityScore());
    aiMessage.setQualityReasoning(response.getReasoning());
    chatMessageRepository.persist(aiMessage);
    
    // Update user points based on the quality score
    updateUserPoints(user, response.getQualityScore());
    
    return aiMessage;
}

private void updateUserPoints(User user, int qualityScore) {
    // Implement points calculation based on quality score
    int pointsToAdd = calculatePointsFromQualityScore(qualityScore);
    
    // Update user's points
    user.setKarmaPoints(user.getKarmaPoints() + pointsToAdd);
    userRepository.persist(user);
    
    // Optionally log this points transaction
    logPointsTransaction(user, pointsToAdd, "Chat interaction quality");
}

private int calculatePointsFromQualityScore(int qualityScore) {
    // Simple formula: points = quality score * 10
    // Low quality (1-3) = 10-30 points
    // Medium quality (4-7) = 40-70 points
    // High quality (8-10) = 80-100 points
    return qualityScore * 10;
}

private void logPointsTransaction(User user, int points, String reason) {
    // Implement point history logging
    // This would use a PointsHistory entity that you would need to create
}
```

### 9. Handle User Session Management

For anonymous users:

```java
@ApplicationScoped
public class AnonymousSessionService {
    
    @Inject
    ChatService chatService;
    
    public ChatMessage processAnonymousMessage(String sessionId, String message, Persona persona) {
        // Create a temporary user for the session if it doesn't exist
        User tempUser = findOrCreateTempUser(sessionId);
        
        // Process message using the existing service
        return chatService.processUserMessage(tempUser.getId(), message, persona);
    }
    
    private User findOrCreateTempUser(String sessionId) {
        // Implementation to find or create a temporary user
        // This would typically have a flag indicating it's a temporary user
    }
}
```

## Error Handling

Implement proper error handling:

```java
@ApplicationScoped
public class ChatService {
    // Existing code...
    
    @Transactional
    public ChatMessage processUserMessage(Long userId, String message, Persona persona) {
        try {
            // Existing implementation...
        } catch (Exception e) {
            // Log the error
            LOG.error("Error processing chat message", e);
            
            // Create a fallback response
            User user = userRepository.findById(userId);
            ChatMessage fallbackMessage = new ChatMessage(
                MessageType.AI, 
                "I'm sorry, I'm having trouble connecting. Please try again in a moment.",
                persona, 
                user
            );
            fallbackMessage.setCreatedAt(LocalDateTime.now());
            chatMessageRepository.persist(fallbackMessage);
            
            return fallbackMessage;
        }
    }
}
```

## Configuration for Different Environments

Update your configuration for different environments:

```properties
# Dev environment
%dev.quarkus.rest-client.ai-service.url=http://localhost:8000

# Test environment
%test.quarkus.rest-client.ai-service.url=http://test-ai-service:8000

# Production environment
%prod.quarkus.rest-client.ai-service.url=${AI_SERVICE_URL:http://nandi-ai-service:8000}
```

## Deployment Considerations

1. **Service Discovery**: In a containerized environment like Kubernetes, consider using service discovery.

2. **Circuit Breaking**: Implement circuit breaking to handle AI service outages:

```java
@RegisterRestClient(configKey = "ai-service")
@CircuitBreaker(requestVolumeThreshold = 10, failureRatio = 0.5, delay = 10000)
@Timeout(10000)
@Retry(maxRetries = 3)
public interface AIServiceClient {
    // Methods...
}
```

3. **Monitoring**: Add metrics and health checks:

```java
@ApplicationScoped
public class AIServiceHealth implements HealthCheck {
    
    @Inject
    @RestClient
    AIServiceClient client;
    
    @Override
    public HealthCheckResponse call() {
        try {
            // Make a health check call to the AI service
            return HealthCheckResponse.up("ai-service");
        } catch (Exception e) {
            return HealthCheckResponse.down("ai-service");
        }
    }
}
```

## Testing the Integration

1. **Unit Testing**: Create unit tests for your ChatService and controller using mocks.

2. **Integration Testing**: Create an integration test that uses a test container for the AI service.

3. **Contract Testing**: Consider implementing contract tests using a tool like Pact.

## Implementation Timeline

1. **Phase 1**: Implement the basic integration without error handling or session management.
2. **Phase 2**: Add error handling, circuit breaking, and monitoring.
3. **Phase 3**: Implement the points system and session management for anonymous users.
4. **Phase 4**: Performance testing and optimization.

## Conclusion

This integration approach provides a robust connection between the Quarkus API and the Python AI service, enabling the KarmaCafe feature to function correctly while maintaining proper separation of concerns. 