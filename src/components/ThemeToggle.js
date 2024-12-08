import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {isDarkMode ? (
          <Sun className="text-gray-500 dark:text-gray-400" />
        ) : (
          <Moon className="text-gray-500 dark:text-gray-400" />
        )}
      </div>
      <span className="ml-4 font-medium text-gray-600 dark:text-gray-300">
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;