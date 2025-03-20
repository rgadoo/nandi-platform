# Chat Component Documentation

## Overview

The Chat component is a core feature of the Nandi application, enabling users to interact with spiritual personas (Karma, Dharma, and Atma) for guidance and personal growth. The component implements clay-morphism styling for a soft, organic feel and is fully responsive across all device sizes.

## Component Structure

The Chat feature consists of several interconnected components:

```
Chat/
├── ChatContainer.tsx       # Main container component
├── ChatHeader.tsx          # Header with persona selection
├── MessageList.tsx         # Scrollable message container
├── ChatMessage.tsx         # Individual message bubbles
├── ChatInput.tsx           # Message input and send controls
├── PersonaSelector.tsx     # Interface for switching personas
└── styles/
    ├── ChatStyles.ts       # Styled components
    └── animations.ts       # Animation definitions
```

## Usage

```tsx
import { ChatContainer } from '@/components/Chat/ChatContainer';

// Basic usage
<ChatContainer userId="user123" />

// With specific persona pre-selected
<ChatContainer userId="user123" initialPersona="karma" />

// With history mode enabled
<ChatContainer userId="user123" showHistory={true} />
```

## Props Interface

### ChatContainer Props

```tsx
interface ChatContainerProps {
  userId: string;                       // Required user identifier
  initialPersona?: 'karma' | 'dharma' | 'atma';  // Optional starting persona
  showHistory?: boolean;                // Whether to show conversation history
  className?: string;                   // Optional custom styling
  onMessageSent?: (message: MessageType) => void;  // Optional callback
}
```

### ChatMessage Props

```tsx
interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'persona';
    persona?: 'karma' | 'dharma' | 'atma';
    timestamp: Date;
    status: 'sending' | 'sent' | 'delivered' | 'read';
    media?: {
      type: 'image' | 'audio' | 'video';
      url: string;
    }[];
  };
  isLatest?: boolean;
}
```

## Clay-morphism Styling Implementation

The chat component uses clay-morphism styling principles to create a soft, tactile aesthetic. Following the [Clay-morphism UI Guidelines](/docs/Clay-morphism-UI-Guidelines.md), we've implemented:

### Chat Bubbles

```tsx
// In ChatStyles.ts
export const MessageBubble = styled.div<{
  isOutgoing: boolean;
  persona?: 'karma' | 'dharma' | 'atma';
}>`
  /* Base styling */
  background: ${({ isOutgoing }) => 
    isOutgoing 
      ? 'linear-gradient(145deg, #e8f0ff, #d8e8ff)'
      : 'linear-gradient(145deg, #f8f8f8, #efefef)'};
  border-radius: 18px;
  padding: 12px 16px;
  max-width: 80%;
  margin-bottom: 8px;
  position: relative;
  
  /* Clay effect */
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.05), 
              inset -2px -2px 5px rgba(0, 0, 0, 0.05), 
              inset 2px 2px 5px rgba(255, 255, 255, 0.7);
  
  /* Subtle texture */
  background-image: url('/assets/textures/noise.png');
  background-size: 200px;
  background-repeat: repeat;
  background-blend-mode: overlay;
  background-opacity: 0.03;
  
  /* Alignment */
  ${({ isOutgoing }) => isOutgoing 
    ? 'margin-left: auto; margin-right: 8px;' 
    : 'margin-right: auto; margin-left: 8px;'}
  
  /* Persona-specific styling */
  ${({ persona }) => {
    if (persona === 'karma') {
      return 'background: linear-gradient(145deg, #fff6e8, #ffedd8);';
    } else if (persona === 'dharma') {
      return 'background: linear-gradient(145deg, #f2fcf2, #e8f8e8);';
    } else if (persona === 'atma') {
      return 'background: linear-gradient(145deg, #f5f0ff, #efe5ff);';
    }
    return '';
  }}
  
  /* Transition for hover effects */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.07), 
                inset -2px -2px 5px rgba(0, 0, 0, 0.05), 
                inset 2px 2px 5px rgba(255, 255, 255, 0.7);
  }
`;
```

### Input Field

```tsx
export const ChatInputContainer = styled.div`
  /* Base styling */
  background: linear-gradient(145deg, #f5f5f5, #ececec);
  border-radius: 16px;
  padding: 12px;
  margin-top: 8px;
  
  /* Clay effect */
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.05), 
              -5px -5px 10px rgba(255, 255, 255, 0.8);
`;

export const MessageInput = styled.textarea`
  /* Base styling */
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  resize: none;
  background-color: #f5f5f5;
  
  /* Clay effect - inset */
  box-shadow: inset 3px 3px 7px rgba(0, 0, 0, 0.1), 
              inset -3px -3px 7px rgba(255, 255, 255, 0.7);
  
  &:focus {
    outline: none;
    box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.1), 
                inset -4px -4px 8px rgba(255, 255, 255, 0.7),
                0 0 0 3px rgba(255, 167, 38, 0.2);
  }
`;
```

### Send Button

```tsx
export const SendButton = styled.button`
  /* Base styling */
  background: linear-gradient(145deg, #ffb74d, #ffa726);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  /* Clay effect */
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1), 
              -5px -5px 10px rgba(255, 255, 255, 0.1);
  
  /* Transition for interactive effects */
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1), 
                -6px -6px 12px rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    transform: translateY(1px);
    background: linear-gradient(145deg, #ffa726, #ffb74d);
    box-shadow: inset 3px 3px 7px rgba(0, 0, 0, 0.1), 
                inset -3px -3px 7px rgba(255, 255, 255, 0.1);
  }
`;
```

## Mobile Responsiveness

The Chat component is designed to be fully responsive across all device sizes, with special considerations for mobile interfaces.

### Responsive Layout Implementation

```tsx
// In ChatStyles.ts
export const ChatContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  background: #f8f8f8;
  
  @media (min-width: 768px) {
    max-width: 680px;
    height: 80vh;
    margin: 48px auto;
    border-radius: 24px;
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.05), 
                -10px -10px 20px rgba(255, 255, 255, 0.8);
  }
`;

export const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  
  /* Optimize scrolling for mobile */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`;

export const ChatInputWrapper = styled.div`
  padding: 8px 16px 16px;
  position: sticky;
  bottom: 0;
  background: #f8f8f8;
  
  @media (min-width: 768px) {
    padding: 16px 24px 24px;
  }
  
  /* Extra padding for iPhone X and newer */
  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    padding-bottom: calc(16px + env(safe-area-inset-bottom));
    
    @media (min-width: 768px) {
      padding-bottom: 24px;
    }
  }
`;
```

### Mobile-Specific Optimizations

1. **Reduced Shadow Size for Mobile**

```tsx
export const MessageBubble = styled.div<{ isOutgoing: boolean }>`
  /* Base styling and other properties */
  
  /* Responsive shadow adjustment */
  @media (max-width: 767px) {
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.05), 
                inset -1px -1px 3px rgba(0, 0, 0, 0.05), 
                inset 1px 1px 3px rgba(255, 255, 255, 0.7);
                
    &:hover {
      box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.07), 
                  inset -1px -1px 3px rgba(0, 0, 0, 0.05), 
                  inset 1px 1px 3px rgba(255, 255, 255, 0.7);
    }
  }
`;
```

2. **Keyboard Management for Mobile**

```tsx
// In ChatInput.tsx
useEffect(() => {
  function handleResize() {
    // Check if viewport height changed (keyboard appeared)
    if (window.innerHeight < window.visualViewport.height) {
      // Scroll to bottom when keyboard appears
      messageListRef.current?.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
  
  window.visualViewport?.addEventListener('resize', handleResize);
  return () => window.visualViewport?.removeEventListener('resize', handleResize);
}, []);
```

3. **Touch-Optimized Controls**

```tsx
export const VoiceMessageButton = styled.button`
  /* Base styling */
  width: 44px;
  height: 44px;
  border-radius: 50%;
  /* Clay styling properties */
  
  /* Ensure touch target size meets accessibility standards */
  @media (max-width: 767px) {
    &::before {
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
    }
  }
`;
```

## Animation Implementation

The chat uses subtle animations for a more engaging experience.

```tsx
// In animations.ts
import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const typingIndicator = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

// Usage in MessageBubble
export const MessageBubble = styled.div<{ isOutgoing: boolean }>`
  /* Other styling properties */
  
  animation: ${fadeIn} 0.3s ease forwards;
  
  /* Accessible animations - respect user preferences */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transition: none;
  }
`;
```

## Accessibility Features

The Chat component implements several accessibility features:

1. **Keyboard Navigation**

```tsx
// In ChatInput.tsx
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
};

// In component JSX
<MessageInput 
  value={message} 
  onChange={(e) => setMessage(e.target.value)}
  onKeyDown={handleKeyDown}
  aria-label="Type a message"
  placeholder="Type a message..."
/>
```

2. **Screen Reader Support**

```tsx
// In MessageList.tsx
<div 
  role="log"
  aria-live="polite"
  aria-atomic="false"
  aria-relevant="additions"
  aria-label="Chat messages"
>
  {messages.map((message) => (
    <ChatMessage 
      key={message.id} 
      message={message} 
      aria-label={`${message.sender === 'user' ? 'You' : message.persona}: ${message.text}`}
    />
  ))}
</div>
```

3. **Focus Management**

```tsx
// In ChatInput.tsx
const inputRef = useRef<HTMLTextAreaElement>(null);

// Auto-focus input when personas change
useEffect(() => {
  inputRef.current?.focus();
}, [activePersona]);

// In component JSX
<MessageInput 
  ref={inputRef}
  /* other props */
/>
```

## API Integration

The Chat component connects to the Nandi backend API for message processing:

```tsx
// In ChatContainer.tsx
const sendMessage = async (text: string) => {
  // Create optimistic update
  const tempId = `temp-${Date.now()}`;
  const newMessage = {
    id: tempId,
    text,
    sender: 'user',
    timestamp: new Date(),
    status: 'sending'
  };
  
  setMessages(prev => [...prev, newMessage]);
  
  try {
    // Send to API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        personaId: activePersona,
        message: text
      })
    });
    
    const data = await response.json();
    
    // Update message status and add response
    setMessages(prev => [
      ...prev.map(m => m.id === tempId ? { ...m, id: data.userMessageId, status: 'delivered' } : m),
      {
        id: data.responseId,
        text: data.responseText,
        sender: 'persona',
        persona: activePersona,
        timestamp: new Date(),
        status: 'delivered'
      }
    ]);
  } catch (error) {
    // Handle error
    setMessages(prev => 
      prev.map(m => m.id === tempId ? { ...m, status: 'error' } : m)
    );
    // Show error toast or notification
  }
};
```

## Performance Optimizations

1. **Virtualized Message List**

For conversations with many messages, we implement virtualized rendering to maintain performance:

```tsx
// In MessageList.tsx
import { FixedSizeList as List } from 'react-window';

const MessageList = ({ messages }) => {
  // Only use virtualization for large message lists
  if (messages.length > 50) {
    return (
      <List
        height={500}
        width="100%"
        itemCount={messages.length}
        itemSize={80} // Approximate height, can be dynamic
        itemData={messages}
      >
        {({ index, style, data }) => (
          <div style={style}>
            <ChatMessage message={data[index]} />
          </div>
        )}
      </List>
    );
  }
  
  // Regular rendering for smaller lists
  return (
    <div>
      {messages.map(message => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
};
```

2. **Debouncing Typing Indicator**

```tsx
// In ChatInput.tsx
const [isTyping, setIsTyping] = useState(false);

const debouncedTypingStatus = useCallback(
  debounce(() => {
    setIsTyping(false);
  }, 1500),
  []
);

const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  setMessage(e.target.value);
  
  // Only update typing status if it's not already set
  if (!isTyping) {
    setIsTyping(true);
    // Notify API about typing status if needed
  }
  
  // Reset typing status after delay
  debouncedTypingStatus();
};
```

3. **Image Optimization**

```tsx
// In ChatMessage.tsx when rendering image media
{message.media?.map(media => (
  media.type === 'image' && (
    <div key={media.url} className="media-container">
      <img 
        src={media.url} 
        alt="Shared image"
        loading="lazy"
        width="250"
        height="auto"
        onLoad={() => scrollToBottom()}
      />
    </div>
  )
))}
```

## Testing

The Chat component has comprehensive tests:

```tsx
// In Chat.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatContainer } from './ChatContainer';

// Mock the API response
jest.mock('next/fetch', () => ({
  fetch: jest.fn(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        userMessageId: '123',
        responseId: '456',
        responseText: 'Hello from Karma'
      })
    })
  )
}));

describe('ChatContainer', () => {
  test('renders the chat interface', () => {
    render(<ChatContainer userId="user123" />);
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument();
  });
  
  test('sends a message and displays the response', async () => {
    render(<ChatContainer userId="user123" initialPersona="karma" />);
    
    const input = screen.getByPlaceholderText(/type a message/i);
    userEvent.type(input, 'Hello Karma');
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    
    // Check that the user message appears
    expect(screen.getByText('Hello Karma')).toBeInTheDocument();
    
    // Wait for the response
    await waitFor(() => {
      expect(screen.getByText('Hello from Karma')).toBeInTheDocument();
    });
  });
  
  test('renders correctly on mobile viewport', () => {
    // Mock a mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    window.dispatchEvent(new Event('resize'));
    
    render(<ChatContainer userId="user123" />);
    
    // Check for mobile-specific UI elements or styles
    const container = screen.getByTestId('chat-container');
    expect(container).toHaveStyle('width: 100%');
  });
});
```

## Future Enhancements

1. **Voice Message Support**

```tsx
// Planned implementation in ChatInput.tsx
const [isRecording, setIsRecording] = useState(false);
const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
const mediaRecorderRef = useRef<MediaRecorder | null>(null);

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    const audioChunks: BlobPart[] = [];
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      setAudioBlob(audioBlob);
      // Upload and send as a message
    };
    
    mediaRecorder.start();
    setIsRecording(true);
  } catch (error) {
    console.error('Error accessing microphone:', error);
  }
};
```

2. **Message Reactions**

```tsx
// Planned implementation in ChatMessage.tsx
interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

// In component JSX
<div className="message-reactions">
  {message.reactions?.map(reaction => (
    <button 
      key={reaction.emoji} 
      className="reaction-button"
      onClick={() => addReaction(message.id, reaction.emoji)}
    >
      {reaction.emoji} {reaction.count}
    </button>
  ))}
  <button className="add-reaction-button" onClick={() => openReactionPicker(message.id)}>
    <span role="img" aria-label="Add reaction">➕</span>
  </button>
</div>
```

## Resources

- [Clay-morphism UI Guidelines](/docs/Clay-morphism-UI-Guidelines.md)
- [Design Mockups](/design/mockups/chat)
- [API Documentation](/docs/api/chat-endpoints.md)
- [Component Testing Guide](/docs/testing/component-tests.md) 