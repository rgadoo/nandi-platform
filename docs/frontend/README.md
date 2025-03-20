# Nandi Frontend Documentation

## Overview
The Nandi frontend is a React-based application that provides a spiritual wellness platform featuring various components including personalized chat experiences, meditation tools, and personal growth resources. The application is designed with a clay-morphism aesthetic and features responsive design for both desktop and mobile users.

## Table of Contents
1. [Project Structure](#project-structure)
2. [Key Components](#key-components)
3. [Design System](#design-system)
4. [Chat System](#chat-system)
5. [Routing and Navigation](#routing-and-navigation)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Environment Configuration](#environment-configuration)
9. [Build and Deployment](#build-and-deployment)
10. [Component Documentation](#component-documentation)

## Project Structure
The Nandi frontend follows a component-based architecture with the following directory structure:

```
/nandi-frontend
├── public/                # Static assets and HTML template
│   └── images/            # Public images including avatars
├── src/                   # Source code
│   ├── assets/            # Internal assets
│   ├── components/        # React components
│   │   ├── Chat/          # Chat-related components
│   │   ├── DharmaPath/    # DharmaPath feature components
│   │   ├── Home/          # Home page components
│   │   ├── KarmaCafe/     # KarmaCafe feature components
│   │   ├── Layout/        # Shared layout components
│   │   ├── SoulQuest/     # SoulQuest feature components
│   │   └── WisdomPets/    # WisdomPets feature components
│   ├── images/            # Image assets
│   ├── services/          # API and services
│   ├── utils/             # Utility functions
│   ├── App.js             # Main App component
│   ├── index.js           # Application entry point
│   └── ...
├── package.json           # Dependencies and scripts
└── ...
```

## Key Components

### Home Component
The Home component serves as the main dashboard and entry point for users. It features:
- A breathe animation for mindfulness
- Daily meditation tracking
- Access to all main features
- Chat bubbles for quick access to AI chat personas

### Chat System
The chat system consists of multiple components:
- **Chat.js**: Main controller for chat functionality
- **ChatBubbles.js**: Floating bubbles that users can click to start a chat
- **NandiChatWindow.js**: The chat interface where conversations happen

### Feature Components
- **DharmaPath**: Tools for exploring personal purpose and life direction
- **KarmaCafe**: Resources for understanding action and consequence
- **SoulQuest**: Journey-based personal growth tools
- **WisdomPets**: Virtual companions that provide spiritual guidance

## Design System
The application follows a clay-morphism design aesthetic with:
- Soft, rounded buttons and containers
- Subtle shadows for depth
- Semi-transparent elements
- Earth-tone color palette
- Responsive design for all device sizes

### Color Palette
- **Karma/Lumina**: #FF9800 (Vibrant Orange)
- **Dharma/Nova**: #4CAF50 (Deep Green)
- **Atma/Solis**: #3F51B5 (Deep Indigo)
- **Background**: Brown gradient with subtle texture
- **Text**: White or light beige for dark backgrounds, dark brown for light backgrounds

## Chat System
The chat system is a central feature of the Nandi platform, offering AI-powered spiritual guidance through three distinct personas:

### Chat Personas
1. **Lumina ⚡ (formerly Karma)**: Focuses on Wisdom & Life Choices, guiding decisions through clarity and insight
2. **Nova 🔮 (formerly Dharma)**: Focuses on Personal Growth & Purpose, helping users explore and find their path
3. **Solis 🌿 (formerly Atma)**: Focuses on Mindfulness & Inner Peace, encouraging calm, clarity, and balance

### Chat Implementation
- Chat bubbles appear on the home screen for easy access
- Each chat persona has a unique welcome message and conversation style
- Conversations are maintained in state during a session
- Mobile-optimized interface with keyboard awareness
- Smooth animations for chat windows and messages

## Routing and Navigation
The application uses React Router (v6) for navigation with the following routes:
- `/`: Home dashboard
- `/soul/*`: SoulQuest feature
- `/pets/*`: WisdomPets feature
- `/dharma`: DharmaPath feature
- `/karma`: KarmaCafe feature

## State Management
The application uses React hooks for state management:
- `useState` for component-level state
- `useEffect` for side effects and lifecycle management
- Local state for UI interactions and form inputs
- No global state management library is currently implemented

## API Integration
The application is prepared for backend integration with:
- API service modules in the `services` directory
- Mock data for development in `mockData.js`
- Environment-specific configuration

## Environment Configuration
The application uses environment variables for configuration:
- Development variables in `.env.development`
- Production variables in `.env.production`
- Environment utility in `utils/envConfig.js`

## Build and Deployment
The project uses standard Create React App scripts:
- `npm start`: Development server
- `npm run build`: Production build
- `npm test`: Run tests
- `npm run eject`: Eject from Create React App

## Component Documentation
Detailed documentation for each component can be found in the individual component documentation files:
- [Chat Components](./components/chat.md)
- [Home Component](./components/home.md)
- [Feature Components](./components/features.md)
- [Layout Components](./components/layout.md) 