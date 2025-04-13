import React from "react";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";

const ChatHistory = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);
  const [userId, setUserId] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const fullText = "Recent Activity";
  const [displayedText, setDisplayedText] = useState("");

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
        const filtered = data.filter((doc) => doc.userId === storedUserId);
        console.log(filtered, "Filtered documents");
        if (filtered.length > 0) {
          setFilteredDocuments(filtered);
          console.log("Store filtered documents", filteredDocuments);
        } else {
          setFilteredDocuments([]);
          console.log("No documents found for this user ID.");
        }
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

  // useEffect(() => {
  //   let currentIndex = 0;
  //   const interval = setInterval(() => {
  //     setDisplayedText((prev) => prev + fullText[currentIndex]);
  //     currentIndex++;
  //     if (currentIndex >= fullText.length) clearInterval(interval);
  //   }, 100); // 100ms delay between each character

  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   let currentIndex = 0;
  //   const interval = setInterval(() => {
  //     setDisplayedText((prev) => prev + fullText[currentIndex]);
  //     currentIndex++;

  //     if (currentIndex >= fullText.length) {
  //       clearInterval(interval);
  //     }
  //   }, 100); // 100ms delay per character

  //   return () => clearInterval(interval); // cleanup
  // }, []);

  // useEffect(() => {
  //   let currentIndex = 0;
  //   const interval = setInterval(() => {
  //     if (currentIndex < fullText.length) {
  //       setDisplayedText((prev) => prev + fullText[currentIndex]);
  //       currentIndex++;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 100);
  
  //   return () => clearInterval(interval);
  // }, []);
  

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      // Add one character at a time
      const nextChar = fullText.charAt(index);
      setDisplayedText((prev) => prev + nextChar);
      index++;

      // Stop when done
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 100); // Delay per character

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);
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
    <div className="flex w-[100%]">
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-col w-[95%] min-h-screen p-[1%] ml-[6%] mt-[10%] ">
        <div className="text-left text-[30px] text-white font-extrabold flex justify-start mt-[3%]">
          {displayedText}
        </div>
        <div className="flex items-center justify-around gap-[5%] w-[75%] mt-[5%]">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((item) => {
              return (
                <div
                  key={item._id}
                  className="border border-white rounded-[0.375rem] bg-[#302c54] p-[2%] w-[calc(35%-1rem)] h-[6rem] flex justify-center items-center"
                >
                  {item.user_query}
                </div>
              );
            })
          ) : (
            <div className="w-full h-[10rem]">
              <div className="text-left text-[18px] font-medium text-white ">
                No chats to display
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
