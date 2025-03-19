// src/components/KarmaCafe/InputArea.js
import React from 'react';
import './KarmaCafe.css';

const InputArea = ({ inputText, setInputText, handleSend, isLoading, placeholder }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-area">
      <input
        type="text"
        className="input-field"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Type your question here..."}
        disabled={isLoading}
        autoFocus
      />
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={isLoading || !inputText.trim()}
      >
        {isLoading ? "..." : "Send"}
      </button>
    </div>
  );
};

export default InputArea;