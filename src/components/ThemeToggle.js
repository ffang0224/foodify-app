// src/components/ThemeToggle.js
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {  // Changed to const declaration
  const { isDarkMode, toggleTheme } = useTheme();  // Changed from toggleDarkMode to toggleTheme

  return (
    <button
      onClick={toggleTheme}  // Changed from toggleDarkMode to toggleTheme
      className="p-2 rounded-lg transition-colors duration-200
        dark:bg-gray-800 bg-gray-100
        dark:hover:bg-gray-700 hover:bg-gray-200"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle;