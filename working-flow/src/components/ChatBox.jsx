import React, { useEffect, useState } from 'react';

const messages = [
  { type: 'bot', text: 'Hello! How can I assist you today?' },
  { type: 'user', text: 'Can you tell me about SiVA.ai features?' },
  { type: 'bot', text: 'SiVA.ai offers context-aware responses, predictive analytics, and intelligent workflow automation.' },
  { type: 'user', text: 'How does the context-aware response work?' },
  { type: 'bot', text: 'We use advanced RAG and Graph-RAG technologies to analyze multiple data sources and provide relevant, contextual answers.' }
];

export default function ChatBox() {
  const [visibleMessages, setVisibleMessages] = useState([]);

  useEffect(() => {
    let timeoutIds = [];

    const startChatLoop = () => {
      setVisibleMessages([]); // Clear messages to restart the chat
      messages.forEach((msg, index) => {
        const timeoutId = setTimeout(() => {
          setVisibleMessages(prev => [...prev, msg]);
        }, index * 2000); // Add messages with a delay
        timeoutIds.push(timeoutId);
      });

      // Restart the loop after the last message
      const loopTimeoutId = setTimeout(startChatLoop, messages.length * 2000 + 2000);
      timeoutIds.push(loopTimeoutId);
    };

    startChatLoop();

    // Cleanup timeouts on component unmount
    return () => timeoutIds.forEach(id => clearTimeout(id));
  }, []);

  return (
    <div className="bg-dark/90 rounded-lg p-4 w-full max-w-md h-[400px] overflow-y-auto absolute right-0 mr-6 top-1/4">
      <div className="space-y-4">
        {visibleMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.type === 'user' 
                ? 'bg-neon-purple text-white' 
                : 'bg-gray-800 text-gray-200'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
