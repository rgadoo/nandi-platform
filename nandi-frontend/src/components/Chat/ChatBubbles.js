import React from 'react';
import './ChatBubble.css';

/**
 * ChatBubbles - Component to display chat icons with clay-like styling
 * 
 * @param {Object} props
 * @param {string} props.activeChat - ID of the currently active chat
 * @param {Function} props.onChatToggle - Function to call when a chat bubble is clicked
 */
const ChatBubbles = ({ activeChat, onChatToggle }) => {
  // Chat themes definition with updated colors
  const chatThemes = [
    {
      id: 'karma',
      name: 'Karma Chat',
      color: '#FF9800', // Vibrant Orange
      position: 'bottom'
    },
    {
      id: 'dharma',
      name: 'Dharma Chat',
      color: '#4CAF50', // Deep Green
      position: 'middle'
    },
    {
      id: 'atma',
      name: 'Atma Chat',
      color: '#3F51B5', // Deep Indigo
      position: 'top'
    }
  ];

  return (
    <div className="side-chat-icons">
      {chatThemes.map((theme) => (
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
          {/* Empty chat bubble - no icon */}
        </button>
      ))}
    </div>
  );
};

export default ChatBubbles; 