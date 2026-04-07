/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B4332',
        'primary-light': '#2D6A4F',
        accent: '#D4A017',
        surface: '#0F1C14',
        'surface-2': '#162219',
        'surface-3': '#1E2E22',
        text: {
          primary: "#F0EDE6",
          muted: "#8FA89A",
        },
        danger: "#E05C5C",
        success: "#4CAF8A",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        heading: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Montserrat", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
