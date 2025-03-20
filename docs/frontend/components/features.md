# Feature Components Documentation

This document provides an overview of the main feature components in the Nandi application.

## 1. DharmaPath Component

### Overview
The DharmaPath component provides tools and guidance for users to explore their personal purpose, life direction, and spiritual path.

### Key Features
- Purpose assessment tools
- Path visualization
- Guided reflections
- Personalized direction insights
- Progress tracking

### Visual Design
- Deep green color theme (#4CAF50)
- Path and journey visualizations
- Compass and direction-themed elements

### Implementation Details
- Located at `src/components/DharmaPath/DharmaPath.js`
- Uses `DharmaPath.css` for styling
- Accessible through the `/dharma` route

## 2. KarmaCafe Component

### Overview
The KarmaCafe component offers resources and insights about actions and consequences, helping users make mindful choices.

### Key Features
- Action-consequence exploration
- Decision guidance
- Ethical framework tools
- Reflection spaces
- Wisdom resources

### Visual Design
- Vibrant orange color theme (#FF9800)
- Balance and scale imagery
- Warm, inviting cafe-like atmosphere

### Implementation Details
- Located at `src/components/KarmaCafe/KarmaCafe.js`
- Uses `KarmaCafe.css` for styling
- Accessible through the `/karma` route

## 3. SoulQuest Component

### Overview
The SoulQuest component provides a journey-based approach to personal growth through challenges, achievements, and spiritual quests.

### Key Features
- Personalized growth journeys
- Quest tracking and achievements
- Guided spiritual challenges
- Milestone celebrations
- Community sharing options

### Visual Design
- Rich purple-blue color palette
- Journey and quest visuals
- Star and celestial imagery

### Implementation Details
- Located at `src/components/SoulQuest/SoulQuest.js`
- Uses `SoulQuest.css` for styling
- Accessible through the `/soul` route

## 4. WisdomPets Component

### Overview
The WisdomPets component offers virtual spiritual companions that provide guidance, comfort, and wisdom through different animal archetypes.

### Key Features
- Virtual pet companions
- Animal wisdom archetypes
- Daily guidance interactions
- Nurturing and growth mechanics
- Personalized pet journeys

### Visual Design
- Nature-inspired color palette
- Animal imagery and animations
- Nurturing environment visuals

### Implementation Details
- Located at `src/components/WisdomPets/WisdomPets.js`
- Uses `WisdomPets.css` for styling
- Accessible through the `/pets` route

## Common Features Across Components

### Responsive Design
All feature components implement responsive layouts that adapt to different screen sizes:
- Mobile-optimized views with simplified layouts
- Tablet layouts with enhanced functionality
- Desktop layouts with full feature sets

### Clay-Morphism Styling
Each component follows the application's clay-morphism design language:
- Soft, rounded UI elements
- Subtle shadow effects
- Semi-transparent overlays
- Earth-tone color palette with feature-specific accents

### Navigation
Components include:
- Back navigation to the Home screen
- Feature-specific sub-navigation
- Breadcrumb trails for complex journeys

### Data Integration
Components are prepared for:
- API integration with corresponding backend services
- Local storage for user preferences
- Mock data for development and demonstration

## Future Development

### Planned Enhancements
- Deeper integration between features
- Community and sharing capabilities
- Advanced customization options
- Expanded content libraries
- Gamification elements

### Integration Opportunities
- Calendar and scheduling integration
- Notification systems
- Third-party content integration
- User data export and import
- Social sharing 