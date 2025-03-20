import React from 'react';
import './ChatBubble.css';

/**
 * ChatBubble component - a circular button that opens a themed chat
 * 
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the chat theme
 * @param {string} props.name - Display name of the chat
 * @param {React.ReactNode} props.icon - React icon component for the chat
 * @param {string} props.color - Background color for the chat bubble
 * @param {Function} props.onClick - Function to call when bubble is clicked
 * @param {boolean} props.isActive - Whether this chat is currently active
 * @param {string} props.position - Position of the bubble ('top-left', 'top-right', 'bottom-left', 'bottom-right')
 */
const ChatBubble = ({ id, name, icon, color, onClick, isActive, position }) => {
  // Determine position class
  const positionClass = `chat-bubble-${position || 'bottom-right'}`;
  
  return (
    <button
      className={`chat-bubble ${positionClass} ${isActive ? 'active' : ''}`}
      style={{ 
        backgroundColor: color || '#6b46c1',
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.2), 0 0 0 2px ${isActive ? color || '#6b46c1' : 'transparent'}`
      }}
      onClick={() => onClick(id)}
      aria-label={`Open ${name} chat`}
      title={name}
    >
      <span className="chat-bubble-icon">{icon}</span>
      {isActive && (
        <span className="chat-bubble-close" onClick={(e) => {
          e.stopPropagation();
          onClick(null);
        }}>
          ✕
        </span>
      )}
    </button>
  );
};

export default ChatBubble; 