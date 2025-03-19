import React, { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./MarsChat.css"; // Import local styles
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  ConversationHeader,
  TypingIndicator,
  Button
} from "@chatscope/chat-ui-kit-react";

// Fallback avatar in case the image doesn't load
const FALLBACK_AVATAR_URL = "https://ui-avatars.com/api/?name=AI&background=6b46c1&color=fff";

const MarsChat = ({ theme, onClose, messages = null, onMessagesUpdate = null }) => {
  // State to track if the image loaded successfully
  const [avatarLoaded, setAvatarLoaded] = useState(true);
  
  // Function to handle image load errors
  const handleImageError = () => {
    console.log("Avatar image failed to load, using fallback");
    setAvatarLoaded(false);
  };

  // Get the current avatar URL (either custom or fallback)
  const getCurrentAvatarUrl = () => {
    if (!avatarLoaded) return FALLBACK_AVATAR_URL;
    return theme?.avatarImage ? `${process.env.PUBLIC_URL}${theme.avatarImage}` : FALLBACK_AVATAR_URL;
  };
  
  // State management - use messages from props if provided, otherwise use local state
  const [localMessages, setLocalMessages] = useState([
    {
      id: 1,
      message: `Hello! This is ${theme?.name || 'AI Assistant'}`,
      sentTime: "just now",
      sender: "system",
      direction: "incoming",
      position: "single"
    }
  ]);
  
  // Use messages from props if provided
  const chatMessages = messages || localMessages;
  
  // Update function that works with either local state or via the callback
  const updateMessages = (newMessages) => {
    if (onMessagesUpdate) {
      onMessagesUpdate(newMessages);
    } else {
      setLocalMessages(newMessages);
    }
  };
  
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState("");

  // Function to handle sending a message
  const handleSendMessage = (message) => {
    // Add user message to chat
    const newUserMessage = {
      id: chatMessages.length + 1,
      message: message,
      sentTime: "just now",
      sender: "user",
      direction: "outgoing",
      position: "single"
    };
    
    updateMessages([...chatMessages, newUserMessage]);
    setInputMessage("");
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Simulate response after delay
    setTimeout(() => {
      const systemResponse = {
        id: chatMessages.length + 2,
        message: getSystemResponse(message),
        sentTime: "just now",
        sender: "system",
        direction: "incoming",
        position: "single"
      };
      
      updateMessages([...chatMessages, newUserMessage, systemResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple function to generate responses based on theme
  const getSystemResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    const themeId = theme?.id || 'default';
    
    // Different responses based on chat theme
    switch(themeId) {
      case 'karma':
        if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
          return "Hello there! I'm Karma, your spiritual guide. How can I assist you today?";
        } else if (lowerMessage.includes("help")) {
          return "I'm here to help you explore spiritual concepts and find meaning in your journey.";
        } else {
          return "That's an interesting perspective. Let's explore that further on your spiritual journey.";
        }
      
      case 'wisdom':
        if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
          return "Greetings! I am Wisdom, your knowledge companion. What would you like to learn today?";
        } else if (lowerMessage.includes("help")) {
          return "I can share insights and knowledge on various topics. Feel free to ask anything.";
        } else {
          return "That's a thoughtful question. Here's what I know about that based on my knowledge.";
        }
        
      case 'meditation':
        if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
          return "Welcome to a space of calm. I am your Meditation guide. How are you feeling today?";
        } else if (lowerMessage.includes("help")) {
          return "I can guide you through meditations, breathing exercises, or help you find inner peace.";
        } else {
          return "Take a deep breath. Let's approach this with mindfulness and presence.";
        }
        
      default:
        if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
          return "Hello there! How can I assist you today?";
        } else if (lowerMessage.includes("help")) {
          return "I'm here to help! You can ask me about our products, services, or any other information you need.";
        } else {
          return "Thank you for your message. I'll process that information and get back to you shortly.";
        }
    }
  };

  return (
    <div className="mars-chat-window"
      style={{
        position: "fixed",
        bottom: "150px",
        right: "20px",
        width: "350px",
        height: "500px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        borderRadius: "10px",
        overflow: "hidden",
        zIndex: 998
      }}
    >
      <MainContainer>
        <ChatContainer>
          <ConversationHeader style={{ backgroundColor: theme?.color || '#6b46c1' }}>
            <Avatar 
              src={getCurrentAvatarUrl()}
              name={theme?.name || "AI Assistant"} 
              status="available"
              onError={handleImageError}
            />
            <ConversationHeader.Content 
              userName={theme?.name || "AI Assistant"} 
              info=""
            />
            <ConversationHeader.Actions>
              <Button onClick={onClose}>Close</Button>
            </ConversationHeader.Actions>
          </ConversationHeader>
          
          <MessageList 
            typingIndicator={isTyping ? <TypingIndicator content="Assistant is typing" /> : null}
          >
            {chatMessages.map(msg => (
              <Message 
                key={msg.id} 
                model={msg}
              >
                {msg.direction === "incoming" && (
                  <Avatar 
                    src={getCurrentAvatarUrl()}
                    name={theme?.name || "AI Assistant"}
                    onError={handleImageError}
                  />
                )}
              </Message>
            ))}
          </MessageList>
          
          <MessageInput 
            placeholder="Type message here..."
            value={inputMessage}
            onChange={val => setInputMessage(val)}
            onSend={handleSendMessage}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default MarsChat; 