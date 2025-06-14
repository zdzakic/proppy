/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // OVO MORA BITI TU!
  theme: {
    extend: {
      colors: {
        primary: '#f97316',
        navy: '#1e293b',
        light: '#e0f2fe',
        base: '#ffffff',
        grayText: '#64748b',
        borderGray: '#cbd5e1'
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
