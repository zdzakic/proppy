// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
//   theme: {
//     extend: {
//       colors: {
//         brand: {
//           bg: "var(--bg)",
//           surface: "var(--surface)",
//           primary: "var(--primary)",
//           accent: "var(--accent)",
//           border: "var(--border)",
//           text: "var(--text)",
//           muted: "var(--muted)",
//         },
//       },

//       fontFamily: {
//         sans: ["Inter", "system-ui", "sans-serif"],
//         display: ["Playfair Display", "Georgia", "serif"],
//       },

//       boxShadow: {
//         premium: "0 20px 50px rgba(0,0,0,0.08)",
//       },

//       borderRadius: {
//         xl: "1rem",
//         "2xl": "1.5rem",
//       },
//     },
//   },
  plugins: [],
};

export default config;
