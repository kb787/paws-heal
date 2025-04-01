import React from "react";
import { ArrowDownCircle } from "lucide-react";

const Welcome = () => {
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="flex flex-col items-center px-8">
        <h1 className="text-7xl font-bold mb-4 text-center">
          <span className="animated-gradient">
            Hello, Bhoomika
          </span>
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-400 mb-8 text-center">
          How can I help your enterprise level query today? <br />
          I can help you extract, summarize, create reports & more.
        </p>

        <div className="flex justify-center w-full">
          <button className="flex items-center px-8 py-4 bg-purple-900 text-white rounded-lg 
            hover:bg-purple-700 hover:scale-105 hover:shadow-lg
            transition-all duration-300 ease-in-out
            transform active:scale-95">
            Explore Chatbots, Prompts & Features
            <ArrowDownCircle className="w-7 h-5 ml-2 animate-bounce" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;