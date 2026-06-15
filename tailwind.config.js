/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nestle: {
          red: '#E2001A',
          dark: '#1A1A1A',
          green: '#00703C',
          gold: '#F0A500',
        },
      },
    },
  },
  plugins: [],
}