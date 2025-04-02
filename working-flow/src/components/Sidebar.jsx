import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Users,
  BookOpen,
  Store,
  Sun,
  Moon,
  LogOut,
  Plus,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ darkMode, toggleDarkMode }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Initially collapsed
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, text: "Home", path: "/welcome" },
    { icon: MessageSquare, text: "Chats", path: "/chats" },
    { icon: BookOpen, text: "Knowledge Hub", path: "/knowledge-hub" },
    { icon: BookOpen, text: "Data Management", path: "/datamanagement" },
    { icon: Store, text: "Agent Store", path: "/store" },
  ];

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] flex">
      {isCollapsed ? null : (
        <div
          className="bg-gray-50 dark:bg-black opacity-80 p-4 flex flex-col w-64 transition-all duration-300"
        >
          <button
            className="w-full bg-black dark:bg-white text-white dark:text-black rounded-lg p-3 flex items-center justify-center mb-6"
            onClick={() => navigate("/new-chat")}
          >
            <Plus className="w-5 h-5 mr-2" />
            <span>New Chat</span>
          </button>

          <div className="flex-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className="w-full text-left p-3 rounded-lg mb-2 flex items-center hover:bg-gray-200 dark:hover:bg-gray-800"
                onClick={() => navigate(item.path)}
              >
                <item.icon
                  className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300"
                />
                <span className="text-gray-700 dark:text-gray-200">
                  {item.text}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-auto border-t border-gray-200 dark:border-gray-700 pt-4">
            <button className="w-full text-left p-3 rounded-lg mb-2 flex items-center hover:bg-gray-200 dark:hover:bg-gray-800">
              <MessageCircle className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-200">
                Feedback
              </span>
            </button>
            <button className="w-full text-left p-3 rounded-lg mb-2 flex items-center hover:bg-gray-200 dark:hover:bg-gray-800">
              <LogOut className="w-5 h-5 mr-3 text-gray-600 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-200">Log Out</span>
            </button>
          </div>
        </div>
      )}

      <button
        className="bg-gray-50 dark:bg-black opacity-60 p-2 text-gray-600 dark:text-gray-300 rounded-r-lg shadow-lg"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    </div>
  );
};

export default Sidebar;
