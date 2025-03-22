import React, { useState, useRef, useEffect } from 'react';
import './KarmaCafe.css';
import { FaPaperPlane, FaMedal } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { chatService } from '../../services/api';
import { ERROR_MESSAGES } from '../../utils/errorHandling';

const KarmaChat = ({ persona = 'Karma' }) => {
  const [messages, setMessages] = useState([{
    id: uuidv4(),
    type: 'ai',
    content: `Welcome to KarmaCafe. I'm ${persona}, how can I help you on your spiritual journey today?`,
    timestamp: new Date()
  }]);
  const [input, setInput] = useState('');
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastQualityScore, setLastQualityScore] = useState(null);
  const [lastPointsEarned, setLastPointsEarned] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    if (!(date instanceof Date) || isNaN(date)) {
      const now = new Date();
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(now);
    }
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: uuidv4(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setError('');
    setLoading(true);
    setLastQualityScore(null);
    setLastPointsEarned(null);

    try {
      const response = await chatService.generateResponse(userMessage.content);
      
      const aiMessage = {
        id: uuidv4(),
        type: 'ai',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setLastQualityScore(response.qualityScore);
      setLastPointsEarned(response.points);

      const metrics = await chatService.calculateSessionMetrics();
      if (metrics && metrics.totalPoints !== undefined) {
        setPoints(metrics.totalPoints);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setError(error.message || ERROR_MESSAGES.DEFAULT);
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        id: uuidv4(),
        type: 'ai',
        content: error.message || ERROR_MESSAGES.DEFAULT,
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getQualityClass = (score) => {
    if (score >= 8) return 'high';
    if (score >= 5) return 'medium';
    return 'low';
  };

  return (
    <div className="karma-chat-container">
      <div className="karma-points-display">
        <FaMedal className="medal-icon" />
        <span className="points-total">{points} points</span>
        {lastQualityScore !== null && (
          <div className="quality-indicator">
            <div className={`quality-badge ${getQualityClass(lastQualityScore)}`}>
              Quality: {lastQualityScore}/10
            </div>
            {lastPointsEarned && (
              <div className="points-earned">+{lastPointsEarned} pts</div>
            )}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map(message => (
          <div key={message.id} className={`message ${message.type} ${message.isError ? 'error' : ''}`}>
            <div className="message-content">{message.content}</div>
            <div className="message-time">{formatTime(message.timestamp)}</div>
          </div>
        ))}
      </div>

      <form role="form" className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={loading}
        />
        <button
          type="submit"
          className="send-button"
          disabled={loading || !input.trim()}
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default KarmaChat; 