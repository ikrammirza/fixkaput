import React, { useState } from 'react';
import Chatbot from './Chatbot';

function FloatingChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
      >
        💬
      </button>

      {/* Chatbot Panel */}
      {isChatOpen && (
        <div className="fixed bottom-16 right-5 w-80 h-96 bg-white rounded-lg shadow-lg border border-gray-300">
          <button
            onClick={toggleChat}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✖️
          </button>
          <Chatbot />
        </div>
      )}
    </div>
  );
}

export default FloatingChat;