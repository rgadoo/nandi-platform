import React, { useState, useEffect, useRef } from 'react';
import './KarmaCafe.css';
import { FaPaperPlane, FaMedal } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';

const KarmaChat = ({ persona = "karma" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [points, setPoints] = useState({
    total: 0,
    breakdown: null,
    qualityScore: null,
    lastMessagePoints: 0
  });
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const messagesEndRef = useRef(null);
  
  // AI service URL (loaded from env)
  const AI_SERVICE_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000';
  // API service URL (loaded from env)
  const API_SERVICE_URL = process.env.REACT_APP_API_SERVICE_URL || 'http://localhost:8080';
  // API key (in real app would be stored more securely)
  const API_KEY = process.env.REACT_APP_API_KEY || 'dev_api_key';
  
  useEffect(() => {
    // Initialize session
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setSessionStartTime(new Date());
    
    // Add welcome message
    setMessages([{
      id: uuidv4(),
      text: `Welcome to KarmaCafe. I'm ${persona === 'karma' ? 'Karma' : persona === 'dharma' ? 'Dharma' : 'Atma'}, how can I help you on your spiritual journey today?`,
      sender: 'ai',
      timestamp: new Date()
    }]);
  }, [persona]);
  
  useEffect(() => {
    // Scroll to bottom of messages
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      id: uuidv4(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // 1. Get response from AI service
      const chatResponse = await fetch(`${AI_SERVICE_URL}/api/chat/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY
        },
        body: JSON.stringify({
          message: input,
          persona: persona,
          session_id: sessionId,
          context: messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        })
      });
      
      const chatData = await chatResponse.json();
      
      if (!chatResponse.ok) {
        throw new Error(chatData.detail || 'Error getting chat response');
      }
      
      // Add AI message to chat
      const aiMessage = {
        id: uuidv4(),
        text: chatData.message,
        sender: 'ai',
        timestamp: new Date(),
        qualityScore: chatData.quality_score
      };
      
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      
      // 2. If we have a quality score, calculate points with API service
      if (chatData.quality_score) {
        // Calculate session duration in minutes
        const sessionDurationMinutes = Math.round((new Date() - sessionStartTime) / 60000);
        
        // Get user's consecutive day info from localStorage
        const lastActivityDate = localStorage.getItem('lastActivityDate');
        const today = new Date().toDateString();
        const isConsecutiveDay = lastActivityDate && 
          new Date(lastActivityDate).toDateString() === 
          new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();
        
        // Store today's date
        localStorage.setItem('lastActivityDate', today);
        
        // Get total questions count from localStorage
        const totalQuestionsCount = parseInt(localStorage.getItem('totalQuestionsCount') || '0') + 1;
        localStorage.setItem('totalQuestionsCount', totalQuestionsCount.toString());
        
        // Send request to API service to calculate points
        const pointsResponse = await fetch(`${API_SERVICE_URL}/api/points/calculate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': API_KEY
          },
          body: JSON.stringify({
            quality_scores: [chatData.quality_score],
            session_duration_minutes: sessionDurationMinutes,
            is_consecutive_day: isConsecutiveDay,
            total_questions_count: totalQuestionsCount,
            session_id: sessionId
          })
        });
        
        if (pointsResponse.ok) {
          const pointsData = await pointsResponse.json();
          
          // Update points state
          setPoints({
            total: pointsData.points_data.total_points,
            breakdown: pointsData.points_data.breakdown,
            qualityScore: chatData.quality_score,
            lastMessagePoints: pointsData.points_data.questions_breakdown[0].points
          });
          
          // Save total points to localStorage
          const totalPoints = parseInt(localStorage.getItem('totalPoints') || '0') + 
            pointsData.points_data.total_points;
          localStorage.setItem('totalPoints', totalPoints.toString());
        }
      }
    } catch (error) {
      console.error('Error in chat:', error);
      // Add error message
      setMessages(prevMessages => [...prevMessages, {
        id: uuidv4(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="karma-chat-container">
      <div className="karma-points-display">
        <FaMedal className="medal-icon" />
        <span className="points-total">{points.total || 0} points</span>
        {points.qualityScore && (
          <div className="quality-indicator">
            <div className={`quality-badge ${
              points.qualityScore.score >= 8 ? 'high' : 
              points.qualityScore.score >= 4 ? 'medium' : 'low'
            }`}>
              Quality: {points.qualityScore.score}/10
            </div>
            {points.lastMessagePoints > 0 && (
              <div className="points-earned">+{points.lastMessagePoints} pts</div>
            )}
          </div>
        )}
      </div>
      
      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-content">{message.text}</div>
            <div className="message-time">
              {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask a question..."
          disabled={isLoading}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()} 
          className="send-button"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default KarmaChat; 