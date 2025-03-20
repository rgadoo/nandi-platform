import React, { useState, useRef, useEffect } from 'react';
import './NandiChatWindow.css';

/**
 * NandiChatWindow - Clay-styled chat window component for Nandi app
 * 
 * @param {Object} props
 * @param {Object} props.theme - Theme configuration for this chat
 * @param {Function} props.onClose - Function to call to close the chat
 * @param {Array} props.messages - Messages to display
 * @param {Function} props.onMessagesUpdate - Function to call when messages change
 */
const NandiChatWindow = ({ theme, onClose, messages = [], onMessagesUpdate }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null); // Reference for the input field
  const [avatarLoaded, setAvatarLoaded] = useState(true);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Autofocus the input field when the component mounts
  useEffect(() => {
    // Use a slightly longer timeout for mobile devices to ensure DOM is ready
    const focusTimer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        
        // On mobile, try to scroll to make the input visible
        if (window.innerWidth <= 768) {
          // Scroll to the bottom of the chat window
          scrollToBottom();
          
          // Try to force the virtual keyboard to show by focusing again after a brief delay
          setTimeout(() => {
            inputRef.current?.focus();
            
            // On iOS, we might need to scroll the window
            window.scrollTo(0, document.body.scrollHeight);
          }, 300);
        }
      }
    }, 200);
    
    return () => clearTimeout(focusTimer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Function to handle image load errors
  const handleImageError = () => {
    console.log("Avatar image failed to load, using fallback");
    setAvatarLoaded(false);
  };
  
  // Function to focus the input field
  const focusInputField = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    // Add user message
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
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        message: getAIResponse(inputMessage, theme),
        sentTime: new Date().toISOString(),
        sender: 'system',
        direction: 'incoming'
      };
      
      onMessagesUpdate([...updatedMessages, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Simple function to generate responses based on theme
  const getAIResponse = (message, theme) => {
    const lowerMessage = message.toLowerCase();
    const themeId = theme?.id || 'default';
    
    // Different responses based on chat theme
    switch(themeId) {
      case 'karma':
        if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
          return "Greetings! I am your Karma guide, focused on action and consequence. How may I assist you in understanding your path?";
        } else if (lowerMessage.includes("help")) {
          return "I can help you understand how your actions create consequences. What specific aspect of karma would you like to explore?";
        } else if (lowerMessage.includes("what is karma")) {
          return "Karma is the universal principle of cause and effect, action and reaction. Every action generates a force of energy that returns to us in like kind. What you sow, so shall you reap.";
        } else {
          return "Your actions shape your destiny. Let's explore how your current choices are influencing your path forward.";
        }
      
      case 'dharma':
        if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
          return "Welcome to Dharma Chat. I'm here to guide you in discovering your purpose and true path in life.";
        } else if (lowerMessage.includes("help")) {
          return "I can help you understand your life's purpose and righteous duties. What area of guidance are you seeking?";
        } else if (lowerMessage.includes("what is dharma")) {
          return "Dharma refers to one's righteous duty or the right way of living. It's about aligning with your true purpose and the cosmic order. How can I help you find your dharma?";
        } else {
          return "Finding your purpose requires reflection and self-awareness. Let's explore what path might best align with your authentic self.";
        }
        
      case 'atma':
        if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
          return "Peace be with you. I am your Atma guide, here to help you cultivate mindfulness and inner peace.";
        } else if (lowerMessage.includes("help")) {
          return "I can guide you through meditation practices, mindfulness techniques, and paths to discovering your inner self. What aspect of mindfulness interests you most?";
        } else if (lowerMessage.includes("meditation")) {
          return "Meditation is the practice of focusing your attention to achieve mental clarity and emotional calmness. Would you like me to guide you through a simple meditation exercise?";
        } else {
          return "Inner peace comes from acknowledging your thoughts without judgment. Take a deep breath, and let's explore your inner landscape together.";
        }
        
      default:
        if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
          return "Namaste! How can I assist you on your path today?";
        } else if (lowerMessage.includes("help")) {
          return "I'm here to guide you. You can ask about karma, dharma, mindfulness, or seek spiritual advice.";
        } else {
          return "I appreciate your sharing. Let's continue this conversation with mindfulness and purpose.";
        }
    }
  };

  return (
    <div 
      className="nandi-chat-window"
      onClick={focusInputField} // Add click handler to focus input
    >
      {/* Chat Header */}
      <div 
        className="chat-header"
        style={{ backgroundColor: theme?.color || 'var(--nandi-brown)' }}
      >
        <div className="chat-header-info">
          <h3>{theme?.name || 'Nandi Chat'}</h3>
        </div>
        <button 
          className="chat-close-button" 
          onClick={(e) => {
            e.stopPropagation(); // Stop click from bubbling to parent
            e.preventDefault(); // Prevent any default action
            onClose(); // Call the close handler
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages Container */}
      <div className="chat-messages-container">
        {messages.map(msg => (
          <div 
            key={msg.id} 
            className={`chat-message ${msg.direction === 'outgoing' ? 'outgoing' : 'incoming'}`}
          >
            {msg.direction === 'incoming' && (
              <div className="message-avatar">
                {theme?.avatarImage && avatarLoaded ? (
                  <img 
                    src={`${process.env.PUBLIC_URL}${theme.avatarImage}`} 
                    alt={`${theme.name} avatar`}
                    onError={handleImageError}
                  />
                ) : (
                  <div style={{ 
                    backgroundColor: theme?.color, 
                    width: '100%', 
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px'
                  }}>
                    {theme?.name?.charAt(0) || 'N'}
                  </div>
                )}
              </div>
            )}
            <div className="message-content">
              <div className="message-bubble">
                {msg.message}
              </div>
              <div className="message-time">
                {msg.sentTime === 'just now' 
                  ? 'just now' 
                  : new Date(msg.sentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="chat-message incoming">
            <div className="message-avatar">
              {theme?.avatarImage && avatarLoaded ? (
                <img 
                  src={`${process.env.PUBLIC_URL}${theme.avatarImage}`} 
                  alt={`${theme.name} avatar`}
                  onError={handleImageError}
                />
              ) : (
                <div style={{ 
                  backgroundColor: theme?.color, 
                  width: '100%', 
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  {theme?.name?.charAt(0) || 'N'}
                </div>
              )}
            </div>
            <div className="message-content">
              <div className="message-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        {/* Empty div for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Add extra tap area for focusing input on mobile */}
      <div 
        className="mobile-focus-helper" 
        onClick={(e) => {
          e.stopPropagation(); // Prevent double handling
          focusInputField();
        }}
      ></div>
      
      {/* Input Area */}
      <form className="chat-input-area" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button 
          type="submit" 
          className="chat-send-button"
          disabled={!inputMessage.trim()}
          style={{ backgroundColor: theme?.color }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default NandiChatWindow; 