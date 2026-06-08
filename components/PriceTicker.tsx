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

  const items = Object.entries(CROPS).map(([k,v]) => ({ k, ...v, cur: prices[k]?.current||v.base, pct: prices[k]?.pct||0 }));
  const dbl = [...items,...items];

  return (
    <div className="bg-brand-700 overflow-hidden">
      <div className="flex items-center" style={{width:"max-content"}}>
        <div className="ticker-inner flex items-center">
          {dbl.map((it, i) => (
            <div key={i} className="flex items-center gap-2 px-5 py-2 border-r border-brand-600 flex-shrink-0">
              <span className="text-base">{it.emoji}</span>
              <span className="text-white font-semibold text-xs tracking-wide">{it.k.toUpperCase()}</span>
              <span className="text-brand-200 font-mono text-sm">₹{it.cur.toLocaleString("en-IN")}</span>
              <span className={`text-xs font-semibold ${it.pct >= 0 ? "text-green-300" : "text-red-300"}`}>
                {it.pct >= 0 ? "▲" : "▼"}{Math.abs(it.pct).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
