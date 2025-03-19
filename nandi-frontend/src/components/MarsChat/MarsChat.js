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

// Define a constant for the avatar image URL - use process.env.PUBLIC_URL to ensure it works in all environments
const AVATAR_URL = `${process.env.PUBLIC_URL}/images/nandi.png`;

// Fallback avatar in case the image doesn't load
const FALLBACK_AVATAR_URL = "https://ui-avatars.com/api/?name=AI&background=6b46c1&color=fff";

const MarsChat = () => {
  // State to track if the image loaded successfully
  const [avatarLoaded, setAvatarLoaded] = useState(true);
  
  // Function to handle image load errors
  const handleImageError = () => {
    console.log("Avatar image failed to load, using fallback");
    setAvatarLoaded(false);
  };

  // Get the current avatar URL (either custom or fallback)
  const getCurrentAvatarUrl = () => {
    return avatarLoaded ? AVATAR_URL : FALLBACK_AVATAR_URL;
  };
  
  // State management
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "Hello! This is Karma",
      sentTime: "just now",
      sender: "system",
      direction: "incoming",
      position: "single"
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Function to handle sending a message
  const handleSendMessage = (message) => {
    // Add user message to chat
    const newUserMessage = {
      id: messages.length + 1,
      message: message,
      sentTime: "just now",
      sender: "user",
      direction: "outgoing",
      position: "single"
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage("");
    
    // Simulate typing indicator
    setIsTyping(true);
    
    // Simulate response after delay
    setTimeout(() => {
      const systemResponse = {
        id: messages.length + 2,
        message: getSystemResponse(message),
        sentTime: "just now",
        sender: "system",
        direction: "incoming",
        position: "single"
      };
      
      setMessages(prevMessages => [...prevMessages, systemResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Simple function to generate responses
  const getSystemResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello there! How can I assist you today?";
    } else if (lowerMessage.includes("help")) {
      return "I'm here to help! You can ask me about our products, services, or any other information you need.";
    } else if (lowerMessage.includes("thank")) {
      return "You're welcome! Is there anything else I can help you with?";
    } else {
      return "Thank you for your message. I'll process that information and get back to you shortly.";
    }
  };

  // Toggle chat window
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="mars-chat-container">
      {/* Chat toggle button */}
      <button 
        className="chat-toggle-button"
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#6b46c1",
          color: "white",
          border: "none",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}
      >
        {isChatOpen ? "✕" : "💬"}
      </button>

      {/* Chat window */}
      {isChatOpen && (
        <div
          className="mars-chat-window"
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
              <ConversationHeader>
                <Avatar 
                  src={getCurrentAvatarUrl()}
                  name="AI Assistant" 
                  status="available"
                  onError={handleImageError}
                />
                <ConversationHeader.Content 
                  userName="Karma" 
                  info=""
                />
                <ConversationHeader.Actions>
                  <Button onClick={toggleChat}>Close</Button>
                </ConversationHeader.Actions>
              </ConversationHeader>
              
              <MessageList 
                typingIndicator={isTyping ? <TypingIndicator content="Assistant is typing" /> : null}
              >
                {messages.map(msg => (
                  <Message 
                    key={msg.id} 
                    model={msg}
                  >
                    {msg.direction === "incoming" && (
                      <Avatar 
                        src={getCurrentAvatarUrl()}
                        name="AI Assistant"
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
      )}
    </div>
  );
};

export default MarsChat; 