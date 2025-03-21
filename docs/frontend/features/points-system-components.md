# Points System Components

This document outlines the UI components needed to implement the points system in the Nandi frontend application.

## Points Badge Component

### Description
A small, visually appealing badge that displays the current points total in the user's account. Located in the header or user profile area.

### Properties
- `points`: Number - The user's current point total
- `size`: 'small' | 'medium' | 'large' - Size variant
- `animated`: Boolean - Whether to animate when points change

### Mockup
```
┌─────────────────┐
│                 │
│     ✨ 420      │
│                 │
└─────────────────┘
```

## Points Earned Toast

### Description
A temporary notification that appears after an interaction, showing points earned and the quality level of the question.

### Properties
- `pointsEarned`: Number - Points earned from the interaction
- `qualityTier`: 'low' | 'medium' | 'high' | 'default' - The quality tier
- `breakdown`: Object - Breakdown of points sources
- `autoHideDuration`: Number - Time in ms before the toast disappears

### Mockup
```
┌─────────────────────────────────┐
│  ✨ +8 POINTS EARNED            │
│                                 │
│  Medium Quality Question        │
│  Base: 5 | Quality Bonus: 3     │
│                                 │
└─────────────────────────────────┘
```

## Points Progress Chart

### Description
A chart displaying the user's points accumulation over time, with milestone markers.

### Properties
- `pointsHistory`: Array - History of points transactions
- `milestones`: Array - List of milestone values
- `timeRange`: 'week' | 'month' | 'year' | 'all' - Time range to display
- `chartType`: 'line' | 'bar' - Type of chart to display

### Mockup
```
  Points
    ^
850 |                           ●
    |                         /
650 |                      /
    |                   /
450 |              ● /
    |            /
250 |       ● /
    |     /
 50 |● /
    +----------------------------->
       1W     2W     3W     4W    Time
```

## Achievement Badge

### Description
A visual representation of a milestone or achievement that the user has unlocked through the points system.

### Properties
- `achievementType`: String - Type of achievement
- `title`: String - Title of the achievement
- `description`: String - Description of the achievement
- `iconUrl`: String - URL to the badge icon
- `unlockedDate`: Date - When the achievement was unlocked

### Mockup
```
┌─────────────────────────┐
│         ⭐⭐⭐          │
│      WISDOM SEEKER      │
│                         │
│ Asked 25 quality        │
│ questions               │
│                         │
│ Unlocked: June 15, 2023 │
└─────────────────────────┘
```

## Points Breakdown Modal

### Description
A detailed modal showing the breakdown of how points were calculated for a session, including time spent, question quality, and any bonuses.

### Properties
- `sessionId`: String - Session identifier
- `questionsBreakdown`: Array - Breakdown of points per question
- `timePoints`: Number - Points earned from session duration
- `consistencyBonus`: Number - Points earned from consecutive usage
- `milestoneBonus`: Number - Points earned from reaching milestones
- `totalPoints`: Number - Total points earned in the session

### Mockup
```
┌───────────────────────────────────────┐
│                                       │
│          SESSION POINTS: 78           │
│                                       │
│  Questions (3)                    35  │
│    - "What is karma?"              5  │
│    - "How do I find purpose?"     12  │
│    - "My spiritual journey..."    18  │
│                                       │
│  Time (23 minutes)                23  │
│                                       │
│  Consistency Bonus                10  │
│  Milestone Bonus                  10  │
│                                       │
│  [CLOSE]         [VIEW DETAILS]       │
│                                       │
└───────────────────────────────────────┘
```

## Leaderboard Component

### Description
An optional component showing the top users by points, with privacy-focused anonymous display options.

### Properties
- `topUsers`: Array - List of top users and their points
- `currentUserRank`: Number - The current user's rank
- `timeRange`: 'week' | 'month' | 'all' - Time range for the leaderboard
- `displayType`: 'public' | 'anonymous' - How to display user identities

### Mockup
```
┌───────────────────────────────────┐
│  WEEKLY LEADERBOARD               │
│                                   │
│  1. Seeker4392        1250 pts    │
│  2. WisdomFinder      920 pts     │
│  3. KarmaExplorer     875 pts     │
│  4. SpiritualPath     820 pts     │
│  5. DharmaStudent     785 pts     │
│  ...                              │
│                                   │
│  YOUR RANK: #12      680 pts      │
│                                   │
└───────────────────────────────────┘
```

## Implementation Guidelines

1. **Clay-morphism Styling**
   - Use soft shadows and subtle gradients
   - Apply rounded corners to all components
   - Use semi-transparent, earthy color palette

2. **Animations**
   - Implement smooth number transitions for points increases
   - Add subtle pulse animations for achievement unlocks
   - Use gentle motion for charts and progress indicators

3. **Accessibility**
   - Ensure all components meet WCAG 2.1 AA standards
   - Provide alternative text descriptions for visual elements
   - Support keyboard navigation for interactive components

4. **Responsiveness**
   - Design components to adapt to both mobile and desktop views
   - Simplify visualizations on smaller screens
   - Use collapsible sections for detailed breakdowns on mobile

5. **Integration Points**
   - Header/profile area for the Points Badge
   - Chat interface for Points Earned Toast
   - Profile page for Achievement Badges and Progress Chart
   - KarmaCafe feature for detailed Session Breakdown 