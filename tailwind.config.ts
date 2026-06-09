import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand:   { 50:"#ECFDF5", 100:"#D1FAE5", 200:"#A7F3D0", 300:"#6EE7B7", 400:"#34D399", 500:"#10B981", 600:"#059669", 700:"#047857", 800:"#065F46", 900:"#064E3B" },
        sky:     { 50:"#EFF6FF", 100:"#DBEAFE", 400:"#60A5FA", 500:"#3B82F6", 600:"#2563EB" },
        gold:    { 400:"#FBBF24", 500:"#F59E0B", 600:"#D97706" },
        rose:    { 400:"#FB7185", 500:"#F43F5E", 600:"#E11D48" },
        slate:   { 50:"#F8FAFC", 100:"#F1F5F9", 200:"#E2E8F0", 300:"#CBD5E1", 400:"#94A3B8", 500:"#64748B", 600:"#475569", 700:"#334155", 800:"#1E293B", 900:"#0F172A" },
        canvas:  "#F0FDF8",
        surface: "#FFFFFF",
      },
      fontFamily: {
        display: ["Cabinet Grotesk", "DM Sans", "system-ui", "sans-serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        soft:   "0 2px 20px rgba(16,185,129,0.08)",
        card:   "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        green:  "0 8px 32px rgba(16,185,129,0.25)",
        glow:   "0 0 40px rgba(16,185,129,0.15)",
        float:  "0 16px 48px rgba(0,0,0,0.12)",
      },
      backgroundImage: {
        "hero-mesh": "radial-gradient(ellipse at 10% 50%, rgba(16,185,129,0.12) 0%,transparent 60%), radial-gradient(ellipse at 90% 20%, rgba(59,130,246,0.08) 0%,transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.06) 0%,transparent 50%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
        "brand-grad": "linear-gradient(135deg, #059669 0%, #10B981 50%, #34D399 100%)",
        "sky-grad":   "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
        "gold-grad":  "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
      },
      keyframes: {
        shimmer: { "0%":{ backgroundPosition:"-200% 0" }, "100%":{ backgroundPosition:"200% 0" } },
        fadeUp:  { "0%":{ opacity:"0", transform:"translateY(20px)" }, "100%":{ opacity:"1", transform:"translateY(0)" } },
        pulse2:  { "0%,100%":{ opacity:"1" }, "50%":{ opacity:"0.5" } },
        ticker:  { "0%":{ transform:"translateX(0)" }, "100%":{ transform:"translateX(-50%)" } },
        float:   { "0%,100%":{ transform:"translateY(0)" }, "50%":{ transform:"translateY(-6px)" } },
        ripple:  { "0%":{ transform:"scale(0.8)", opacity:"1" }, "100%":{ transform:"scale(2.4)", opacity:"0" } },
        spin:    { to:{ transform:"rotate(360deg)" } },
      },
      animation: {
        shimmer: "shimmer 2s linear infinite",
        fadeUp:  "fadeUp 0.5s ease both",
        ticker:  "ticker 35s linear infinite",
        float:   "float 4s ease-in-out infinite",
        ripple:  "ripple 2s ease-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
