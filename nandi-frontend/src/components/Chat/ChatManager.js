import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import NandiChatWindow from './NandiChatWindow';
import { FaBalanceScale, FaRoute, FaYinYang } from 'react-icons/fa';

// Define the chat themes with updated colors and icons
const CHAT_THEMES = [
  {
    id: 'karma',
    name: 'Karma Chat',
    apiEndpoint: '/api/karma',
    icon: <FaBalanceScale />,
    color: '#FF9800', // Vibrant Orange
    position: 'bottom-right',
    description: 'Action & Consequence',
    avatarImage: '/images/chat-avatars/karma-avatar.png' // Path to karma avatar image
  },
  {
    id: 'dharma',
    name: 'Dharma Chat',
    apiEndpoint: '/api/dharma',
    icon: <FaRoute />,
    color: '#4CAF50', // Deep Green
    position: 'bottom-left',
    description: 'Purpose & Guidance',
    avatarImage: '/images/chat-avatars/wisdom-avatar.png' // Updated to match existing file
  },
  {
    id: 'atma',
    name: 'Atma Chat',
    apiEndpoint: '/api/atma',
    icon: <FaYinYang />,
    color: '#3F51B5', // Deep Indigo
    position: 'top-right',
    description: 'Mindfulness & Inner Peace',
    avatarImage: '/images/chat-avatars/meditation-avatar.png' // Updated to match existing file
  }
];

const ChatManager = forwardRef((props, ref) => {
  const [activeChat, setActiveChat] = useState(null);
  
  // Store message histories for each chat theme
  const [messageHistories, setMessageHistories] = useState({});
  
  // Expose methods to parent components via ref
  useImperativeHandle(ref, () => ({
    handleChatToggle: (chatId) => {
      handleChatToggle(chatId);
    }
  }));
  
  // Initialize message histories for each theme if not already present
  useEffect(() => {
    const initialHistories = {};
    CHAT_THEMES.forEach(theme => {
      if (!messageHistories[theme.id]) {
        initialHistories[theme.id] = [
          {
            id: 1,
            message: `Hello! This is ${theme.name}`,
            sentTime: "just now",
            sender: "system",
            direction: "incoming",
            position: "single"
          }
        ];
      }
    });
    
    if (Object.keys(initialHistories).length > 0) {
      setMessageHistories(prev => ({...prev, ...initialHistories}));
    }
  }, [messageHistories]);

  const handleChatToggle = (chatId) => {
    if (activeChat === chatId) {
      setActiveChat(null);
    } else {
      setActiveChat(chatId);
    }
  };

  const getActiveChatTheme = () => {
    return CHAT_THEMES.find(theme => theme.id === activeChat);
  };
  
  // Handle message updates for this chat
  const handleMessagesUpdate = (chatId, messages) => {
    setMessageHistories(prev => ({
      ...prev,
      [chatId]: messages
    }));
  };

  return (
    <div className="chat-manager">
      {/* Render the active chat window if there is one */}
      {activeChat && (
        <NandiChatWindow
          theme={getActiveChatTheme()}
          onClose={() => setActiveChat(null)}
          messages={messageHistories[activeChat] || []}
          onMessagesUpdate={(messages) => handleMessagesUpdate(activeChat, messages)}
        />
      )}
    </div>
  );
});

export default ChatManager; 