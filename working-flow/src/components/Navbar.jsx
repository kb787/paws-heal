import React from 'react';
import { Bell, LogIn } from 'lucide-react';
import { Route , Router } from 'lucide-react';
import { Link } from'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-black opacity-80 p-4 flex justify-between items-center z-50 ">
      <Link to = "/"      
      className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-purple-500 dark:text-purple-400" >SiVA.ai</h1>
      </Link >
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
          <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
