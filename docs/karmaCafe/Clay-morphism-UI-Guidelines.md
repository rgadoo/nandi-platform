# Clay-morphism UI Guidelines for Nandi

## Overview

Clay-morphism is a UI styling approach that mimics the appearance of molded clay or plasticity, providing depth and tactility to digital interfaces. For the Nandi application, we've adopted this aesthetic to create a warm, organic feel that aligns with our spiritual wellness focus.

## Key Characteristics

### Visual Properties

1. **Soft Shadows**
   - Outer shadow: `box-shadow: 7px 7px 14px rgba(0, 0, 0, 0.1);`
   - Inner shadow: `box-shadow: inset -7px -7px 14px rgba(255, 255, 255, 0.7), inset 7px 7px 14px rgba(0, 0, 0, 0.05);`

2. **Rounded Corners**
   - Border radius: `border-radius: 24px;` for large components
   - Border radius: `border-radius: 16px;` for medium components
   - Border radius: `border-radius: 12px;` for small components

3. **Neutral Base Colors**
   - Background: `background: linear-gradient(145deg, #f0f0f0, #e6e6e6);`
   - For colored elements, use desaturated tones with gradient

4. **Subtle Texture**
   - Add noise texture with low opacity: `background-image: url('/assets/textures/noise.png');`
   - Texture opacity: 2-5%

## Component-Specific Guidelines

### Chat Bubbles

```css
.chat-bubble {
  /* Base styling */
  background: linear-gradient(145deg, #f0f0f0, #e6e6e6);
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
}

.chat-bubble.outgoing {
  background: linear-gradient(145deg, #e8f0ff, #d8e8ff);
  margin-left: auto;
  margin-right: 8px;
}

.chat-bubble.incoming {
  background: linear-gradient(145deg, #f8f8f8, #efefef);
  margin-right: auto;
  margin-left: 8px;
}

/* Persona-specific styling */
.chat-bubble.karma {
  background: linear-gradient(145deg, #fff6e8, #ffedd8);
}

.chat-bubble.dharma {
  background: linear-gradient(145deg, #f2fcf2, #e8f8e8);
}

.chat-bubble.atma {
  background: linear-gradient(145deg, #f5f0ff, #efe5ff);
}
```

### Interactive Buttons

```css
.clay-button {
  /* Base styling */
  background: linear-gradient(145deg, #f0f0f0, #e6e6e6);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  color: #444;
  position: relative;
  transition: all 0.2s ease;
  
  /* Clay effect */
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1), 
              -5px -5px 10px rgba(255, 255, 255, 0.8);
}

.clay-button:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1), 
              -6px -6px 12px rgba(255, 255, 255, 0.8);
}

.clay-button:active {
  transform: translateY(1px);
  background: linear-gradient(145deg, #e6e6e6, #f0f0f0);
  box-shadow: inset 3px 3px 7px rgba(0, 0, 0, 0.1), 
              inset -3px -3px 7px rgba(255, 255, 255, 0.7);
}

/* Primary button variant */
.clay-button.primary {
  background: linear-gradient(145deg, #ffb74d, #ffa726);
  color: #fff;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1), 
              -5px -5px 10px rgba(255, 255, 255, 0.1);
}

.clay-button.primary:active {
  background: linear-gradient(145deg, #ffa726, #ffb74d);
}
```

### Input Fields

```css
.clay-input {
  /* Base styling */
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
  width: 100%;
  background-color: #f5f5f5;
  
  /* Clay effect - inset */
  box-shadow: inset 3px 3px 7px rgba(0, 0, 0, 0.1), 
              inset -3px -3px 7px rgba(255, 255, 255, 0.7);
  
  transition: all 0.3s ease;
}

.clay-input:focus {
  outline: none;
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.1), 
              inset -4px -4px 8px rgba(255, 255, 255, 0.7),
              0 0 0 3px rgba(255, 167, 38, 0.2);
}
```

### Card Components

```css
.clay-card {
  /* Base styling */
  background: linear-gradient(145deg, #f5f5f5, #ececec);
  border-radius: 24px;
  padding: 24px;
  
  /* Clay effect */
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.05), 
              -10px -10px 20px rgba(255, 255, 255, 0.8);
  
  /* Subtle texture */
  background-image: url('/assets/textures/noise.png');
  background-size: 200px;
  background-repeat: repeat;
  background-blend-mode: overlay;
  background-opacity: 0.03;
}
```

## Animation Guidelines

### Hover Effects

For interactive elements, use subtle scaling and shadow changes:

```css
.interactive-element {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.interactive-element:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.07), 
              -8px -8px 16px rgba(255, 255, 255, 0.8);
}
```

### Press Effects

For buttons and clickable elements, simulate physical pressure:

```css
.pressable {
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.1s ease;
}

.pressable:active {
  transform: scale(0.98);
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.1), 
              inset -4px -4px 8px rgba(255, 255, 255, 0.7);
  background: linear-gradient(145deg, #e6e6e6, #f0f0f0);
}
```

### Loading State

For loading indicators, use a breathing effect:

```css
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}

.loading-indicator {
  animation: breathe 2s infinite ease-in-out;
}
```

## Implementing Clay-morphism in React

### Example Component

```jsx
import React from 'react';
import styled from 'styled-components';

// Clay Card Component
const ClayCard = styled.div`
  background: linear-gradient(145deg, #f5f5f5, #ececec);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.05), 
              -10px -10px 20px rgba(255, 255, 255, 0.8);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 12px 12px 24px rgba(0, 0, 0, 0.07), 
                -12px -12px 24px rgba(255, 255, 255, 0.8);
  }
  
  transition: transform 0.3s ease, box-shadow 0.3s ease;
`;

// Clay Button Component
const ClayButton = styled.button`
  background: linear-gradient(145deg, #f0f0f0, #e6e6e6);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  color: #444;
  position: relative;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1), 
              -5px -5px 10px rgba(255, 255, 255, 0.8);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 6px 6px 12px rgba(0, 0, 0, 0.1), 
                -6px -6px 12px rgba(255, 255, 255, 0.8);
  }
  
  &:active {
    transform: translateY(1px);
    background: linear-gradient(145deg, #e6e6e6, #f0f0f0);
    box-shadow: inset 3px 3px 7px rgba(0, 0, 0, 0.1), 
                inset -3px -3px 7px rgba(255, 255, 255, 0.7);
  }
  
  transition: all 0.2s ease;
`;

// Example usage
const ExampleComponent = () => {
  return (
    <ClayCard>
      <h2>Clay-morphism Example</h2>
      <p>This card demonstrates the clay-morphism effect.</p>
      <ClayButton>Click Me</ClayButton>
    </ClayCard>
  );
};

export default ExampleComponent;
```

## Mobile Considerations

When implementing clay-morphism on mobile:

1. **Reduce Shadow Size**: Decrease shadow values by 25-30% for mobile
   ```css
   @media (max-width: 768px) {
     .clay-element {
       box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.05), 
                   -4px -4px 8px rgba(255, 255, 255, 0.8);
     }
   }
   ```

2. **Increase Touch Targets**: Ensure buttons and interactive elements are at least 44px × 44px

3. **Optimize Performance**: Limit complex shadows on elements that are animated frequently

## Accessibility Considerations

1. **Contrast**: Ensure text has sufficient contrast against clay backgrounds (at least 4.5:1 ratio)

2. **Focus States**: Add clear focus indicators for keyboard navigation
   ```css
   .clay-interactive:focus {
     outline: none;
     box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.6), 
                 5px 5px 10px rgba(0, 0, 0, 0.1), 
                 -5px -5px 10px rgba(255, 255, 255, 0.8);
   }
   ```

3. **Reduce Motion**: Provide options for users who prefer reduced motion
   ```css
   @media (prefers-reduced-motion: reduce) {
     .clay-element {
       transition: none;
       animation: none;
     }
   }
   ```

## Resources

- [Texture Files](/assets/textures/) - Location of noise textures used for clay effects
- [Color Palette](/design/colors.pdf) - Official Nandi color system for use with clay-morphism
- [Component Library](/components) - Reusable clay-morphism components

## Examples

![Chat Bubbles Example](/design/examples/chat-bubbles.png)
![Buttons Example](/design/examples/clay-buttons.png)
![Cards Example](/design/examples/clay-cards.png) 