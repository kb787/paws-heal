import React from "react";
import Navbar from "../components/Navbar";
import DataManagement from "../components/DataManagement";
import Sidebar from "../components/Sidebar";
import { useState , useEffect } from "react";

function DataManagementPage(){
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

return(
    <div>
        <Navbar></Navbar>
        <DataManagement></DataManagement>
        <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode}  />
    </div>
)
}

export default DataManagementPage;