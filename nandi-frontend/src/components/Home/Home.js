// src/components/Home/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ChatDemo from '../Chat/ChatDemo';
import { FaHome, FaSearch, FaUserAlt, FaStar, FaDog, FaQuestion, FaPrayingHands, FaGem } from 'react-icons/fa';

function Home() {
    return (
        <div className="home-container">
            <div className="phone-frame">
                <div className="status-bar">
                    <div className="time">1:20</div>
                    <div className="battery">93%</div>
                </div>

                <header className="home-header">
                    <div className="nandi-branding">
                        <h1 className="app-title">Nandi</h1>
                        <div className="nandi-logo">
                            <img src="/images/nandi-main.png" alt="Nandi" />
                        </div>
                    </div>
                </header>

                {/* Progress Section */}
                <section className="progress-section">
                    <div className="progress-card">
                        <div className="avatar">
                            <img src="/images/mascots/panda-avatar.png" alt="Panda mascot" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Panda&background=b17d4a&color=fff'; e.target.onerror = null; }} />
                        </div>
                        <div className="info">
                            <h3>Day 3 of 30</h3>
                            <p>Complete today's meditation</p>
                        </div>
                        <div className="badge">24 min</div>
                    </div>

                    <div className="progress-card">
                        <div className="avatar">
                            <img src="/images/mascots/dog-avatar.png" alt="Dog mascot" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Dog&background=e07a3a&color=fff'; e.target.onerror = null; }} />
                        </div>
                        <div className="info">
                            <h3>2023 points total</h3>
                            <p>You're making great progress!</p>
                        </div>
                        <div className="badge">+15</div>
                    </div>
                </section>

                {/* App Cards */}
                <section className="app-cards">
                    {/* Row 1 */}
                    <div className="cards-row">
                        <Link to="/soul" className="card">
                            <div className="card-icon soul-quest-icon">
                                <FaQuestion />
                            </div>
                            <div className="card-content">
                                <h2>Soul Quest</h2>
                                <p>Quiz</p>
                                <div className="card-rating">
                                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                                </div>
                            </div>
                        </Link>
                        
                        <Link to="/karma" className="card">
                            <div className="card-icon karma-cafe-icon">
                                <FaDog />
                            </div>
                            <div className="card-content">
                                <h2>KarmaCafe</h2>
                                <p>Chat with wisdom</p>
                            </div>
                        </Link>
                    </div>
                    
                    {/* Row 2 */}
                    <div className="cards-row">
                        <Link to="/dharma" className="card">
                            <div className="card-icon dharma-path-icon">
                                <FaPrayingHands />
                            </div>
                            <div className="card-content">
                                <h2>Dharma Path</h2>
                                <p>21-day spiritual journey</p>
                            </div>
                        </Link>
                        
                        <Link to="/treasure" className="card">
                            <div className="card-icon treasure-icon">
                                <FaGem />
                            </div>
                            <div className="card-content">
                                <h2>Treasure</h2>
                                <p>Discover ancient wisdom</p>
                            </div>
                        </Link>
                    </div>
                    
                    {/* Full width featured card - wrapped in row container */}
                    <div className="cards-row">
                        <Link to="/pets" className="card featured-card">
                            <div className="card-icon wisdom-pets-icon">
                                <FaDog />
                            </div>
                            <div className="card-content">
                                <h2>Wisdom Pets Deswas</h2>
                                <p>Virtual companions for mindfulness</p>
                            </div>
                        </Link>
                    </div>
                </section>
            </div>
            
            {/* Use our new ChatDemo component */}
            <ChatDemo />
            
            <nav className="bottom-nav">
                <Link to="/" className="nav-item active">
                    <span className="icon"><FaHome /></span>
                    <span>Home</span>
                </Link>
                
                <Link to="#" className="nav-item">
                    <span className="icon"><FaSearch /></span>
                    <span>Explore</span>
                </Link>
                
                <Link to="#" className="nav-item">
                    <span className="icon"><FaStar /></span>
                    <span>Favorites</span>
                </Link>
                
                <Link to="#" className="nav-item">
                    <span className="icon"><FaUserAlt /></span>
                    <span>Profile</span>
                </Link>
            </nav>
        </div>
    );
}

export default Home;