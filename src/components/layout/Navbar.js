import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 
      'bg-indigo-700' : 
      'hover:bg-gray-700';
  };

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-white font-bold text-xl">PrivacyDEX</span>
              <span className="ml-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                Hackathon 2025
              </span>
            </Link>
          </div>
          
          <div className="flex">
            <Link 
              to="/" 
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              to="/swap" 
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive('/swap')}`}
            >
              Swap
            </Link>
            <Link 
              to="/learn" 
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive('/learn')}`}
            >
              Privacy Learn
            </Link>
            <Link 
              to="/demo" 
              className={`text-white px-3 py-2 rounded-md text-sm font-medium ${isActive('/demo')}`}
            >
              Judge Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;