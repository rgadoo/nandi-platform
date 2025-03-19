import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import MarsChat from '../MarsChat/MarsChat';
import { FaQuestionCircle, FaGraduationCap, FaPrayingHands } from 'react-icons/fa';

// Define the chat themes
const CHAT_THEMES = [
  {
    id: 'karma',
    name: 'Karma Chat',
    apiEndpoint: '/api/karma',
    icon: <FaQuestionCircle />,
    color: '#6b46c1',
    position: 'bottom-right',
    avatarImage: '/images/chat-avatars/karma-avatar.png'
  },
  {
    id: 'wisdom',
    name: 'Wisdom Chat',
    apiEndpoint: '/api/wisdom',
    icon: <FaGraduationCap />,
    color: '#3182ce',
    position: 'bottom-left',
    avatarImage: '/images/chat-avatars/wisdom-avatar.png'
  },
  {
    id: 'meditation',
    name: 'Meditation Chat',
    apiEndpoint: '/api/meditation',
    icon: <FaPrayingHands />,
    color: '#38a169',
    position: 'top-right',
    avatarImage: '/images/chat-avatars/meditation-avatar.png'
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
  
  // Handle message updates from the MarsChat component
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
        <MarsChat
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