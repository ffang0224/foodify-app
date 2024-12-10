import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ isExpanded }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl 
        hover:bg-gray-50 dark:hover:bg-gray-800 
        active:bg-gray-100 dark:active:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        transition-all duration-200"
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {isDarkMode ? (
          <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
        ) : (
          <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
        )}
      </div>
      {isExpanded && (
        <span className="ml-3 sm:ml-4 font-medium text-sm sm:text-base text-gray-600 dark:text-gray-300">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;