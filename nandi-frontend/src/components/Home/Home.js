// src/components/Home/Home.js
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import ChatManager from '../Chat/ChatManager';
import { FaHome, FaSearch, FaUserAlt, FaStar, FaDog, FaQuestion, FaPrayingHands } from 'react-icons/fa';

function Home() {
    // Reference to the ChatManager component
    const chatManagerRef = useRef(null);

    // Function to handle opening a specific chat
    const openChat = (chatId) => {
        // Check if chatManagerRef is set and it has the handleChatToggle method
        if (chatManagerRef.current && chatManagerRef.current.handleChatToggle) {
            chatManagerRef.current.handleChatToggle(chatId);
        } else {
            console.log(`Chat manager not ready yet. Unable to open: ${chatId}`);
        }
    };

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

                <section className="progress-section">
                    <div className="progress-card clay">
                        <div className="avatar">
                            <img src="/images/mascots/panda-avatar.png" alt="Panda mascot" onError={(e) => { e.target.src = 'https://ui-avatars.com/api/?name=Panda&background=b17d4a&color=fff'; e.target.onerror = null; }} />
                        </div>
                        <div className="info">
                            <h3>Day 3 of 30</h3>
                            <p>Complete today's meditation</p>
                        </div>
                        <div className="badge">24 min</div>
                    </div>

                    <div className="progress-card clay">
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

                <div className="app-grid">
                    <Link to="/soul" className="app-card clay">
                        <div className="app-icon">
                            <FaQuestion />
                        </div>
                        <h2>Soul Quest</h2>
                        <p>Quiz</p>
                        <div className="rating">
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                            <span className="star">★</span>
                        </div>
                    </Link>

                    <Link to="/karma" className="app-card clay karma-cafe">
                        <div className="app-icon">
                            <FaDog />
                        </div>
                        <h2>KarmaCafe</h2>
                        <p>Chat with wisdom</p>
                    </Link>
                    
                    <Link to="/dharma" className="app-card clay dharma-path">
                        <div className="app-icon">
                            <FaPrayingHands />
                        </div>
                        <h2>Dharma Path</h2>
                        <p>21-day spiritual journey</p>
                    </Link>
                    
                    <Link to="/pets" className="app-card clay featured">
                        <div className="app-icon">
                            <FaDog />
                        </div>
                        <div>
                            <h2>Wisdom Pets Deswas</h2>
                            <p>Virtual companions for mindfulness</p>
                        </div>
                    </Link>
                </div>
            </div>
            
            {/* Side chat icons */}
            <div className="side-chat-icons">
                <button className="chat-icon-button clay flower" onClick={() => openChat('karma')}>
                    <div className="chat-pet-icon"></div>
                </button>
                
                <button className="chat-icon-button clay flower-white" onClick={() => openChat('wisdom')}>
                    <div className="chat-pet-icon"></div>
                </button>
                
                <button className="chat-icon-button clay bear" onClick={() => openChat('meditation')}>
                    <div className="chat-pet-icon"></div>
                </button>
            </div>
            
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
            
            <ChatManager ref={chatManagerRef} />
        </div>
    );
}

export default Home;