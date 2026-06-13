"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { getHealthColor, getMoistureColor, FORECAST } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, X, Droplets, RefreshCw,
  Download, Zap, ArrowLeft, Activity,
  Thermometer, Wind, Sun, Leaf, Layers,
  Map as MapIcon, Eye, BarChart2
} from "lucide-react";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

/* ─── Polygon shapes for 6 base plots ─── */
const POLYS: Record<string,{pts:string; cx:number; cy:number}> = {
  A:  { pts:"28,18 308,12 320,210 146,222 30,218",       cx:170, cy:116 },
  B:  { pts:"340,12 612,16 620,220 343,212 328,110",     cx:472, cy:116 },
  C:  { pts:"635,12 878,22 866,222 630,226",              cx:750, cy:120 },
  D:  { pts:"30,238 267,232 276,416 34,426",              cx:150, cy:328 },
  E:  { pts:"286,232 636,238 632,422 280,426",            cx:458, cy:330 },
  F:  { pts:"646,238 878,232 888,430 642,426",            cx:762, cy:334 },
};
/* Extra polygon slots for newly added plots */
const EXTRA_POLYS: Record<string,{pts:string; cx:number; cy:number}> = {
  G:  { pts:"30,448 267,444 272,560 34,564",             cx:150, cy:504 },
  H:  { pts:"286,444 636,448 630,562 280,566",           cx:458, cy:506 },
};

function ndvi(h:number, m:number){
  const s = h*0.6+m*0.4;
  if(s>=82)return"#16A34A";
  if(s>=68)return"#22C55E";
  if(s>=52)return"#84CC16";
  if(s>=38)return"#EAB308";
  return"#EF4444";
}
function statusOf(h:number,m:number){
  if(h>=78&&m>=55)return{label:"OPEN",  c:"#10B981",bg:"rgba(16,185,129,0.2)"};
  if(h<60||m<30)  return{label:"ALERT", c:"#EF4444",bg:"rgba(239,68,68,0.2)"};
  return{label:"WATCH",c:"#F59E0B",bg:"rgba(245,158,11,0.2)"};
}
function weekHistory(base:number){
  return Array.from({length:7},(_,i)=>({
    d:["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i],
    v:Math.round(Math.max(30,Math.min(99,base+(i-3)*2.5+(Math.random()*4-2))))
  }));
}

/* Rain canvas overlay */
function RainCanvas(){
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c = ref.current; if(!c) return;
    const ctx = c.getContext("2d")!;
    const resize = ()=>{ c.width=c.offsetWidth; c.height=c.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const drops = Array.from({length:90},()=>({
      x:Math.random()*1920, y:Math.random()*1080,
      l:Math.random()*20+8, s:Math.random()*3+1.5
    }));
    let raf:number;
    const draw=()=>{
      ctx.clearRect(0,0,c.width,c.height);
      ctx.strokeStyle="rgba(147,210,255,0.3)"; ctx.lineWidth=0.9;
      drops.forEach(d=>{
        ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x+d.l*0.2,d.y+d.l); ctx.stroke();
        d.y+=d.s*2.5; d.x+=d.s*0.4;
        if(d.y>c.height){d.y=-d.l; d.x=Math.random()*c.width;}
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{cancelAnimationFrame(raf); window.removeEventListener("resize",resize);};
  },[]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-55"/>;
}

export default function LandView(){
  const { plots, updateSensor, setField, irrigate, pushNotif } = useStore();
  const [selId, setSelId]         = useState<string|null>(null);
  const [carIdx, setCarIdx]       = useState(0);
  const [editMode, setEditMode]   = useState(false);
  const [editVals, setEditVals]   = useState<Record<string,number>>({});
  const [liveFlash, setLiveFlash] = useState<string|null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [viewMode, setViewMode]   = useState<"satellite"|"terrain"|"ndvi">("satellite");
  const [pulse, setPulse]         = useState<string|null>(null);
  const [showRadar, setShowRadar] = useState(false);
  const carRef = useRef<HTMLDivElement>(null);

  const rainDay = FORECAST[0].rain > 30;

  /* Map each plot to its polygon position */
  const plotData = plots.map(p=>({
    ...p,
    poly: POLYS[p.id] ?? EXTRA_POLYS[p.id] ?? null,
  })).filter(p=>p.poly);

  /* Real-time simulation — updates global store every 8s */
  useEffect(()=>{
    const iv = setInterval(()=>{
      if(plots.length===0) return;
      const target = plots[Math.floor(Math.random()*plots.length)];
      const nm = Math.max(10, Math.min(95, target.moisture+(Math.random()-.5)*4));
      const nh = Math.max(30, Math.min(98, target.health  +(Math.random()-.5)*2));
      const nt = Math.max(24, Math.min(43, target.temp    +(Math.random()-.5)*1));
      updateSensor(target.id, nm, nh, nt);
      setPulse(target.id);
      setLiveFlash(target.id);
      setTimeout(()=>{ setPulse(null); setLiveFlash(null); },2500);
    },8000);
    return()=>clearInterval(iv);
  },[plots]);

  const selPlot = selId ? plotData.find(p=>p.id===selId) : null;
  const selIdx  = selId ? plotData.findIndex(p=>p.id===selId) : -1;

  const openCarousel = (id:string, idx:number)=>{
    setSelId(id); setCarIdx(idx);
    setShowPanel(true); setEditMode(false); setEditVals({});
  };
  const prevPlot = ()=>{
    const ni = (carIdx-1+plotData.length)%plotData.length;
    setCarIdx(ni); setSelId(plotData[ni].id); setEditMode(false); setEditVals({});
  };
  const nextPlot = ()=>{
    const ni = (carIdx+1)%plotData.length;
    setCarIdx(ni); setSelId(plotData[ni].id); setEditMode(false); setEditVals({});
  };

  const applyEdit = ()=>{
    if(!selPlot) return;
    if(editVals.moisture!==undefined) updateSensor(selPlot.id, editVals.moisture, editVals.health??selPlot.health, editVals.temp??selPlot.temp);
    if(editVals.health!==undefined)   updateSensor(selPlot.id, editVals.moisture??selPlot.moisture, editVals.health, editVals.temp??selPlot.temp);
    if(editVals.ph!==undefined)       setField(selPlot.id, "ph", editVals.ph);
    pushNotif({title:`✏️ ${selPlot.name} Updated`,body:"Metrics edited and synced.",type:"success",time:"just now"});
    setEditMode(false); setEditVals({});
  };

  const exportCSV = (p:typeof plotData[0])=>{
    const rows = [
      ["Metric","Value"],
      ["Name",p.name],["Crop",p.crop],["Phase",p.phase],
      ["Moisture %",Math.round(p.moisture)],["Health %",Math.round(p.health)],
      ["Temp °C",p.temp.toFixed(1)],["pH",p.ph.toFixed(1)],
      ["Nitrogen",p.npk.n],["Phosphorus",p.npk.p],["Potassium",p.npk.k],
      ["Pest Risk",p.pestRisk],["Area",p.area],
    ].map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([rows],{type:"text/csv"}));
    a.download=`${p.name.replace(/\s+/g,"-")}.csv`; a.click();
  };

  const svgH = plots.length > 6 ? 580 : 450;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden"
      style={{background:"linear-gradient(180deg,#0a1a0e,#081208)"}}>

      {/* Rain overlay */}
      {rainDay && <RainCanvas/>}

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 z-20"
        style={{background:"rgba(5,15,8,0.95)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(16,185,129,0.2)"}}>
        <div className="flex items-center gap-2">
          <Link href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 hover:bg-white/10 transition-all"
            style={{border:"1px solid rgba(255,255,255,0.15)"}}>
            🏠 Dashboard
          </Link>
          <Link href="/land"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-green-300 hover:bg-green-500/10 transition-all"
            style={{border:"1px solid rgba(16,185,129,0.3)"}}>
            <ArrowLeft className="w-3.5 h-3.5"/> Land
          </Link>
          <div className="ml-1">
            <h1 className="text-sm font-bold text-white leading-none">🔭 Land Intelligence View</h1>
            <p className="text-[10px] text-green-400">{plotData.length} plots · Live sensor data · Kharif 2026</p>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl"
          style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)"}}>
          {([
            {id:"satellite",Icon:MapIcon,   label:"Satellite"},
            {id:"terrain",  Icon:Layers,    label:"Terrain"},
            {id:"ndvi",     Icon:BarChart2, label:"NDVI"},
          ] as const).map(m=>(
            <button key={m.id} onClick={()=>setViewMode(m.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={viewMode===m.id?{background:"linear-gradient(135deg,#059669,#10B981)",color:"#fff"}:{color:"#64748B"}}>
              <m.Icon className="w-3.5 h-3.5"/>{m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {rainDay && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">🌧️ Rain</span>}
          <button onClick={()=>setShowRadar(!showRadar)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={showRadar?{background:"rgba(16,185,129,0.2)",color:"#A7F3D0",border:"1px solid rgba(16,185,129,0.3)"}:{color:"#64748B",border:"1px solid rgba(255,255,255,0.1)"}}>
            <Eye className="w-3.5 h-3.5"/> Radar
          </button>
        </div>
      </div>

      {/* ── MAIN MAP AREA ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Left sidebar — live status */}
        <AnimatePresence>
          {showRadar && (
            <motion.div initial={{width:0,opacity:0}} animate={{width:220,opacity:1}} exit={{width:0,opacity:0}}
              className="flex-shrink-0 overflow-hidden z-10"
              style={{background:"rgba(5,15,8,0.9)",backdropFilter:"blur(12px)",borderRight:"1px solid rgba(16,185,129,0.15)"}}>
              <div className="p-3 w-[220px]">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Farm Health Radar</p>
                <ResponsiveContainer width="100%" height={150}>
                  <RadarChart data={[
                    {s:"Moisture",  v:Math.round(plots.reduce((a,p)=>a+p.moisture,0)/Math.max(plots.length,1))},
                    {s:"Health",    v:Math.round(plots.reduce((a,p)=>a+p.health,0)/Math.max(plots.length,1))},
                    {s:"Nutrition", v:72},
                    {s:"Sunlight",  v:88},
                    {s:"Growth",    v:76},
                  ]} outerRadius={50}>
                    <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                    <PolarAngleAxis dataKey="s" tick={{fill:"#64748B",fontSize:8}}/>
                    <Radar dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.18} strokeWidth={1.5}/>
                  </RadarChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {plotData.slice(0,6).map(p=>{
                    const st = statusOf(p.health,p.moisture);
                    return (
                      <div key={p.id} onClick={()=>openCarousel(p.id,plotData.indexOf(p))}
                        className="flex items-center gap-2 p-1.5 rounded-lg cursor-pointer hover:bg-white/5 transition-all">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{background:st.c}}/>
                        <span className="text-xs text-slate-300 truncate flex-1">{p.name}</span>
                        <span className="text-[9px] font-bold" style={{color:st.c}}>{Math.round(p.health)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SVG Map */}
        <div className="flex-1 overflow-auto relative">
          <svg
            viewBox={`0 0 910 ${svgH}`}
            className="w-full h-full"
            style={{minHeight:380}}
            preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="lv-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <rect width="28" height="28" fill="#091408"/>
                <line x1="0" y1="14" x2="28" y2="14" stroke="#122018" strokeWidth="0.6"/>
                <line x1="14" y1="0" x2="14" y2="28" stroke="#122018" strokeWidth="0.6"/>
              </pattern>
              {plotData.map(p=>{
                const nc = ndvi(p.health,p.moisture);
                return (
                  <radialGradient key={p.id} id={`lv-g-${p.id}`} cx="50%" cy="50%" r="65%">
                    <stop offset="0%" stopColor={nc} stopOpacity={selId===p.id?0.68:0.44}/>
                    <stop offset="100%" stopColor={nc} stopOpacity={selId===p.id?0.3:0.16}/>
                  </radialGradient>
                );
              })}
            </defs>

            <rect width="910" height={svgH} fill="url(#lv-grid)"/>
            {/* Dirt paths */}
            <rect x="322" y="0" width="18" height={svgH} fill="#1f1008" opacity="0.95"/>
            <rect x="0" y="228" width="910" height="16" fill="#1f1008" opacity="0.95"/>
            {plots.length>6 && <rect x="0" y="438" width="910" height="14" fill="#1f1008" opacity="0.9"/>}
            {/* Irrigation channels */}
            <path d="M888,0 Q870,80 884,228 Q898,320 874,450"
              stroke="#3B82F6" strokeWidth="5" fill="none" opacity="0.3" strokeLinecap="round"/>
            <path d="M0,105 Q140,100 322,105"
              stroke="#3B82F6" strokeWidth="3" fill="none" opacity="0.2" strokeLinecap="round"/>
            {/* Tree clusters */}
            {[{cx:44,cy:24},{cx:66,cy:42},{cx:34,cy:56},{cx:78,cy:18},{cx:54,cy:68}].map((t,i)=>(
              <g key={i}>
                <circle cx={t.cx} cy={t.cy} r={13} fill="#1a5c1a" opacity={0.85}/>
                <circle cx={t.cx} cy={t.cy} r={9}  fill="#22882a" opacity={0.7}/>
                <circle cx={t.cx} cy={t.cy} r={5}  fill="#4ade80" opacity={0.4}/>
              </g>
            ))}

            {/* Plot polygons */}
            {plotData.map((p,i)=>{
              if(!p.poly) return null;
              const isSel   = selId===p.id;
              const isPulse = pulse===p.id;
              const nc = ndvi(p.health, p.moisture);
              const st = statusOf(p.health, p.moisture);
              return (
                <g key={p.id} onClick={()=>openCarousel(p.id,i)} style={{cursor:"pointer"}}>
                  <clipPath id={`lv-c-${p.id}`}><polygon points={p.poly.pts}/></clipPath>
                  <g clipPath={`url(#lv-c-${p.id})`}>
                    {viewMode==="satellite" && Array.from({length:30},(_,r)=>(
                      <line key={r} x1={0} y1={r*16} x2={910} y2={r*16}
                        stroke={nc} strokeWidth="2" strokeOpacity="0.12"/>
                    ))}
                    {viewMode==="terrain" && Array.from({length:22},(_,r)=>(
                      <path key={r} d={`M0,${r*22} Q455,${r*22+(Math.sin(r)*10)} 910,${r*22}`}
                        stroke={nc} strokeWidth="1.5" fill="none" strokeOpacity="0.18"/>
                    ))}
                    {viewMode==="ndvi" && (
                      <rect width="910" height={svgH} fill={nc} opacity="0.32"/>
                    )}
                  </g>
                  <polygon points={p.poly.pts}
                    fill={`url(#lv-g-${p.id})`}
                    stroke={isSel?st.c:`${nc}90`}
                    strokeWidth={isSel?3.5:1.5}
                    style={{
                      filter:isSel?`drop-shadow(0 0 14px ${nc})`:isPulse?`drop-shadow(0 0 8px ${nc})`:"none",
                      transition:"all 0.4s ease",
                    }}/>
                  {isPulse && (
                    <polygon points={p.poly.pts} fill="none" stroke={nc} strokeWidth="2.5" opacity="0.65">
                      <animate attributeName="stroke-width" values="2;8;2" dur="2.2s" repeatCount="2"/>
                      <animate attributeName="opacity" values="0.65;0;0.65" dur="2.2s" repeatCount="2"/>
                    </polygon>
                  )}
                  {/* Label card */}
                  <rect x={p.poly.cx-62} y={p.poly.cy-24} width={124} height={48} rx={9}
                    fill="rgba(0,0,0,0.82)" stroke={isSel?st.c:"rgba(255,255,255,0.06)"} strokeWidth={isSel?1.8:0.6}/>
                  <text x={p.poly.cx} y={p.poly.cy-6} textAnchor="middle" fill="#fff" fontSize="12" fontWeight="800" fontFamily="system-ui">{p.name}</text>
                  <text x={p.poly.cx} y={p.poly.cy+8} textAnchor="middle" fill={nc} fontSize="9.5" fontFamily="system-ui">
                    {p.crop} · {Math.round(p.moisture)}%💧 {Math.round(p.health)}%❤
                  </text>
                  {isPulse && (
                    <>
                      <rect x={p.poly.cx-20} y={p.poly.cy+14} width={40} height={13} rx={5} fill={nc} opacity={0.95}/>
                      <text x={p.poly.cx} y={p.poly.cy+23} textAnchor="middle" fill="#000" fontSize="7.5" fontWeight="800" fontFamily="system-ui">● LIVE</text>
                    </>
                  )}
                  <circle cx={p.poly.cx+56} cy={p.poly.cy-16} r={5.5} fill={st.c} opacity={0.9}/>
                  {isSel && <circle cx={p.poly.cx+56} cy={p.poly.cy-16} r={9} fill="none" stroke={st.c} strokeWidth={1.5} opacity={0.55}>
                    <animate attributeName="r" values="5;11;5" dur="1.6s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.55;0;0.55" dur="1.6s" repeatCount="indefinite"/>
                  </circle>}
                </g>
              );
            })}

            {/* NDVI Legend */}
            {[{c:"#16A34A",l:"Excellent"},{c:"#22C55E",l:"Good"},{c:"#EAB308",l:"Stressed"},{c:"#EF4444",l:"Critical"}].map((x,i)=>(
              <g key={x.l}>
                <circle cx={14+i*92} cy={svgH-10} r={5} fill={x.c}/>
                <text x={22+i*92} y={svgH-6} fill={x.c} fontSize="9" fontFamily="system-ui" fontWeight="600">{x.l}</text>
              </g>
            ))}
          </svg>

          {/* Hint overlay */}
          <AnimatePresence>
            {!showPanel && (
              <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold pointer-events-none"
                style={{background:"rgba(0,0,0,0.72)",backdropFilter:"blur(10px)",border:"1px solid rgba(16,185,129,0.3)",color:"#A7F3D0"}}>
                👆 Tap any plot to open detailed view
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM CAROUSEL PANEL ── */}
      <AnimatePresence>
        {showPanel && selPlot && (
          <motion.div
            initial={{y:"100%"}} animate={{y:0}} exit={{y:"100%"}}
            transition={{type:"spring",damping:30,stiffness:260}}
            className="flex-shrink-0 z-30"
            style={{
              background:"rgba(5,12,8,0.97)",
              backdropFilter:"blur(24px)",
              borderTop:"2px solid rgba(16,185,129,0.3)",
              maxHeight:"52vh",
              overflowY:"auto",
            }}>

            {/* Panel header */}
            <div className="flex items-center justify-between px-5 py-3 border-b sticky top-0 z-10"
              style={{background:"rgba(5,12,8,0.98)",borderColor:"rgba(16,185,129,0.15)"}}>
              <div className="flex items-center gap-3 min-w-0">
                <button onClick={prevPlot} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all flex-shrink-0">
                  <ChevronLeft className="w-4 h-4"/>
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-white text-base truncate">{selPlot.name}</h2>
                    {(()=>{const st=statusOf(selPlot.health,selPlot.moisture);return(
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{background:st.bg,color:st.c,border:`1px solid ${st.c}40`}}>{st.label}</span>
                    );})()}
                    {liveFlash===selPlot.id && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 animate-pulse flex-shrink-0">● LIVE UPDATE</span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs truncate">{selPlot.crop} · {selPlot.phase} · {selPlot.size}ac ({(selPlot.size*100).toFixed(0)} cents) · {selPlot.area}</p>
                </div>
                <button onClick={nextPlot} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all flex-shrink-0">
                  <ChevronRight className="w-4 h-4"/>
                </button>
                {/* Mini dot nav */}
                <div className="hidden sm:flex items-center gap-1 ml-1">
                  {plotData.map((_,i)=>(
                    <button key={i} onClick={()=>{setCarIdx(i);setSelId(plotData[i].id);}}
                      className="rounded-full transition-all"
                      style={{
                        width:i===carIdx?"20px":"8px",height:"8px",
                        background:i===carIdx?"#10B981":"rgba(255,255,255,0.2)",
                        borderRadius:"9999px",
                      }}/>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={()=>setEditMode(!editMode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={editMode?{background:"linear-gradient(135deg,#059669,#10B981)",color:"#fff"}:{color:"#64748B",border:"1px solid rgba(255,255,255,0.1)"}}>
                  <Activity className="w-3.5 h-3.5"/> {editMode?"Editing…":"Edit"}
                </button>
                <button onClick={()=>exportCSV(selPlot)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-green-300 hover:bg-white/10 transition-all border"
                  style={{borderColor:"rgba(255,255,255,0.1)"}}>
                  <Download className="w-3.5 h-3.5"/> CSV
                </button>
                <button onClick={()=>irrigate(selPlot.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{background:"linear-gradient(135deg,#0369A1,#0EA5E9)"}}>
                  <Droplets className="w-3.5 h-3.5"/> Irrigate
                </button>
                <button onClick={()=>{setShowPanel(false);setSelId(null);setEditMode(false);}}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                  <X className="w-4 h-4"/>
                </button>
              </div>
            </div>

            {/* Panel content */}
            <div className="px-5 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Left: metrics or edit sliders */}
                <div className="lg:col-span-2">
                  {editMode ? (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">✏️ Adjust Metrics</h3>
                      {[
                        {k:"moisture",label:"Moisture %", min:10,max:95,step:1,    col:"#38BDF8"},
                        {k:"health",  label:"Health %",   min:20,max:99,step:1,    col:"#10B981"},
                        {k:"ph",      label:"Soil pH",    min:5.0,max:8.5,step:0.1,col:"#A78BFA"},
                      ].map(s=>{
                        const cur = editVals[s.k] ?? (s.k==="ph"?selPlot.ph:s.k==="moisture"?selPlot.moisture:selPlot.health);
                        return (
                          <div key={s.k}>
                            <div className="flex justify-between mb-1.5">
                              <label className="text-xs font-semibold text-slate-300">{s.label}</label>
                              <span className="text-xs font-bold" style={{color:s.col}}>
                                {(cur as number).toFixed(s.step<1?1:0)}{s.k!=="ph"?"%":""}
                              </span>
                            </div>
                            <input type="range" min={s.min} max={s.max} step={s.step}
                              value={cur as number}
                              onChange={e=>setEditVals(p=>({...p,[s.k]:+e.target.value}))}
                              className="w-full h-2 rounded-full cursor-pointer appearance-none"
                              style={{background:`linear-gradient(to right,${s.col} ${(((cur as number)-s.min)/(s.max-s.min))*100}%,rgba(255,255,255,0.1) 0%)`}}/>
                          </div>
                        );
                      })}
                      <div className="flex gap-2 pt-1">
                        <button onClick={applyEdit}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
                          style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                          <Zap className="w-3.5 h-3.5"/> Apply & Sync
                        </button>
                        <button onClick={()=>{setEditMode(false);setEditVals({});}}
                          className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/10 transition-all">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {/* Metrics grid — 4 primary */}
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {[
                          {Icon:Droplets,    l:"Moisture",  v:`${Math.round(selPlot.moisture)}%`,  c:getMoistureColor(selPlot.moisture)},
                          {Icon:Activity,    l:"Health",    v:`${Math.round(selPlot.health)}%`,    c:getHealthColor(selPlot.health)},
                          {Icon:Thermometer, l:"Temp",      v:`${selPlot.temp.toFixed(1)}°C`,      c:"#F59E0B"},
                          {Icon:Wind,        l:"Soil pH",   v:selPlot.ph.toFixed(1),               c:"#A78BFA"},
                        ].map(s=>(
                          <div key={s.l} className="rounded-xl p-2.5 text-center flex flex-col items-center gap-1.5"
                            style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)"}}>
                            <s.Icon className="w-3.5 h-3.5" style={{color:s.c}}/>
                            <div className="text-[10px] text-slate-500">{s.l}</div>
                            <div className="text-sm font-bold" style={{color:s.c}}>{s.v}</div>
                          </div>
                        ))}
                      </div>
                      {/* NPK + pest grid */}
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          {Icon:Leaf,     l:"Nitrogen",  v:`${selPlot.npk.n}`,                        c:"#60A5FA"},
                          {Icon:Sun,      l:"Phosphorus",v:`${selPlot.npk.p}`,                        c:"#EC4899"},
                          {Icon:Zap,      l:"Potassium", v:`${selPlot.npk.k}`,                        c:"#FCD34D"},
                          {Icon:Activity, l:"Pest Risk", v:selPlot.pestRisk.toUpperCase(),            c:selPlot.pestRisk==="high"?"#F43F5E":selPlot.pestRisk==="medium"?"#F59E0B":"#10B981"},
                        ].map(s=>(
                          <div key={s.l} className="rounded-xl p-2.5 text-center flex flex-col items-center gap-1.5"
                            style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                            <s.Icon className="w-3.5 h-3.5" style={{color:s.c}}/>
                            <div className="text-[10px] text-slate-500">{s.l}</div>
                            <div className="text-xs font-bold capitalize" style={{color:s.c}}>{s.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: health trend chart */}
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Health Trend — 7 Days</p>
                  <ResponsiveContainer width="100%" height={120}>
                    <LineChart data={weekHistory(selPlot.health)}>
                      <XAxis dataKey="d" tick={{fill:"#475569",fontSize:9}} axisLine={false} tickLine={false}/>
                      <YAxis domain={[0,100]} hide/>
                      <Tooltip contentStyle={{background:"#0a1a0e",border:"1px solid #10B981",borderRadius:"8px",color:"#A7F3D0",fontSize:"11px"}}
                        formatter={(v:any)=>[`${v}%`,"Health"]}/>
                      <Line type="monotone" dataKey="v" stroke="#10B981" strokeWidth={2.5}
                        dot={{fill:"#10B981",r:3}} name="Health %"/>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bottom carousel — all plots mini cards */}
              <div ref={carRef} className="flex gap-2 mt-4 overflow-x-auto pb-2"
                style={{scrollbarWidth:"none"}}>
                {plotData.map((p,i)=>{
                  const nc = ndvi(p.health, p.moisture);
                  const isAct = i===carIdx;
                  return (
                    <button key={p.id} onClick={()=>{setCarIdx(i);setSelId(p.id);}}
                      className="flex-shrink-0 rounded-xl p-2.5 text-left transition-all"
                      style={{
                        minWidth:"130px",
                        background:isAct?"rgba(16,185,129,0.15)":"rgba(255,255,255,0.03)",
                        border:isAct?"1.5px solid #10B981":"1px solid rgba(255,255,255,0.07)",
                        transform:isAct?"translateY(-4px)":"none",
                        boxShadow:isAct?`0 8px 24px rgba(16,185,129,0.28)`:"none",
                      }}>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:nc}}/>
                        <span className="text-white text-[11px] font-bold truncate">{p.name}</span>
                        {liveFlash===p.id && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0"/>}
                      </div>
                      <div className="text-slate-500 text-[9px] mb-1.5 truncate">{p.crop}</div>
                      <div className="h-1 rounded-full overflow-hidden mb-1" style={{background:"rgba(255,255,255,0.08)"}}>
                        <div className="h-full rounded-full transition-all" style={{width:`${p.moisture}%`,background:getMoistureColor(p.moisture)}}/>
                      </div>
                      <div className="flex justify-between text-[9px]">
                        <span style={{color:getMoistureColor(p.moisture)}}>{Math.round(p.moisture)}%💧</span>
                        <span style={{color:getHealthColor(p.health)}}>{Math.round(p.health)}%❤</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
