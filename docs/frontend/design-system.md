# CSS and Design System Documentation

## Overview
The Nandi application utilizes a cohesive design system based on clay-morphism aesthetics, natural colors, and immersive experiences. This document outlines the key components of the design system, CSS architecture, and styling guidelines.

## Design Philosophy

### Clay-morphism
The application uses a clay-like aesthetic that creates a sense of physical, touchable elements:
- Soft, rounded shapes with gentle shadows
- Tactile, pressable buttons that respond to interaction
- Earthy colors that evoke natural materials
- Subtle depth effects that create visual hierarchy

### Earth-Tone Palette
The color palette is inspired by natural earth tones:
- **Primary**: Clay brown (#b17d4a)
- **Secondary**: Warm orange (#ff9800)
- **Background**: Deep charcoal with transparency
- **Text**: Light ivory for dark backgrounds, deep brown for light areas
- **Accents**: Golden highlights for important elements

### Immersive Experience
The design creates an immersive, focused environment:
- Subtle background textures that suggest natural materials
- Minimal distractions to maintain focus on content
- Breathing animations that encourage mindfulness
- Responsive elements that adapt to user interactions

## CSS Architecture

### File Organization
The CSS is organized into several categories:
- **Global Styles**: `src/index.css`
- **Component-Specific Styles**: Co-located with components (e.g., `Home.css`)
- **Utility Classes**: Shared across components
- **Animation Definitions**: Centralized animation keyframes

### CSS Variables
CSS variables are used to maintain consistency:

```css
:root {
  /* Colors */
  --primary-color: #b17d4a;
  --secondary-color: #ff9800;
  --text-light: #f5f5f5;
  --text-dark: #333;
  --card-bg: rgba(30, 30, 30, 0.7);
  --nandi-brown: #b17d4a;
  --nandi-light: #e6c9a8;
  --nandi-accent: #ff9800;
  
  /* Shadows */
  --shadow-soft: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 6px 12px rgba(0, 0, 0, 0.15);
  --shadow-strong: 0 10px 20px rgba(0, 0, 0, 0.2);
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-circle: 50%;
}
```

### Media Queries
Consistent breakpoints are used for responsive design:

```css
/* Mobile (base styles) */
.component { /* Base styles */ }

/* Tablet */
@media (min-width: 768px) {
  .component { /* Tablet styles */ }
}

/* Desktop */
@media (min-width: 1024px) {
  .component { /* Desktop styles */ }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .component { /* Large desktop styles */ }
}
```

## Components

### Buttons
Buttons follow clay-morphism principles:
- Soft, pressable appearance
- Visual feedback on hover and press
- Consistent padding and border-radius
- Clear visual hierarchy (primary, secondary, tertiary)

```css
.clay-button {
  background: var(--primary-color);
  color: var(--text-light);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  box-shadow: var(--shadow-soft);
  transition: all 0.2s ease;
}

.clay-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.clay-button:active {
  transform: translateY(1px);
  box-shadow: var(--shadow-soft);
}
```

### Cards
Cards are used as content containers:
- Semi-transparent backgrounds
- Consistent padding and margins
- Clay-like appearance with subtle shadows
- Responsive sizing

```css
.clay-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-medium);
  margin-bottom: var(--spacing-lg);
}
```

### Input Fields
Form inputs maintain the clay-like aesthetic:
- Subtle backgrounds
- Clear focus states
- Consistent height and padding
- Placeholder text styling

```css
.clay-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-light);
  height: 40px;
}

.clay-input:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.3);
}
```

## Animations

### Breathing Animation
Used for meditation and focus features:

```css
@keyframes breathe {
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
}

.breathing-element {
  animation: breathe 4s infinite ease-in-out;
}
```

### Transition Effects
Consistent transitions for interactive elements:

```css
.transition-element {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### Page Transitions
Smooth transitions between routes:

```css
.page-enter {
  opacity: 0;
  transform: translateY(10px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms, transform 300ms;
}

.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity 300ms;
}
```

## Layout

### Container System
Consistent container sizing:

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    padding: 0 var(--spacing-lg);
  }
}
```

### Grid System
Flexible grid system based on CSS Grid:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(12, 1fr);
  }
}
```

### Flex Layouts
Common flex patterns:

```css
.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## Typography

### Font Family
The application uses a consistent font stack:

```css
body {
  font-family: 'Nunito', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
```

### Type Scale
A consistent typographic scale:

```css
:root {
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-md: 1rem;      /* 16px */
  --font-size-lg: 1.25rem;   /* 20px */
  --font-size-xl: 1.5rem;    /* 24px */
  --font-size-2xl: 2rem;     /* 32px */
  --font-size-3xl: 2.5rem;   /* 40px */
}
```

### Font Weights
Standard font weights:

```css
:root {
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semi-bold: 600;
  --font-weight-bold: 700;
}
```

## Icons and Images

### Icon System
Consistent icon usage:
- React Icons library for most UI icons
- Custom SVG icons for brand-specific elements
- Consistent sizing and coloring

### Background Images
Guidelines for background images:
- Optimized for performance (WebP format where possible)
- Low opacity to maintain text contrast
- Subtle patterns that don't distract from content
- Responsive loading for different screen sizes

## Accessibility

### Color Contrast
All text meets WCAG 2.1 AA standards for contrast:
- Regular text: 4.5:1 minimum contrast ratio
- Large text: 3:1 minimum contrast ratio

### Focus States
Clear focus indicators for keyboard navigation:

```css
:focus {
  outline: 2px solid var(--secondary-color);
  outline-offset: 2px;
}
```

### Screen Reader Support
Semantic HTML and ARIA attributes ensure screen reader compatibility:
- Meaningful alt text for images
- ARIA labels for interactive elements
- Proper heading hierarchy
- Skip-to-content links

## Implementation Examples

### Chat Bubbles
Example of clay-morphism styling for chat bubbles:

```css
.chat-bubble {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  box-shadow: var(--shadow-soft);
  max-width: 75%;
}

.chat-bubble.user {
  background: rgba(177, 125, 74, 0.3);
  align-self: flex-end;
  border-bottom-right-radius: var(--radius-sm);
}

.chat-bubble.ai {
  background: rgba(255, 152, 0, 0.2);
  align-self: flex-start;
  border-bottom-left-radius: var(--radius-sm);
}
```

### Feature Cards
Example of feature cards on the home screen:

```css
.feature-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-medium);
  transition: all 0.3s ease;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-strong);
}

.feature-card-title {
  color: var(--text-light);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semi-bold);
  margin-bottom: var(--spacing-sm);
}

.feature-card-icon {
  font-size: 2rem;
  color: var(--secondary-color);
  margin-bottom: var(--spacing-sm);
}
```

## Future Enhancements

### Dark/Light Mode
Plans for theme switching capabilities:
- Toggle between light and dark themes
- Preserve user preferences
- Automatic switching based on device settings

### Design System Documentation
Development of a standalone design system:
- Component library with examples
- Interactive documentation
- Copy-paste code snippets
- Visual design guidelines

### Improved Animations
Enhanced animation capabilities:
- More performant animations using CSS Houdini
- Reduced motion options for accessibility
- More complex interaction patterns
- Spring-based animations for natural movement

### Design Tokens
Structured design tokens:
- JSON-based design token system
- Build-time compilation
- Platform-specific token outputs
- Designer-developer handoff improvements 