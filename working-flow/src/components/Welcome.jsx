import React from "react";
import { ArrowDownCircle } from "lucide-react";
import { useState, useEffect } from "react";

const Welcome = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const myId = localStorage.getItem("userId");
        if (!myId) return;

        console.log(myId, "userId-Storage");

        const response = await fetch("http://localhost:3500/fetch-all-users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log(data, "user data");

        setUserId(myId);
        setUserData(data);

        const filteredValue = data.filter((item) => item._id === myId);
        console.log(filteredValue, "filtered-value");

        if (filteredValue.length > 0) {
          console.log(filteredValue[0].username);
          setUserName(filteredValue[0].username);
        }
      } catch (error) {
        alert(`Unable to fetch the user due to error ${error}`);
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="flex flex-col items-center px-8">
        <h1 className="text-7xl font-bold mb-4 text-center">
          <span className="animated-gradient">Hello, {userName}</span>
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-400 mb-8 text-center mx-[12%]">
          Explore the world of wildlife with me! I can provide information on
          animal species, endangered wildlife data, and conservation efforts
        </p>

        <div className="flex justify-center w-full">
          <button
            className="flex items-center px-8 py-4 bg-purple-900 text-white rounded-lg 
            hover:bg-purple-700 hover:scale-105 hover:shadow-lg
            transition-all duration-300 ease-in-out
            transform active:scale-95"
          >
            Explore Chatbots, Prompts & Features
            <ArrowDownCircle className="w-7 h-5 ml-2 animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
