// src/components/KarmaCafe/KarmaCafe.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './KarmaCafe.css';

// Main KarmaCafe component
const KarmaCafe = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: "Hello! What's on your mind?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('atma');
  const chatAreaRef = useRef(null);

  // Theme data
  const themeInfo = {
    karma: {
      title: "Karma",
      description: "Explore how your actions and intentions shape your experience and future.",
      sampleQuestions: []
    },
    dharma: {
      title: "Dharma",
      description: "Discover your unique purpose and how to live in alignment with your true nature.",
      sampleQuestions: []
    },
    atma: {
      title: "Atma",
      description: "Connect with your true self beyond ego and discover your inner wisdom.",
      sampleQuestions: []
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim()) {
      const userMessage = { type: 'user', text: inputText };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setIsLoading(true);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simple mock response
        const aiResponse = "Thank you for your question about " + selectedTheme + ". This is a placeholder response that would normally come from the backend.";
        
        const aiMessage = { type: 'ai', text: aiResponse };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: 'Sorry, something went wrong. Please try again.' 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClearChat = () => {
    setMessages([{ type: 'ai', text: "Hello! What's on your mind?" }]);
  };

  // Function to handle key press in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Function to handle theme selection
  const handleThemeClick = (theme) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="card karmacafe">
      <div className="card-header">
        <div className="text-avatar">N</div>
        <h2>KarmaCafe Session</h2>
        <div className="xp-tracker">Avatar | ★ 40 XP | Level 2</div>
      </div>
      
      {/* Floating Controls */}
      <div className="floating-controls">
        <button 
          className="floating-btn" 
          onClick={handleClearChat}
          title="Clear Chat"
        >
          🗑️
        </button>
        <Link to="/" className="floating-btn home-btn" title="Back Home">
          🏠
        </Link>
      </div>
      
      {/* Theme selector - always visible */}
      <div className="theme-selector-container">
        <div className="theme-buttons">
          {Object.keys(themeInfo).map((theme) => (
            <button
              key={theme}
              className={`theme-button ${selectedTheme === theme ? 'active' : ''}`}
              onClick={() => handleThemeClick(theme)}
            >
              {themeInfo[theme].title}
            </button>
          ))}
        </div>
      </div>
      
      <div className="chat-area" ref={chatAreaRef}>
        {messages.map((msg, index) => (
          <div key={index}>
            <div className={`chat-bubble ${msg.type}`}>
              {msg.text}
            </div>
            {msg.type === 'ai' && (
              <div className="chat-actions">
                <button className="action-button like" title="Like this response">👍</button>
                <button className="action-button dislike" title="Dislike this response">👎</button>
                <button className="action-button bookmark" title="Save this insight">🔖</button>
                <button className="action-button share" title="Share this wisdom">🔗</button>
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
      </div>
      
      <div className="input-area">
        <input
          type="text"
          className="input-field"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          disabled={isLoading}
          autoFocus
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default KarmaCafe;