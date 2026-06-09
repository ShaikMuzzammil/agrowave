"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Activity, AlertTriangle, Settings, X, Printer,
  ChevronRight, Thermometer, Wind, Cloud, TrendingUp, Leaf,
  BarChart3, Info, CheckCircle, RefreshCw, Map as MapIcon, Layers
} from "lucide-react";
import { useStore } from "@/lib/store";
import { getHealthColor, getMoistureColor, FORECAST } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

/* ─── PLOT DEFINITIONS ─────────────────────────────────────── */
const LAND_PLOTS = [
  { id:"NF", name:"North Field",  crop:"Wheat",   phase:"Tillering",       color:"#10B981", pos:{x:5,y:5,w:44,h:44} },
  { id:"EB", name:"East Block",   crop:"Rice",    phase:"Panicle Init.",   color:"#3B82F6", pos:{x:52,y:5,w:44,h:44} },
  { id:"WB", name:"West Block",   crop:"Soybean", phase:"Pod Fill",        color:"#F59E0B", pos:{x:5,y:52,w:44,h:44} },
  { id:"SF", name:"South Field",  crop:"Cotton",  phase:"Boll Formation",  color:"#F43F5E", pos:{x:52,y:52,w:44,h:44} },
  { id:"CP", name:"Central Plot", crop:"Maize",   phase:"Silking",         color:"#8B5CF6", pos:{x:28.5,y:28.5,w:43,h:43} },
  { id:"BS", name:"Border Strip", crop:"Onion",   phase:"Bulb Dev.",       color:"#EC4899", pos:{x:0,y:0,w:100,h:100} },
];

/* ─── DEFAULT THRESHOLDS ────────────────────────────────────── */
const DEFAULT_THRESHOLDS = {
  NF_health:90, NF_moisture:85,
  EB_pest:"medium", EB_temp:33,
  WB_rainfall:30,
  SF_npk:100,
  CP_pH_lo:6.0, CP_pH_hi:6.5,
  BS_rainDays:2,
};

/* ─── MOCK SENSOR DATA PER PLOT ─────────────────────────────── */
const BASE_SENSOR: Record<string,any> = {
  NF:{ health:94, moisture:92, temp:32, pH:6.8, npk:{n:142,p:46,k:180}, pest:"low",   rainfall:12, rainDays:1, growthStage:"Tillering",   weekHistory:[82,85,88,90,91,93,94] },
  EB:{ health:75, moisture:49, temp:34, pH:6.2, npk:{n:118,p:38,k:165}, pest:"medium",rainfall:18, rainDays:2, growthStage:"Panicle Init.",weekHistory:[68,70,72,73,74,74,75] },
  WB:{ health:82, moisture:68, temp:31, pH:6.5, npk:{n:155,p:48,k:195}, pest:"low",   rainfall:22, rainDays:1, growthStage:"Pod Fill",     weekHistory:[75,77,79,80,81,82,82] },
  SF:{ health:63, moisture:23, temp:33, pH:7.1, npk:{n:95,p:52,k:140},  pest:"high",  rainfall:8,  rainDays:0, growthStage:"Boll Formation",weekHistory:[70,68,66,65,64,63,63] },
  CP:{ health:88, moisture:56, temp:32, pH:6.3, npk:{n:133,p:42,k:175}, pest:"low",   rainfall:15, rainDays:1, growthStage:"Silking",      weekHistory:[81,83,84,85,86,87,88] },
  BS:{ health:79, moisture:62, temp:30, pH:6.4, npk:{n:148,p:55,k:188}, pest:"low",   rainfall:28, rainDays:3, growthStage:"Bulb Dev.",     weekHistory:[73,74,75,77,78,79,79] },
};

function calcOpenStatus(id:string, sensor:any, thresholds:typeof DEFAULT_THRESHOLDS) {
  switch(id) {
    case "NF": return { open: sensor.health >= thresholds.NF_health && sensor.moisture >= thresholds.NF_moisture,
                        reason: `Health ≥${thresholds.NF_health}% AND Moisture ≥${thresholds.NF_moisture}%` };
    case "EB": return { open: sensor.pest === thresholds.EB_pest || sensor.temp > thresholds.EB_temp,
                        reason: `Pest="${thresholds.EB_pest}" OR Temp >${thresholds.EB_temp}°C` };
    case "WB": return { open: sensor.growthStage === "Pod Fill" && sensor.rainfall < thresholds.WB_rainfall,
                        reason: `Growth="Pod Fill" AND Rainfall <${thresholds.WB_rainfall}mm/week` };
    case "SF": return { open: sensor.npk.n < thresholds.SF_npk || sensor.npk.p < thresholds.SF_npk || sensor.npk.k < thresholds.SF_npk,
                        reason: `Any NPK < ${thresholds.SF_npk} (low nutrition)` };
    case "CP": return { open: sensor.growthStage === "Silking" && sensor.pH >= thresholds.CP_pH_lo && sensor.pH <= thresholds.CP_pH_hi,
                        reason: `Stage="Silking" AND pH ${thresholds.CP_pH_lo}–${thresholds.CP_pH_hi}` };
    case "BS": return { open: sensor.growthStage === "Bulb Dev." && sensor.rainDays >= thresholds.BS_rainDays,
                        reason: `Stage="Bulb Dev." AND ≥${thresholds.BS_rainDays} rain days in 7-day forecast` };
    default: return { open:false, reason:"Unknown" };
  }
}

function calcWarning(sensor:any) {
  return sensor.health < 70 || sensor.pest === "high" || sensor.moisture < 40;
}

/* ─── RADAR DATA ────────────────────────────────────────────── */
function buildRadarData(sensor:any) {
  return [
    {s:"Moisture", v:Math.round(sensor.moisture)},
    {s:"Health",   v:sensor.health},
    {s:"Nutrition",v:Math.min(100,Math.round((sensor.npk.n+sensor.npk.p+sensor.npk.k)/5))},
    {s:"Sunlight", v:88},
    {s:"Growth",   v:83},
    {s:"pH Score", v:Math.round(((sensor.pH-0)/14)*100)},
  ];
}

export default function Land() {
  const { pushNotif } = useStore();
  const [sensors, setSensors] = useState<Record<string,any>>(BASE_SENSOR);
  const [thresholds, setThresholds] = useState(DEFAULT_THRESHOLDS);
  const [showSettings, setShowSettings] = useState(false);
  const [selPlot, setSelPlot] = useState<string|null>(null);
  const [showTerrain, setShowTerrain] = useState(false);
  const [irrigating, setIrrigating] = useState<string|null>(null);
  const [now, setNow] = useState(new Date());
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cl = setInterval(() => setNow(new Date()), 1000);
    const iv = setInterval(() => {
      setSensors(prev => {
        const next = {...prev};
        Object.keys(next).forEach(k => {
          next[k] = {
            ...next[k],
            moisture: Math.max(10, Math.min(95, next[k].moisture + (Math.random()-.5)*1.2)),
            health:   Math.max(30, Math.min(98, next[k].health   + (Math.random()-.5)*0.5)),
            temp:     Math.max(24, Math.min(42, next[k].temp     + (Math.random()-.5)*0.4)),
          };
        });
        return next;
      });
    }, 15000);
    return () => { clearInterval(cl); clearInterval(iv); };
  },[]);

  const handleIrrigate = (id:string) => {
    setIrrigating(id);
    setSensors(p=>({...p,[id]:{...p[id],moisture:Math.min(95,p[id].moisture+18)}}));
    pushNotif({title:`💧 Irrigation applied — ${LAND_PLOTS.find(x=>x.id===id)?.name}`,body:"Moisture improved. Check again in 24h.",type:"success",time:"just now"});
    setTimeout(()=>setIrrigating(null),2000);
  };

  const handlePrint = () => window.print();

  const plotStatuses = LAND_PLOTS.map(p => {
    const s = sensors[p.id];
    const {open,reason} = calcOpenStatus(p.id, s, thresholds);
    const warning = calcWarning(s);
    return {...p, sensor:s, open, reason, warning};
  });

  const openCount = plotStatuses.filter(p=>p.open).length;
  const warnCount = plotStatuses.filter(p=>p.warning).length;
  const selData   = selPlot ? plotStatuses.find(p=>p.id===selPlot) : null;

  const totalAcres = 23.0;
  const seasonDay  = 47;

  return (
    <div ref={printRef} className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#0F2027 0%,#203A43 40%,#2C5364 100%)"}}>
      {/* Top status */}
      <div className="flex items-center justify-between px-6 py-2 text-sm" style={{background:"rgba(16,185,129,0.15)",borderBottom:"1px solid rgba(16,185,129,0.25)"}}>
        <div className="flex items-center gap-3">
          <span className="dot-live"/>
          <span className="text-green-300 font-bold tracking-widest text-xs">LAND · SMART FARM DASHBOARD</span>
          <span className="text-green-500 text-xs">KHARIF 2026 · Day {seasonDay} of 120</span>
        </div>
        <div className="flex items-center gap-3 text-green-400 text-xs font-mono">
          <span>{openCount} sections open</span>
          <span>·</span>
          <span>{now.toLocaleTimeString("en-IN")}</span>
        </div>
      </div>

      <div className="container py-6 max-w-[1400px]" id="land-print-area">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center gap-1">
                <span className="text-5xl font-black text-white tracking-tighter leading-none" style={{textShadow:"0 0 40px rgba(16,185,129,0.6)"}}>land</span>
                <div className="flex flex-col ml-2">
                  <span className="text-green-400 text-xs font-bold tracking-widest">SMART FARM</span>
                  <span className="text-slate-400 text-xs">Family-driven agriculture</span>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2 text-slate-400">
                <span className="text-2xl">👨‍🌾</span><span className="text-2xl">👩‍🌾</span><span className="text-xl">🧒</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm italic">"Family-driven smart farming — every plot opens with care, calculation, and legacy."</p>
          </div>
          <div className="flex items-center gap-2 no-print">
            <button onClick={()=>setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{background:"rgba(255,255,255,0.08)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
              <Settings className="w-4 h-4"/> Thresholds
            </button>
            <button onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{background:"linear-gradient(135deg,#059669,#10B981)",color:"#fff",boxShadow:"0 4px 14px rgba(16,185,129,0.4)"}}>
              <Printer className="w-4 h-4"/> Print Report
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            {label:"Total Acreage",    val:`${totalAcres} ac`,      icon:"🌾", col:"rgba(16,185,129,0.15)", border:"rgba(16,185,129,0.3)",  text:"#A7F3D0"},
            {label:"Sections Open",   val:`${openCount} / 6`,       icon:"🔓", col:"rgba(59,130,246,0.15)",  border:"rgba(59,130,246,0.3)",   text:"#93C5FD"},
            {label:"Active Warnings", val:`${warnCount} plots`,     icon:"⚠️", col:warnCount>0?"rgba(245,158,11,0.15)":"rgba(16,185,129,0.1)", border:warnCount>0?"rgba(245,158,11,0.4)":"rgba(16,185,129,0.2)", text:warnCount>0?"#FCD34D":"#A7F3D0"},
            {label:"Season Day",      val:`Day ${seasonDay}/120`,   icon:"📅", col:"rgba(139,92,246,0.15)", border:"rgba(139,92,246,0.3)",  text:"#C4B5FD"},
          ].map((s,i)=>(
            <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
              <div className="rounded-xl p-4 flex items-center gap-3" style={{background:s.col,border:`1px solid ${s.border}`}}>
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <div className="text-xl font-bold" style={{color:s.text}}>{s.val}</div>
                  <div className="text-xs font-medium text-slate-400">{s.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main 3-col layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          {/* LEFT: Plot cards */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-white text-sm">Land Sections</h3>
              <span className="text-green-400 text-xs">{openCount} open</span>
            </div>
            {plotStatuses.map((p,i)=>(
              <motion.div key={p.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                onClick={()=>setSelPlot(p.id===selPlot?null:p.id)}
                className="rounded-xl p-3 cursor-pointer transition-all"
                style={{
                  background: p.open ? "rgba(16,185,129,0.12)" : p.warning ? "rgba(245,158,11,0.10)" : "rgba(255,255,255,0.05)",
                  border: p.open ? "1.5px solid rgba(16,185,129,0.5)" : p.warning ? "1.5px solid rgba(245,158,11,0.5)" : "1px solid rgba(255,255,255,0.1)",
                  boxShadow: selPlot===p.id ? "0 0 0 2px #10B981" : "none",
                }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-bold text-white text-sm">{p.name}</span>
                    <div className="text-xs text-slate-400">{p.crop} · {p.phase}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.open?"bg-green-500/20 text-green-300":p.warning?"bg-amber-500/20 text-amber-300":"bg-slate-500/20 text-slate-400"}`}>
                      {p.open?"🔓 OPEN":p.warning?"⚠️ WARN":"🔒 CLOSED"}
                    </span>
                    <span className="text-xs font-bold" style={{color:getHealthColor(p.sensor.health)}}>{p.sensor.health}%</span>
                  </div>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.1)"}}>
                  <div className="h-full rounded-full transition-all" style={{width:`${p.sensor.moisture}%`,background:p.open?"#10B981":p.warning?"#F59E0B":"#64748B"}}/>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-400">{Math.round(p.sensor.moisture)}% moisture</span>
                  <span className="text-[10px] text-slate-400">{p.sensor.temp}°C</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CENTER: Live Farm Map + Satellite View */}
          <div className="lg:col-span-6 space-y-4">
            {/* Farm Map */}
            <div className="rounded-2xl overflow-hidden" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:"rgba(255,255,255,0.08)"}}>
                <h3 className="font-bold text-white text-sm flex items-center gap-2"><MapIcon className="w-4 h-4 text-green-400"/> Live Farm Map</h3>
                <span className="text-xs text-slate-400">Click any plot for details</span>
              </div>
              <div className="p-3">
                <svg viewBox="0 0 600 280" className="w-full rounded-xl" style={{height:260}}>
                  <rect width="600" height="280" fill="#0F2027" rx="12"/>
                  {/* Grid lines */}
                  {[1,2,3].map(i=><line key={`h${i}`} x1="0" y1={70*i} x2="600" y2={70*i} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
                  {[1,2,3].map(i=><line key={`v${i}`} x1={150*i} y1="0" x2={150*i} y2="280" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
                  {plotStatuses.map((p,i)=>{
                    const positions=[
                      {x:10,y:10,w:178,h:120},{x:202,y:10,w:188,h:120},{x:404,y:10,w:184,h:120},
                      {x:10,y:144,w:178,h:120},{x:202,y:144,w:188,h:120},{x:404,y:144,w:184,h:120}
                    ];
                    const pos=positions[i];
                    const col=p.open?"#10B981":p.warning?"#F59E0B":"#475569";
                    const isSel=selPlot===p.id;
                    return (
                      <g key={p.id} className="cursor-pointer" onClick={()=>setSelPlot(p.id===selPlot?null:p.id)}>
                        <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx={10}
                          fill={col} fillOpacity={isSel?.18:.07}
                          stroke={col} strokeWidth={isSel?2.5:1.5} strokeOpacity={isSel?1:.6}/>
                        {p.open && <rect x={pos.x+4} y={pos.y+4} width={pos.w-8} height={3} rx={1.5} fill={col} opacity={0.5}/>}
                        <text x={pos.x+pos.w/2} y={pos.y+26} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="DM Sans">{p.name}</text>
                        <text x={pos.x+pos.w/2} y={pos.y+43} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="DM Sans">{p.crop} · {p.phase}</text>
                        <rect x={pos.x+14} y={pos.y+54} width={pos.w-28} height={5} rx={2.5} fill="rgba(255,255,255,0.1)"/>
                        <rect x={pos.x+14} y={pos.y+54} width={Math.max(4,(p.sensor.moisture/100)*(pos.w-28))} height={5} rx={2.5} fill={col}/>
                        <text x={pos.x+pos.w/2} y={pos.y+75} textAnchor="middle" fill={col} fontSize="11" fontWeight="600" fontFamily="DM Sans">{Math.round(p.sensor.moisture)}% moisture</text>
                        <text x={pos.x+pos.w/2} y={pos.y+91} textAnchor="middle" fill="#64748B" fontSize="9" fontFamily="DM Sans">pH {p.sensor.pH} · NPK {p.sensor.npk.n}/{p.sensor.npk.p}/{p.sensor.npk.k}</text>
                        <text x={pos.x+pos.w/2} y={pos.y+108} textAnchor="middle" fontSize="9" fontFamily="DM Sans"
                          fill={p.open?"#34D399":p.warning?"#FCD34D":"#64748B"}>
                          {p.open?"✓ OPEN":p.warning?"⚠ WARN":"● CLOSED"}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Real Land View — Satellite */}
            <div className="rounded-2xl overflow-hidden" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(16,185,129,0.2)"}}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:"rgba(255,255,255,0.08)"}}>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  🌍 Real-Land View <span className="text-green-400">(Satellite / Terrain)</span>
                </h3>
                <label className="flex items-center gap-2 cursor-pointer no-print">
                  <span className="text-xs text-slate-400">Terrain overlay</span>
                  <div className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${showTerrain?"bg-green-500":"bg-slate-600"}`}
                    onClick={()=>setShowTerrain(!showTerrain)}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${showTerrain?"translate-x-4":"translate-x-0.5"}`}/>
                  </div>
                </label>
              </div>
              <div className="relative" style={{height:280}}>
                {/* Satellite background SVG */}
                <svg viewBox="0 0 600 280" className="w-full h-full" style={{position:"absolute",inset:0}}>
                  <defs>
                    <pattern id="farmGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                      <rect width="60" height="60" fill="#1a3a1a"/>
                      <line x1="0" y1="30" x2="60" y2="30" stroke="#2d5a2d" strokeWidth="0.5"/>
                      <line x1="30" y1="0" x2="30" y2="60" stroke="#2d5a2d" strokeWidth="0.5"/>
                    </pattern>
                    {showTerrain && (
                      <pattern id="terrain" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M0,15 Q7.5,5 15,15 Q22.5,25 30,15" stroke="rgba(74,222,128,0.2)" strokeWidth="0.8" fill="none"/>
                      </pattern>
                    )}
                    <radialGradient id="plotGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(16,185,129,0.3)"/>
                      <stop offset="100%" stopColor="rgba(16,185,129,0)"/>
                    </radialGradient>
                  </defs>
                  <rect width="600" height="280" fill="url(#farmGrid)"/>
                  {showTerrain && <rect width="600" height="280" fill="url(#terrain)" opacity="0.6"/>}
                  {/* Path-dividers (dirt paths) */}
                  <rect x="195" y="0" width="14" height="280" fill="#3D2B1F" opacity="0.8"/>
                  <rect x="399" y="0" width="14" height="280" fill="#3D2B1F" opacity="0.8"/>
                  <rect x="0" y="133" width="600" height="14" fill="#3D2B1F" opacity="0.8"/>
                  {/* Tree cluster top-left */}
                  {[{cx:30,cy:20},{cx:50,cy:35},{cx:20,cy:45},{cx:65,cy:15},{cx:40,cy:55}].map((t,i)=>(
                    <g key={i}>
                      <circle cx={t.cx} cy={t.cy} r={10} fill="#1a5c1a" opacity={0.9}/>
                      <circle cx={t.cx} cy={t.cy} r={7}  fill="#22882a" opacity={0.7}/>
                    </g>
                  ))}
                  {/* Plots as SVG polygons */}
                  {plotStatuses.map((p,i)=>{
                    const positions=[
                      {x:10,y:10,w:178,h:120},{x:213,y:10,w:178,h:120},{x:415,y:10,w:178,h:120},
                      {x:10,y:147,w:178,h:120},{x:213,y:147,w:178,h:120},{x:415,y:147,w:178,h:120}
                    ];
                    const pos=positions[i];
                    const col=p.open?"rgba(16,185,129,0.35)":p.warning?"rgba(245,158,11,0.30)":"rgba(100,116,139,0.2)";
                    const strokeCol=p.open?"#10B981":p.warning?"#F59E0B":"#475569";
                    return (
                      <g key={p.id} className="cursor-pointer" style={{cursor:"pointer"}}
                        onClick={()=>setSelPlot(p.id===selPlot?null:p.id)}>
                        {/* Crop rows inside field */}
                        {Array.from({length:Math.floor(pos.h/8)},(_,r)=>(
                          <line key={r} x1={pos.x+6} y1={pos.y+8+r*8} x2={pos.x+pos.w-6} y2={pos.y+8+r*8}
                            stroke={p.open?"rgba(16,185,129,0.25)":p.warning?"rgba(245,158,11,0.2)":"rgba(100,116,139,0.15)"} strokeWidth="1.5"/>
                        ))}
                        <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx={4}
                          fill={col} stroke={strokeCol} strokeWidth={selPlot===p.id?2.5:1.5} strokeOpacity={0.8}/>
                        {/* Tooltip label */}
                        <rect x={pos.x+pos.w/2-45} y={pos.y+pos.h/2-16} width={90} height={32} rx={6} fill="rgba(0,0,0,0.65)"/>
                        <text x={pos.x+pos.w/2} y={pos.y+pos.h/2-2} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="DM Sans">{p.name}</text>
                        <text x={pos.x+pos.w/2} y={pos.y+pos.h/2+12} textAnchor="middle" fill={strokeCol} fontSize="9" fontFamily="DM Sans">{p.sensor.health}% health</text>
                      </g>
                    );
                  })}
                  {/* Water stream */}
                  <path d="M580,0 Q560,70 570,140 Q580,200 560,280" stroke="#3B82F6" strokeWidth="4" fill="none" opacity="0.4" strokeLinecap="round"/>
                </svg>
                <div className="absolute bottom-3 left-3 flex gap-2 no-print">
                  {[{c:"#10B981",l:"Open"},{c:"#F59E0B",l:"Warning"},{c:"#475569",l:"Closed"}].map(x=>(
                    <span key={x.l} className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg" style={{background:"rgba(0,0,0,0.6)",color:x.c}}>
                      <span className="w-2 h-2 rounded-full" style={{background:x.c}}/>{x.l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Radar + Forecast */}
          <div className="lg:col-span-3 space-y-4">
            {/* Farm Health Radar */}
            <div className="rounded-2xl p-4" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Farm Health Radar</p>
              <ResponsiveContainer width="100%" height={175}>
                <RadarChart data={buildRadarData(sensors.NF)} outerRadius={62}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)"/>
                  <PolarAngleAxis dataKey="s" tick={{fill:"#94A3B8",fontSize:9}}/>
                  <Radar dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.18}/>
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* 7-day forecast */}
            <div className="rounded-2xl p-4" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">7-Day Forecast</p>
              <div className="space-y-2">
                {FORECAST.slice(0,7).map((d,i)=>(
                  <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{borderColor:"rgba(255,255,255,0.06)"}}>
                    <span className="text-xs text-slate-400 w-8">{d.day}</span>
                    <span className="text-base">{d.icon}</span>
                    <div className="flex-1 mx-2">
                      <div className="h-1 rounded-full overflow-hidden" style={{background:"rgba(255,255,255,0.1)"}}>
                        <div className="h-full rounded-full" style={{width:`${d.rain}%`,background:"#3B82F6"}}/>
                      </div>
                      <span className="text-[9px] text-slate-500">{d.rain}% rain</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-300 text-right w-18">{d.lo}°–{d.hi}°C</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Plot summary table (print) */}
            <div className="print-section rounded-2xl p-4" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Section Status</p>
              <div className="space-y-1.5">
                {plotStatuses.map(p=>(
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">{p.id}</span>
                    <span className={p.open?"text-green-400":p.warning?"text-amber-400":"text-slate-500"}>
                      {p.open?"● OPEN":p.warning?"⚠ WARN":"○ CLOSED"}
                    </span>
                    <span className="text-slate-400">{p.sensor.health}%</span>
                    <span className="text-slate-400">{Math.round(p.sensor.moisture)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── SELECTED PLOT MODAL ─────────────────────────────────── */}
        <AnimatePresence>
          {selData && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print"
              style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)"}}>
              <motion.div initial={{scale:.92,y:20}} animate={{scale:1,y:0}} exit={{scale:.92,y:20}}
                className="w-full max-w-2xl rounded-2xl overflow-hidden"
                style={{background:"linear-gradient(145deg,#0F2027,#1a3a4a)",border:"1px solid rgba(16,185,129,0.3)",boxShadow:"0 24px 80px rgba(0,0,0,0.6)"}}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b" style={{borderColor:"rgba(16,185,129,0.2)"}}>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-bold text-white text-xl">{selData.name}</h2>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${selData.open?"bg-green-500/20 text-green-300 border border-green-500/40":selData.warning?"bg-amber-500/20 text-amber-300 border border-amber-500/40":"bg-slate-500/20 text-slate-400 border border-slate-500/30"}`}>
                        {selData.open?"🔓 OPEN":selData.warning?"⚠️ WARNING":"🔒 CLOSED"}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-0.5">{selData.crop} · {selData.phase}</p>
                  </div>
                  <button onClick={()=>setSelPlot(null)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <X className="w-5 h-5"/>
                  </button>
                </div>

                {/* Calculation result */}
                <div className="mx-5 mt-4 p-3 rounded-xl text-sm font-medium" style={{background:selData.open?"rgba(16,185,129,0.12)":"rgba(100,116,139,0.12)",border:`1px solid ${selData.open?"rgba(16,185,129,0.3)":"rgba(100,116,139,0.3)"}`}}>
                  <span className="text-slate-400 font-semibold text-xs uppercase tracking-wide">Calculation Rule: </span>
                  <span className={selData.open?"text-green-300":"text-slate-400"}>{selData.reason}</span>
                  <span className={`ml-3 text-xs font-bold ${selData.open?"text-green-400":"text-slate-500"}`}>→ {selData.open?"CONDITIONS MET":"CONDITIONS NOT MET"}</span>
                </div>

                {/* Metric grid */}
                <div className="grid grid-cols-4 gap-3 p-5">
                  {[
                    {l:"Moisture",  v:`${Math.round(selData.sensor.moisture)}%`,   c:"#10B981"},
                    {l:"Health",    v:`${selData.sensor.health}%`,                c:getHealthColor(selData.sensor.health)},
                    {l:"Soil pH",   v:selData.sensor.pH,                          c:"#3B82F6"},
                    {l:"Temp",      v:`${selData.sensor.temp}°C`,                 c:"#F59E0B"},
                    {l:"Nitrogen",  v:`${selData.sensor.npk.n}`,                  c:"#8B5CF6"},
                    {l:"Phosphorus",v:`${selData.sensor.npk.p}`,                  c:"#EC4899"},
                    {l:"Potassium", v:`${selData.sensor.npk.k}`,                  c:"#06B6D4"},
                    {l:"Pest Risk", v:selData.sensor.pest,                         c:selData.sensor.pest==="high"?"#F43F5E":selData.sensor.pest==="medium"?"#F59E0B":"#10B981"},
                  ].map(s=>(
                    <div key={s.l} className="rounded-xl p-3 text-center" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
                      <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                      <div className="text-lg font-bold capitalize" style={{color:s.c}}>{s.v}</div>
                    </div>
                  ))}
                </div>

                {/* 7-day health history */}
                <div className="px-5 pb-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Health Trend — Last 7 Days</p>
                  <ResponsiveContainer width="100%" height={90}>
                    <LineChart data={selData.sensor.weekHistory.map((v:number,i:number)=>({d:["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i],v}))}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                      <XAxis dataKey="d" tick={{fill:"#64748B",fontSize:10}} axisLine={false} tickLine={false}/>
                      <YAxis domain={[0,100]} hide/>
                      <Tooltip contentStyle={{background:"#0F2027",border:"1px solid #10B981",borderRadius:"8px",color:"#A7F3D0",fontSize:"12px"}}/>
                      <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2.5} dot={{fill:"#10B981",r:3}} name="Health %"/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-5 border-t" style={{borderColor:"rgba(255,255,255,0.08)"}}>
                  <button onClick={()=>handleIrrigate(selData.id)}
                    disabled={irrigating===selData.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                    style={{background:"linear-gradient(135deg,#059669,#10B981)",color:"#fff",boxShadow:"0 4px 14px rgba(16,185,129,0.4)"}}>
                    {irrigating===selData.id ? <><RefreshCw className="w-4 h-4 animate-spin"/>Applying…</> : <><Droplets className="w-4 h-4"/>Apply Irrigation</>}
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{background:"rgba(255,255,255,0.06)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.2)"}}>
                    <Leaf className="w-4 h-4"/> Nutrient Plan
                  </button>
                  <button onClick={()=>setSelPlot(null)} className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-200 transition-all"
                    style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── PRINT SUMMARY TABLE ─────────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden mb-6" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)"}}>
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{borderColor:"rgba(255,255,255,0.08)"}}>
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-400"/> Section Analysis Table
            </h3>
            <button onClick={handlePrint} className="flex items-center gap-1.5 text-xs text-green-400 font-semibold hover:text-green-300 no-print">
              <Printer className="w-3.5 h-3.5"/> Print
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                  {["Field","Crop","Status","Reason","Health %","Moisture","Pest Risk","Temp","pH","NPK"].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plotStatuses.map((p,i)=>(
                  <tr key={p.id} className="border-b transition-colors cursor-pointer hover:bg-white/5"
                    style={{borderColor:"rgba(255,255,255,0.05)"}}
                    onClick={()=>setSelPlot(p.id)}>
                    <td className="px-4 py-3 font-semibold text-white">{p.name}</td>
                    <td className="px-4 py-3 text-slate-300">{p.crop}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.open?"bg-green-500/20 text-green-300":p.warning?"bg-amber-500/20 text-amber-300":"bg-slate-500/20 text-slate-400"}`}>
                        {p.open?"OPEN":p.warning?"WARNING":"CLOSED"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs max-w-[180px]">{p.reason}</td>
                    <td className="px-4 py-3 font-bold" style={{color:getHealthColor(p.sensor.health)}}>{p.sensor.health}%</td>
                    <td className="px-4 py-3 text-slate-300">{Math.round(p.sensor.moisture)}%</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${p.sensor.pest==="high"?"text-red-400":p.sensor.pest==="medium"?"text-amber-400":"text-green-400"}`}>
                        {p.sensor.pest}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{p.sensor.temp}°C</td>
                    <td className="px-4 py-3 text-slate-300">{p.sensor.pH}</td>
                    <td className="px-4 py-3 text-slate-300 font-mono text-xs">{p.sensor.npk.n}/{p.sensor.npk.p}/{p.sensor.npk.k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 text-slate-500 text-sm border-t" style={{borderColor:"rgba(255,255,255,0.06)"}}>
          <p className="text-slate-400 italic mb-1">"Family-driven smart farming — every plot opens with care, calculation, and legacy."</p>
          <p className="text-xs">land · Smart Farm Dashboard · AgroWave · Kharif 2026</p>
        </div>
      </div>

      {/* ─── SETTINGS PANEL ─────────────────────────────────────── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)"}}>
            <motion.div initial={{scale:.94,y:20}} animate={{scale:1,y:0}} exit={{scale:.94,y:20}}
              className="w-full max-w-lg rounded-2xl p-6 overflow-y-auto max-h-[90vh]"
              style={{background:"linear-gradient(145deg,#0F2027,#1a3a4a)",border:"1px solid rgba(16,185,129,0.3)"}}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-white text-lg flex items-center gap-2"><Settings className="w-5 h-5 text-green-400"/> Threshold Settings</h3>
                <button onClick={()=>setShowSettings(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"><X className="w-5 h-5"/></button>
              </div>
              <div className="space-y-5">
                {[
                  {label:"North Field — Min Health %",     key:"NF_health",   min:50, max:100, step:1},
                  {label:"North Field — Min Moisture %",   key:"NF_moisture", min:40, max:95,  step:1},
                  {label:"East Block — Max Temperature °C",key:"EB_temp",     min:28, max:42,  step:0.5},
                  {label:"West Block — Max Rainfall mm",   key:"WB_rainfall", min:10, max:80,  step:5},
                  {label:"South Field — Min NPK value",    key:"SF_npk",      min:50, max:200, step:5},
                  {label:"Central Plot — pH Lower Bound",  key:"CP_pH_lo",    min:5.0,max:7.0, step:0.1},
                  {label:"Central Plot — pH Upper Bound",  key:"CP_pH_hi",    min:5.5,max:7.5, step:0.1},
                  {label:"Border Strip — Min Rain Days",   key:"BS_rainDays", min:0,  max:7,   step:1},
                ].map(s=>(
                  <div key={s.key}>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-slate-300 font-medium">{s.label}</label>
                      <span className="text-green-400 font-bold text-sm">{(thresholds as any)[s.key]}</span>
                    </div>
                    <input type="range" min={s.min} max={s.max} step={s.step}
                      value={(thresholds as any)[s.key]}
                      onChange={e=>setThresholds(p=>({...p,[s.key]:+e.target.value}))}
                      className="w-full h-2 rounded-full outline-none cursor-pointer"
                      style={{background:`linear-gradient(to right,#10B981 ${(((thresholds as any)[s.key]-s.min)/(s.max-s.min))*100}%,rgba(255,255,255,0.15) 0%)`,padding:0,border:"none"}}/>
                  </div>
                ))}
              </div>
              <button onClick={()=>setShowSettings(false)} className="mt-6 w-full py-3 rounded-xl font-semibold text-white transition-all"
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
