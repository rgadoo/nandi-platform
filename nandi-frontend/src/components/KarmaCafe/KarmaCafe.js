// src/components/KarmaCafe/KarmaCafe.js
import React, { useState, useEffect, useRef } from 'react';
import './KarmaCafe.css';

// Main KarmaCafe component
const KarmaCafe = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: "Hello! What's on your mind today? I'm here to chat about anything you'd like to discuss." }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatAreaRef = useRef(null);

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
        const aiResponse = "Thank you for your message. This is a placeholder response that would normally come from the backend.";
        
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
    setMessages([{ type: 'ai', text: "Hello! What's on your mind today? I'm here to chat about anything you'd like to discuss." }]);
  };

  // Function to handle key press in input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="card karmacafe">
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
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={isLoading || !inputText.trim()}
        >
          {isLoading ? "..." : "Send"}
        </button>
        <button 
          className="clear-btn" 
          onClick={handleClearChat}
          title="Clear Chat"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default KarmaCafe;