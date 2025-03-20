# Chat Components Documentation

## Overview
The Chat system is a core feature of the Nandi platform, providing users with personalized spiritual guidance through AI-powered chat personas. Each persona offers unique insights and perspectives aligned with different spiritual aspects.

## Components Architecture

### 1. Chat.js
**Purpose**: Main controller component that manages the chat state and coordinates between chat bubbles and the chat window.

**Key Features**:
- Manages which chat is active
- Maintains message history for each chat persona
- Handles opening and closing of chat windows
- Provides appropriate theme data to child components

**State Management**:
- `activeChat`: Tracks which chat persona is currently active
- `messageHistories`: Stores conversation history for each chat persona

**Implementation Notes**:
- Uses React Hooks (useState, useEffect) for state management
- Initializes each chat with a personalized welcome message
- Prevents page scrolling when chat is active
- Manages body classes for mobile responsiveness

### 2. ChatBubbles.js
**Purpose**: Renders the floating chat bubbles that users can click to initiate a conversation.

**Key Features**:
- Displays themed chat bubbles with appropriate icons
- Positions bubbles at different locations on screen
- Provides visual feedback for active/inactive state
- Handles click events to open/close chats

**Props**:
- `activeChat`: Currently active chat (if any)
- `onChatToggle`: Function to call when a bubble is clicked

**Visual Elements**:
- Each bubble has a unique icon representing its persona
- Color coding matches the theme of each chat persona
- Animations for hover and active states
- Visual dimming of inactive bubbles when one is active

### 3. NandiChatWindow.js
**Purpose**: Renders the chat interface where conversations take place.

**Key Features**:
- Displays conversation history
- Provides input field for user messages
- Shows typing indicators
- Handles sending messages
- Supports closing the chat

**Props**:
- `theme`: Theme configuration for the active chat
- `onClose`: Function to call when closing the chat
- `messages`: Array of messages to display
- `onMessagesUpdate`: Function to call when messages change

**UI Components**:
- Chat title indicator
- Messages container with scrolling
- Message bubbles with sender avatars
- Typing indicator
- Input area with send button
- Close button

**Accessibility Features**:
- Proper ARIA labels for buttons
- Keyboard navigation support
- Mobile-specific optimizations

## Theme Structure
Each chat persona has the following theme properties:

```javascript
{
  id: 'karma',             // Unique identifier
  name: 'Lumina ⚡',        // Display name with emoji
  color: '#FF9800',        // Theme color
  position: 'bottom',      // Position on screen
  description: 'Wisdom & Life Choices',
  themeDescription: 'Guides decisions through clarity & insight',
  avatarImage: '/images/chat-avatars/karma-avatar.png'
}
```

## Persona-Specific Welcome Messages

Each chat persona has a unique welcome message that sets the tone for the conversation:

**Lumina ⚡ (Wisdom & Life Choices)**:
> "Life is full of choices. Some are small, some are big, but they all shape our path. What's on your mind today?"

**Nova 🔮 (Personal Growth & Purpose)**:
> "Every step forward starts with a question. Where are you headed? Let's figure it out together."

**Solis 🌿 (Mindfulness & Inner Peace)**:
> "Take a breath. You don't have to have all the answers right now. Let's take a moment to slow down and see things clearly."

## Mobile Responsiveness
The chat system includes specific optimizations for mobile use:

- Full-width chat window on small screens
- Adjusted sizing and positioning
- Keyboard awareness to avoid input field being hidden
- Hidden bottom navigation when chat is active on mobile
- Larger tap targets for mobile interaction

## Styling
The chat components use a combination of:
- CSS with clay-morphism styling
- Semi-transparent backgrounds with backdrop filters
- Transition animations for smooth user experience
- Theme-specific colors and styling
- Responsive design with media queries

## Future Enhancements
Potential areas for enhancement include:
- Integration with backend AI services
- Persistent message storage
- Multiple conversation threads per persona
- Rich media support in chat
- User authentication and personalized experiences 