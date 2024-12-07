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
      }
    }
  },
  plugins: [],
};