## Points System Integration

To implement the gamification strategy in the KarmaCafe chat feature, we need to integrate the points system UI components with the chat interface. The following components will be added to enhance user engagement and provide feedback on their interactions.

### Points System UI Components

1. **Points Earned Toast**
   - Appears after each AI response
   - Shows points earned for the question and its quality
   - Located at the top of the chat window

   ```jsx
   const PointsToast = ({ pointsEarned, qualityTier, breakdown }) => {
     return (
       <div className="points-toast">
         <div className="points-toast-header">
           <span className="points-icon">✨</span>
           <span className="points-value">+{pointsEarned} POINTS EARNED</span>
         </div>
         <div className="points-toast-content">
           <div className="quality-tier">{qualityTier} Quality Question</div>
           <div className="points-breakdown">
             Base: {breakdown.base} | Quality Bonus: {breakdown.quality_bonus}
           </div>
         </div>
       </div>
     );
   };
   ```

2. **Session Points Summary**
   - Appears at the end of a chat session
   - Shows total points earned, including time bonus
   - Provides a breakdown of points sources

   ```jsx
   const SessionSummary = ({ sessionPoints }) => {
     const { 
       total_points, 
       breakdown: { 
         question_points, 
         time_points,
         consistency_bonus,
         milestone_bonus
       } 
     } = sessionPoints;
     
     return (
       <div className="session-summary">
         <h3>Session Complete</h3>
         <div className="total-points">✨ {total_points} points earned</div>
         <div className="points-breakdown">
           <div className="breakdown-item">
             <span>Questions:</span>
             <span>{question_points} pts</span>
           </div>
           <div className="breakdown-item">
             <span>Time Spent:</span>
             <span>{time_points} pts</span>
           </div>
           {consistency_bonus > 0 && (
             <div className="breakdown-item bonus">
               <span>Consistency Bonus:</span>
               <span>{consistency_bonus} pts</span>
             </div>
           )}
           {milestone_bonus > 0 && (
             <div className="breakdown-item bonus">
               <span>Milestone Bonus:</span>
               <span>{milestone_bonus} pts</span>
             </div>
           )}
         </div>
         <button className="view-details-btn">View Details</button>
       </div>
     );
   };
   ```

3. **Points Badge**
   - Persistent component in the chat header
   - Shows current points total
   - Animates when points increase

   ```jsx
   const PointsBadge = ({ points, animated = false }) => {
     return (
       <div className={`points-badge ${animated ? 'animated' : ''}`}>
         <span className="points-icon">✨</span>
         <span className="points-value">{points}</span>
       </div>
     );
   };
   ```

### Chat Component Updates

The main chat component needs to be updated to track the session duration and manage points-related state:

```jsx
const NandiChatWindow = ({ persona }) => {
  // Existing state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  // Points-related state
  const [sessionStartTime, setSessionStartTime] = useState(new Date());
  const [sessionPoints, setSessionPoints] = useState(null);
  const [showPointsToast, setShowPointsToast] = useState(false);
  const [pointsToastData, setPointsToastData] = useState(null);
  const [totalUserPoints, setTotalUserPoints] = useState(0);
  
  // Calculate session duration in minutes
  const getSessionDuration = () => {
    const now = new Date();
    const durationMs = now - sessionStartTime;
    return Math.round(durationMs / 60000); // Convert to minutes
  };
  
  // Send message with session duration
  const sendMessage = async () => {
    // Existing message sending code...
    
    // Add session duration to the request
    const sessionDuration = getSessionDuration();
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: inputValue,
        persona: persona,
        context: convertMessagesToContext(messages),
        session_duration_minutes: sessionDuration,
        is_consecutive_day: checkConsecutiveDay(),
        total_questions_count: getUserQuestionCount()
      })
    });
    
    const data = await response.json();
    
    // Handle points data from response
    if (data.points) {
      setPointsToastData(data.points);
      setShowPointsToast(true);
      setTotalUserPoints(prev => prev + data.points.points);
      
      // Hide toast after 5 seconds
      setTimeout(() => setShowPointsToast(false), 5000);
    }
    
    // Rest of the message handling...
  };
  
  // End session and show summary
  const endSession = async () => {
    // Calculate session duration
    const sessionDuration = getSessionDuration();
    
    // Get quality scores from messages
    const qualityScores = messages
      .filter(m => m.sender === 'ai')
      .map(m => m.qualityScore);
    
    // Call API to calculate total session points
    const response = await fetch('/api/points/calculate', {
      method: 'POST',
      body: JSON.stringify({
        quality_scores: qualityScores,
        session_duration_minutes: sessionDuration,
        is_consecutive_day: checkConsecutiveDay(),
        total_questions_count: getUserQuestionCount()
      })
    });
    
    const data = await response.json();
    setSessionPoints(data.points_data);
  };
  
  return (
    <div className="nandi-chat-window">
      <div className="chat-header">
        <h3>{getPersonaName(persona)}</h3>
        <PointsBadge 
          points={totalUserPoints} 
          animated={showPointsToast} 
        />
      </div>
      
      {showPointsToast && (
        <PointsToast
          pointsEarned={pointsToastData.points}
          qualityTier={pointsToastData.quality_tier}
          breakdown={pointsToastData.breakdown}
        />
      )}
      
      <div className="chat-messages">
        {messages.map((message, index) => (
          <ChatBubble 
            key={index}
            message={message.content}
            sender={message.sender}
          />
        ))}
      </div>
      
      {sessionPoints && (
        <SessionSummary sessionPoints={sessionPoints} />
      )}
      
      <div className="chat-input">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question..."
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={endSession}>End Session</button>
      </div>
    </div>
  );
};
```

### CSS Styling

All points system components should follow the clay-morphism styling approach:

```css
/* Points Toast Styling */
.points-toast {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.1),
    inset 0 0 15px rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 15px;
  margin: 10px auto;
  max-width: 90%;
  animation: toast-slide-in 0.5s ease-out;
}

.points-toast-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #805ad5;
  font-weight: bold;
}

.points-icon {
  margin-right: 8px;
  font-size: 1.2em;
}

/* Session Summary Styling */
.session-summary {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  box-shadow: 
    0 4px 30px rgba(0, 0, 0, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 20px;
  margin: 15px auto;
  max-width: 85%;
  animation: summary-fade-in 0.8s ease-out;
}

.total-points {
  font-size: 1.5em;
  font-weight: bold;
  color: #805ad5;
  margin: 15px 0;
  text-align: center;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.breakdown-item.bonus {
  color: #805ad5;
  font-weight: bold;
}

/* Points Badge Styling */
.points-badge {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 20px;
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 0 8px rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 12px;
  display: flex;
  align-items: center;
  font-weight: bold;
}

.points-badge.animated {
  animation: pulse 1s ease-in-out;
}

@keyframes toast-slide-in {
  from { transform: translateY(-20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes summary-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
```

### Implementation Timeline

1. **Phase 1: Core Points System Integration**
   - Implement PointsToast component
   - Update chat component to track session duration
   - Add points badge to chat header

2. **Phase 2: Session Summary and Extended Features**
   - Implement SessionSummary component
   - Add end session functionality
   - Connect to points calculation API

3. **Phase 3: User Profile and History**
   - Create points history visualization
   - Implement achievements system
   - Add points profile page 