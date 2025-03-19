import React from 'react';
import './DharmaPath.css';

const DharmaPath = () => {
  return (
    <div className="dharma-container">
      <div className="clay-content">
        <h1>Dharma Path</h1>
        <div className="clay-card">
          <h2>Welcome to Your Dharma Journey</h2>
          <p>This is where your spiritual journey begins. More features coming soon...</p>
        </div>
        <div className="clay-grid">
          <div className="clay-item">
            <h3>Daily Practice</h3>
            <p>Establish your spiritual routine</p>
          </div>
          <div className="clay-item">
            <h3>Teachings</h3>
            <p>Access ancient wisdom</p>
          </div>
          <div className="clay-item">
            <h3>Meditation</h3>
            <p>Find your inner peace</p>
          </div>
          <div className="clay-item">
            <h3>Community</h3>
            <p>Connect with fellow seekers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DharmaPath; 