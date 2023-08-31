/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxs': '440px',
        'xxxs': '340px'
      },
      colors: {
        'kv-red': "#d02424",
        "kv-gray": "#b8b4b4",
        "kv-logo-gray": "#5c605c",
        "slate-gray": "#6D6D6D",
        "white-400": "rgba(255, 255, 255, 0.80)"
      },
    },
  },
  plugins: [],
}

