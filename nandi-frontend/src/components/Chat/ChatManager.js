import React, { useState } from 'react';
import ChatBubble from './ChatBubble';
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

const ChatManager = () => {
  const [activeChat, setActiveChat] = useState(null);

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

  return (
    <div className="chat-manager">
      {/* Render all chat bubbles */}
      {CHAT_THEMES.map(theme => (
        <ChatBubble
          key={theme.id}
          id={theme.id}
          name={theme.name}
          icon={theme.icon}
          color={theme.color}
          position={theme.position}
          isActive={activeChat === theme.id}
          onClick={() => handleChatToggle(theme.id)}
        />
      ))}

      {/* Render the active chat window if there is one */}
      {activeChat && (
        <MarsChat
          theme={getActiveChatTheme()}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default ChatManager; 