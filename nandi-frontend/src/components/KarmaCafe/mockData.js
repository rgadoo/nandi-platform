// Mock data for KarmaCafe component
export const mockResponses = [
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    replies: [
      "Hello there! How are you feeling today?",
      "Hi! Welcome to the KarmaCafe. What's on your mind?",
      "Hey! I'm here to chat about anything that might help your spiritual journey."
    ]
  },
  {
    keywords: ["meditation", "meditate", "mindfulness", "relax"],
    replies: [
      "Meditation is a wonderful practice. Have you tried focusing on your breath for just 5 minutes a day?",
      "Mindfulness can transform your daily experience. Even simple activities like eating can become meditative practices.",
      "Finding moments of stillness in our busy lives can be so healing. Would you like some simple meditation techniques?"
    ]
  },
  {
    keywords: ["stress", "anxious", "anxiety", "worried", "overwhelmed"],
    replies: [
      "I'm sorry to hear you're feeling stressed. Remember that it's okay to take a step back and breathe.",
      "Anxiety is something many of us face. One technique that might help is the 5-4-3-2-1 grounding exercise. Would you like to know more?",
      "When we feel overwhelmed, sometimes breaking tasks into smaller steps can help. What's one tiny action you could take right now?"
    ]
  },
  {
    keywords: ["gratitude", "thankful", "appreciate", "grateful"],
    replies: [
      "Practicing gratitude can shift our perspective in powerful ways. What's something small you're grateful for today?",
      "Even in difficult times, finding moments of gratitude can be transformative. Have you tried keeping a gratitude journal?",
      "That's wonderful! Recognizing the good in our lives, no matter how small, can bring more joy and contentment."
    ]
  },
  {
    keywords: ["purpose", "meaning", "lost", "direction"],
    replies: [
      "Finding purpose is a journey, not a destination. What activities make you lose track of time?",
      "Sometimes our purpose reveals itself when we pay attention to what moves us or what problems we feel called to solve.",
      "It's completely normal to question your direction. These periods of uncertainty often precede significant growth."
    ]
  }
];

// Default fallback responses
export const defaultResponses = [
  "That's an interesting perspective. Tell me more about how you're feeling about this.",
  "I appreciate you sharing that with me. How long have you been thinking about this?",
  "I see. And how has this been affecting your daily life?",
  "That's a thoughtful observation. What do you think might be the next step for you?",
  "I'm here to listen and support you. Would you like to explore this topic further?"
];

// Theme-specific responses
const themeResponses = {
  karma: [
    "Karma is about action and consequence. Each choice you make creates an energy pattern that returns to you in time. Notice how your past choices are reflected in your present circumstances.",
    "What we give, we receive. Your question reveals a deep awareness of karmic patterns. Consider that the challenges you face may be opportunities to resolve past karmic debts.",
    "The path of karma yoga involves action without attachment to results. When we act with pure intention and detachment, we create more favorable karma going forward.",
    "Karma isn't punishment but rather the universe's way of teaching us balance. Your awareness of this principle is already shifting your karmic trajectory.",
    "Your karmic patterns won't change overnight, but each mindful action creates new momentum. Stay consistent with positive intentions, and you'll see profound shifts over time."
  ],
  dharma: [
    "Dharma is your unique purpose or soul mission. It's the intersection of your natural gifts, what brings you joy, and how you can best serve others. What activities make you lose track of time?",
    "Living your dharma means aligning with your true nature. When you're in alignment, you'll feel energized rather than depleted by your work, even when it's challenging.",
    "Sometimes our dharma evolves through different life phases. The key is staying attuned to inner guidance and noticing when it's time for a transition.",
    "Your question reveals a deep yearning to live authentically. Trust that your dharma is already revealing itself through what naturally calls to you.",
    "Dharma isn't just about career—it's about how you show up in all areas of life. Small daily actions aligned with your values are as much your dharma as your life's work."
  ],
  atma: [
    "The Atma or soul is your eternal essence beyond all changing phenomena. Through meditation and self-inquiry, you can experience this unchanging awareness that is your true nature.",
    "You are not your thoughts, emotions, or experiences—you are the awareness that perceives them. This recognition is the beginning of liberation from suffering.",
    "The path to realizing Atma involves discernment between what is temporary (all phenomena) and what is eternal (pure consciousness). Your question shows you're already engaged in this discernment.",
    "Regular meditation creates space to recognize your essential nature. Even a few minutes daily can gradually dissolve the identification with form and reveal your formless essence.",
    "The Atma is ever-present, never born, never dies. Your spiritual journey isn't about creating or finding something new, but recognizing what has always been here."
  ]
};

// Generic/fallback responses
const genericResponses = [
  "That's an interesting question. When we look at it from a spiritual perspective, we might consider that all experiences are opportunities for growth and self-discovery.",
  "The ancient wisdom traditions would suggest looking within for answers. Through mindful self-observation, insights naturally arise that are perfectly suited to your unique situation.",
  "Sometimes the most profound answers come through patient observation rather than analytical thinking. What might emerge if you sit with this question in meditation?",
  "Your question touches on the interconnectedness of all things. Consider that the answer may reveal itself through relationships and interactions with others.",
  "The spiritual path isn't always about finding answers, but asking better questions. Your inquiry itself is a powerful form of practice."
];

/**
 * Get mock response based on user input
 * @param {string} userInput - User's message
 * @param {string} theme - Selected theme (karma, dharma, atma)
 * @returns {string} - AI response
 */
export const getMockResponse = (userInput, theme = 'karma') => {
  // Convert to lowercase and remove punctuation for easier matching
  const normalizedInput = userInput.toLowerCase().replace(/[^\w\s]/g, '');
  
  // Check for greetings or simple queries
  if (/^(hi|hello|hey|greetings)/.test(normalizedInput)) {
    return `Hello! I'm here to explore ${theme} with you. What would you like to know?`;
  }
  
  if (/^(how are you|how do you feel|how are you doing)/.test(normalizedInput)) {
    return `I'm here to help you explore ${theme}. What aspects of ${theme} are you curious about today?`;
  }
  
  if (/^(thank|thanks)/.test(normalizedInput)) {
    return "You're welcome. I'm glad our conversation about spiritual growth is helpful.";
  }
  
  if (/^(bye|goodbye|farewell|see you)/.test(normalizedInput)) {
    return "Farewell for now. May your spiritual journey bring you peace and clarity.";
  }
  
  // For other inputs, select a random response from the appropriate theme
  const responses = themeResponses[theme] || genericResponses;
  return responses[Math.floor(Math.random() * responses.length)];
}; 