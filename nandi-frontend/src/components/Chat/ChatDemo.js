import React, { useState, useEffect } from 'react';
import ChatBubbles from './ChatBubbles';
import NandiChatWindow from './NandiChatWindow';
import { FaBalanceScale, FaRoute, FaYinYang } from 'react-icons/fa';

// Define the chat themes for consistency with updated colors and icons
const CHAT_THEMES = [
  {
    id: 'karma',
    name: 'Karma Chat',
    icon: <FaBalanceScale />,
    color: '#FF9800', // Vibrant Orange
    position: 'bottom',
    description: 'Action & Consequence',
    avatarImage: '/images/chat-avatars/karma-avatar.png'
  },
  {
    id: 'dharma',
    name: 'Dharma Chat',
    icon: <FaRoute />,
    color: '#4CAF50', // Deep Green
    position: 'middle',
    description: 'Purpose & Guidance',
    avatarImage: '/images/chat-avatars/wisdom-avatar.png'
  },
  {
    id: 'atma',
    name: 'Atma Chat',
    icon: <FaYinYang />,
    color: '#3F51B5', // Deep Indigo
    position: 'top',
    description: 'Mindfulness & Inner Peace',
    avatarImage: '/images/chat-avatars/meditation-avatar.png'
  }
];

/**
 * ChatDemo - Components that showcases the chat functionality
 * with clay-like design
 */
const ChatDemo = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messageHistories, setMessageHistories] = useState({});
  
  // Initialize message histories
  useEffect(() => {
    const initialHistories = {};
    CHAT_THEMES.forEach(theme => {
      if (!messageHistories[theme.id]) {
        initialHistories[theme.id] = [
          {
            id: 1,
            message: `Welcome to ${theme.name}, your guide for ${theme.description}. How may I assist you on your journey today?`,
            sentTime: "just now",
            sender: "system",
            direction: "incoming"
          }
        ];
      }
    });
    
    if (Object.keys(initialHistories).length > 0) {
      setMessageHistories(prev => ({...prev, ...initialHistories}));
    }
  }, []);

  // Handle chat toggle
  const handleChatToggle = (chatId) => {
    // If a chat is already active, close it by setting activeChat to null
    // Otherwise, set the active chat to the selected chatId
    setActiveChat(chatId === activeChat ? null : chatId);
    
    // Prevent home page shift by making sure the chat window doesn't
    // affect the layout of other elements
    document.body.style.overflow = chatId ? 'hidden' : '';
  };

  // Get active chat theme
  const getActiveChatTheme = () => {
    return CHAT_THEMES.find(theme => theme.id === activeChat);
  };
  
  // Handle message updates
  const handleMessagesUpdate = (messages) => {
    setMessageHistories(prev => ({
      ...prev,
      [activeChat]: messages
    }));
  };

  return (
    <div className="chat-demo">
      {/* Chat Bubbles */}
      <ChatBubbles 
        activeChat={activeChat}
        onChatToggle={handleChatToggle}
      />
      
      {/* Active Chat Window */}
      {activeChat && (
        <NandiChatWindow
          theme={getActiveChatTheme()}
          onClose={() => handleChatToggle(null)} // Use the handler to close properly
          messages={messageHistories[activeChat] || []}
          onMessagesUpdate={handleMessagesUpdate}
        />
      )}
    </div>
  );
};

export default ChatDemo; 