// src/components/KarmaCafe/ChatBubble.js
import React from 'react';
import './KarmaCafe.css';

const ChatBubble = ({ type, text }) => {
    return (
        <div className={`chat-bubble ${type}`}>
            {text}
        </div>
    );
};

export default ChatBubble;