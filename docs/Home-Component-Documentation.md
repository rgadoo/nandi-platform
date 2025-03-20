# Home Component Documentation

## Overview

The Home component serves as the landing page and main dashboard for the Nandi application. It showcases the app's core features, provides quick access to spiritual guidance, and implements the clay-morphism design system for a welcoming, organic feel.

## Component Structure

The Home component is organized into several subcomponents:

```
Home/
├── HomeContainer.tsx       # Main wrapper component
├── WelcomeSection.tsx      # Hero section with greeting and CTA
├── QuickAccessGrid.tsx     # Grid of feature tiles
├── PersonaGallery.tsx      # Carousel of spiritual personas
├── DailyInsight.tsx        # Daily wisdom or meditation
├── RecentActivity.tsx      # User's recent interactions
└── styles/
    ├── HomeStyles.ts       # Styled components
    └── animations.ts       # Animation definitions
```

## Usage

```tsx
import { HomeContainer } from '@/components/Home/HomeContainer';

// Basic usage
<HomeContainer userId="user123" />

// With featured content
<HomeContainer userId="user123" featuredContent={featuredData} />

// With personalized greeting
<HomeContainer userId="user123" userName="Sarah" />
```

## Props Interface

### HomeContainer Props

```tsx
interface HomeContainerProps {
  userId: string;                    // Required user identifier
  userName?: string;                 // Optional name for personalized greeting
  featuredContent?: FeaturedContent; // Optional highlighted content
  recentActivity?: ActivityItem[];   // Optional recent user activities
  className?: string;                // Optional custom styling
  onFeatureSelect?: (featureId: string) => void; // Optional callback
}

interface FeaturedContent {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  type: 'meditation' | 'article' | 'practice';
}

interface ActivityItem {
  id: string;
  type: 'chat' | 'meditation' | 'journal' | 'practice';
  title: string;
  timestamp: Date;
  duration?: number; // In minutes, for activities like meditation
  persona?: 'karma' | 'dharma' | 'atma';
  progress?: number; // For practices or courses
}
```

## Clay-morphism Styling Implementation

The Home component extensively uses clay-morphism styling to create a tactile, organic interface. Following the [Clay-morphism UI Guidelines](/docs/Clay-morphism-UI-Guidelines.md), we've implemented:

### Feature Cards

```tsx
// In HomeStyles.ts
export const FeatureCard = styled.div<{
  accentColor?: string;
}>`
  /* Base styling */
  background: linear-gradient(145deg, #f5f5f5, #ececec);
  border-radius: 24px;
  padding: 24px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  
  /* Clay effect */
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.05), 
              -8px -8px 16px rgba(255, 255, 255, 0.8);
  
  /* Subtle texture */
  background-image: url('/assets/textures/noise.png');
  background-size: 200px;
  background-repeat: repeat;
  background-blend-mode: overlay;
  background-opacity: 0.03;
  
  /* Accent color customization */
  ${({ accentColor }) => accentColor && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 6px;
      height: 100%;
      background: ${accentColor};
      border-radius: 24px 0 0 24px;
    }
  `}
  
  /* Transition for hover effects */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.07), 
                -10px -10px 20px rgba(255, 255, 255, 0.8);
  }
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.06), 
                -8px -8px 16px rgba(255, 255, 255, 0.8);
  }
`;
```

### Welcome Panel

```tsx
export const WelcomePanel = styled.div`
  /* Base styling */
  background: linear-gradient(145deg, #fff6e8, #ffedd8);
  border-radius: 24px;
  padding: 32px;
  margin-bottom: 24px;
  width: 100%;
  position: relative;
  
  /* Clay effect */
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.05), 
              -10px -10px 20px rgba(255, 255, 255, 0.8);
  
  /* Subtle texture */
  background-image: url('/assets/textures/noise.png');
  background-size: 200px;
  background-repeat: repeat;
  background-blend-mode: overlay;
  background-opacity: 0.03;
  
  h1 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 28px;
    font-weight: 600;
    color: #444;
  }
  
  p {
    font-size: 16px;
    line-height: 1.5;
    color: #666;
    margin-bottom: 24px;
  }
  
  /* Responsive adjustments */
  @media (min-width: 768px) {
    h1 {
      font-size: 32px;
    }
    
    p {
      font-size: 18px;
    }
  }
`;
```

### Persona Avatar

```tsx
export const PersonaAvatar = styled.div<{
  persona: 'karma' | 'dharma' | 'atma';
}>`
  /* Base styling */
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  /* Persona-specific gradients */
  background: ${({ persona }) => {
    if (persona === 'karma') {
      return 'linear-gradient(145deg, #fff6e8, #ffedd8)';
    } else if (persona === 'dharma') {
      return 'linear-gradient(145deg, #f2fcf2, #e8f8e8)';
    } else if (persona === 'atma') {
      return 'linear-gradient(145deg, #f5f0ff, #efe5ff)';
    }
    return 'linear-gradient(145deg, #f5f5f5, #ececec)';
  }};
  
  /* Clay effect */
  box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.05), 
              -8px -8px 16px rgba(255, 255, 255, 0.8),
              inset 2px 2px 4px rgba(255, 255, 255, 0.5),
              inset -2px -2px 4px rgba(0, 0, 0, 0.05);
  
  /* Image styling */
  img {
    width: 80%;
    height: 80%;
    object-fit: contain;
  }
  
  /* Animation */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.07), 
                -10px -10px 20px rgba(255, 255, 255, 0.8),
                inset 2px 2px 4px rgba(255, 255, 255, 0.5),
                inset -2px -2px 4px rgba(0, 0, 0, 0.05);
  }
`;
```

## Mobile Responsiveness

The Home component is fully responsive across all device sizes, with careful attention to layout shifts and touch targets.

### Responsive Layout Implementation

```tsx
// In HomeStyles.ts
export const HomeContainerWrapper = styled.div`
  width: 100%;
  padding: 16px;
  background: #f8f8f8;
  min-height: 100vh;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
  
  @media (min-width: 1024px) {
    padding: 32px;
  }
`;

export const QuickAccessGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const PersonaGalleryWrapper = styled.div`
  /* Base styling */
  margin-bottom: 24px;
  
  /* Scroll container for small screens */
  .persona-scroll {
    display: flex;
    overflow-x: auto;
    padding: 16px 0;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    scrollbar-width: none; /* Firefox */
    
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Edge */
    }
    
    /* Spacing between items */
    & > * {
      margin-right: 16px;
      flex: 0 0 auto;
      width: 140px;
    }
  }
  
  /* Grid layout for larger screens */
  @media (min-width: 768px) {
    .persona-scroll {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      overflow-x: visible;
      padding: 0;
      
      & > * {
        margin-right: 0;
        width: auto;
      }
    }
  }
`;
```

### Mobile-Specific Optimizations

1. **Optimized Touch Targets**

```tsx
export const ActionButton = styled.button`
  /* Base styling */
  height: 48px;
  min-width: 48px;
  border-radius: 12px;
  /* Other clay-morphism styling */
  
  /* Larger touch area on mobile */
  @media (max-width: 767px) {
    height: 56px;
    
    /* Additional invisible touch area */
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

2. **Mobile Navigation**

```tsx
export const MobileNavBar = styled.nav`
  /* Only show on mobile */
  display: none;
  
  @media (max-width: 767px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 64px;
    background: linear-gradient(145deg, #f5f5f5, #ececec);
    z-index: 100;
    justify-content: space-around;
    align-items: center;
    padding: 0 16px;
    
    /* Clay effect */
    box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.05);
    
    /* Safe area padding for notched devices */
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;
```

3. **Content Prioritization**

```tsx
// In HomeContainer.tsx
const HomeContainer: React.FC<HomeContainerProps> = ({ userId, userName, featuredContent, recentActivity }) => {
  // Responsive content organization
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);
  
  return (
    <HomeContainerWrapper>
      <WelcomeSection userName={userName} />
      
      {/* Prioritize different content based on viewport */}
      {isMobile ? (
        <>
          <DailyInsight />
          <QuickAccessGrid />
          <PersonaGallery />
          {featuredContent && <FeaturedContentCard content={featuredContent} />}
        </>
      ) : (
        <>
          <div className="desktop-layout">
            <div className="main-column">
              <QuickAccessGrid />
              <DailyInsight />
            </div>
            <div className="side-column">
              <PersonaGallery />
              {featuredContent && <FeaturedContentCard content={featuredContent} />}
            </div>
          </div>
        </>
      )}
      
      {recentActivity && recentActivity.length > 0 && (
        <RecentActivity activities={recentActivity} />
      )}
      
      {isMobile && <MobileNavBar />}
    </HomeContainerWrapper>
  );
};
```

## Animation Implementation

The Home component features subtle animations to enhance engagement without compromising performance:

```tsx
// In animations.ts
import { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const breathe = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
`;

export const gentlePulse = keyframes`
  0%, 100% { box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.05), 
                        -8px -8px 16px rgba(255, 255, 255, 0.8); }
  50% { box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.07), 
                    -10px -10px 20px rgba(255, 255, 255, 0.9); }
`;

// Usage in components
export const DailyInsightCard = styled.div`
  /* Base styling with clay-morphism */
  
  /* Animation */
  animation: ${fadeIn} 0.5s ease forwards, ${breathe} 8s infinite ease-in-out;
  
  /* Respect user preferences */
  @media (prefers-reduced-motion: reduce) {
    animation: ${fadeIn} 0.5s ease forwards;
  }
`;
```

## Component Implementation 

### QuickAccessGrid Component

```tsx
// In QuickAccessGrid.tsx
import React from 'react';
import { QuickAccessGrid as GridContainer, FeatureCard } from './styles/HomeStyles';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  link: string;
}

interface QuickAccessGridProps {
  features: Feature[];
  onFeatureSelect?: (featureId: string) => void;
}

const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({ 
  features, 
  onFeatureSelect 
}) => {
  const handleCardClick = (feature: Feature) => {
    if (onFeatureSelect) {
      onFeatureSelect(feature.id);
    }
    // Otherwise handle navigation
  };

  return (
    <GridContainer>
      {features.map(feature => (
        <FeatureCard 
          key={feature.id}
          accentColor={feature.accentColor}
          onClick={() => handleCardClick(feature)}
          tabIndex={0}
          role="button"
          aria-label={`Access ${feature.title}`}
        >
          <div className="card-icon">{feature.icon}</div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </FeatureCard>
      ))}
    </GridContainer>
  );
};

export default QuickAccessGrid;
```

### Welcome Section Component

```tsx
// In WelcomeSection.tsx
import React from 'react';
import { format } from 'date-fns';
import { WelcomePanel, ActionButton } from './styles/HomeStyles';

interface WelcomeSectionProps {
  userName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName }) => {
  const currentHour = new Date().getHours();
  let greeting = 'Hello';
  
  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }
  
  const today = format(new Date(), 'EEEE, MMMM do');

  return (
    <WelcomePanel>
      <h1>{greeting}{userName ? `, ${userName}` : ''}!</h1>
      <p>Today is {today}. Take a moment to connect with your inner self.</p>
      <div className="action-buttons">
        <ActionButton 
          className="primary" 
          aria-label="Begin meditation"
        >
          Begin Meditation
        </ActionButton>
        <ActionButton 
          aria-label="Open journal"
        >
          Journal
        </ActionButton>
      </div>
    </WelcomePanel>
  );
};

export default WelcomeSection;
```

## Accessibility Features

The Home component implements several accessibility features:

1. **Keyboard Navigation**

```tsx
// In FeatureCard component
const FeatureCard: React.FC<FeatureCardProps> = ({ 
  feature, 
  onClick 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(feature.id);
    }
  };

  return (
    <FeatureCardWrapper
      tabIndex={0}
      role="button"
      aria-label={`Access ${feature.title}`}
      onClick={() => onClick(feature.id)}
      onKeyDown={handleKeyDown}
      accentColor={feature.accentColor}
    >
      {/* Card content */}
    </FeatureCardWrapper>
  );
};
```

2. **Color Contrast**

```tsx
// In HomeStyles.ts - ensuring text has sufficient contrast
export const FeatureCard = styled.div<{
  accentColor?: string;
}>`
  /* Other styling */
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    /* Ensure dark text for contrast */
    color: #333;
  }
  
  p {
    font-size: 14px;
    line-height: 1.4;
    /* Ensure sufficient contrast */
    color: #555;
  }
`;
```

3. **Focus Indicators**

```tsx
// Global style additions for focus states
const GlobalStyles = createGlobalStyle`
  /* Focus styles for clay elements */
  .clay-interactive:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.6), 
                8px 8px 16px rgba(0, 0, 0, 0.05), 
                -8px -8px 16px rgba(255, 255, 255, 0.8);
  }
  
  /* Ensure focus is visible for keyboard users */
  .clay-interactive:focus:not(:focus-visible) {
    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.05), 
                -8px -8px 16px rgba(255, 255, 255, 0.8);
  }
  
  .clay-interactive:focus-visible {
    box-shadow: 0 0 0 3px rgba(255, 167, 38, 0.6), 
                8px 8px 16px rgba(0, 0, 0, 0.05), 
                -8px -8px 16px rgba(255, 255, 255, 0.8);
  }
`;
```

## Performance Optimizations

1. **Image Optimization**

```tsx
// In FeaturedContentCard.tsx
<FeaturedImage>
  <img
    src={content.imageUrl}
    alt={content.title}
    width="400"
    height="240"
    loading="lazy"
  />
</FeaturedImage>
```

2. **Deferred Loading**

```tsx
// In HomeContainer.tsx
const HomeContainer: React.FC<HomeContainerProps> = ({ 
  userId, 
  // other props 
}) => {
  const [recentActivityData, setRecentActivityData] = useState<ActivityItem[]>([]);
  const [isActivityLoaded, setIsActivityLoaded] = useState(false);
  
  // Load activity data after critical content is rendered
  useEffect(() => {
    const loadActivityData = async () => {
      // Simulating a delay for non-critical data
      setTimeout(async () => {
        try {
          const response = await fetch(`/api/users/${userId}/activity`);
          const data = await response.json();
          setRecentActivityData(data);
        } catch (error) {
          console.error('Failed to load activity data:', error);
        } finally {
          setIsActivityLoaded(true);
        }
      }, 500);
    };
    
    loadActivityData();
  }, [userId]);
  
  return (
    <HomeContainerWrapper>
      {/* Critical UI rendered immediately */}
      <WelcomeSection />
      <QuickAccessGrid />
      
      {/* Non-critical UI with deferred loading */}
      {isActivityLoaded ? (
        <RecentActivity activities={recentActivityData} />
      ) : (
        <ActivityPlaceholder />
      )}
    </HomeContainerWrapper>
  );
};
```

## Testing

The Home component has comprehensive tests:

```tsx
// In Home.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import HomeContainer from './HomeContainer';

describe('HomeContainer', () => {
  const mockFeatures = [
    { 
      id: 'meditation', 
      title: 'Meditation', 
      description: 'Find your inner peace',
      icon: <span>🧘</span>,
      accentColor: '#FF9F43',
      link: '/meditation'
    },
    // More mock features
  ];
  
  test('renders welcome section with correct greeting', () => {
    render(<HomeContainer 
      userId="user123" 
      userName="John"
      features={mockFeatures} 
    />);
    
    // Check for personalized greeting (time-based, so using regex)
    expect(screen.getByText(/John!/i)).toBeInTheDocument();
  });
  
  test('renders feature cards correctly', () => {
    render(<HomeContainer 
      userId="user123"
      features={mockFeatures} 
    />);
    
    expect(screen.getByText('Meditation')).toBeInTheDocument();
    expect(screen.getByText('Find your inner peace')).toBeInTheDocument();
  });
  
  test('calls onFeatureSelect when a feature card is clicked', () => {
    const handleFeatureSelect = jest.fn();
    
    render(<HomeContainer 
      userId="user123"
      features={mockFeatures}
      onFeatureSelect={handleFeatureSelect}
    />);
    
    fireEvent.click(screen.getByText('Meditation'));
    expect(handleFeatureSelect).toHaveBeenCalledWith('meditation');
  });
  
  test('renders correctly on mobile viewport', () => {
    // Mock a mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375 });
    window.dispatchEvent(new Event('resize'));
    
    render(<HomeContainer userId="user123" features={mockFeatures} />);
    
    // Check for mobile-specific UI elements
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
```

## Future Enhancements

1. **Personalized Content Recommendations**

```tsx
// Planned implementation in HomeContainer.tsx
const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/recommendations`);
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };
  
  fetchRecommendations();
}, [userId]);
```

2. **Progressive Web App Support**

```tsx
// Service worker registration in index.tsx or _app.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('ServiceWorker registration successful');
      },
      error => {
        console.log('ServiceWorker registration failed:', error);
      }
    );
  });
}
```

## Resources

- [Clay-morphism UI Guidelines](/docs/Clay-morphism-UI-Guidelines.md)
- [Design Mockups](/design/mockups/home)
- [Component Library](/components)
- [Responsive Design System](/docs/design-system/responsive.md) 