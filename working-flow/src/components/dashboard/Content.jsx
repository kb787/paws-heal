import Header from "./Header";
import Analytics from "./Analytics";
import Footer from "./Footer";
import Sidebar from "../Sidebar";
import { useState, useEffect } from "react";
const Content = () => {
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
    <>
      <div className="flex w-[100%]">
        <Sidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex flex-col w-[98%] min-h-screen p-[1%] ml-[1%]">
          <Header />
          <Analytics />
          <Footer />
        </div>
      </div>
    </>
  );
};
export default Content;
