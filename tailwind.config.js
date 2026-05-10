/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#141414",
        accent: "#3b82f6",
        lilac: "#c8a2c8",
        lilacDark: "#9b729b",
      }
    },
  },
  plugins: [],
}
