"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Printer, ExternalLink, ZoomIn, ZoomOut, Maximize2, ChevronRight, Info, Map, Layers } from "lucide-react";
import { useStore } from "@/lib/store";
import { getMoistureColor, getHealthColor } from "@/lib/utils";

// Realistic irregular polygon paths (SVG viewBox 0 0 900 560)
const PARCEL_SHAPES = [
  { id:"A", name:"North Field",  crop:"Wheat",  path:"M60,40 L280,30 L310,55 L295,180 L240,210 L80,200 L45,150 L60,40", cx:185, cy:115 },
  { id:"B", name:"East Block",   crop:"Rice",   path:"M320,25 L510,18 L535,42 L545,190 L490,205 L310,195 L310,55 L320,25", cx:427, cy:112 },
  { id:"C", name:"West Block",   crop:"Soybean",path:"M560,15 L750,22 L780,50 L770,200 L710,215 L555,208 L545,190 L535,42 L560,15", cx:662, cy:113 },
  { id:"D", name:"South Field",  crop:"Cotton", path:"M45,220 L240,215 L295,215 L310,230 L300,380 L260,415 L70,420 L30,380 L45,220", cx:172, cy:315 },
  { id:"E", name:"Central Plot", crop:"Maize",  path:"M310,230 L545,225 L555,245 L558,390 L500,415 L305,408 L300,380 L310,230", cx:430, cy:318 },
  { id:"F", name:"Border Strip", crop:"Onion",  path:"M560,238 L770,228 L810,265 L820,420 L760,445 L575,438 L558,390 L555,245 L560,238", cx:692, cy:333 },
];

const COMPLETIONS: Record<string,number> = {
  A:93.95571812921074, B:74.71632610612846, C:62.98277071487386,
  D:82.18390979790693, E:88.52486644323442, F:77.83659463739020,
};
const ACRES: Record<string,string> = {
  A:"4.5 ac / 1.82 ha", B:"3.2 ac / 1.29 ha", C:"3.8 ac / 1.54 ha",
  D:"5.0 ac / 2.02 ha", E:"4.0 ac / 1.62 ha", F:"2.5 ac / 1.01 ha",
};

const STATUS_COLOR = { Open:"#10B981", Warning:"#F59E0B", Closed:"#94A3B8" };

export default function LandView() {
  const { plots } = useStore();
  const [sel, setSel]           = useState<string|null>(null);
  const [terrain, setTerrain]   = useState(false);
  const [basemap, setBasemap]   = useState<"satellite"|"terrain"|"hybrid">("satellite");
  const [zoom, setZoom]         = useState(1);
  const [thresholds, setThresholds] = useState({ moisture:40, health:60 });
  const [showThresh, setShowThresh] = useState(false);
  const [pulse, setPulse]       = useState(false);

  useEffect(() => {
    const iv = setInterval(() => setPulse(p=>!p), 900);
    return () => clearInterval(iv);
  }, []);

  const getPlot = (id:string) => plots.find(p=>p.id===id);

  const getStatus = (id:string): keyof typeof STATUS_COLOR => {
    const p = getPlot(id);
    if (!p) return "Closed";
    if (p.moisture < thresholds.moisture || p.health < thresholds.health) return "Warning";
    return "Open";
  };

  const getFill = (id:string) => {
    const p = getPlot(id);
    if (!p) return "#334155";
    const h = p.health / 100;
    if (terrain) {
      const g = Math.round(80 + h * 100);
      return `rgb(${Math.round(40-h*20)},${g},${Math.round(40-h*30)})`;
    }
    // NDVI-style: red (low) → yellow → green (high)
    const r = Math.round(255 * (1 - h));
    const g = Math.round(200 * h);
    return `rgba(${r},${g},30,0.55)`;
  };

  const openDetail = (id:string) => {
    window.open(`/fields/${id}`, "_blank", "noopener");
  };

  const selPlot = sel ? getPlot(sel) : null;
  const shape = PARCEL_SHAPES.find(s => s.id === sel);

  const BASEMAP_BG: Record<string,string> = {
    satellite: "linear-gradient(160deg,#0d2818 0%,#1a3a20 30%,#0f2a14 60%,#1e3d1a 100%)",
    terrain:   "linear-gradient(160deg,#2d4a1e 0%,#3d6b2a 30%,#4a7a32 60%,#5a8e3a 100%)",
    hybrid:    "linear-gradient(160deg,#1a2e18 0%,#2a4a20 30%,#1e3a16 60%,#2e5020 100%)",
  };

  return (
    <div className="pt-[88px] min-h-screen flex flex-col" style={{background:"linear-gradient(160deg,#0F172A,#1E293B)"}}>
      {/* Header */}
      <div className="py-4 border-b border-white/10 no-print">
        <div className="container flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">🌍</span> Land <span className="text-brand-400">View</span>
              </h1>
              <p className="text-slate-400 text-xs">Real-time satellite parcel view · KHARIF 2026 · 6 plots</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Basemap switcher */}
            <div className="flex gap-1 bg-white/10 rounded-xl p-1 border border-white/20">
              {(["satellite","terrain","hybrid"] as const).map(b => (
                <button key={b} onClick={()=>setBasemap(b)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${basemap===b?"bg-white text-slate-900":"text-white/60 hover:text-white"}`}>
                  {b}
                </button>
              ))}
            </div>
            {/* Terrain toggle */}
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/20">
              <Layers className="w-3.5 h-3.5 text-slate-300"/>
              <span className="text-xs text-slate-300 font-medium">Terrain</span>
              <button onClick={()=>setTerrain(!terrain)}
                className={`relative w-9 h-5 rounded-full transition-all ${terrain?"bg-brand-500":"bg-white/20"}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${terrain?"translate-x-4":""}`}/>
              </button>
            </div>
            <button onClick={()=>setShowThresh(!showThresh)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
              <Settings className="w-3.5 h-3.5"/> Thresholds
            </button>
            <button onClick={()=>window.print()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-green-300 bg-white/10 border border-white/20 hover:bg-white/20 transition-all no-print">
              <Printer className="w-3.5 h-3.5"/> Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Thresholds panel */}
      <AnimatePresence>
        {showThresh && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
            className="border-b border-white/10 overflow-hidden bg-white/5">
            <div className="container py-3 flex items-center gap-6 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Warning Thresholds:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">Moisture &lt;</span>
                <input type="range" min="10" max="70" value={thresholds.moisture}
                  onChange={e=>setThresholds(p=>({...p,moisture:+e.target.value}))}
                  className="w-24 accent-brand-500"/>
                <span className="text-xs text-brand-400 font-bold w-8">{thresholds.moisture}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300">Health &lt;</span>
                <input type="range" min="20" max="80" value={thresholds.health}
                  onChange={e=>setThresholds(p=>({...p,health:+e.target.value}))}
                  className="w-24 accent-brand-500"/>
                <span className="text-xs text-brand-400 font-bold w-8">{thresholds.health}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      <div className="container pt-3 no-print">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs mb-3"
          style={{background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",color:"#A7F3D0"}}>
          <Info className="w-3.5 h-3.5 flex-shrink-0"/>
          <span><strong>Tip:</strong> Click any parcel to select and view sensor data. Double-click or use the "Open Detail" button to open the full parcel page in a new tab. Use Thresholds to customize Open/Warning status.</span>
        </div>
      </div>

      <div className="flex-1 container pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          {/* SATELLITE MAP — SVG geospatial view */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl overflow-hidden border border-white/20"
              style={{background:BASEMAP_BG[basemap],minHeight:"500px",position:"relative",boxShadow:"0 8px 32px rgba(0,0,0,0.4)"}}>
              {/* Map header */}
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
                  <span className="text-white text-xs font-semibold">KHARIF 2026 · 6 Active Parcels</span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={()=>setZoom(z=>Math.min(z+0.2,2))}
                    className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-all">
                    <ZoomIn className="w-3.5 h-3.5"/>
                  </button>
                  <button onClick={()=>setZoom(z=>Math.max(z-0.2,0.5))}
                    className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-all">
                    <ZoomOut className="w-3.5 h-3.5"/>
                  </button>
                  <button onClick={()=>setZoom(1)}
                    className="w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-all">
                    <Maximize2 className="w-3.5 h-3.5"/>
                  </button>
                </div>
              </div>

              {/* SVG Parcel Map */}
              <svg
                viewBox="0 0 860 480"
                className="w-full h-full"
                style={{minHeight:"460px",transform:`scale(${zoom})`,transformOrigin:"center center",transition:"transform 0.3s ease"}}
              >
                {/* Satellite texture lines */}
                {terrain && Array.from({length:18},(_,i)=>(
                  <line key={i} x1="0" y1={i*28+14} x2="860" y2={i*28+14} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                ))}
                {/* Grid overlay */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <filter id="selGlow">
                    <feGaussianBlur stdDeviation="5" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                <rect width="860" height="480" fill="url(#grid)"/>

                {/* Irrigation channels between parcels */}
                <path d="M0,210 Q430,205 860,215" fill="none" stroke="rgba(59,130,246,0.3)" strokeWidth="3" strokeDasharray="6,3"/>
                <path d="M305,0 Q310,240 300,480" fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth="2.5" strokeDasharray="6,3"/>
                <path d="M545,0 Q550,240 560,480" fill="none" stroke="rgba(59,130,246,0.25)" strokeWidth="2.5" strokeDasharray="6,3"/>

                {/* Parcels */}
                {PARCEL_SHAPES.map(shape => {
                  const plot = getPlot(shape.id);
                  const status = getStatus(shape.id);
                  const isSel = sel === shape.id;
                  const fill = getFill(shape.id);
                  const statusCol = STATUS_COLOR[status];

                  return (
                    <g key={shape.id}
                      onClick={()=>setSel(isSel?null:shape.id)}
                      onDoubleClick={()=>openDetail(shape.id)}
                      style={{cursor:"pointer",transition:"opacity 0.2s"}}
                      opacity={sel && !isSel ? 0.55 : 1}>
                      {/* Main parcel fill */}
                      <polygon
                        points={shape.path.replace(/[MLQ]/g,"").replace(/\s+/g," ").trim()}
                        fill={fill}
                        stroke={isSel ? statusCol : "rgba(255,255,255,0.2)"}
                        strokeWidth={isSel ? 3 : 1.5}
                        filter={isSel ? "url(#selGlow)" : undefined}
                      />
                      {/* Crop row lines inside parcel */}
                      <clipPath id={`clip-${shape.id}`}><polygon points={shape.path.replace(/[MLQ]/g,"").replace(/\s+/g," ").trim()}/></clipPath>
                      <g clipPath={`url(#clip-${shape.id})`} opacity="0.3">
                        {Array.from({length:12},(_,i)=>(
                          <line key={i} x1={shape.cx-120} y1={shape.cy-80+i*14} x2={shape.cx+120} y2={shape.cy-75+i*14}
                            stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
                        ))}
                      </g>
                      {/* Pulsing selection border */}
                      {isSel && (
                        <polygon
                          points={shape.path.replace(/[MLQ]/g,"").replace(/\s+/g," ").trim()}
                          fill="none"
                          stroke={statusCol}
                          strokeWidth={pulse?4:2.5}
                          strokeDasharray={pulse?"8,4":"12,0"}
                          opacity={pulse?1:0.7}
                          style={{transition:"all 0.4s ease"}}
                        />
                      )}
                      {/* Status corner dot */}
                      <circle cx={shape.cx+50} cy={shape.cy-35} r="5" fill={statusCol} opacity="0.9"
                        filter="url(#glow)"/>
                      {/* Label */}
                      <text x={shape.cx} y={shape.cy-20} textAnchor="middle" fill="white"
                        fontSize="11" fontWeight="700" fontFamily="DM Sans,sans-serif"
                        style={{textShadow:"0 1px 3px rgba(0,0,0,0.8)",pointerEvents:"none"}}>
                        {shape.name}
                      </text>
                      <text x={shape.cx} y={shape.cy-4} textAnchor="middle" fill="rgba(255,255,255,0.75)"
                        fontSize="8.5" fontFamily="DM Sans,sans-serif" style={{pointerEvents:"none"}}>
                        {shape.crop}
                      </text>
                      {plot && (
                        <text x={shape.cx} y={shape.cy+12} textAnchor="middle" fill={getMoistureColor(plot.moisture)}
                          fontSize="10" fontWeight="700" fontFamily="JetBrains Mono,monospace"
                          style={{pointerEvents:"none"}}>
                          {Math.round(plot.moisture)}% moisture
                        </text>
                      )}
                      <text x={shape.cx} y={shape.cy+26} textAnchor="middle" fill="rgba(255,255,255,0.5)"
                        fontSize="8" fontFamily="DM Sans,sans-serif" style={{pointerEvents:"none"}}>
                        {ACRES[shape.id]}
                      </text>
                    </g>
                  );
                })}

                {/* Compass */}
                <g transform="translate(820,440)">
                  <circle cx="0" cy="0" r="18" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <text x="0" y="-6" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">N</text>
                  <polygon points="0,-14 4,-2 0,0 -4,-2" fill="white" opacity="0.8"/>
                  <polygon points="0,14 4,2 0,0 -4,2" fill="rgba(255,255,255,0.3)"/>
                </g>

                {/* Scale bar */}
                <g transform="translate(30,455)">
                  <rect x="0" y="0" width="80" height="4" fill="rgba(255,255,255,0.6)" rx="1"/>
                  <text x="40" y="14" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">200m</text>
                </g>
              </svg>

              {/* Legend */}
              <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/20">
                {Object.entries(STATUS_COLOR).map(([s,c])=>(
                  <span key={s} className="flex items-center gap-1.5 text-xs text-white/80 font-semibold">
                    <span className="w-3 h-3 rounded-full" style={{background:c}}/>
                    {s}
                  </span>
                ))}
                <span className="w-px h-4 bg-white/20"/>
                <span className="text-xs text-white/50">Double-click to open detail</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — Parcel detail + plot list */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {/* Selected parcel detail */}
            <AnimatePresence mode="wait">
              {selPlot && shape ? (
                <motion.div key={sel} initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}
                  className="rounded-2xl p-5 border border-white/20"
                  style={{background:"rgba(15,23,42,0.8)",backdropFilter:"blur(12px)"}}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white text-base">{selPlot.name}</h3>
                      <p className="text-slate-400 text-xs">{selPlot.crop} · {selPlot.phase}</p>
                    </div>
                    <button onClick={()=>openDetail(sel!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-green-300 border border-green-500/30 hover:bg-green-500/10 transition-all">
                      Open Detail <ExternalLink className="w-3 h-3"/>
                    </button>
                  </div>
                  <div className="text-xs text-brand-300 font-mono mb-3">{ACRES[sel!]}</div>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {[
                      {l:"Moisture",  v:`${Math.round(selPlot.moisture)}%`,  c:getMoistureColor(selPlot.moisture)},
                      {l:"Health",    v:`${selPlot.health}%`,               c:getHealthColor(selPlot.health)},
                      {l:"Temp",      v:`${selPlot.temp}°C`,                c:"#F59E0B"},
                      {l:"pH",        v:selPlot.ph.toFixed(1),              c:"#10B981"},
                      {l:"N kg/ha",   v:selPlot.npk.n,                     c:"#60A5FA"},
                      {l:"P kg/ha",   v:selPlot.npk.p,                     c:"#A78BFA"},
                    ].map(s=>(
                      <div key={s.l} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                        <span className="text-slate-400 text-xs">{s.l}</span>
                        <span className="font-bold text-sm" style={{color:s.c}}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                  {/* Season completion */}
                  <div className="bg-white/5 rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Season Completion</span>
                      <span className="font-mono text-xs text-brand-300">{COMPLETIONS[sel!]?.toFixed(2)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-brand-500" initial={{width:0}}
                        animate={{width:`${COMPLETIONS[sel!]||0}%`}} transition={{duration:0.8}}/>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`badge text-xs ${getStatus(sel!)===`Open`?"badge-green":"badge-amber"}`}>
                      {getStatus(sel!)}
                    </span>
                    <span className={`badge text-xs ${selPlot.pestRisk==="high"?"badge-red":selPlot.pestRisk==="medium"?"badge-amber":"badge-green"}`}>
                      {selPlot.pestRisk} pest
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}}
                  className="rounded-2xl p-5 border border-white/10 text-center py-8"
                  style={{background:"rgba(255,255,255,0.04)"}}>
                  <Map className="w-8 h-8 text-slate-500 mx-auto mb-2"/>
                  <p className="text-slate-400 text-sm">Click a parcel to view sensor data</p>
                  <p className="text-slate-600 text-xs mt-1">Double-click to open detail in new tab</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* All plots list */}
            <div className="rounded-2xl border border-white/20 overflow-hidden flex-1"
              style={{background:"rgba(15,23,42,0.8)",backdropFilter:"blur(12px)"}}>
              <div className="px-4 py-3 border-b border-white/10">
                <h3 className="font-bold text-white text-sm">All Parcels</h3>
              </div>
              <div className="overflow-y-auto max-h-[340px]">
                {PARCEL_SHAPES.map((sh,i)=>{
                  const p = getPlot(sh.id);
                  const st = getStatus(sh.id);
                  if(!p) return null;
                  return (
                    <motion.div key={sh.id} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                      onClick={()=>setSel(sel===sh.id?null:sh.id)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-white/5 transition-all ${sel===sh.id?"bg-white/10":"hover:bg-white/5"}`}>
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:STATUS_COLOR[st]}}/>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{p.name}</p>
                        <p className="text-slate-500 text-xs">{p.crop} · {ACRES[sh.id].split("/")[0].trim()}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-bold text-xs" style={{color:getMoistureColor(p.moisture)}}>{Math.round(p.moisture)}%</div>
                        <div className="text-slate-500 text-[10px]">moisture</div>
                      </div>
                      <button onClick={e=>{e.stopPropagation();openDetail(sh.id);}}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-brand-400 hover:bg-white/10 transition-all">
                        <ExternalLink className="w-3.5 h-3.5"/>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* NDVI colour scale legend */}
            <div className="rounded-2xl border border-white/10 p-4"
              style={{background:"rgba(255,255,255,0.04)"}}>
              <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">Health Colour Scale</p>
              <div className="h-3 rounded-full overflow-hidden mb-1.5"
                style={{background:"linear-gradient(90deg,#F43F5E,#F59E0B,#10B981)"}}>
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Low (0%)</span><span>Medium (50%)</span><span>High (100%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
