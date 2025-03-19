import React from 'react';
import './KarmaCafe.css';

const themeInfo = {
  karma: {
    title: "Karma",
    description: "Explore how your actions and intentions shape your experience and future.",
    sampleQuestions: [
      {
        question: "How can I break free from negative karmic patterns?",
        answer: "Start by becoming aware of your habitual reactions. Practice responding mindfully rather than reacting automatically to situations. Small shifts in your actions today create new karmic patterns for tomorrow."
      },
      {
        question: "How does karma relate to my career path?",
        answer: "Your work is a powerful realm for karmic growth. Notice how you contribute your energy and talents, and the intentions behind your work. Align your career with positive service to create beneficial karma."
      }
    ]
  },
  dharma: {
    title: "Dharma",
    description: "Discover your unique purpose and how to live in alignment with your true nature.",
    sampleQuestions: [
      {
        question: "How do I know what my dharma is?",
        answer: "Look for the intersection of your natural talents, what brings you joy, and how you can serve others. Your dharma often lies where these three aspects converge."
      },
      {
        question: "Can I have multiple dharmas in one lifetime?",
        answer: "Yes, your dharma may evolve through different life stages. What's important is recognizing what each phase of life is calling you to embody and express."
      }
    ]
  },
  atma: {
    title: "Atma",
    description: "Connect with your true self beyond ego and discover your inner wisdom.",
    sampleQuestions: [
      {
        question: "How do I connect with my higher self?",
        answer: "Regular meditation, spending time in nature, and creative expression can all help quiet the ego mind and create space for your higher self to be heard."
      },
      {
        question: "What blocks me from experiencing my true nature?",
        answer: "Our identification with thoughts, emotions, and social conditioning often obscures our true nature. Practices of mindful awareness and self-inquiry help dissolve these barriers."
      }
    ]
  }
};

const ThemeSelector = ({ selectedTheme, setSelectedTheme, showSamples, setShowSamples }) => {
  const handleThemeClick = (theme) => {
    setSelectedTheme(theme);
    setShowSamples(true);
  };

  return (
    <div className="theme-selector-container">
      <div className="theme-buttons">
        {Object.keys(themeInfo).map((theme) => (
          <button
            key={theme}
            className={`theme-button ${selectedTheme === theme ? 'active' : ''}`}
            onClick={() => handleThemeClick(theme)}
          >
            {themeInfo[theme].title}
          </button>
        ))}
      </div>
      
      {showSamples && selectedTheme && (
        <div className="theme-samples">
          <p className="theme-description">{themeInfo[selectedTheme].description}</p>
          {themeInfo[selectedTheme].sampleQuestions.map((sample, index) => (
            <div key={index} className="sample-qa">
              <p className="sample-question">Q: {sample.question}</p>
              <p className="sample-answer">A: {sample.answer}</p>
            </div>
          ))}
          <p className="sample-hint">Ask your own question about {themeInfo[selectedTheme].title} to begin.</p>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector; 