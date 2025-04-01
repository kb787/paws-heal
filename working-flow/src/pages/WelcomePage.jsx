import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Welcome from "../components/Welcome";
import ChatInput from "../components/ChatInput";
// import { useState } from "react";
// import SparkleEffect from "../components/SparkleEffect";
import ParticlesBackground from "../components/ParticlesBackground";

function WelcomePage() {
    const [darkMode, setDarkMode] = useState(false);
    const [isWelcomeVisible, setIsWelcomeVisible] = useState(true); // State for visibility

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

    const handleMessageSent = () => {
        setIsWelcomeVisible(false); // Hide Welcome component when message is sent
    };

    return (
        <div>
            <Navbar />
            <ParticlesBackground />
            <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            {isWelcomeVisible && <Welcome />}  {/* Conditionally render Welcome */}
            <ChatInput onMessageSent={handleMessageSent} />  {/* Pass function to ChatInput */}
        </div>
    );
}

export default WelcomePage;