# KarmaCafe Component Documentation

## Overview
KarmaCafe was a chat interface component that provided users with a themed conversation experience. It has been replaced by the new Chat system with multiple themed chat bubbles.

## Features (Deprecated)
- Theme selection for conversation styling
- Mock data responses based on conversational context
- Mobile-responsive design

## Replacement
The KarmaCafe component has been replaced by the new multi-themed Chat system, which offers:
- Multiple chat themes (Karma, Wisdom, Meditation)
- Enhanced UI with floating chat bubbles
- Better mobile experience
- Themed avatars and responses
- Framework for API integration

## Key Files (Removed)
- `src/components/KarmaCafe/KarmaCafe.js` - Main component
- `src/components/KarmaCafe/KarmaCafe.css` - Styling
- `src/components/KarmaCafe/ChatActions.js` - Chat action buttons
- `src/components/KarmaCafe/ChatBubble.js` - Message bubbles
- `src/components/KarmaCafe/InputArea.js` - Text input area
- `src/components/KarmaCafe/ThemeSelector.js` - Theme selection
- `src/components/KarmaCafe/mockData.js` - Mock responses

## Migration
Any code that was previously using KarmaCafe should be updated to use the new Chat system components:
- `src/components/Chat/ChatManager.js`
- `src/components/MarsChat/MarsChat.js`

## Routes
The following routes have been removed:
- `/karma`
- `/karma/:avatarId` 