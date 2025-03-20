# Layout Components Documentation

## Overview
The layout components in the Nandi application provide consistent structure and navigation across the platform. These components control the overall page layout, navigation, and shared UI elements.

## Navbar Component

### Purpose
The Navbar component provides navigation across the main sections of the application, allowing users to move between different features.

### Implementation
- **Location**: `src/components/Layout/Navbar.js`
- **Styling**: `src/components/Layout/Navbar.css`

### Features
- Displays navigation links with icons and labels
- Highlights the active route
- Responsive design that adapts to different screen sizes
- Uses React Router's NavLink for navigation

### Visual Design
- Clean, minimal navigation bar
- Icon-based navigation with supporting text
- Active state highlighting
- Clay-morphism styling consistent with the application

### Code Structure
```jsx
// Example of Navbar component structure
<NavLink
  to="/"
  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
>
  <span className="nav-icon">🏠</span>
  <span className="nav-label">Home</span>
</NavLink>
```

### Navigation Items
The Navbar includes links to:
- Home (main dashboard)
- SoulQuest (spiritual journeys)
- WisdomPets (virtual companions)
- Chat (direct access to chat interface)
- UI Demo (design system examples)

### Mobile Considerations
- Bottom-positioned on mobile devices
- Easily accessible with thumbs
- Collapses or hides when a chat is active
- Simplified icons for smaller screens

## Common Layout Patterns

### Phone Frame
Many components use a phone frame layout to create a consistent containment for content:
- Rounded corners
- Subtle border
- Content scrolls within the frame
- Fixed header and navigation elements

### Card System
The layout employs a card-based system for content:
- Consistent card styling across components
- Cards serve as containers for features and content
- Standardized spacing and margins
- Responsive card layouts that adapt to screen sizes

### Header Areas
Most pages include a structured header area:
- Page title
- Back navigation when appropriate
- Action buttons
- Status information

### Shared CSS Variables
The layout uses a system of CSS variables for consistency:
```css
:root {
  --primary-color: #b17d4a;
  --secondary-color: #ff9800;
  --text-light: #f5f5f5;
  --text-dark: #333;
  --card-bg: rgba(30, 30, 30, 0.7);
  --nandi-brown: #b17d4a;
  --nandi-light: #e6c9a8;
  --nandi-accent: #ff9800;
}
```

## Responsive Design System

### Breakpoints
The layout uses consistent breakpoints for responsive design:
- Mobile: Up to 767px
- Tablet: 768px to 1023px
- Desktop: 1024px and above

### Mobile-First Approach
The layout is built with a mobile-first approach:
- Base styles target mobile devices
- Media queries enhance the layout for larger screens
- Essential functions are accessible on all device sizes

### Specific Adaptations
- Navigation changes position and style based on screen size
- Card layouts adjust from single column to multi-column
- Font sizes and spacing scale appropriately
- Touch targets are optimized for each device type

## Animation System
The layout includes a consistent animation system:
- Subtle transitions between states
- Breathing animations for mindfulness elements
- Hover and active state animations
- Page transition effects

## Accessibility Considerations
- Semantic HTML structure
- ARIA labels on interactive elements
- Sufficient color contrast
- Keyboard navigation support
- Focus indicators for interactive elements

## Future Layout Enhancements
- Theme switching capability (light/dark modes)
- User-customizable layouts
- Advanced animation options
- Enhanced keyboard navigation
- Internationalization support 