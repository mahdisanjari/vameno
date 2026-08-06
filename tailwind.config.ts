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
        markazi: ["var(--font-markazi)", "var(--font-vazir)", "serif"],
        cormorant: ["var(--font-cormorant)", "Georgia", "serif"],
        nastaliq: ["var(--font-nastaliq)", "var(--font-vazir)", "serif"],
      },
      colors: {
        /* سبز کاشی — Tile Green. Second brand colour, doubles as the
           "verified" semantic. Keeps the `primary` key so existing usage
           compiles unchanged. */
        primary: {
          50: "#f0f6f4",
          100: "#dbeae6",
          200: "#b7d5ce",
          300: "#8abab0",
          400: "#529a8c",
          500: "#2a7a6c",
          600: "#14524a",
          700: "#114540",
          800: "#0e3833",
          900: "#0b2c29",
          950: "#061a18",
        },
        /* زر کهن — Old Gold. Leafed-manuscript gold: earthy and
           desaturated, never neon yellow. Use sparingly (see note below). */
        accent: {
          50: "#fbf6ea",
          100: "#f6ebcf",
          200: "#edd9a2",
          300: "#e7cd8b",
          400: "#d9b665",
          500: "#c9a24b",
          600: "#a8842f",
          700: "#8e6b28",
          800: "#6b4f1c",
          900: "#4e3914",
          950: "#2e220c",
        },
        /* لاجورد — Night Lapis. The brand's native ground. */
        navy: {
          50: "#eef1f6",
          100: "#d8dee8",
          200: "#b2bdce",
          300: "#8695af",
          400: "#5c6f8d",
          500: "#3e5273",
          600: "#2e3f5b",
          700: "#253349",
          800: "#1d2838",
          900: "#1a2534",
          950: "#131c29",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 2px 10px -2px rgb(19 28 41 / 0.07), 0 1px 3px -1px rgb(19 28 41 / 0.06)",
        "card-hover": "0 10px 28px -6px rgb(19 28 41 / 0.16), 0 2px 6px -2px rgb(19 28 41 / 0.08)",
        /* the 1px metallic relief of the logo, reproduced on gold surfaces */
        "gold-relief":
          "inset 0 1px 0 rgb(255 255 255 / 0.30), inset 0 -1px 0 rgb(0 0 0 / 0.22)",
        "gold-glow":
          "inset 0 1px 0 rgb(255 255 255 / 0.36), inset 0 -1px 0 rgb(0 0 0 / 0.22), 0 8px 22px -10px rgb(201 162 75 / 0.75)",
      },
      backgroundImage: {
        /* زر کوبیده — three-stop burnished gold for the single primary CTA */
        "gold-leaf":
          "linear-gradient(170deg, #e7cd8b 0%, #c9a24b 58%, #a8842f 100%)",
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
