# Utilities and Services Documentation

## Overview
The Nandi application uses a collection of utility functions and service modules to handle common tasks, API interactions, and cross-component functionality. These modules enable code reuse, separation of concerns, and maintainable architecture.

## API Services

### ChatService
**Location**: `src/services/ChatService.js`

Handles interactions with the chat backend:
- Message sending and receiving
- Chat history management
- Chat persona selection
- Error handling for network issues

```javascript
// Example usage
import { sendMessage, getChatHistory } from '../services/ChatService';

// Send a new message
sendMessage(chatId, message)
  .then(response => setResponse(response))
  .catch(error => handleError(error));

// Get chat history
getChatHistory(chatId)
  .then(history => setMessageHistory(history))
  .catch(error => handleError(error));
```

### AuthService
**Location**: `src/services/AuthService.js`

Manages user authentication and session handling:
- Login/logout functionality
- Token management
- Session persistence
- Authentication status checks

## Utility Functions

### DateUtils
**Location**: `src/utils/DateUtils.js`

Functions for date and time manipulation:
- Formatting dates for display
- Calculating time differences
- Generating day streaks for meditation tracking
- Timezone handling

### LocalStorageUtils
**Location**: `src/utils/LocalStorageUtils.js`

Utilities for interacting with browser local storage:
- Saving user preferences
- Caching chat histories
- Managing application state between sessions
- Handling storage quotas and errors

### ValidationUtils
**Location**: `src/utils/ValidationUtils.js`

Functions for input validation:
- Email format validation
- Password strength checking
- Form field validation
- Error message generation

### AnimationUtils
**Location**: `src/utils/AnimationUtils.js`

Utilities for managing animations:
- Breathing animation calculations
- Timing functions
- Animation state management
- Performance optimizations

## Context Providers

### ThemeContext
**Location**: `src/context/ThemeContext.js`

Provides theme-related data and functions:
- Current theme state
- Theme switching functionality
- Custom theme properties
- Theme persistence

```javascript
// Example usage in a component
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`container ${theme}`}>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <p>Current theme: {theme}</p>
    </div>
  );
}
```

### UserContext
**Location**: `src/context/UserContext.js`

Manages user-related state and functions:
- Current user information
- Authentication status
- User preferences
- Profile management

## Custom Hooks

### useMediaQuery
**Location**: `src/hooks/useMediaQuery.js`

A custom hook for responsive design:
- Detects screen size changes
- Provides boolean flags for different breakpoints
- Enables conditional rendering based on screen size

```javascript
// Example usage
import { useMediaQuery } from '../hooks/useMediaQuery';

function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop } = useMediaQuery();
  
  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  );
}
```

### useLocalStorage
**Location**: `src/hooks/useLocalStorage.js`

A custom hook for easier local storage interaction:
- Automatically serializes and deserializes JSON
- Provides React state integration with local storage
- Handles storage errors gracefully

### useChatState
**Location**: `src/hooks/useChatState.js`

Manages chat-related state:
- Message histories
- Active chat selection
- Typing indicators
- Error states

## Error Handling

### ErrorBoundary
**Location**: `src/components/ErrorBoundary.js`

A React error boundary component:
- Catches JavaScript errors in child components
- Prevents entire app crashes
- Displays fallback UI
- Reports errors to logging service

### ErrorLogger
**Location**: `src/utils/ErrorLogger.js`

Utilities for error logging:
- Standardized error formatting
- Integration with monitoring services
- Development vs. production error handling
- User feedback options

## Testing Utilities

### TestHelpers
**Location**: `src/utils/TestHelpers.js`

Utilities to assist with unit and integration testing:
- Mock data generation
- Test rendering helpers
- Common assertions
- Test cleanup functions

## Configuration Management

### Config
**Location**: `src/config/index.js`

Centralizes application configuration:
- Environment-specific settings
- Feature flags
- API endpoints
- Default values

```javascript
// Example configuration
export default {
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://api.nandi.app',
  features: {
    enableChatHistory: true,
    enableOfflineMode: false
  },
  defaults: {
    theme: 'light',
    language: 'en',
    meditationDuration: 300 // 5 minutes in seconds
  }
};
```

## Future Development

### Planned Utilities
- **Analytics Service**: For tracking user engagement and feature usage
- **Notification Service**: For managing in-app and push notifications
- **Internationalization Utils**: For multi-language support
- **Accessibility Helpers**: For enhancing app accessibility

### Enhancement Opportunities
- Converting more utility functions to custom hooks
- Adding typing with TypeScript
- Creating a comprehensive test suite for utilities
- Developing a utility documentation generator 