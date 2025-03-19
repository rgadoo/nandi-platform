import React from 'react';
import './KarmaCafe.css';
import { FaDog, FaCoffee, FaHeart, FaComments } from 'react-icons/fa';

const KarmaCafe = () => {
  return (
    <div className="karma-container">
      <div className="clay-content">
        <header className="karma-header">
          <div className="nandi-branding">
            <h1 className="app-title">KarmaCafe</h1>
            <div className="nandi-logo">
              <img src="/images/nandi-main.png" alt="Nandi" />
            </div>
          </div>
        </header>

        <div className="karma-grid">
          <div className="clay-card">
            <div className="card-icon">
              <FaCoffee />
            </div>
            <h2>Daily Wisdom</h2>
            <p>Start your day with mindful insights</p>
          </div>

          <div className="clay-card">
            <div className="card-icon">
              <FaComments />
            </div>
            <h2>Group Chat</h2>
            <p>Connect with fellow seekers</p>
          </div>

          <div className="clay-card">
            <div className="card-icon">
              <FaHeart />
            </div>
            <h2>Meditation</h2>
            <p>Find your inner peace</p>
          </div>

          <div className="clay-card">
            <div className="card-icon">
              <FaDog />
            </div>
            <h2>Wisdom Pets</h2>
            <p>Chat with your spiritual companions</p>
          </div>
        </div>

        <div className="featured-section">
          <div className="clay-card featured">
            <h2>Welcome to KarmaCafe</h2>
            <p>A space for mindful conversations and spiritual growth. Connect with others, share experiences, and learn together.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KarmaCafe; 