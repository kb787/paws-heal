import React, { useState, useEffect, useRef } from "react";
import {
  ToggleLeftIcon,
  ToggleRightIcon,
  Mic,
  SendIcon,
  Copy,
  User,
} from "lucide-react";
import axios from "axios";

const ChatInterface = ({ onMessageSent }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseTime, setResponseTime] = useState(null);
  const messagesEndRef = useRef(null);
  const startTimeRef = useRef(null);
  const [copyMessage, setCopyMessage] = useState(""); // To handle the copy message
  const [userId,setUserId] = useState('') ;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(
     () => {
         const storedUserId = localStorage.getItem("userId") ;
         console.log(storedUserId,'Id from dtorage') ;
         if(storedUserId){
             setUserId(storedUserId) ;
         }
     }
  )
  useEffect(scrollToBottom, [messages]);
  const getIpAddress = async () => {
    try {
      const response = await fetch("https://httpbin.org/ip");
      const data = await response.json();
      return data.origin;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return "Unknown";
    }
  };

  // Helper function to bold text appearing between ** **
  const boldText = (content) => {
    const parts = content.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <b key={index}>{part.slice(2, -2)}</b>
      ) : (
        part
      )
    );
  };

  const formatMessageContent = (content) => {
    return content
      .split(/[\n\r]+/)
      .filter((line) => line.trim() !== "")
      .map((line, index) => <div key={index}>{boldText(line.trim())}</div>);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) {
      console.error("Input is empty.");
      return;
    }

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    startTimeRef.current = Date.now();
    onMessageSent();

    try {
      const userIp = await getIpAddress();
      const response = await axios.post(
        " http://127.0.0.1:8000/rag/siva/query",
        {
          user_query: input.trim(),
          id:userId,
          user_ip: userIp,
          db_name: "wildlife",
          collection_name: "pdfs",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      const endTime = Date.now();
      const responseDuration = (
        (endTime - startTimeRef.current) /
        1000
      ).toFixed(2);
      setResponseTime(responseDuration);

      const assistantMessage = {
        role: "assistant",
        content: `${data.response || "No response received."}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        role: "assistant",
        content: "Sorry, I could not process your request.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSwitch = () => {
    setIsToggleOn((prev) => !prev);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopyMessage("Copied!"); // Display the "Copied!" message
        setTimeout(() => setCopyMessage(""), 3000); // Hide after 3 seconds
      },
      (err) => console.error("Failed to copy text: ", err)
    );
  };

  return (
    <div className="flex flex-col h-full w-full chat-interface">
      {/* Copy message display */}
      {copyMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-purple-700 text-white text-sm px-4 py-2 rounded-md">
          {copyMessage}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-16">
        <div className="max-w-4xl mx-auto w-full px-4 pt-24">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } mb-4 relative`}
            >
              <div
                className={`absolute top-0 ${
                  message.role === "user" ? "right-[-40px]" : "left-[-40px]"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-8 h-8 text-purple-700 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">S</span>
                  </div>
                )}
              </div>

              <div
                className={`message-container relative pl-4 pr-8 pt-3 pb-5 rounded-xl max-w-[60%] ${
                  message.role === "user"
                    ? "bg-purple-900 text-white"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                <ul className="pr-6 list-disc">
                  {formatMessageContent(message.content)}
                </ul>

                <div
                  className={`absolute bottom-1 right-2 text-xs ${
                    message.role === "user"
                      ? "text-purple-200"
                      : "text-gray-400"
                  }`}
                >
                  {message.timestamp}
                  {message.role === "assistant" && responseTime && (
                    <span className="ml-2">({responseTime}s)</span>
                  )}
                </div>

                <button
                  onClick={() => copyToClipboard(message.content)}
                  className="absolute top-1 right-1 p-1 rounded-full text-white hover:bg-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start ml-8 mt-4">
              <div className="relative bg-gray-800 px-4 py-2 rounded-xl">
                <div className="flex space-x-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-400"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="fixed bottom-0 w-full p-4 flex justify-center">
        <div className="relative w-1/2 max-w-2xl min-w-[320px]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-xs text-white font-bold">S</span>
            </div>
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask Prithvi AI..."
            disabled={isLoading}
            className="w-full p-4 pl-12 pr-20 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-800 text-white"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-purple-500 rounded-full text-white hover:bg-purple-600"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
