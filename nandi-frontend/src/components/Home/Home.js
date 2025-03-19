// src/components/Home/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ChatManager from '../Chat/ChatManager';

function Home() {
    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Nandi Platform</h1>
                <p className="home-tagline">Spiritual exploration and mindfulness applications</p>
            </header>

            <div className="home-content">
                <div className="app-grid">
                    <Link to="/karma" className="app-card">
                        <div className="app-icon">🧘</div>
                        <h2>KarmaCafe</h2>
                        <p>Chat with philosophical avatars exploring spirituality and mindfulness</p>
                    </Link>
                    
                    <Link to="/soul" className="app-card">
                        <div className="app-icon">🌱</div>
                        <h2>SoulQuest</h2>
                        <p>Interactive journeys for personal growth and self-discovery</p>
                    </Link>
                    
                    <Link to="/pets" className="app-card">
                        <div className="app-icon">🐾</div>
                        <h2>WisdomPets</h2>
                        <p>Virtual companions that guide you through daily meditation</p>
                    </Link>
                    
                    <Link to="/chat-test" className="app-card">
                        <div className="app-icon">💬</div>
                        <h2>Chat Test</h2>
                        <p>Test the new Mars-style chat component</p>
                    </Link>
                </div>
            </div>
            
            <ChatManager />
        </div>
    );
}

export default Home;