/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#121212',
        'dark-surface': '#1E1E1E',
        'dark-hover': '#2D2D2D',
        'dark-orange': {
          light: '#FFEDD5',
          DEFAULT: '#FB923C',
          dark: '#EA580C'
        }
      },
      keyframes: {
        'slide-right': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'slide-right': 'slide-right 0.5s ease-out',
        'slide-left': 'slide-left 0.5s ease-out',
      },
    }
  },
  plugins: [],
};