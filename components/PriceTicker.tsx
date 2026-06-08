"use client";
import { useEffect, useState, useRef } from "react";
import { CROPS, getLivePrices } from "@/lib/utils";

export default function PriceTicker() {
  const [prices, setPrices] = useState<Record<string,any>>({});
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setPrices(getLivePrices());
    const iv = setInterval(() => setPrices(getLivePrices()), 45000);
    return () => clearInterval(iv);
  }, []);

  const items = Object.entries(CROPS).map(([k, v]) => ({
    key: k, emoji: v.emoji, name: k.toUpperCase(),
    price: prices[k]?.current ?? v.base,
    pct: prices[k]?.pct ?? 0,
    unit: v.unit,
  }));
  // Double for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden no-print"
      style={{ background: "#0F172A", borderBottom: "1px solid rgba(255,255,255,0.08)", height: "38px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg,#0F172A,transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
        style={{ background: "linear-gradient(270deg,#0F172A,transparent)" }} />

      <div
        className="flex items-center h-full"
        style={{
          width: "max-content",
          animation: paused ? "none" : "tickerScroll 38s linear infinite",
        }}
      >
        {doubled.map((item, i) => {
          const up = item.pct >= 0;
          return (
            <div key={i} className="flex items-center gap-2 px-5 border-r border-white/10 h-full flex-shrink-0">
              <span className="text-base">{item.emoji}</span>
              <span className="text-white/60 text-xs font-semibold tracking-wide">{item.name}</span>
              <span className="text-white font-bold text-xs">
                ₹{item.price.toLocaleString("en-IN")}
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: up ? "#4ADE80" : "#F87171" }}
              >
                {up ? "▲" : "▼"}{Math.abs(item.pct).toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
