import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState , useEffect } from "react";
import KnowledgeBase from "../components/KnowledgeBase";
import ParticlesBackground from "../components/ParticlesBackground";
function KnowledgePage(){

    const [darkMode, setDarkMode] = useState(false);
    
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
    return (
        <div>
            <Navbar />
            
            <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <KnowledgeBase />

        </div>
        
    )
}

export default KnowledgePage;