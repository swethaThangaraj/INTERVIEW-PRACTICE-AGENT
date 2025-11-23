import React from 'react';

export default function Message({ who, text }) {
  return (
    <div className={`message ${who === 'user' ? 'user' : 'bot'}`}>
      <div className="bubble">
        <strong>{who === 'user' ? 'You' : 'AI'}:</strong> {text}
      </div>
    </div>
  );
}
