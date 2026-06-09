"use client";
import { useEffect, useRef, useState } from "react";
export default function StatCounter({ end, prefix="", suffix="", label, sub, dark=false }: {
  end:number; prefix?:string; suffix?:string; label:string; sub?:string; dark?:boolean;
}) {
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
  const fmt=(v:number)=> v>=1e6 ? (v/1e6).toFixed(1)+"M" : v>=1000 ? (v/1000).toFixed(0)+"K" : Number.isInteger(end)?v.toFixed(0):v.toFixed(1);
  return (
    <div ref={ref} className="text-center px-6 py-4">
      <div className={`text-4xl md:text-5xl font-bold mb-1.5 ${dark?"text-white":"text-brand-700"}`}>
        {prefix}{fmt(n)}{suffix}
      </div>
      <div className={`font-semibold text-base ${dark?"text-green-200":"text-slate-700"}`}>{label}</div>
      {sub && <div className={`text-xs mt-0.5 ${dark?"text-slate-400":"text-slate-400"}`}>{sub}</div>}
    </div>
  );
}
