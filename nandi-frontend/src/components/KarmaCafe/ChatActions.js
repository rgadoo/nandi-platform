// src/components/KarmaCafe/ChatActions.js
import React from 'react';
import './KarmaCafe.css';

const ChatActions = () => {
    return (
        <div className="chat-actions">
            <button className="action-button like" title="Like this response">👍</button>
            <button className="action-button dislike" title="Dislike this response">👎</button>
            <button className="action-button bookmark" title="Save this insight">🔖</button>
            <button className="action-button share" title="Share this wisdom">🔗</button>
        </div>
    );
};

export default ChatActions;