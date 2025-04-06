import React from "react";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

const ChatHistory = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);
  const [userId, setUserId] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Step 1: Get user ID from local storage
        const storedUserId = localStorage.getItem("userId");
        console.log(storedUserId, "Id from storage");
  
        if (!storedUserId) return;
  
        setUserId(storedUserId);
  
        // Step 2: Fetch all documents
        const response = await fetch("http://localhost:3500/fetchAllChats", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data, "All documents");
        setAllDocuments(data);
  
        // Step 3: Filter documents by user ID
        const filtered = data.filter((doc) => doc.id === storedUserId);
        setFilteredDocuments(filtered);
      } catch (error) {
        console.error("Error during initialization:", error);
      }
    };
  
    initialize();
  }, []);
  

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const historyItems = [
    {
      category: "Network and Connectivity",
      question: "What should I do if the internet is slow?",
      timestamp: new Date(),
    },
    {
      category: "Password and Account",
      question: "How can I change my email password?",
      timestamp: new Date(),
    },
    {
      category: "Network and Connectivity",
      question: "Why can't I connect to Wi-Fi?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    },
    {
      category: "Printing and Scanning",
      question: "Why is my print job stuck in the queue?",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    },
  ];

  const groupByDate = (items) => {
    const groups = {
      Today: [],
      Yesterday: [],
    };

    items.forEach((item) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (item.timestamp.toDateString() === today.toDateString()) {
        groups.Today.push(item);
      } else if (item.timestamp.toDateString() === yesterday.toDateString()) {
        groups.Yesterday.push(item);
      }
    });

    return groups;
  };

  const groupedHistory = groupByDate(historyItems);

  return (
    // <div className="max-w-4xl mx-auto mt-8 mb-32">
    <div className="flex w-[100%]">
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-col w-[98%] min-h-screen p-[1%] ml-[1%]">
        {Object.entries(groupedHistory).map(([date, items]) =>
          items.length > 0 ? (
            <div key={date} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                {date}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => console.log("Clicked:", item.question)}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-left"
                  >
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {item.category}
                    </h3>
                    <p className="mt-1 text-gray-900 dark:text-gray-100">
                      {item.question}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
