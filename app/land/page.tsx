"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Settings, X, Printer, Leaf, BarChart3, Info,
  CheckCircle, RefreshCw, Map as MapIcon, ExternalLink, ZapIcon
} from "lucide-react";
import { useStore } from "@/lib/store";
import { getHealthColor, getMoistureColor, FORECAST } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";
import Link from "next/link";

/* ─── Plot ID to Polygon mapping ─── */
const POLY_SLOTS = [
  { slot:"P0", points:"20,12 210,8 218,142 100,150 22,148",    lx:116, ly:82 },
  { slot:"P1", points:"228,8 410,12 415,148 230,142 220,80",   lx:316, ly:82 },
  { slot:"P2", points:"425,8 585,15 578,148 420,155",           lx:500, ly:82 },
  { slot:"P3", points:"22,162 180,158 185,278 24,285",          lx:104, ly:222 },
  { slot:"P4", points:"192,158 425,162 422,282 188,278",        lx:307, ly:222 },
  { slot:"P5", points:"430,162 588,158 592,288 428,282",        lx:510, ly:222 },
  { slot:"P6", points:"22,292 180,288 182,395 24,398",          lx:104, ly:345 },
  { slot:"P7", points:"192,288 425,292 422,400 188,398",        lx:307, ly:345 },
  { slot:"P8", points:"430,288 588,284 590,400 428,398",        lx:510, ly:345 },
];

function ndviColor(h:number, m:number){
  const s = h*0.6 + m*0.4;
  if(s>=85) return "#16A34A";
  if(s>=70) return "#22C55E";
  if(s>=55) return "#84CC16";
  if(s>=40) return "#EAB308";
  return "#EF4444";
}
function calcWarning(p:{health:number;moisture:number;pestRisk:string}){
  return p.health < 65 || p.pestRisk === "high" || p.moisture < 35;
}
function buildRadarData(p:any){
  return [
    { s:"Moisture",  v:Math.round(p.moisture) },
    { s:"Health",    v:Math.round(p.health) },
    { s:"Nutrition", v:Math.min(100,Math.round((p.npk.n+p.npk.p+p.npk.k)/5)) },
    { s:"Sunlight",  v:88 },
    { s:"Growth",    v:83 },
    { s:"pH",        v:Math.round(p.ph*10) },
  ];
}

const DEFAULT_THRESHOLDS = { minHealth:75, minMoisture:45, maxTemp:38 };

export default function Land() {
  const { plots, updateSensor, irrigate, pushNotif } = useStore();
  const [thresholds, setThresholds]   = useState(DEFAULT_THRESHOLDS);
  const [showSettings, setShowSettings] = useState(false);
  const [selId, setSelId]             = useState<string|null>(null);
  const [irrigating, setIrrigating]   = useState<string|null>(null);
  const [pulse, setPulse]             = useState<string|null>(null);
  const [now, setNow]                 = useState(new Date());
  const [showHint, setShowHint]       = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  /* Live clock */
  useEffect(()=>{
    const cl = setInterval(()=>setNow(new Date()),1000);
    return ()=>clearInterval(cl);
  },[]);

  /* Real-time sensor simulation — updates global store every 12s */
  useEffect(()=>{
    const iv = setInterval(()=>{
      const target = plots[Math.floor(Math.random()*plots.length)];
      if(!target) return;
      const nm = Math.max(10, Math.min(95, target.moisture + (Math.random()-.5)*2.5));
      const nh = Math.max(30, Math.min(98, target.health   + (Math.random()-.5)*1.2));
      const nt = Math.max(24, Math.min(43, target.temp     + (Math.random()-.5)*0.8));
      updateSensor(target.id, nm, nh, nt);
      setPulse(target.id);
      setTimeout(()=>setPulse(null), 2200);
    }, 12000);
    return ()=>clearInterval(iv);
  }, [plots]);

  const handleIrrigate = (id:string, name:string)=>{
    setIrrigating(id);
    irrigate(id);
    setTimeout(()=>setIrrigating(null), 2000);
  };

  /* Map store plots to polygon slots */
  const mappedPlots = plots.map((p,i)=>({
    ...p,
    slot: POLY_SLOTS[i] ?? null,
    open: p.health >= thresholds.minHealth && p.moisture >= thresholds.minMoisture,
    warning: calcWarning(p),
    ndvi: ndviColor(p.health, p.moisture),
  })).filter(p=>p.slot);

  const openCount  = mappedPlots.filter(p=>p.open).length;
  const warnCount  = mappedPlots.filter(p=>p.warning).length;
  const selPlot    = selId ? mappedPlots.find(p=>p.id===selId) : null;

  /* Build week history from real data */
  const weekHistory = (base:number)=>
    Array.from({length:7},(_,i)=>({
      d:["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i],
      v:Math.round(Math.max(30,Math.min(99,base+(i-3)*2.5+(Math.random()*3-1.5))))
    }));

  const viewBound = plots.length > 6 ? 310 : 295;

  return (
    <div ref={printRef} className="pt-[88px] min-h-screen"
      style={{background:"linear-gradient(160deg,#0F2027,#203A43 50%,#2C5364)"}}>

      {/* Live status strip */}
      <div className="flex items-center justify-between px-6 py-2 text-sm"
        style={{background:"rgba(16,185,129,0.15)",borderBottom:"1px solid rgba(16,185,129,0.25)"}}>
        <div className="flex items-center gap-3">
          <span className="dot-live"/>
          <span className="text-green-300 font-bold tracking-widest text-xs">
            LAND · SMART FARM · KHARIF 2026
          </span>
        </div>
        <div className="flex items-center gap-3 text-green-400 text-xs font-mono">
          <span className="hidden sm:block">{openCount} open · {warnCount} warn</span>
          <span>·</span>
          <span>{now.toLocaleTimeString("en-IN")}</span>
        </div>
      </div>

      <div className="container py-6 max-w-[1400px]">

        {/* Header */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
              Land <span className="text-green-400 text-xl font-bold ml-2">Intelligence</span>
            </h1>
            <p className="text-slate-400 text-sm italic">
              Real-time farm map · Click any plot for full sensor details
            </p>
          </div>
          <div className="flex items-center gap-2 no-print flex-wrap">
            <Link href="/land-view"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background:"linear-gradient(135deg,#059669,#10B981)",
                color:"#fff",
                boxShadow:"0 4px 18px rgba(16,185,129,0.45)"
              }}>
              <ExternalLink className="w-4 h-4"/> 🔭 Detailed Land View
            </Link>
            <button onClick={()=>setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{background:"rgba(255,255,255,0.08)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
              <Settings className="w-4 h-4"/> Thresholds
            </button>
            <button onClick={()=>window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
              style={{background:"rgba(255,255,255,0.06)",color:"#94A3B8",border:"1px solid rgba(255,255,255,0.1)"}}>
              <Printer className="w-4 h-4"/> Print
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            {l:"Total Acreage",  v:`${plots.reduce((a,p)=>a+p.size,0).toFixed(1)} ac`,
              icon:"🌾",col:"rgba(16,185,129,0.15)",br:"rgba(16,185,129,0.3)",t:"#A7F3D0"},
            {l:"Sections Open", v:`${openCount} / ${plots.length}`,
              icon:"🔓",col:"rgba(59,130,246,0.15)",br:"rgba(59,130,246,0.3)",t:"#93C5FD"},
            {l:"Warnings",      v:`${warnCount}`,
              icon:"⚠️",
              col:warnCount>0?"rgba(245,158,11,0.15)":"rgba(16,185,129,0.1)",
              br:warnCount>0?"rgba(245,158,11,0.4)":"rgba(16,185,129,0.2)",
              t:warnCount>0?"#FCD34D":"#A7F3D0"},
            {l:"Season Day",    v:"Day 47/120",
              icon:"📅",col:"rgba(139,92,246,0.15)",br:"rgba(139,92,246,0.3)",t:"#C4B5FD"},
          ].map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
              <div className="rounded-xl p-4 flex items-center gap-3"
                style={{background:s.col,border:`1px solid ${s.br}`}}>
                <span className="text-2xl">{s.icon}</span>
                <div className="min-w-0">
                  <div className="text-xl font-bold truncate" style={{color:s.t}}>{s.v}</div>
                  <div className="text-xs text-slate-400">{s.l}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,height:0}}
              className="flex items-start justify-between gap-3 mb-5 rounded-xl p-3"
              style={{background:"rgba(16,185,129,0.12)",border:"1.5px solid rgba(16,185,129,0.3)"}}>
              <div className="flex items-start gap-2 text-green-300 text-xs">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400"/>
                <span>
                  <strong className="text-green-200">Land Guide:</strong> Click any plot polygon on the map for full sensor data. Colours show NDVI health status. Press{" "}
                  <strong className="text-green-200">🔭 Detailed Land View</strong> for the full immersive experience with interactive controls.
                </span>
              </div>
              <button onClick={()=>setShowHint(false)} className="text-green-400 hover:text-green-200 p-1 flex-shrink-0">
                <X className="w-4 h-4"/>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-5">

          {/* LEFT: Plot cards — scrollable */}
          <div className="lg:col-span-3 flex flex-col" style={{maxHeight:"calc(100vh - 180px)"}}>
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h3 className="font-bold text-white text-sm">Land Sections <span className="text-slate-400 font-normal text-xs">({mappedPlots.length})</span></h3>
              <span className="text-green-400 text-xs font-semibold">{openCount} open</span>
            </div>
            <div className="overflow-y-auto flex-1 space-y-2 pr-1" style={{scrollbarWidth:"thin",scrollbarColor:"rgba(16,185,129,0.3) transparent"}}>
            {mappedPlots.map((p,i)=>(
              <motion.div key={p.id}
                initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                onClick={()=>setSelId(p.id===selId?null:p.id)}
                className="rounded-xl p-3 cursor-pointer transition-all"
                style={{
                  background: selId===p.id
                    ? "rgba(16,185,129,0.2)"
                    : p.open?"rgba(16,185,129,0.1)":p.warning?"rgba(245,158,11,0.08)":"rgba(255,255,255,0.04)",
                  border: selId===p.id
                    ? "2px solid #10B981"
                    : p.open?"1.5px solid rgba(16,185,129,0.4)":p.warning?"1.5px solid rgba(245,158,11,0.4)":"1px solid rgba(255,255,255,0.08)",
                }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white text-xs block truncate">{p.name}</span>
                    <span className="text-slate-400 text-[10px] truncate">{p.crop} · {p.phase}</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                    {pulse===p.id && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${p.open?"bg-green-500/20 text-green-300":p.warning?"bg-amber-500/20 text-amber-300":"bg-slate-500/20 text-slate-400"}`}>
                      {p.open?"OPEN":p.warning?"WARN":"CLOSED"}
                    </span>
                  </div>
                </div>
                <div className="h-1 rounded-full overflow-hidden mb-1.5" style={{background:"rgba(255,255,255,0.08)"}}>
                  <motion.div className="h-full rounded-full" initial={{width:0}}
                    animate={{width:`${p.moisture}%`}}
                    style={{background:p.open?"#10B981":p.warning?"#F59E0B":"#64748B"}}/>
                </div>
                <div className="flex justify-between text-[9px]">
                  <span className="text-slate-400">{Math.round(p.moisture)}% moisture</span>
                  <span style={{color:getHealthColor(p.health)}}>{Math.round(p.health)}% health</span>
                </div>
              </motion.div>
            ))}
            </div>{/* end scrollable */}
          </div>

          {/* CENTER: Single Polygon Map */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
              <div className="flex items-center justify-between px-4 py-3 border-b"
                style={{borderColor:"rgba(255,255,255,0.08)"}}>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <MapIcon className="w-4 h-4 text-green-400"/> Live Farm Map — Polygon View
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 hidden sm:block">Click any plot for details</span>
                  <Link href="/land-view"
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all"
                    style={{background:"linear-gradient(135deg,#059669,#10B981)",color:"#fff",boxShadow:"0 2px 8px rgba(16,185,129,0.4)"}}>
                    <ExternalLink className="w-3 h-3"/> Detailed View
                  </Link>
                </div>
              </div>
              <div className="p-3">
                <svg viewBox={`0 0 610 ${viewBound}`} className="w-full rounded-xl"
                  style={{height:Math.min(320, 250+plots.length*8)}}>
                  <defs>
                    <pattern id="fg" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                      <rect width="24" height="24" fill="#0a2010"/>
                      <line x1="0" y1="12" x2="24" y2="12" stroke="#1a3a1a" strokeWidth="0.5"/>
                      <line x1="12" y1="0" x2="12" y2="24" stroke="#1a3a1a" strokeWidth="0.5"/>
                    </pattern>
                    {mappedPlots.map(p=>(
                      <radialGradient key={p.id} id={`pg-${p.id}`} cx="50%" cy="50%" r="60%">
                        <stop offset="0%" stopColor={p.ndvi} stopOpacity={selId===p.id?0.6:0.38}/>
                        <stop offset="100%" stopColor={p.ndvi} stopOpacity={0.12}/>
                      </radialGradient>
                    ))}
                  </defs>
                  <rect width="610" height={viewBound} fill="url(#fg)" rx="10"/>
                  {/* Soil paths */}
                  <rect x="210" y="0" width="12" height={viewBound} fill="#3D2B1F" opacity="0.8"/>
                  <rect x="406" y="0" width="12" height={viewBound} fill="#3D2B1F" opacity="0.8"/>
                  <rect x="0" y="148" width="610" height="12" fill="#3D2B1F" opacity="0.8"/>
                  {plots.length > 6 && <rect x="0" y="282" width="610" height="12" fill="#3D2B1F" opacity="0.8"/>}
                  {/* Tree clusters */}
                  {[{cx:35,cy:18},{cx:55,cy:32},{cx:25,cy:40},{cx:68,cy:14},{cx:45,cy:52}].map((t,i)=>(
                    <g key={i}>
                      <circle cx={t.cx} cy={t.cy} r={9} fill="#1a5c1a" opacity={0.9}/>
                      <circle cx={t.cx} cy={t.cy} r={6} fill="#22882a" opacity={0.7}/>
                    </g>
                  ))}
                  {/* Irrigation channel */}
                  <path d="M595,0 Q575,75 585,148 Q598,210 575,295"
                    stroke="#3B82F6" strokeWidth="3" fill="none" opacity="0.35" strokeLinecap="round"/>
                  {/* Plot polygons */}
                  {mappedPlots.map(p=>{
                    if(!p.slot) return null;
                    const isSel = selId===p.id;
                    const isPulse = pulse===p.id;
                    const sc = p.open?"#10B981":p.warning?"#F59E0B":"#475569";
                    return (
                      <g key={p.id} onClick={()=>setSelId(p.id===selId?null:p.id)} style={{cursor:"pointer"}}>
                        <clipPath id={`pc-${p.id}`}>
                          <polygon points={p.slot.points}/>
                        </clipPath>
                        <g clipPath={`url(#pc-${p.id})`}>
                          {Array.from({length:20},(_,r)=>(
                            <line key={r} x1={0} y1={8+r*14} x2={610} y2={8+r*14}
                              stroke={p.ndvi} strokeWidth="1.5" strokeOpacity="0.18"/>
                          ))}
                        </g>
                        <polygon points={p.slot.points}
                          fill={`url(#pg-${p.id})`}
                          stroke={sc}
                          strokeWidth={isSel?2.5:1.5}
                          strokeOpacity={isSel?1:0.7}
                          style={{filter:isSel?`drop-shadow(0 0 8px ${p.ndvi})`:isPulse?`drop-shadow(0 0 5px ${p.ndvi})`:"none",transition:"all 0.4s"}}/>
                        {/* Pulse ring on live update */}
                        {isPulse && (
                          <polygon points={p.slot.points} fill="none" stroke={p.ndvi} strokeWidth="2" opacity="0.7">
                            <animate attributeName="stroke-width" values="2;5;2" dur="2s" repeatCount="2"/>
                            <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="2"/>
                          </polygon>
                        )}
                        {/* Label */}
                        <rect x={p.slot.lx-44} y={p.slot.ly-17} width={88} height={34} rx={7} fill="rgba(0,0,0,0.78)"/>
                        <text x={p.slot.lx} y={p.slot.ly-2} textAnchor="middle" fill="#fff" fontSize="9.5" fontWeight="700" fontFamily="system-ui">{p.name}</text>
                        <text x={p.slot.lx} y={p.slot.ly+11} textAnchor="middle" fill={p.ndvi} fontSize="8.5" fontFamily="system-ui">{Math.round(p.health)}% health</text>
                        <circle cx={p.slot.lx+38} cy={p.slot.ly-9} r={4} fill={sc} opacity={0.9}/>
                        {isSel && <circle cx={p.slot.lx+38} cy={p.slot.ly-9} r={7} fill="none" stroke={sc} strokeWidth={1.5} opacity={0.5}>
                          <animate attributeName="r" values="4;9;4" dur="1.8s" repeatCount="indefinite"/>
                          <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite"/>
                        </circle>}
                      </g>
                    );
                  })}
                  {/* NDVI legend */}
                  {[{c:"#16A34A",l:"Excellent"},{c:"#22C55E",l:"Good"},{c:"#EAB308",l:"Stressed"},{c:"#EF4444",l:"Critical"}].map((x,i)=>(
                    <g key={x.l}>
                      <circle cx={10+i*72} cy={viewBound-8} r={4} fill={x.c}/>
                      <text x={17+i*72} y={viewBound-4} fill={x.c} fontSize="8.5" fontFamily="system-ui" fontWeight="600">{x.l}</text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Detailed View CTA */}
              <div className="px-4 pb-4">
                <Link href="/land-view"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background:"linear-gradient(135deg,rgba(5,150,105,0.15),rgba(16,185,129,0.25))",
                    border:"1.5px solid rgba(16,185,129,0.35)",
                    color:"#A7F3D0",
                  }}>
                  <ZapIcon className="w-4 h-4 text-green-400"/>
                  🔭 Open Detailed Land View — Full Immersive Experience
                  <ExternalLink className="w-3.5 h-3.5 ml-1"/>
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT: Radar + Forecast + Status */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl p-4"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Farm Health Radar</p>
              <ResponsiveContainer width="100%" height={170}>
                <RadarChart data={buildRadarData(plots[0]||{moisture:70,health:80,npk:{n:120,p:40,k:160},ph:6.5})} outerRadius={60}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)"/>
                  <PolarAngleAxis dataKey="s" tick={{fill:"#94A3B8",fontSize:9}}/>
                  <Radar dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.18} strokeWidth={2}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-4"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">7-Day Forecast</p>
              <div className="space-y-2">
                {FORECAST.slice(0,7).map((d,i)=>(
                  <div key={i} className="flex items-center justify-between py-1 border-b last:border-0"
                    style={{borderColor:"rgba(255,255,255,0.05)"}}>
                    <span className="text-xs text-slate-400 w-8">{d.day}</span>
                    <span className="text-base">{d.icon}</span>
                    <div className="flex-1 mx-2">
                      <div className="h-1 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.08)"}}>
                        <div className="h-full rounded-full" style={{width:`${d.rain}%`,background:"#3B82F6"}}/>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-300 w-16 text-right">{d.lo}°–{d.hi}°C</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4"
              style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Section Status</p>
              <div className="space-y-2">
                {mappedPlots.map(p=>(
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[70px]">{p.name.split(" ")[0]}</span>
                    <span className={p.open?"text-green-400":p.warning?"text-amber-400":"text-slate-500"}>
                      {p.open?"● OPEN":p.warning?"⚠ WARN":"○ CLOSED"}
                    </span>
                    <span className="text-slate-400">{Math.round(p.health)}%</span>
                    <span className="text-slate-400">{Math.round(p.moisture)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Pesticide & Input Control Panel ── */}
        <div className="rounded-2xl overflow-hidden mb-5"
          style={{background:"rgba(244,63,94,0.06)",border:"1.5px solid rgba(244,63,94,0.2)"}}>
          <div className="flex items-center justify-between px-5 py-3 border-b"
            style={{borderColor:"rgba(244,63,94,0.15)"}}>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              🐛 Pesticide & Input Controls
            </h3>
            <span className="text-[10px] text-rose-300 font-semibold">Plot-level settings</span>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mappedPlots.map(p=>(
              <PesticideToggleCard key={p.id} plot={p} />
            ))}
          </div>
        </div>

        {/* Analysis table — bright, full opacity */}
        <div className="rounded-2xl overflow-hidden mb-6"
          style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.2)"}}>
          <div className="flex items-center justify-between px-5 py-3 border-b"
            style={{borderColor:"rgba(255,255,255,0.12)"}}>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-400"/> Section Analysis
            </h3>
            <button onClick={()=>window.print()} className="flex items-center gap-1.5 text-xs text-green-400 font-semibold no-print">
              <Printer className="w-3 h-3"/> Print
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{borderBottom:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)"}}>
                  {["Field","Crop","Acres/Cents","Status","Health","Moisture","Pest","Temp","pH","NPK"].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-300 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mappedPlots.map(p=>(
                  <tr key={p.id} className="border-b hover:bg-white/8 cursor-pointer transition-colors"
                    style={{borderColor:"rgba(255,255,255,0.06)"}}
                    onClick={()=>setSelId(p.id)}>
                    <td className="px-4 py-3 font-semibold text-white truncate max-w-[110px]">{p.name}</td>
                    <td className="px-4 py-3 text-slate-200 whitespace-nowrap">{p.crop}</td>
                    <td className="px-4 py-3 text-slate-200 whitespace-nowrap font-mono text-xs">{p.size}ac<br/><span className="text-slate-400">{(p.size*100).toFixed(0)}¢</span></td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.open?"bg-green-500/25 text-green-300":p.warning?"bg-amber-500/25 text-amber-300":"bg-slate-500/25 text-slate-300"}`}>
                        {p.open?"OPEN":p.warning?"WARN":"CLOSED"}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold" style={{color:getHealthColor(p.health)}}>{Math.round(p.health)}%</td>
                    <td className="px-4 py-3 text-slate-200">{Math.round(p.moisture)}%</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${p.pestRisk==="high"?"text-red-400":p.pestRisk==="medium"?"text-amber-400":"text-green-400"}`}>
                        {p.pestRisk}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-200 whitespace-nowrap">{p.temp.toFixed(1)}°C</td>
                    <td className="px-4 py-3 text-slate-200">{p.ph.toFixed(1)}</td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">{p.npk.n}/{p.npk.p}/{p.npk.k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Plot Detail Modal ── */}
      <AnimatePresence>
        {selPlot && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
            style={{background:"rgba(0,0,0,0.78)",backdropFilter:"blur(8px)"}}>
            <motion.div initial={{scale:.92,y:20}} animate={{scale:1,y:0}} exit={{scale:.92,y:20}}
              className="w-full max-w-2xl rounded-2xl overflow-hidden"
              style={{background:"linear-gradient(145deg,#0F2027,#1a3a4a)",border:"1px solid rgba(16,185,129,0.35)",boxShadow:"0 28px 80px rgba(0,0,0,0.65)"}}>

              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b" style={{borderColor:"rgba(16,185,129,0.2)"}}>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-bold text-white text-xl">{selPlot.name}</h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${selPlot.open?"bg-green-500/20 text-green-300 border border-green-500/40":selPlot.warning?"bg-amber-500/20 text-amber-300 border border-amber-500/40":"bg-slate-500/20 text-slate-400 border border-slate-500/30"}`}>
                      {selPlot.open?"🔓 OPEN":selPlot.warning?"⚠️ WARNING":"🔒 CLOSED"}
                    </span>
                    {pulse===selPlot.id && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 animate-pulse">● LIVE</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mt-0.5">{selPlot.crop} · {selPlot.phase} · {selPlot.size} ac</p>
                </div>
                <button onClick={()=>setSelId(null)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              {/* Status rule */}
              <div className="mx-5 mt-4 p-3 rounded-xl text-sm"
                style={{background:selPlot.open?"rgba(16,185,129,0.1)":"rgba(100,116,139,0.1)",border:`1px solid ${selPlot.open?"rgba(16,185,129,0.3)":"rgba(100,116,139,0.2)"}`}}>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">Status Rule: </span>
                <span className={selPlot.open?"text-green-300":"text-slate-400"}>
                  Health ≥ {thresholds.minHealth}% AND Moisture ≥ {thresholds.minMoisture}%
                </span>
                <span className={`ml-3 text-xs font-bold ${selPlot.open?"text-green-400":"text-slate-500"}`}>
                  → {selPlot.open?"CONDITIONS MET":"NOT MET"}
                </span>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-4 gap-3 p-5">
                {[
                  {l:"Moisture",  v:`${Math.round(selPlot.moisture)}%`,       c:getMoistureColor(selPlot.moisture)},
                  {l:"Health",    v:`${Math.round(selPlot.health)}%`,         c:getHealthColor(selPlot.health)},
                  {l:"Soil pH",   v:selPlot.ph.toFixed(1),                    c:"#3B82F6"},
                  {l:"Temp",      v:`${selPlot.temp.toFixed(1)}°C`,           c:"#F59E0B"},
                  {l:"Nitrogen",  v:`${selPlot.npk.n}`,                       c:"#8B5CF6"},
                  {l:"Phosphorus",v:`${selPlot.npk.p}`,                       c:"#EC4899"},
                  {l:"Potassium", v:`${selPlot.npk.k}`,                       c:"#06B6D4"},
                  {l:"Pest Risk", v:selPlot.pestRisk,                          c:selPlot.pestRisk==="high"?"#F43F5E":selPlot.pestRisk==="medium"?"#F59E0B":"#10B981"},
                ].map(s=>(
                  <div key={s.l} className="rounded-xl p-3 text-center"
                    style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
                    <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                    <div className="text-base font-bold capitalize truncate" style={{color:s.c}}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* Health trend */}
              <div className="px-5 pb-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Health Trend — Last 7 Days</p>
                <ResponsiveContainer width="100%" height={85}>
                  <LineChart data={weekHistory(selPlot.health)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                    <XAxis dataKey="d" tick={{fill:"#64748B",fontSize:9}} axisLine={false} tickLine={false}/>
                    <YAxis domain={[0,100]} hide/>
                    <Tooltip contentStyle={{background:"#0F2027",border:"1px solid #10B981",borderRadius:"8px",color:"#A7F3D0",fontSize:"11px"}}/>
                    <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2.5}
                      dot={{fill:"#10B981",r:3}} name="Health %"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Actions */}
              <div className="flex gap-3 p-5 border-t flex-wrap" style={{borderColor:"rgba(255,255,255,0.08)"}}>
                <button onClick={()=>handleIrrigate(selPlot.id, selPlot.name)}
                  disabled={irrigating===selPlot.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                  style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                  {irrigating===selPlot.id
                    ? <><RefreshCw className="w-4 h-4 animate-spin"/>Applying…</>
                    : <><Droplets className="w-4 h-4"/>Apply Irrigation</>}
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                  style={{background:"rgba(255,255,255,0.06)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.2)"}}>
                  <Leaf className="w-4 h-4"/> Nutrient Plan
                </button>
                <Link href="/land-view"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold ml-auto"
                  style={{background:"rgba(16,185,129,0.15)",color:"#A7F3D0",border:"1px solid rgba(16,185,129,0.3)"}}>
                  <ExternalLink className="w-4 h-4"/> Detailed View
                </Link>
                <button onClick={()=>setSelId(null)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200"
                  style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Threshold Settings Modal ── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{background:"rgba(0,0,0,0.75)",backdropFilter:"blur(6px)"}}>
            <motion.div initial={{scale:.94,y:20}} animate={{scale:1,y:0}} exit={{scale:.94,y:20}}
              className="w-full max-w-lg rounded-2xl p-6"
              style={{background:"linear-gradient(145deg,#0F2027,#1a3a4a)",border:"1px solid rgba(16,185,129,0.3)"}}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-green-400"/> Threshold Settings
                </h3>
                <button onClick={()=>setShowSettings(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <div className="space-y-5">
                {[
                  {label:"Minimum Health % for OPEN",key:"minHealth",  min:50,max:100,step:1},
                  {label:"Minimum Moisture % for OPEN",key:"minMoisture",min:20,max:85, step:1},
                  {label:"Maximum Temp °C alert",     key:"maxTemp",   min:28,max:45, step:0.5},
                ].map(s=>(
                  <div key={s.key}>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-sm text-slate-300 font-medium">{s.label}</label>
                      <span className="text-green-400 font-bold text-sm">{(thresholds as any)[s.key]}</span>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step}
                      value={(thresholds as any)[s.key]}
                      onChange={e=>setThresholds(p=>({...p,[s.key]:+e.target.value}))}
                      className="w-full h-2 rounded-full cursor-pointer"
                      style={{background:`linear-gradient(to right,#10B981 ${(((thresholds as any)[s.key]-s.min)/(s.max-s.min))*100}%,rgba(255,255,255,0.1) 0%)`}}/>
                  </div>
                ))}
              </div>
              <button onClick={()=>setShowSettings(false)}
                className="mt-6 w-full py-3 rounded-xl font-semibold text-white"
                style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                <CheckCircle className="w-4 h-4 inline mr-2"/>Apply & Recalculate
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Pesticide Toggle Card — per plot ── */
function PesticideToggleCard({plot}:{plot:any}) {
  const [pestOn, setPestOn]   = useState(false);
  const [schedule, setSchedule] = useState("none");
  const SCHED = ["none","Weekly","Bi-weekly","Monthly"];
  return (
    <div className="rounded-xl p-3 transition-all"
      style={{
        background: pestOn ? "rgba(244,63,94,0.12)" : "rgba(255,255,255,0.05)",
        border: pestOn ? "1.5px solid rgba(244,63,94,0.4)" : "1px solid rgba(255,255,255,0.08)",
      }}>
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{plot.name}</p>
          <p className="text-[10px] text-slate-400">{plot.crop} · Risk: <span className={plot.pestRisk==="high"?"text-red-400":plot.pestRisk==="medium"?"text-amber-400":"text-green-400"}>{plot.pestRisk}</span></p>
        </div>
        <button onClick={()=>setPestOn(!pestOn)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ml-2 flex-shrink-0"
          style={pestOn
            ? {background:"linear-gradient(135deg,#DC2626,#EF4444)",color:"#fff",boxShadow:"0 2px 8px rgba(239,68,68,0.4)"}
            : {background:"rgba(255,255,255,0.08)",color:"#94A3B8",border:"1px solid rgba(255,255,255,0.1)"}}>
          🐛 {pestOn?"ON":"OFF"}
        </button>
      </div>
      {pestOn && (
        <div className="mt-2 pt-2 border-t" style={{borderColor:"rgba(244,63,94,0.2)"}}>
          <p className="text-[10px] text-rose-300 font-semibold mb-1.5">Spray Schedule</p>
          <div className="flex gap-1 flex-wrap">
            {SCHED.map(s=>(
              <button key={s} onClick={()=>setSchedule(s)}
                className="px-2 py-0.5 rounded text-[9px] font-bold transition-all"
                style={schedule===s
                  ? {background:"rgba(239,68,68,0.3)",color:"#FCA5A5",border:"1px solid rgba(239,68,68,0.5)"}
                  : {background:"rgba(255,255,255,0.05)",color:"#64748B",border:"1px solid rgba(255,255,255,0.08)"}}>
                {s}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            {schedule!=="none" ? `✅ Pest spray ${schedule.toLowerCase()} active` : "Select spray schedule above"}
          </div>
        </div>
      )}
    </div>
  );
}
