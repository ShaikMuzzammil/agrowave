"use client";
import { useEffect, useState } from "react";
import { CROPS, getLivePrices } from "@/lib/utils";

export default function PriceTicker() {
  const [prices, setPrices] = useState<Record<string,any>>({});
  useEffect(() => {
    setPrices(getLivePrices());
    const iv = setInterval(() => setPrices(getLivePrices()), 60000);
    return () => clearInterval(iv);
  },[]);

  const items = Object.entries(CROPS).map(([k,v]) => ({
    k, ...v,
    cur: prices[k]?.current || v.base,
    pct: prices[k]?.pct || 0
  }));
  // Duplicate for seamless loop
  const dbl = [...items, ...items, ...items];

  return (
    <div className="bg-brand-700 overflow-hidden" style={{background:"linear-gradient(135deg,#047857,#059669)"}}>
      <div className="flex items-center gap-0 relative" style={{overflow:"hidden"}}>
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{background:"linear-gradient(to right, rgba(4,120,87,1) 0%, transparent 100%)"}}/>
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
          style={{background:"linear-gradient(to left, rgba(5,150,105,1) 0%, transparent 100%)"}}/>
        
        <div
          className="flex items-center ticker-track"
          style={{
            animation: "tickerScroll 40s linear infinite",
            display:"flex",
            width:"max-content",
          }}
          onMouseEnter={e=>(e.currentTarget.style.animationPlayState="paused")}
          onMouseLeave={e=>(e.currentTarget.style.animationPlayState="running")}
        >
          {dbl.map((it, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-2.5 border-r border-brand-600 flex-shrink-0"
              style={{borderColor:"rgba(255,255,255,0.15)"}}>
              <span className="text-lg">{it.emoji}</span>
              <span className="text-white font-bold text-xs tracking-wide uppercase">{it.k}</span>
              <span className="text-green-100 font-mono text-sm font-semibold">
                ₹{it.cur.toLocaleString("en-IN")}
              </span>
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                it.pct >= 0
                  ? "bg-green-400/20 text-green-200"
                  : "bg-red-400/20 text-red-300"
              }`}>
                {it.pct >= 0 ? "▲" : "▼"}{Math.abs(it.pct).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
