import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const newChatHistory = [...chatHistory, { sender: 'user', message: userMessage }];
    setChatHistory(newChatHistory);

    try {
      const response = await axios.post('/api/chatbot', { userMessage });
      setChatHistory([...newChatHistory, { sender: 'bot', message: response.data.reply }]);
    } catch (error) {
      setChatHistory([...newChatHistory, { sender: 'bot', message: 'Error in fetching response' }]);
    }

    setUserMessage('');
  };

  return (
    <div className="chatbot">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={chat.sender === 'user' ? 'user-message' : 'bot-message'}>
            <p>{chat.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask about our services..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbot;