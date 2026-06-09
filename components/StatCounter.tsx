"use client";
import { useEffect, useRef, useState } from "react";
export default function StatCounter({ end, prefix="", suffix="", label, sub }: {end:number;prefix?:string;suffix?:string;label:string;sub?:string}) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        let cur = 0; const steps = 60; const inc = end/steps;
        const iv = setInterval(() => { cur = Math.min(cur+inc, end); setN(cur); if(cur>=end) clearInterval(iv); }, 2000/steps);
      }
    }, {threshold:0.3});
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  },[end]);
  const fmt=(v:number)=> v>=1e6 ? (v/1e6).toFixed(1)+"M" : v>=1000 ? (v/1000).toFixed(0)+"K" : v.toFixed(0);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-brand-700 mb-1">{prefix}{fmt(n)}{suffix}</div>
      <div className="font-semibold text-slate-700 text-sm">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}
