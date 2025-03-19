// src/components/Home/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="card home">
            <div className="card-header">
                <div className="text-avatar">N</div>
                <h2>Welcome to Nandi!</h2>
                <div className="xp-tracker">Avatar | ★ 40 XP | Level 2</div>
            </div>
            <p>Your thoughtful guide to daily growth.</p>
            <div className="button-container">
                <Link to="/karma" className="button karmacafe-button">Visit KarmaCafe</Link>
                <Link to="/soul" className="button soulquest-button">Start a Quest</Link>
                <Link to="/pets" className="button wisdompets-button">Check WisdomPets</Link>
                <div className="coming-soon-container">
                    <div className="coming-soon-item">
                        <span className="coming-soon-label">Daily Reflection</span>
                        <span className="coming-soon-badge">Coming Soon</span>
                    </div>
                    <div className="coming-soon-item">
                        <span className="coming-soon-label">Wisdom Library</span>
                        <span className="coming-soon-badge">Coming Soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;