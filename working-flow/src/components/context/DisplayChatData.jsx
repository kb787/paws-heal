import React from "react";
import Sidebar from "../Sidebar";
import { useDocumentContext } from "./DocumentContext";
import { useState, useEffect } from "react";

const DisplayChatData = () => {
  const [darkMode, setDarkMode] = useState(false);
  const fullText = "Your Recent Chats";
  const [displayedText, setDisplayedText] = useState("");
  const [chatId,setChatId] = useState(null) ;
  const [chatData,setChatData] = useState([]) ;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [darkMode]);

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const {filteredDocumentsContext, setFilteredDocumentsContext } = useDocumentContext();



  useEffect(() => {
    const handleChatFiltering = async() => {
    console.log(filteredDocumentsContext,'before-filtering-context') ;
    const storageData = localStorage.getItem("chatId") ;
    if(storageData){
        console.log(storageData,'id-fetched-from-storage') ;
        const filtered = filteredDocumentsContext.filter((item) => item._id === storageData);
        if(filtered){
           console.log('filtered-single-chat',filtered) ;
           setChatData(filtered[0]) ;
           console.log('final-state-value',chatData) ;
        }
    }    
  }
  handleChatFiltering()}, []);
  
  return (
    <div className="flex w-[100%]">
      <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div className = "flex flex-col w-[98%] min-h-screen p-4 ml-6 mt-10">
      <div className="text-center text-3xl text-white font-extrabold flex justify-center mb-6">
          {displayedText}
        </div>
      <div className="w-full flex justify-end mb-2">
      <div className="flex flex-col border border-white rounded-lg text-white p-2 min-w-12 max-w-fit justify-start text-left items-start bg-[#302c54]">
  <div className="text-left font-bold text-[20px] w-full">
    Query
  </div>
  <div className="font-light text-[16px] mt-[1%]">
    {chatData.user_query}
  </div>
</div>
  </div>
  <div className="w-full flex justify-start mb-2 mt-[0.5%]">
    <div className="flex flex-col border border-white rounded-lg text-white p-2 min-w-12 justify-center items-center ml-[2%] bg-[#302c54]">
     <div className = "font-bold text-[20px] text-left w-full">
        Response 
     </div> 
     <div className = "font-light text-[16px] mt-[1%]">
    {chatData.answer}
    </div> 
    </div>
  </div> 
      </div>
    </div>
  );
};

export default DisplayChatData;
