import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
          800: "#065F46",
          900: "#064E3B",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Syne", "sans-serif"],
      },
      boxShadow: {
        green: "0 4px 16px rgba(16,185,129,0.35)",
        soft:  "0 4px 24px rgba(0,0,0,0.08)",
        float: "0 8px 40px rgba(0,0,0,0.12)",
        card:  "0 2px 16px rgba(0,0,0,0.06)",
      },
      backgroundImage: {
        "brand-grad": "linear-gradient(135deg,#059669,#10B981)",
        "dark-grad":  "linear-gradient(135deg,#0F172A,#1E293B)",
      },
      animation: {
        "float":     "float 3s ease-in-out infinite",
        "slide-in":  "slide-in 0.3s ease-out",
        "pulse-live":"pulse-live 2s infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-6px)" },
        },
        "slide-in": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to:   { transform: "translateX(0)",    opacity: "1" },
        },
        "pulse-live": {
          "0%,100%": { boxShadow: "0 0 0 2px rgba(16,185,129,0.3)" },
          "50%":     { boxShadow: "0 0 0 5px rgba(16,185,129,0)" },
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
