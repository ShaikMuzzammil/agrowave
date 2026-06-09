/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0A0703",
        soil: "#1A0E05",
        loam: "#2C1A0A",
        bark: "#3D2410",
        moss: "#2D6A4F",
        fern: "#52B788",
        leaf: "#95D5B2",
        amber: "#E9A319",
        wheat: "#F4D03F",
        rust: "#C0392B",
        clay: "#8B5E3C",
        parchment: "#F5E6C8",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        data: ["Space Mono", "monospace"],
        accent: ["Playfair Display", "serif"],
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "ticker": "ticker 40s linear infinite",
        "rain-drop": "rain-drop 1s linear infinite",
        "grow": "grow 0.6s ease-out forwards",
        "flash": "flash 0.5s ease-in-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(45,106,79,0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(45,106,79,0)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "rain-drop": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(80px)", opacity: "0" },
        },
        grow: {
          "0%": { transform: "scale(0.1)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        flash: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;