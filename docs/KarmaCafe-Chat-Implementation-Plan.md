# KarmaCafe Chat Implementation Plan

## Overview

The KarmaCafe chat feature enables users to interact with AI personas (Karma/Lumina, Dharma/Nova, Atma/Solis) for spiritual guidance and mindfulness coaching. This document outlines the technical implementation plan from frontend to backend, detailing the data flow, API contracts, and system interactions.

## Architecture Components

```mermaid
graph TD
    A[React Frontend] -->|HTTP/REST| B(Quarkus API)
    B -->|PostgreSQL| C[Database]
    B -->|REST| D(Python AI Service)
    D -->|API Call| E[OpenAI GPT]
    B -->|Redis| F[Cache]
```

### Component Responsibilities

1. **React Frontend**
   - Renders chat bubbles (ChatBubbles.js)
   - Manages chat window UI (NandiChatWindow.js)
   - Handles message state and UI interactions (Chat.js)

2. **Quarkus API**
   - Manages chat sessions
   - Routes messages to AI service
   - Persists chat history
   - Handles user authentication
   - **Calculates and manages user points**

3. **Python AI Service** 
   - Processes chat messages
   - Formats prompts based on selected persona
   - Calls OpenAI GPT API
   - Returns responses to API layer
   - **Evaluates question quality for points calculation**

4. **Database (PostgreSQL)**
   - Stores chat history
   - Persists user preferences
   - Tracks interaction metrics
   - **Stores points and engagement metrics**

5. **Cache (Redis)**
   - Caches recent chat history
   - Stores session data
   - Improves response time

## Points System

### Overview

The Nandi platform includes a gamified points system to encourage quality interactions and engagement. Points are awarded for:

1. **Quality of Questions**: Assessed by the AI based on depth, relevance, and thoughtfulness
2. **Engagement Time**: Calculated based on time spent in chat sessions
3. **Consistency**: Rewards for regular usage and interaction
4. **Milestone Achievements**: Points for completing specific conversation goals

### Points Calculation Algorithm

```java
// Example points calculation in ChatService.java

public int calculateSessionPoints(ChatSession session, List<ChatMessage> messages, User user) {
    int totalPoints = 0;
    
    // 1. Base points for session creation
    totalPoints += 5;
    
    // 2. Points based on session duration (1 point per minute, max 30)
    long durationMinutes = ChronoUnit.MINUTES.between(session.getStartTime(), session.getEndTime());
    totalPoints += Math.min(30, durationMinutes);
    
    // 3. Points from AI quality evaluation
    for (ChatMessage message : messages) {
        if (message.getQualityScore() > 0) {
            totalPoints += message.getQualityScore();
        }
    }
    
    // 4. Consistency bonus (daily login streak)
    int streak = userService.getCurrentStreak(user);
    if (streak > 0) {
        totalPoints += Math.min(20, streak); // Max 20 points for streak
    }
    
    return totalPoints;
}
```

### Quality Score Evaluation

The AI service will be enhanced to evaluate the quality of user questions:

```python
# nandi-ai-service/app/services/openai_service.py - Enhanced version

async def generate_response_with_quality_score(self, message: str, persona: str, context: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
    """Generate a chat response with quality score using OpenAI API."""
    
    # Create system message with quality evaluation instruction
    system_message = f"""
    {self._get_persona_prompt(persona)}
    
    Additionally, evaluate the quality of the user's question on a scale of 1-10 based on:
    - Depth of reflection (1-3 points)
    - Relevance to spiritual growth (1-3 points)
    - Clarity of expression (1-2 points)
    - Personal investment/vulnerability (1-2 points)
    
    Return your response in JSON format:
    {{
        "message": "Your regular response to the user",
        "quality_score": <score between 1-10>,
        "score_reason": "Brief explanation of the score"
    }}
    """
    
    # Create messages array
    messages = [{"role": "system", "content": system_message}]
    
    # Add context and user message
    if context:
        messages.extend(context)
    messages.append({"role": "user", "content": message})
    
    # Call OpenAI API
    response = await openai.ChatCompletion.acreate(
        model=self.model,
        messages=messages,
        max_tokens=600,
        temperature=0.7,
        response_format={"type": "json_object"}
    )
    
    # Parse the JSON response
    try:
        response_content = response.choices[0].message.content
        parsed_response = json.loads(response_content)
        
        # Ensure we have all required fields
        if "message" not in parsed_response or "quality_score" not in parsed_response:
            raise ValueError("Incomplete response format")
            
        return parsed_response
    except Exception as e:
        logger.error(f"Error parsing AI response: {e}")
        # Fallback to a simple response with a default score
        return {
            "message": response.choices[0].message.content,
            "quality_score": 5,
            "score_reason": "Default score due to parsing error"
        }
```

### Frontend Points Display

The frontend will be enhanced to display points earned:

```javascript
// nandi-frontend/src/components/Chat/PointsDisplay.js
const PointsDisplay = ({ sessionPoints, totalPoints, qualityScore }) => {
  return (
    <div className="points-container">
      <div className="total-points">
        <span className="points-value">{totalPoints}</span>
        <span className="points-label">Total Points</span>
      </div>
      
      {sessionPoints > 0 && (
        <div className="session-points">
          <span className="points-value">+{sessionPoints}</span>
          <span className="points-label">This Session</span>
        </div>
      )}
      
      {qualityScore > 0 && (
        <div className="quality-indicator" title={`Quality score: ${qualityScore}/10`}>
          <div className="quality-bar" style={{ width: `${qualityScore * 10}%` }}></div>
        </div>
      )}
    </div>
  );
};
```

## Detailed Implementation Flow

### 1. User Initiates Chat

#### Frontend Implementation (React)

##### Chat Bubbles Component
```javascript
// nandi-frontend/src/components/Chat/ChatBubbles.js
// Displays the floating chat bubbles for different personas
const ChatBubbles = ({ activeChat, onChatToggle }) => {
  // Chat themes with icons and visual styling
  const chatThemes = [
    {
      id: 'karma',
      name: 'Lumina ⚡',
      color: '#FF9800',
      position: 'bottom',
      icon: FaBalanceScale
    },
    // Other personas...
  ];
  
  return (
    <div className="side-chat-icons">
      {chatThemes.map((theme) => (
        <button
          key={theme.id}
          className={`chat-icon-button ${theme.id} ${activeChat === theme.id ? 'active' : ''}`}
          onClick={() => onChatToggle(theme.id)}
          aria-label={`${activeChat === theme.id ? 'Close' : 'Open'} ${theme.name}`}
          title={theme.name}
        >
          <div className="chat-icon">
            <IconComponent />
          </div>
        </button>
      ))}
    </div>
  );
};
```

##### Main Chat Component
```javascript
// nandi-frontend/src/components/Chat/Chat.js
// Controls chat state and orchestrates the chat feature
const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messageHistories, setMessageHistories] = useState({});
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionPoints, setSessionPoints] = useState(0);
  
  // Handle chat toggle
  const handleChatToggle = (chatId) => {
    // If opening a new chat, record the start time
    if (chatId && chatId !== activeChat) {
      setSessionStartTime(new Date());
    }
    
    // If closing a chat, calculate session duration and send to backend
    if (chatId === null && activeChat && sessionStartTime) {
      const sessionDuration = (new Date() - sessionStartTime) / 1000; // in seconds
      sendSessionMetrics(activeChat, sessionDuration);
    }
    
    setActiveChat(chatId === activeChat ? null : chatId);
    // Additional UI adjustments...
  };
  
  // Send session metrics to backend for points calculation
  const sendSessionMetrics = async (chatId, durationSeconds) => {
    try {
      const response = await fetch('/api/karma_cafe/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          persona: chatId,
          durationSeconds,
          messageCount: messageHistories[chatId]?.length || 0
        }),
      });
      
      const data = await response.json();
      setSessionPoints(data.pointsEarned);
      
      // Show points earned notification
      showPointsNotification(data.pointsEarned, data.totalPoints);
    } catch (error) {
      console.error('Error sending session metrics:', error);
    }
  };
  
  // Handle messages update
  const handleMessagesUpdate = (messages) => {
    setMessageHistories(prev => ({
      ...prev,
      [activeChat]: messages
    }));
  };
  
  return (
    <div className="chat-demo">
      <ChatBubbles 
        activeChat={activeChat}
        onChatToggle={handleChatToggle}
      />
      
      {activeChat && (
        <NandiChatWindow
          theme={getActiveChatTheme()}
          onClose={handleCloseChat}
          messages={messageHistories[activeChat] || []}
          onMessagesUpdate={handleMessagesUpdate}
          sessionPoints={sessionPoints}
        />
      )}
    </div>
  );
};
```

##### Chat Window Component
```javascript
// nandi-frontend/src/components/Chat/NandiChatWindow.js
// Renders the chat window with messages and input
const NandiChatWindow = ({ theme, onClose, messages, onMessagesUpdate, sessionPoints }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [lastQualityScore, setLastQualityScore] = useState(0);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message to UI immediately
    const newUserMessage = {
      id: Date.now(),
      message: inputMessage,
      sentTime: new Date().toISOString(),
      sender: 'user',
      direction: 'outgoing'
    };
    
    const updatedMessages = [...messages, newUserMessage];
    onMessagesUpdate(updatedMessages);
    
    // Clear input
    setInputMessage('');
    
    // Call API to get AI response
    fetchAIResponse(inputMessage, theme.id, updatedMessages);
  };
  
  const fetchAIResponse = async (message, persona, messageHistory) => {
    // Display typing indicator
    setIsTyping(true);
    
    try {
      // Call backend API
      const response = await fetch('/api/karma_cafe/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          persona,
          context: messageHistory.map(msg => ({
            content: msg.message,
            role: msg.sender === 'user' ? 'user' : 'assistant'
          }))
        }),
      });
      
      const data = await response.json();
      
      // Update quality score if available
      if (data.qualityScore) {
        setLastQualityScore(data.qualityScore);
      }
      
      // Add AI response to chat
      const aiResponse = {
        id: Date.now() + 1,
        message: data.message,
        sentTime: new Date().toISOString(),
        sender: 'system',
        direction: 'incoming',
        qualityScore: data.qualityScore
      };
      
      onMessagesUpdate([...messageHistory, aiResponse]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      // Handle error (show error message)
    } finally {
      setIsTyping(false);
    }
  };
  
  return (
    <div className="nandi-chat-window">
      {/* Points display */}
      <PointsDisplay 
        sessionPoints={sessionPoints}
        totalPoints={userPoints} // From user context or props
        qualityScore={lastQualityScore}
      />
      
      {/* Messages display */}
      <div className="chat-messages-container">
        {messages.map(msg => (/* Message rendering */)}
        {isTyping && (/* Typing indicator */)}
      </div>
      
      {/* Input form */}
      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-input"
          placeholder={getPlaceholderForTheme(theme?.id)}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <div className="chat-buttons-container">
          <button type="submit" className="chat-send-button">
            {/* Send icon */}
          </button>
          <button type="button" className="chat-close-button" onClick={onClose}>
            ✕
          </button>
        </div>
      </form>
    </div>
  );
};
```

#### Backend Implementation

##### Quarkus API (Java)

###### API Controller
```java
// nandi-api/src/main/java/com/nandi/api/controller/ChatController.java
@Path("/api/karma_cafe")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ChatController {
    
    @Inject
    ChatService chatService;
    
    @Inject
    SecurityService securityService;
    
    @Inject
    PointsService pointsService;
    
    @POST
    @Path("/chat")
    public Response processChatMessage(ChatRequest request) {
        // 1. Authenticate user (if required)
        User currentUser = securityService.getCurrentUser();
        
        // 2. Process chat request
        ChatResponse response = chatService.processMessage(
            request.getMessage(),
            request.getPersona(),
            request.getContext(),
            currentUser
        );
        
        // 3. Return response with quality score if available
        return Response.ok(response).build();
    }
    
    @POST
    @Path("/session")
    public Response processSessionEnd(SessionMetricsRequest request) {
        // 1. Authenticate user
        User currentUser = securityService.getCurrentUser();
        
        // 2. Calculate points earned for this session
        PointsResponse pointsResponse = pointsService.calculateSessionPoints(
            request.getPersona(),
            request.getDurationSeconds(),
            request.getMessageCount(),
            currentUser
        );
        
        // 3. Return points information
        return Response.ok(pointsResponse).build();
    }
}
```

###### Service Layer
```java
// nandi-api/src/main/java/com/nandi/api/service/ChatService.java
@ApplicationScoped
public class ChatService {
    
    @Inject
    AIServiceClient aiServiceClient;
    
    @Inject
    ChatRepository chatRepository;
    
    @Inject
    CacheManager cacheManager;
    
    public ChatResponse processMessage(String message, Persona persona, List<MessageContext> context, User user) {
        // 1. Check cache for similar queries (optional optimization)
        Optional<String> cachedResponse = cacheManager.getChatResponse(message, persona);
        if (cachedResponse.isPresent()) {
            // Log cache hit and return cached response
            return new ChatResponse(cachedResponse.get());
        }
        
        // 2. Call AI service for response with quality score
        AIResponseWithQuality aiResponse = aiServiceClient.generateResponseWithQuality(message, persona, context);
        
        // 3. Persist chat messages with quality score
        persistChatMessages(message, aiResponse.getMessage(), persona, user, aiResponse.getQualityScore());
        
        // 4. Cache response for future similar queries
        cacheManager.cacheResponse(message, aiResponse.getMessage(), persona);
        
        // 5. Return response with quality score
        return new ChatResponse(
            aiResponse.getMessage(),
            aiResponse.getQualityScore(),
            aiResponse.getScoreReason()
        );
    }
    
    private void persistChatMessages(String userMessage, String aiMessage, Persona persona, User user, int qualityScore) {
        // Create and save user message
        ChatMessage userChatMessage = new ChatMessage(
            MessageType.USER,
            userMessage,
            persona,
            user
        );
        chatRepository.persist(userChatMessage);
        
        // Create and save AI response with quality score
        ChatMessage aiChatMessage = new ChatMessage(
            MessageType.AI,
            aiMessage,
            persona,
            user,
            qualityScore
        );
        chatRepository.persist(aiChatMessage);
    }
}
```

###### Points Service
```java
// nandi-api/src/main/java/com/nandi/api/service/PointsService.java
@ApplicationScoped
public class PointsService {
    
    @Inject
    UserRepository userRepository;
    
    @Inject
    PointsHistoryRepository pointsHistoryRepository;
    
    public PointsResponse calculateSessionPoints(String persona, long durationSeconds, int messageCount, User user) {
        int pointsEarned = 0;
        
        // 1. Base points for participation
        pointsEarned += 5;
        
        // 2. Points for duration (1 point per minute, max 30)
        int durationPoints = (int) Math.min(30, durationSeconds / 60);
        pointsEarned += durationPoints;
        
        // 3. Points for message count (2 points per message, max 20)
        int messagePoints = Math.min(20, messageCount * 2);
        pointsEarned += messagePoints;
        
        // 4. Consistency bonus
        LocalDate lastInteraction = user.getLastInteractionDate();
        LocalDate today = LocalDate.now();
        
        if (lastInteraction != null && lastInteraction.plusDays(1).isEqual(today)) {
            // User has interacted on consecutive days
            int streak = user.getConsecutiveLoginDays() + 1;
            int streakBonus = Math.min(20, streak); // Cap at 20 points
            pointsEarned += streakBonus;
            
            // Update user streak
            user.setConsecutiveLoginDays(streak);
        } else {
            // Reset streak
            user.setConsecutiveLoginDays(1);
        }
        
        // 5. Update user's interaction timestamp
        user.setLastInteractionDate(today);
        
        // 6. Add points to user's total
        int previousTotal = user.getTotalPoints();
        int newTotal = previousTotal + pointsEarned;
        user.setTotalPoints(newTotal);
        
        // 7. Save user
        userRepository.update(user);
        
        // 8. Record points history
        PointsHistory history = new PointsHistory(
            user,
            PointsSource.CHAT,
            pointsEarned,
            "Chat session with " + persona,
            LocalDateTime.now()
        );
        pointsHistoryRepository.persist(history);
        
        // 9. Return the response
        return new PointsResponse(pointsEarned, newTotal);
    }
}
```

##### Python AI Service

###### AI Service with Quality Evaluation
```python
# nandi-ai-service/app/api/routes/chat.py
@router.post("/generate", response_model=ChatResponseWithQuality)
async def generate_chat_response(
    request: ChatRequest,
    openai_service: OpenAIService = Depends(get_openai_service)
):
    try:
        response = await openai_service.generate_response_with_quality_score(
            message=request.message,
            persona=request.persona,
            context=request.context
        )
        return ChatResponseWithQuality(
            message=response["message"],
            quality_score=response["quality_score"],
            score_reason=response.get("score_reason", "")
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating response: {str(e)}"
        )
```

## API Contracts

### Chat Request (Frontend to Quarkus API)

```json
{
  "message": "How can I find my purpose in life?",
  "persona": "dharma",
  "context": [
    {
      "role": "user",
      "content": "Hello, I'm feeling lost"
    },
    {
      "role": "assistant",
      "content": "I understand that feeling. Would you like to explore what might be causing this?"
    }
  ]
}
```

### Chat Response (Quarkus API to Frontend)

```json
{
  "message": "Finding your purpose begins with understanding your unique gifts and values. Consider what activities bring you joy and fulfillment. In the Vedic tradition, dharma is about aligning your actions with your authentic self. Start by reflecting on these questions: What activities make you lose track of time? What contributions do you feel called to make? Small steps of exploration will gradually reveal your path.",
  "id": "chat-response-123456",
  "timestamp": "2023-07-10T15:30:45Z",
  "qualityScore": 8,
  "scoreReason": "Deep, thoughtful question about purpose that shows personal investment"
}
```

### Session Metrics Request (Frontend to Quarkus API)

```json
{
  "persona": "dharma",
  "durationSeconds": 720,
  "messageCount": 12
}
```

### Points Response (Quarkus API to Frontend)

```json
{
  "pointsEarned": 42,
  "totalPoints": 1250,
  "breakdown": {
    "base": 5,
    "duration": 12,
    "messages": 20,
    "streak": 5
  }
}
```

## Database Schema

### ChatMessage Table

| Column       | Type           | Description                                 |
|--------------|----------------|---------------------------------------------|
| id           | Long           | Primary key                                 |
| type         | MessageType    | Enum: USER or AI                            |
| content      | String         | Message content (max 2000 chars)            |
| persona      | Persona        | Enum: KARMA, DHARMA, or ATMA                |
| user_id      | Long           | Foreign key to User table                   |
| created_at   | LocalDateTime  | Timestamp when message was created          |
| quality_score| Integer        | Score 1-10 reflecting question quality      |

### User Table (Enhanced)

| Column                   | Type           | Description                                    |
|--------------------------|----------------|------------------------------------------------|
| id                       | Long           | Primary key                                    |
| username                 | String         | User's username                                |
| email                    | String         | User's email                                   |
| password_hash            | String         | Hashed password                                |
| total_points             | Integer        | Total points accumulated                       |
| level                    | Integer        | User level based on points                     |
| last_interaction_date    | LocalDate      | Date of last interaction                       |
| consecutive_login_days   | Integer        | Streak of consecutive days with activity       |
| karma_points             | Integer        | Points earned from Karma interactions          |
| dharma_points            | Integer        | Points earned from Dharma interactions         |
| atma_points              | Integer        | Points earned from Atma interactions           |
| created_at               | LocalDateTime  | Account creation timestamp                     |
| updated_at               | LocalDateTime  | Last update timestamp                          |

### ChatSession Table

| Column         | Type           | Description                                 |
|----------------|----------------|---------------------------------------------|
| id             | Long           | Primary key                                 |
| user_id        | Long           | Foreign key to User table                   |
| persona        | Persona        | Persona used in this session                |
| start_time     | LocalDateTime  | Session start timestamp                     |
| end_time       | LocalDateTime  | Session end timestamp                       |
| duration_seconds | Long        | Session duration in seconds                  |
| message_count  | Integer        | Number of messages in session               |
| points_earned  | Integer        | Points earned in this session               |

### PointsHistory Table

| Column         | Type           | Description                                 |
|----------------|----------------|---------------------------------------------|
| id             | Long           | Primary key                                 |
| user_id        | Long           | Foreign key to User table                   |
| source         | PointsSource   | Enum: CHAT, QUEST, MEDITATION, etc.         |
| points         | Integer        | Points earned or spent                      |
| description    | String         | Description of the points transaction       |
| created_at     | LocalDateTime  | Transaction timestamp                       |

## Caching Strategy

### Redis Cache Structure

- Key: `chat:{persona}:{message_hash}`
- Value: AI response
- TTL: 1 week (configurable)

## Error Handling

1. **Frontend Errors**
   - Network errors: Retry with exponential backoff
   - API errors: Display user-friendly message
   - Session expiration: Redirect to login

2. **Quarkus API Errors**
   - Validation errors: Return 400 Bad Request
   - Authentication errors: Return 401 Unauthorized
   - AI service errors: Use fallback responses
   - Database errors: Log and return graceful error

3. **AI Service Errors**
   - OpenAI API failures: Retry with exponential backoff
   - Content policy violations: Filter and return appropriate message
   - Timeout errors: Return status code for frontend retry

## Implementation Timeline

1. **Phase 1: Basic Functionality** (1-2 weeks)
   - Implement chat UI components
   - Create chat API endpoints
   - Set up basic AI service integration
   - Implement message persistence

2. **Phase 2: Enhanced Functionality** (2-3 weeks)
   - Add context management for multi-turn conversations
   - Implement caching for frequently asked questions
   - Add analytics tracking
   - Improve error handling and fallbacks
   - **Implement points calculation algorithm**
   - **Enhance AI service for quality assessment**

3. **Phase 3: Optimization** (1-2 weeks)
   - Performance optimization
   - UX improvements based on user feedback
   - Add additional persona customization
   - Implement chat history browsing
   - **Add points visualization and rewards**
   - **Implement leaderboards and achievements**

## Security Considerations

1. **Authentication**
   - JWT-based authentication for API requests
   - Session management for chat history

2. **Data Protection**
   - Encryption for sensitive data
   - Proper data sanitization to prevent injection attacks

3. **Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Captcha for suspicious activity

## Testing Strategy

1. **Unit Tests**
   - Test chat components in isolation
   - Test service methods with mocked dependencies
   - **Test points calculation algorithms**

2. **Integration Tests**
   - Test frontend-to-API integration
   - Test API-to-AI service integration
   - **Verify points are correctly awarded and stored**

3. **End-to-End Tests**
   - Full flow testing from UI to database
   - Performance testing under load
   - **Test gamification features across user sessions**

## Future Enhancements

1. **Personalization**
   - User preference tracking
   - Adaptive responses based on interaction history

2. **Advanced Features**
   - Voice input/output
   - Multi-language support
   - Image and media sharing

3. **Analytics**
   - User engagement tracking
   - Common question analysis
   - Sentiment analysis of conversations

4. **Advanced Gamification**
   - Achievements and badges system
   - Level progression with special benefits
   - Challenges and quests to earn bonus points
   - Social sharing of accomplishments

## Conclusion

This comprehensive implementation plan provides a roadmap for building the KarmaCafe chat feature in the Nandi platform, including an engaging points system that rewards quality interactions. By following this architecture and implementation approach, we can deliver a robust, scalable, and user-friendly chat experience that fulfills the spiritual guidance mission of the platform while encouraging deeper engagement through gamification. 