import React, { useState, useEffect } from 'react';
import ChatBubbles from './ChatBubbles';
import NandiChatWindow from './NandiChatWindow';

// Define the chat themes with modern names and updated descriptions
const CHAT_THEMES = [
  {
    id: 'karma',
    name: 'Lumina',
    color: '#FF9800', // Vibrant Orange
    position: 'bottom',
    description: 'Wisdom & Life Choices',
    themeDescription: 'Guides decisions through clarity & insight',
    avatarImage: '/images/chat-avatars/karma-avatar.png'
  },
  {
    id: 'dharma',
    name: 'Nova',
    color: '#4CAF50', // Deep Green
    position: 'middle',
    description: 'Personal Growth & Purpose',
    themeDescription: 'Helps users explore and find their path',
    avatarImage: '/images/chat-avatars/wisdom-avatar.png'
  },
  {
    id: 'atma',
    name: 'Solis',
    color: '#3F51B5', // Deep Indigo
    position: 'top',
    description: 'Mindfulness & Inner Peace',
    themeDescription: 'Encourages calm, clarity, and balance',
    avatarImage: '/images/chat-avatars/meditation-avatar.png'
  }
];

/**
 * Chat - Component that showcases the chat functionality
 * with clay-like design
 */
const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messageHistories, setMessageHistories] = useState({});
  
  // Initialize message histories
  useEffect(() => {
    const initialHistories = {};
    CHAT_THEMES.forEach(theme => {
      if (!messageHistories[theme.id]) {
        let welcomeMessage = '';
        
        // Set specific welcome message based on chat theme ID
        if (theme.id === 'karma') {
          welcomeMessage = "Your choices shape your story. Big or small, they all matter. What's on your mind?";
        } else if (theme.id === 'dharma') {
          welcomeMessage = "Every journey starts with a step. Need clarity, direction, or just exploring?";
        } else if (theme.id === 'atma') {
          welcomeMessage = "Pause for a moment. What's been weighing on your mind?";
        }
        
        initialHistories[theme.id] = [
          {
            id: 1,
            message: welcomeMessage,
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
    
    // Add or remove a class to the body to control nav bar visibility on mobile
    if (chatId && chatId !== activeChat) {
      document.body.classList.add('chat-active');
    } else {
      document.body.classList.remove('chat-active');
    }
    
    // Prevent home page shift by making sure the chat window doesn't
    // affect the layout of other elements
    document.body.style.overflow = chatId ? 'hidden' : '';
  };

  // Create a dedicated function for closing the chat to ensure proper cleanup
  const handleCloseChat = () => {
    // Set active chat to null
    setActiveChat(null);
    
    // Remove the chat-active class from the body
    document.body.classList.remove('chat-active');
    
    // Reset overflow style
    document.body.style.overflow = '';
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
          onClose={handleCloseChat} // Use the enhanced close handler
          messages={messageHistories[activeChat] || []}
          onMessagesUpdate={handleMessagesUpdate}
        />
      )}
    </div>
  );
};

export default Chat; 