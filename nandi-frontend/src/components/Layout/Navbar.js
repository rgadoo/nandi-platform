// src/components/Layout/Navbar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    return (
        <div className="nav-bar">
            <NavLink
                to="/"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon">🏠</span>
                <span className="nav-label">Home</span>
            </NavLink>
            <NavLink
                to="/soul"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon">✨</span>
                <span className="nav-label">SoulQuest</span>
            </NavLink>
            <NavLink
                to="/pets"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon">🐘</span>
                <span className="nav-label">WisdomPets</span>
            </NavLink>
            <NavLink
                to="/chat-test"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon">💬</span>
                <span className="nav-label">Chat</span>
            </NavLink>
            <NavLink
                to="/clay-demo"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
                <span className="nav-icon">🎨</span>
                <span className="nav-label">UI Demo</span>
            </NavLink>
        </div>
    );
};

export default Navbar; 