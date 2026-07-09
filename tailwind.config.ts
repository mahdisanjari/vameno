import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1152px",
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        vazir: ["var(--font-vazir)", "Tahoma", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eff8f5",
          100: "#d7efe6",
          200: "#b0dfcd",
          300: "#7fc9ad",
          400: "#4ba888",
          500: "#2a8a6c",
          600: "#1f6f57",
          700: "#1a5847",
          800: "#17453a",
          900: "#123830",
          950: "#081f1a",
        },
        accent: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f2760f",
          600: "#e2590a",
          700: "#bc430c",
          800: "#963511",
          900: "#7a2e11",
        },
        navy: {
          50: "#eef2f8",
          100: "#d6e0ee",
          200: "#adc1dd",
          300: "#7f9cc6",
          400: "#5779ac",
          500: "#3c5c8f",
          600: "#2d4770",
          700: "#243a5c",
          800: "#1c2d48",
          900: "#12203a",
          950: "#0b1526",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 2px 10px -2px rgb(20 40 35 / 0.08), 0 1px 3px -1px rgb(20 40 35 / 0.06)",
        "card-hover": "0 8px 24px -4px rgb(20 40 35 / 0.14), 0 2px 6px -2px rgb(20 40 35 / 0.08)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.35s ease-out",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
