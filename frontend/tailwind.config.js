/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'farmer-green': '#2e7d32',
        'farmer-light': '#4caf50',
        'earth-brown': '#795548',
        'farm-bg': '#f3f6f4'
      }
    },
  },
  plugins: [],
}
