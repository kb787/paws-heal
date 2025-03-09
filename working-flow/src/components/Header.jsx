import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-dark/90 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Home button */}
          <Link
            to="/"
            className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-purple-400 bg-clip-text text-transparent"
          >
            SiVA.ai
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/welcome" // Navigates to the Welcome page
              className="text-white hover:text-neon-purple transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/mentorship"
              className="text-white hover:text-neon-purple transition-colors"
            >
              Mentorship
            </Link>
            <Link
              to="/contact"
              className="text-white hover:text-neon-purple transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
