import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getIpAddress = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('Error getting IP address:', error);
      return 'unknown';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { text: inputMessage, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const userIp = await getIpAddress();
      console.log('User IP:', userIp);

      const requestData = {
        user_query: inputMessage,
        db_name: "wildlife",
        collection_name: "pdfs",
        user_ip: userIp
      };

      console.log('Sending request to app backend:', {
        url: `http://localhost:8000/rag/siva/query`,
        data: requestData
      });

      // Try app backend first
      const response = await axios.post(
        `http://localhost:8000/rag/siva/query`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      console.log('App backend response:', response.data);

      if (response.data && response.data.response) {
        setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
      } else {
        console.log('Falling back to Siva backend');
        console.log('Sending request to Siva backend:', {
          url: `${import.meta.env.VITE_SIVA_API_URL}/query`,
          data: requestData
        });

        // Fallback to Siva backend
        const sivaResponse = await axios.post(
          `${import.meta.env.VITE_SIVA_API_URL}/query`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          }
        );

        console.log('Siva backend response:', sivaResponse.data);

        if (sivaResponse.data && sivaResponse.data.response) {
          setMessages(prev => [...prev, { text: sivaResponse.data.response, sender: 'bot' }]);
        } else {
          setMessages(prev => [...prev, { text: 'Sorry, I could not process your request.', sender: 'bot' }]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { text: 'Sorry, I could not process your request.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;