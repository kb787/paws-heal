import React from "react";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { Eye, Trash } from "lucide-react";
import { Tooltip } from "reactstrap";
import axios from "axios";
import { useDocumentContext } from "./context/DocumentContext";
import {useNavigate} from 'react-router-dom'

const ChatHistory = () => {
  const navigate = useNavigate() ;
  const [darkMode, setDarkMode] = useState(false);
  const [allDocuments, setAllDocuments] = useState([]);
  const [userId, setUserId] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const fullText = "Chat History";
  const [displayedText, setDisplayedText] = useState("");
  const [eyeDisplay, setEyeDisplay] = useState(false);
  const [trashDisplay, setTrashDisplay] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const { filteredDocumentsContext,setFilteredDocumentsContext } = useDocumentContext();

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
          setFilteredDocumentsContext(filtered) ;
          // console.log("Store filtered documents", filteredDocuments);
          console.log("Context-Value",filteredDocumentsContext) ;
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

  useEffect(() => {
    // Reset displayed text at the beginning
    setDisplayedText("");
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
  }, [fullText]);
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
  const handleDeleteChat = async () => {
    try {
      console.log(userId, "id-recieved");
      await axios.delete(`http://localhost:3500/delete-chat/:${userId}`);
      alert("Chat deleted successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Server side error occured");
    }
  };

  const handleChatNavigation = (chatId) => {
       localStorage.setItem("chatId",chatId) ;
      navigate("/chat-data")
  }

  return (
    <div className="flex w-[100%]">
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-col w-[98%] min-h-screen p-4 ml-6 mt-10">
        <div className="text-center text-3xl text-white font-extrabold flex justify-center mb-6">
          {displayedText}
        </div>
        <div className="w-full">
          {filteredDocuments.length > 0 ? (
            <div className="flex flex-col gap-4 w-full overflow-y-auto h-[35rem]">
              {filteredDocuments?.map((item) => (
                <div
                  key={item._id}
                  className="border border-white rounded-md bg-[#302c54] p-2 w-full h-24 flex justify-start items-center"
                >
                  <div className="flex flex-1 justify-between">
                    <div>{item.user_query}</div>
                    <div className="flex gap-4 mr-[2%]">
                      {/* Eye Icon */}
                      <div
                        id={`eye-${item._id}`}
                        onMouseEnter={() => {
                          setHoveredId(item._id);
                          setHoveredIcon("eye");
                          
                        }}
                        onClick={() => handleChatNavigation(item._id)}
                        onMouseLeave={() => {
                          setHoveredId(null);
                          setHoveredIcon(null);
                          localStorage.clear("chatId")
                        }}
                        style={{ cursor: "pointer" }}
                        // onClick={handleChatNavigation(item._id)}
                      >
                        <Eye />
                      </div>

                      {/* Trash Icon */}
                      <div
                        id={`trash-${item._id}`}
                        onMouseEnter={() => {
                          setHoveredId(item._id);
                          setHoveredIcon("trash");
                        }}
                        onMouseLeave={() => {
                          setHoveredId(null);
                          setHoveredIcon(null);
                        }}
                        style={{ cursor: "pointer" }}
                        onClick={handleDeleteChat}
                      >
                        <Trash />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Tooltip for Eye */}
              {hoveredIcon === "eye" && (
                <Tooltip
                  isOpen={true}
                  target={`eye-${hoveredId}`}
                  placement="top"
                  className="text-[12px]"
                >
                  <div className="bg-dark text-white p-1 rounded-[8px]">
                    {" "}
                    View chat{" "}
                  </div>
                </Tooltip>
              )}

              {/* Tooltip for Trash */}
              {hoveredIcon === "trash" && (
                <Tooltip
                  isOpen={true}
                  target={`trash-${hoveredId}`}
                  placement="top"
                  className="text-[12px]"
                >
                  <div className="bg-dark text-white p-1 rounded-[8px]">
                    Delete chat{" "}
                  </div>
                </Tooltip>
              )}
            </div>
          ) : (
            <div className="w-full">
              <div className="text-left text-lg font-medium text-white">
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
