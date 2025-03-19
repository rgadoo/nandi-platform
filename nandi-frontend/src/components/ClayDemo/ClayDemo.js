import React from 'react';
import ClayCard from './ClayCard';
import { FaQuestion, FaPrayingHands, FaGraduationCap, FaDog, FaCompass } from 'react-icons/fa';
import './ClayDemo.css';
import 'claymorphism-css/dist/clay.css';

const ClayDemo = () => {
  return (
    <div className="clay-demo-container">
      <header className="clay-demo-header clay">
        <h1>Nandi Clay Design Demo</h1>
        <p>Claymorphic UI components for Nandi app</p>
      </header>

      <section className="clay-demo-section">
        <h2>App Cards</h2>
        <div className="clay-card-grid">
          <ClayCard 
            title="KarmaCafe" 
            icon={<FaQuestion />} 
            description="Chat with philosophical avatars exploring spirituality and mindfulness" 
            color="#f6d6ad" 
          />
          <ClayCard 
            title="SoulQuest" 
            icon={<FaCompass />} 
            description="Interactive journeys for personal growth and self-discovery" 
            color="#b9e0f9" 
          />
          <ClayCard 
            title="WisdomPets" 
            icon={<FaDog />} 
            description="Virtual companions that guide you through daily meditation" 
            color="#f5c2c2" 
          />
        </div>
      </section>

      <section className="clay-demo-section">
        <h2>Chat Themes</h2>
        <div className="clay-card-grid">
          <ClayCard 
            title="Karma Chat" 
            icon={<FaQuestion />} 
            description="Explore spiritual concepts and find meaning in your journey" 
            color="#6b46c1" 
          />
          <ClayCard 
            title="Wisdom Chat" 
            icon={<FaGraduationCap />} 
            description="Share insights and knowledge on various topics" 
            color="#3182ce" 
          />
          <ClayCard 
            title="Meditation Chat" 
            icon={<FaPrayingHands />} 
            description="Guided meditations, breathing exercises, and mindfulness" 
            color="#38a169" 
          />
        </div>
      </section>

      <section className="clay-demo-section">
        <h2>UI Elements</h2>
        <div className="clay-ui-samples">
          <button className="clay clay-button">Button</button>
          <button className="clay clay-button primary">Primary</button>
          <div className="clay clay-input-container">
            <input type="text" placeholder="Clay Input" className="clay-input" />
          </div>
          <div className="clay clay-toggle">
            <input type="checkbox" id="toggleDemo" />
            <label htmlFor="toggleDemo"></label>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClayDemo; 