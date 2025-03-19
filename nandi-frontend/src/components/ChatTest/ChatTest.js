import React from 'react';
import MarsChat from '../MarsChat/MarsChat';

const ChatTest = () => {
  return (
    <div className="chat-test-container">
      <h1>Chat Component Test Page</h1>
      <p>This page demonstrates the Chatscope chat widget. Click the chat button in the bottom right corner to start a conversation.</p>
      
      <div style={{ margin: '20px 0', padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '5px' }}>
        <h2>Features</h2>
        <ul>
          <li>Clean, minimalist design</li>
          <li>Expandable chat window</li>
          <li>Typing indicators</li>
          <li>Avatar support</li>
          <li>Fully customizable</li>
          <li>Mobile responsive</li>
        </ul>
      </div>
      
      {/* The MarsChat component will appear as a floating button */}
      <MarsChat />
    </div>
  );
};

export default ChatTest; 