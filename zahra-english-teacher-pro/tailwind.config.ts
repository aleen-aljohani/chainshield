import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Elegant green / white / neutral palette
        brand: {
          50: "#f0f9f4",
          100: "#dcf1e3",
          200: "#bce3cb",
          300: "#8ecda8",
          400: "#5aae7e",
          500: "#37905f",
          600: "#27744b",
          700: "#205c3d",
          800: "#1d4a33",
          900: "#193d2c",
          950: "#0d2219",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
