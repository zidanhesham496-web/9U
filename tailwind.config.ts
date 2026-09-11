import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#050b16",
          900: "#081322",
          800: "#0d1b2e",
        },
        ivory: {
          50: "#f7f8f5",
          100: "#e9ece8",
          300: "#aeb8ba",
        },
      },
      boxShadow: {
        glass: "0 24px 80px rgba(0, 0, 0, 0.34), 0 8px 24px rgba(2, 10, 23, 0.24)",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(18px, -24px, 0) scale(1.08)" },
        },
        "float-delayed": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(-22px, 18px, 0) scale(0.94)" },
        },
      },
      animation: {
        "float-slow": "float-slow 18s ease-in-out infinite",
        "float-delayed": "float-delayed 23s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;