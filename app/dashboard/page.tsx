"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Activity, AlertTriangle, TrendingUp, CloudRain,
  Sprout, Plus, X, RefreshCw, ChevronRight, Map, Printer, Info
} from "lucide-react";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { getHealthColor, getMoistureColor, getMoistureLabel, FORECAST } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const TT = { contentStyle:{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",fontFamily:"DM Sans",fontSize:"12px"} };
const RAIN=[{d:"Mon",r:12},{d:"Tue",r:0},{d:"Wed",r:45},{d:"Thu",r:8},{d:"Fri",r:0},{d:"Sat",r:22},{d:"Sun",r:5}];
const TEMP=[{d:"Mon",hi:33,lo:23},{d:"Tue",hi:34,lo:23},{d:"Wed",hi:32,lo:22},{d:"Thu",hi:33,lo:23},{d:"Fri",hi:35,lo:24},{d:"Sat",hi:37,lo:25},{d:"Sun",hi:38,lo:27}];

const COMPLETIONS: Record<string,number> = {
  A: 93.95571812921074,
  B: 74.71632610612846,
  C: 62.98277071487386,
  D: 82.18390979790693,
  E: 88.52486644323442,
  F: 77.83659463739020,
};

export default function Dashboard() {
  const { plots, notifications, irrigate, irrigateAll, toggleAutoIrr } = useStore();
  const [sel, setSel]   = useState<string|null>(null);
  const [now, setNow]   = useState(new Date());
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const cl = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(cl);
  },[]);

  useEffect(() => {
    const iv = setInterval(() => {
      plots.forEach(p => {
        useStore.getState().updateMoisture(p.id, Math.max(10, Math.min(92, p.moisture + (Math.random()-.5)*1.5)));
      });
    }, 20000);
    return () => clearInterval(iv);
  },[plots]);

  const selPlot      = plots.find(p=>p.id===sel);
  const activeAlerts = notifications.filter(n=>!n.read).length;
  const lowMoisture  = plots.filter(p=>p.moisture<40).length;
  const avgHealth    = Math.round(plots.reduce((s,p)=>s+p.health,0)/plots.length);
  const totalAcres   = plots.reduce((s,p)=>s+p.size,0).toFixed(1);

  const radarData = [
    {s:"Moisture",  v:Math.round(plots.reduce((a,p)=>a+p.moisture,0)/plots.length)},
    {s:"Health",    v:Math.round(plots.reduce((a,p)=>a+p.health,0)/plots.length)},
    {s:"pH Score",  v:Math.round(plots.reduce((a,p)=>a+p.ph,0)/plots.length*10)},
    {s:"Nutrition", v:Math.round(plots.reduce((a,p)=>a+(p.npk.n+p.npk.p+p.npk.k)/3,0)/plots.length)},
    {s:"Growth",    v:Math.round(plots.reduce((a,p)=>a+(COMPLETIONS[p.id]||75),0)/plots.length)},
    {s:"Sunlight",  v:72},
  ];

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#F8FAFC 100%)"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-8">
        <div className="container flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="dot-live" style={{background:"#4ADE80"}}/>
              <span className="text-green-300 text-xs font-semibold uppercase tracking-widest">Live Monitoring · KHARIF 2026 · Day 47 of 120</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Farm <span className="grad-text">Dashboard</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
              style={{background:"rgba(255,255,255,0.1)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
              <Printer className="w-4 h-4"/> Print
            </button>
            <button onClick={irrigateAll} className="btn btn-primary flex items-center gap-2"
              style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
              <Droplets className="w-4 h-4"/> Irrigate All
            </button>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{background:"linear-gradient(90deg,#065F46,#047857)"}} className="no-print">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 py-0">
            {[
              {l:"Active Plots",  v:`${plots.length}`, s:"KHARIF 2026",              i:"🌾"},
              {l:"Avg Health",    v:`${avgHealth}%`,   s:avgHealth>80?"Excellent":"Fair", i:"💚"},
              {l:"Low Moisture",  v:lowMoisture,       s:lowMoisture>0?"Need irrigation":"All optimal", i:"💧"},
              {l:"Unread Alerts", v:activeAlerts,      s:activeAlerts>0?"Needs attention":"All clear",  i:"🔔"},
            ].map((s,i)=>(
              <div key={i} className="flex items-center gap-3 px-6 py-3">
                <span className="text-xl">{s.i}</span>
                <div>
                  <div className="text-white font-bold text-lg leading-tight">{s.v}</div>
                  <div className="text-green-200 text-xs">{s.l}</div>
                  <div className="text-green-300/60 text-[10px]">{s.s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Hint banner */}
        <AnimatePresence>
          {showHint && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,height:0}}
              className="hint-banner mb-5 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5"/>
                <span><strong>Dashboard Guide:</strong> Click any <strong>field card</strong> on the left to expand details. Use <strong>Irrigate All</strong> to water every plot. The centre map shows live moisture — click any plot tile for details. The <strong>Farm Health Radar</strong> (right) summarises all 6 plots.</span>
              </div>
              <button onClick={()=>setShowHint(false)} className="flex-shrink-0 text-brand-500 hover:text-brand-700 p-1">
                <X className="w-4 h-4"/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* ── LEFT — Plot list ── */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Field Overview</h2>
              <button onClick={irrigateAll} className="flex items-center gap-1 text-xs text-brand-600 font-semibold hover:text-brand-700">
                <RefreshCw className="w-3 h-3"/> Irrigate All
              </button>
            </div>
            {plots.map((p,i)=>{
              const mc = getMoistureColor(p.moisture);
              const hc = getHealthColor(p.health);
              const compl = COMPLETIONS[p.id]||75;
              return (
                <motion.div key={p.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                  onClick={()=>setSel(sel===p.id?null:p.id)}
                  className={`card cursor-pointer transition-all border-2 ${sel===p.id?"border-brand-400 ring-2 ring-brand-100":"border-slate-200 hover:border-brand-200"}`}
                  style={{boxShadow:sel===p.id?"0 4px 20px rgba(16,185,129,0.14)":"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                      <p className="text-[11px] text-slate-400">{p.crop} · {p.size}ac · {p.phase}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm" style={{color:mc}}>{Math.round(p.moisture)}%</span>
                      <div className="text-[9px] text-slate-400">moisture</div>
                    </div>
                  </div>
                  {/* Completion ring + bars */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                        <circle cx="24" cy="24" r="19" fill="none" stroke="#F1F5F9" strokeWidth="5"/>
                        <circle cx="24" cy="24" r="19" fill="none" strokeWidth="5"
                          stroke={mc} strokeDasharray={`${(p.moisture/100)*119.4} 119.4`}
                          strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-slate-600">{Math.round(p.moisture)}%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[
                        {l:"Soil pH",  v:p.ph,    max:9,   c:"#10B981"},
                        {l:"Health",   v:p.health, max:100, c:hc},
                        {l:"Temp",     v:p.temp,   max:45,  c:"#F59E0B"},
                      ].map(s=>(
                        <div key={s.l} className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-400 w-11 shrink-0">{s.l}</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div className="h-full rounded-full" initial={{width:0}}
                              animate={{width:`${(s.v/s.max)*100}%`}} transition={{duration:0.9}}
                              style={{background:s.c}}/>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 w-6 text-right">{s.v}{s.l==="Temp"?"°":""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-50">
                    <span className={`badge text-[9px] ${p.pestRisk==="high"?"badge-red":p.pestRisk==="medium"?"badge-amber":"badge-green"}`}>{p.pestRisk} pest</span>
                    <span className={`badge text-[9px] ${getMoistureLabel(p.moisture)==="Optimal"?"badge-green":getMoistureLabel(p.moisture)==="Good"?"badge-blue":"badge-amber"}`}>{getMoistureLabel(p.moisture)}</span>
                    <button onClick={e=>{e.stopPropagation();toggleAutoIrr(p.id);}}
                      className={`ml-auto text-[9px] px-2 py-1 rounded-lg border font-semibold transition-all ${p.autoIrr?"bg-brand-500 text-white border-brand-500":"border-slate-200 text-slate-400 hover:border-brand-300"}`}>
                      {p.autoIrr?"▶ AUTO":"▐▐ AUTO"}
                    </button>
                  </div>
                  {/* KHARIF completion */}
                  <div className="mt-2 text-[9px] text-slate-400">
                    Season: <span className="font-mono text-brand-600" title={`${compl}%`}>{compl.toFixed(2)}%</span>
                  </div>
                </motion.div>
              );
            })}
            <Link href="/field-monitor"
              className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 text-xs font-semibold transition-all">
              <Plus className="w-3 h-3"/> Add New Plot
            </Link>
          </div>

          {/* ── CENTRE — Live Farm Map ── */}
          <div className="lg:col-span-6 space-y-4">
            {/* Farm Map grid */}
            <Card hover={false} style={{boxShadow:"0 4px 20px rgba(0,0,0,0.07)"}}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-800">Live Farm Map</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Click plot for details</span>
                  <Link href="/land" className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 px-3 py-1.5 bg-brand-50 rounded-lg border border-brand-100">
                    <Map className="w-3 h-3"/> Full Map
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {plots.slice(0,6).map((p,i)=>{
                  const mc = getMoistureColor(p.moisture);
                  const isSelected = sel===p.id;
                  return (
                    <motion.div key={p.id} initial={{opacity:0,scale:.95}} animate={{opacity:1,scale:1}} transition={{delay:i*0.06}}
                      onClick={()=>setSel(sel===p.id?null:p.id)}
                      whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                      className={`rounded-xl p-3 cursor-pointer border-2 transition-all ${isSelected?"ring-2 ring-brand-300":"hover:border-opacity-80"}`}
                      style={{
                        background: `${mc}12`,
                        borderColor: isSelected ? mc : `${mc}40`,
                        boxShadow: isSelected ? `0 4px 16px ${mc}30` : "none"
                      }}>
                      <div className="font-bold text-slate-800 text-xs mb-0.5">{p.name}</div>
                      <div className="text-[10px] text-slate-400 mb-2">{p.crop} · {p.phase}</div>
                      <div className="h-1.5 bg-white/60 rounded-full overflow-hidden mb-1">
                        <motion.div className="h-full rounded-full" initial={{width:0}}
                          animate={{width:`${p.moisture}%`}} transition={{duration:1}}
                          style={{background:mc}}/>
                      </div>
                      <div className="text-xs font-bold" style={{color:mc}}>{Math.round(p.moisture)}% moisture</div>
                      <div className="text-[10px] text-slate-400 mt-1">pH {p.ph} · NPK {p.npk.n}/{p.npk.p}/{p.npk.k}</div>
                      <div className="text-[9px] mt-1">
                        <span className={`badge text-[8px] px-1.5 py-0.5 ${p.pestRisk==="high"?"badge-red":p.pestRisk==="medium"?"badge-amber":"badge-green"}`}>✓ {p.pestRisk}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </Card>

            {/* Selected plot detail */}
            <AnimatePresence>
              {selPlot && (
                <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>
                  <Card hover={false} style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",border:"none"}}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-white text-lg">{selPlot.name}</h3>
                        <p className="text-slate-400 text-sm">{selPlot.crop} · {selPlot.size}ac · {selPlot.area} · {selPlot.phase}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>irrigate(selPlot.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white"
                          style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                          <Droplets className="w-3 h-3"/> Irrigate
                        </button>
                        <button onClick={()=>setSel(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                          <X className="w-4 h-4"/>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        {l:"Moisture",  v:`${Math.round(selPlot.moisture)}%`,  c:getMoistureColor(selPlot.moisture)},
                        {l:"Health",    v:`${selPlot.health}%`,                c:getHealthColor(selPlot.health)},
                        {l:"Temp",      v:`${selPlot.temp}°C`,                 c:"#F59E0B"},
                        {l:"pH",        v:selPlot.ph.toFixed(1),               c:"#10B981"},
                        {l:"N (kg/ha)", v:selPlot.npk.n,                       c:"#60A5FA"},
                        {l:"P (kg/ha)", v:selPlot.npk.p,                       c:"#A78BFA"},
                        {l:"K (kg/ha)", v:selPlot.npk.k,                       c:"#FCD34D"},
                        {l:"Pest",      v:selPlot.pestRisk.toUpperCase(),       c:selPlot.pestRisk==="high"?"#F87171":selPlot.pestRisk==="medium"?"#FCD34D":"#4ADE80"},
                      ].map(s=>(
                        <div key={s.l} className="text-center">
                          <div className="text-lg font-bold" style={{color:s.c}}>{s.v}</div>
                          <div className="text-slate-500 text-[10px]">{s.l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>Last watered: {selPlot.lastWatered}</span>
                        <span>·</span>
                        <span>Season: {COMPLETIONS[selPlot.id]?.toFixed(2)}%</span>
                        <Link href="/field-monitor" className="ml-auto flex items-center gap-1 text-green-400 hover:text-green-300 font-semibold">
                          Full Analysis <ChevronRight className="w-3 h-3"/>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Weekly charts */}
            <div className="grid grid-cols-2 gap-4">
              <Card hover={false}>
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-4">Rainfall This Week (mm)</h3>
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={RAIN} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                    <XAxis dataKey="d" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false} unit="mm" width={28}/>
                    <Tooltip {...TT}/>
                    <Bar dataKey="r" fill="#38BDF8" radius={[4,4,0,0]} name="Rain (mm)"/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
              <Card hover={false}>
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-4">Temperature (°C)</h3>
                <ResponsiveContainer width="100%" height={130}>
                  <AreaChart data={TEMP}>
                    <defs>
                      <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#F59E0B" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                    <XAxis dataKey="d" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false} unit="°" width={28}/>
                    <Tooltip {...TT}/>
                    <Area type="monotone" dataKey="hi" stroke="#F59E0B" fill="url(#tg)" strokeWidth={2} name="High °C"/>
                    <Area type="monotone" dataKey="lo" stroke="#86EFAC" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Low °C"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </div>

          {/* ── RIGHT — Radar + Forecast ── */}
          <div className="lg:col-span-3 space-y-4">
            <Card hover={false} style={{boxShadow:"0 4px 20px rgba(0,0,0,0.07)"}}>
              <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">Farm Health Radar</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#E2E8F0"/>
                  <PolarAngleAxis dataKey="s" tick={{fill:"#94A3B8",fontSize:10}}/>
                  <Radar name="Farm" dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card hover={false} style={{boxShadow:"0 4px 20px rgba(0,0,0,0.07)"}}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">7-Day Forecast</h3>
                <Link href="/weather" className="text-[10px] text-brand-600 font-semibold hover:text-brand-700">Details</Link>
              </div>
              <div className="space-y-2">
                {FORECAST.map((f,i) => (
                  <div key={f.day} className={`flex items-center justify-between ${i<FORECAST.length-1?"pb-2 border-b border-slate-50":""}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{f.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{f.day}</p>
                        {f.rain > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="h-1 rounded-full bg-sky-200 overflow-hidden" style={{width:"40px"}}>
                              <div className="h-full bg-sky-500 rounded-full" style={{width:`${f.rain}%`}}/>
                            </div>
                            <span className="text-[9px] text-sky-500">{f.rain}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800">{f.hi}°–{f.lo}°C</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick links */}
            <div className="grid grid-cols-2 gap-2">
              {[
                {l:"My Fields",  href:"/field-monitor", icon:Sprout,     c:"bg-brand-50  border-brand-200  text-brand-700"},
                {l:"Weather",    href:"/weather",       icon:CloudRain,  c:"bg-sky-50    border-sky-200    text-sky-700"},
                {l:"Market",     href:"/market",        icon:TrendingUp, c:"bg-amber-50  border-amber-200  text-amber-700"},
                {l:"Land View",  href:"/land",          icon:Map,        c:"bg-violet-50 border-violet-200 text-violet-700"},
              ].map(x=>(
                <Link key={x.l} href={x.href}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center hover:scale-105 transition-transform ${x.c}`}>
                  <x.icon className="w-4 h-4"/>
                  <span className="text-xs font-semibold">{x.l}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
