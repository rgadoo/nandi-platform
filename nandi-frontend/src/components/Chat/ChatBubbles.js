import React from 'react';
import './ChatBubble.css';
import { FaBalanceScale, FaCompass } from 'react-icons/fa';
import { GiFlowerEmblem } from 'react-icons/gi';

/**
 * ChatBubbles - Component to display chat icons
 * 
 * @param {Object} props
 * @param {string} props.activeChat - ID of the currently active chat
 * @param {Function} props.onChatToggle - Function to call when a chat bubble is clicked
 */
const ChatBubbles = ({ activeChat, onChatToggle }) => {
  // Chat themes definition with icons
  const chatThemes = [
    {
      id: 'karma',
      name: 'Lumina ⚡',
      color: '#FF9800', // Vibrant Orange
      position: 'bottom',
      icon: FaBalanceScale // Balance scale icon for Wisdom & Life Choices
    },
    {
      id: 'dharma',
      name: 'Nova 🔮',
      color: '#4CAF50', // Deep Green
      position: 'middle',
      icon: FaCompass // Compass icon for Personal Growth & Purpose
    },
    {
      id: 'atma',
      name: 'Solis 🌿',
      color: '#3F51B5', // Deep Indigo
      position: 'top',
      icon: GiFlowerEmblem // Lotus flower icon for Mindfulness & Inner Peace
    }
  ];

  return (
    <div className="side-chat-icons">
      {chatThemes.map((theme) => {
        const IconComponent = theme.icon;
        return (
          <button
            key={theme.id}
            className={`chat-icon-button ${theme.id} ${activeChat === theme.id ? 'active' : ''}`}
            style={{ 
              backgroundColor: theme.color,
              opacity: activeChat && activeChat !== theme.id ? 0.4 : 0.7, // Dim non-active chats
            }}
            onClick={() => onChatToggle(theme.id === activeChat ? null : theme.id)}
            aria-label={`${activeChat === theme.id ? 'Close' : 'Open'} ${theme.name}`}
            title={theme.name}
          >
            <div className="chat-icon">
              <IconComponent />
            </div>
          </button>
        )
      })}
    </div>
  );
};

export default ChatBubbles; 