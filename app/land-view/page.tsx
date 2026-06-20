"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { getHealthColor, getMoistureColor, getMoistureLabel, FORECAST } from "@/lib/utils";
import {
  ChevronLeft, ChevronRight, X, Droplets, RefreshCw,
  Download, Zap, ArrowLeft, Activity, Edit3, BarChart2,
  Thermometer, Wind, Sun, Leaf, Layers, Trash2, Info,
  Map as MapIcon, Eye, ToggleLeft, ToggleRight, Sparkles, Save
} from "lucide-react";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

/* ─── Polygon shapes for the 6 base plots (A–F) ─── */
const POLYS: Record<string,{pts:string; cx:number; cy:number}> = {
  A:  { pts:"28,18 308,12 320,210 146,222 30,218",       cx:170, cy:116 },
  B:  { pts:"340,12 612,16 620,220 343,212 328,110",     cx:472, cy:116 },
  C:  { pts:"635,12 878,22 866,222 630,226",              cx:750, cy:120 },
  D:  { pts:"30,238 267,232 276,416 34,426",              cx:150, cy:328 },
  E:  { pts:"286,232 636,238 632,422 280,426",            cx:458, cy:330 },
  F:  { pts:"646,238 878,232 888,430 642,426",            cx:762, cy:334 },
};

/* ─── Dynamic grid for any plot beyond A–F (newly added plots) ─── */
const GRID_COLS = 3, GRID_CELL_W = 290, GRID_CELL_H = 130, GRID_GAP = 14, GRID_START_Y = 448, GRID_START_X = 10;
function gridPoly(index:number){
  const row = Math.floor(index/GRID_COLS);
  const col = index%GRID_COLS;
  const x = GRID_START_X + col*(GRID_CELL_W+10);
  const y = GRID_START_Y + row*(GRID_CELL_H+GRID_GAP);
  const w = GRID_CELL_W, h = GRID_CELL_H;
  const pts = `${x+4},${y+6} ${x+w-6},${y} ${x+w},${y+h-6} ${x+6},${y+h}`;
  return { pts, cx:x+w/2, cy:y+h/2, row };
}

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

/* Small reusable edit row: label + number input + slider */
function EditSlider({label,value,min,max,step=1,unit="",color,onChange}:{
  label:string; value:number; min:number; max:number; step?:number; unit?:string; color:string; onChange:(v:number)=>void;
}){
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-semibold text-slate-300">{label}</label>
        <div className="flex items-center gap-1.5">
          <input type="number" value={value} min={min} max={max} step={step}
            onChange={e=>onChange(Math.max(min,Math.min(max,+e.target.value)))}
            className="w-16 text-right text-xs font-bold rounded-lg px-1.5 py-0.5"
            style={{background:"rgba(255,255,255,0.06)",border:`1px solid ${color}40`,color}}/>
          <span className="text-[10px] text-slate-500 w-6">{unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e=>onChange(+e.target.value)}
        className="w-full h-2 rounded-full cursor-pointer appearance-none"
        style={{background:`linear-gradient(to right,${color} ${((value-min)/(max-min))*100}%,rgba(255,255,255,0.1) 0%)`}}/>
    </div>
  );
}

/* Small reusable edit row: label + text input */
function EditText({label,value,placeholder,onChange}:{label:string;value:string;placeholder?:string;onChange:(v:string)=>void;}){
  return (
    <div>
      <label className="label-xs text-slate-400">{label}</label>
      <input value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)}
        style={{background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",color:"#fff"}}/>
    </div>
  );
}

export default function LandView(){
  const { plots, updateSensor, setField, toggleAutoIrr, irrigate, deletePlot, pushNotif } = useStore();
  const [selId, setSelId]         = useState<string|null>(null);
  const [tab, setTab]             = useState<"overview"|"edit"|"trends">("overview");
  const [liveFlash, setLiveFlash] = useState<string|null>(null);
  const [viewMode, setViewMode]   = useState<"satellite"|"terrain"|"ndvi">("satellite");
  const [pulse, setPulse]         = useState<string|null>(null);
  const [showRadar, setShowRadar] = useState(false);
  const [showHint, setShowHint]   = useState(true);
  const [savedFlash, setSavedFlash] = useState(false);
  const [justSaved, setJustSaved]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [syncFlash, setSyncFlash]   = useState(false);

  /* ── Cross-tab sync ──
     When a plot is added / edited in the Land page (another tab), the browser
     fires a "storage" event. We call useStore.persist.rehydrate() to pull the
     latest state from localStorage into this tab instantly. */
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "agrowave-v3") {
        (useStore as any).persist?.rehydrate?.();
        setSyncFlash(true);
        setTimeout(() => setSyncFlash(false), 2000);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const rainDay = FORECAST[0].rain > 30;

  /* Map every plot to a polygon — base 6 shapes for A–F, dynamic grid for anything new */
  const extraIds = plots.filter(p=>!POLYS[p.id]).map(p=>p.id);
  const plotData = plots.map(p=>{
    const poly = POLYS[p.id] ?? gridPoly(extraIds.indexOf(p.id));
    return { ...p, poly };
  });
  const extraRows = extraIds.length ? Math.ceil(extraIds.length/GRID_COLS) : 0;
  const svgH = extraRows>0 ? (GRID_START_Y + (extraRows-1)*(GRID_CELL_H+GRID_GAP) + GRID_CELL_H + 44) : 450;

  /* Real-time simulation — updates global store every 8s (skips plot being edited) */
  useEffect(()=>{
    const iv = setInterval(()=>{
      if(plots.length===0) return;
      const pool = (selId && tab==="edit") ? plots.filter(p=>p.id!==selId) : plots;
      if(pool.length===0) return;
      const target = pool[Math.floor(Math.random()*pool.length)];
      const nm = Math.max(10, Math.min(95, target.moisture+(Math.random()-.5)*4));
      const nh = Math.max(30, Math.min(98, target.health  +(Math.random()-.5)*2));
      const nt = Math.max(24, Math.min(43, target.temp    +(Math.random()-.5)*1));
      updateSensor(target.id, nm, nh, nt);
      setPulse(target.id);
      setLiveFlash(target.id);
      setTimeout(()=>{ setPulse(null); setLiveFlash(null); },2500);
    },8000);
    return()=>clearInterval(iv);
  },[plots, selId, tab]);

  const selPlot = selId ? plotData.find(p=>p.id===selId) ?? null : null;
  const selIdx  = selPlot ? plotData.findIndex(p=>p.id===selPlot.id) : -1;

  const openPanel = (id:string)=>{ setSelId(id); setTab("overview"); setConfirmDel(false); };
  const closePanel = ()=>{ setSelId(null); setConfirmDel(false); };
  const prevPlot = ()=>{ if(!plotData.length) return; const ni=(selIdx-1+plotData.length)%plotData.length; setSelId(plotData[ni].id); setConfirmDel(false); };
  const nextPlot = ()=>{ if(!plotData.length) return; const ni=(selIdx+1)%plotData.length; setSelId(plotData[ni].id); setConfirmDel(false); };

  const flashSaved = ()=>{ setSavedFlash(true); setTimeout(()=>setSavedFlash(false), 900); };
  const set1 = (field:string, value:any)=>{ if(!selPlot) return; setField(selPlot.id, field, value); flashSaved(); };
  const setSensor = (field:"moisture"|"health"|"temp", value:number)=>{
    if(!selPlot) return;
    const m = field==="moisture"?value:selPlot.moisture;
    const h = field==="health"?value:selPlot.health;
    const t = field==="temp"?value:selPlot.temp;
    updateSensor(selPlot.id, m, h, t);
    flashSaved();
  };
  const setNPK = (key:"n"|"p"|"k", value:number)=>{
    if(!selPlot) return;
    setField(selPlot.id, "npk", {...selPlot.npk, [key]:Math.max(0,value)});
    flashSaved();
  };
  const setSizeAcres = (value:number)=>{ if(!selPlot) return; set1("size", Math.round(Math.max(0.1, value)*100)/100); };

  const handleDelete = ()=>{
    if(!selPlot) return;
    if(!confirmDel){ setConfirmDel(true); setTimeout(()=>setConfirmDel(false),3500); return; }
    const name = selPlot.name, idx = selIdx;
    deletePlot(selPlot.id);
    pushNotif({title:"🗑️ Plot Removed", body:`${name} removed from the farm map, dashboard and all views.`, type:"warning", time:"just now"});
    setConfirmDel(false);
    const remaining = plotData.filter(p=>p.id!==selPlot.id);
    setSelId(remaining.length ? remaining[Math.min(idx, remaining.length-1)].id : null);
  };

  const saveAllChanges = ()=>{
    if(!selPlot) return;
    setJustSaved(true);
    pushNotif({
      title:`💾 ${selPlot.name} Saved`,
      body:`All edits — size ${selPlot.size}ac (${(selPlot.size*100).toFixed(0)}¢), moisture ${Math.round(selPlot.moisture)}%, health ${Math.round(selPlot.health)}%, NPK ${selPlot.npk.n}/${selPlot.npk.p}/${selPlot.npk.k} — synced to Land, Dashboard and Field Monitor.`,
      type:"success", time:"just now",
    });
    setTimeout(()=>setJustSaved(false), 2200);
  };

  const exportCSV = (p:typeof plotData[0])=>{
    const rows = [
      ["Metric","Value"],
      ["Name",p.name],["Crop",p.crop],["Phase",p.phase],["Area/Block",p.area],
      ["Size (acres)",p.size],["Size (cents)",(p.size*100).toFixed(0)],
      ["Moisture %",Math.round(p.moisture)],["Health %",Math.round(p.health)],
      ["Temp °C",p.temp.toFixed(1)],["pH",p.ph.toFixed(1)],
      ["Nitrogen",p.npk.n],["Phosphorus",p.npk.p],["Potassium",p.npk.k],
      ["Pest Risk",p.pestRisk],["Auto-Irrigation",p.autoIrr?"ON":"OFF"],["Last Watered",p.lastWatered],
    ].map(r=>r.join(",")).join("\n");
    const a=document.createElement("a");
    a.href=URL.createObjectURL(new Blob([rows],{type:"text/csv"}));
    a.download=`${p.name.replace(/\s+/g,"-")}.csv`; a.click();
  };

  return (
    <div className="relative min-h-screen flex flex-col"
      style={{background:"linear-gradient(180deg,#0a1a0e,#081208)"}}>

      {/* Rain overlay */}
      {rainDay && <RainCanvas/>}

      {/* ── TOP BAR (sticky at very top — no global nav on this page) ── */}
      <div className="sticky top-0 flex items-center justify-between gap-2 px-4 py-2.5 flex-shrink-0 z-30 flex-wrap"
        style={{background:"rgba(5,15,8,0.97)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(16,185,129,0.2)"}}>
        {/* LEFT — brand + back links */}
        <div className="flex items-center gap-2">
          {/* Mini AgroWave logo */}
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
            <span className="text-white text-sm font-black">🌾</span>
          </div>
          <div className="mr-1">
            <h1 className="text-sm font-extrabold text-white leading-none tracking-tight flex items-center gap-1.5">
              Land Intelligence View
              <span className="dot-live flex-shrink-0" style={{display:"inline-block"}}/>
            </h1>
            <p className="text-[10px] text-green-400 mt-0.5">{plotData.length} plots · Kharif 2026{extraIds.length>0?` · +${extraIds.length} custom`:""}</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 ml-1">
            <Link href="/dashboard"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              style={{border:"1px solid rgba(255,255,255,0.1)"}}>
              🏠 Dashboard
            </Link>
            <Link href="/land"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-green-300 hover:bg-green-500/10 transition-all"
              style={{border:"1px solid rgba(16,185,129,0.25)"}}>
              <ArrowLeft className="w-3 h-3"/> Land Map
            </Link>
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

          {/* Cross-tab sync indicator */}
          <AnimatePresence>
            {syncFlash && (
              <motion.span initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-500/20 text-green-300 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin"/> Synced
              </motion.span>
            )}
          </AnimatePresence>

          {/* Manual sync — pulls latest state from localStorage (useful if auto didn't fire) */}
          <button onClick={()=>{ (useStore as any).persist?.rehydrate?.(); setSyncFlash(true); setTimeout(()=>setSyncFlash(false),2000); }}
            title="Sync latest plots from other tabs"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-slate-400 hover:text-green-300 hover:bg-white/10"
            style={{border:"1px solid rgba(255,255,255,0.1)"}}>
            <RefreshCw className="w-3.5 h-3.5"/> Sync
          </button>

          <button onClick={()=>setShowHint(!showHint)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={showHint?{background:"rgba(16,185,129,0.2)",color:"#A7F3D0",border:"1px solid rgba(16,185,129,0.3)"}:{color:"#64748B",border:"1px solid rgba(255,255,255,0.1)"}}>
            <Info className="w-3.5 h-3.5"/> Guide
          </button>
          <button onClick={()=>setShowRadar(!showRadar)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={showRadar?{background:"rgba(16,185,129,0.2)",color:"#A7F3D0",border:"1px solid rgba(16,185,129,0.3)"}:{color:"#64748B",border:"1px solid rgba(255,255,255,0.1)"}}>
            <Eye className="w-3.5 h-3.5"/> Radar
          </button>
        </div>
      </div>

      {/* Guide / tips banner */}
      <AnimatePresence>
        {showHint && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
            className="flex-shrink-0 overflow-hidden z-10"
            style={{background:"rgba(16,185,129,0.08)",borderBottom:"1px solid rgba(16,185,129,0.18)"}}>
            <div className="flex items-start gap-2 px-4 py-2 text-[11px] text-green-200 flex-wrap">
              <Sparkles className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5"/>
              <span>
                <strong className="text-green-300">Tap any plot</strong> to open its live panel on the right.{" "}
                Use the <strong className="text-green-300">Edit All</strong> tab to type or drag-edit every value — changes sync instantly across Land, Dashboard and Field Monitor.{" "}
                Plots added in <strong className="text-green-300">My Fields</strong> appear automatically below — press <strong className="text-green-300">Sync</strong> in the top bar (or it auto-syncs) to see newly added plots here immediately.
              </span>
              <button onClick={()=>setShowHint(false)} className="ml-auto text-green-400 hover:text-green-200 flex-shrink-0"><X className="w-3.5 h-3.5"/></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN AREA ── */}
      <div className="flex flex-col lg:flex-row relative">

        <div className="flex flex-col sm:flex-row lg:flex-1 relative">
          {/* Left sidebar — radar */}
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
                  <div className="space-y-1.5 mt-2 max-h-[220px] overflow-y-auto panel-scroll-dark">
                    {plotData.map(p=>{
                      const st = statusOf(p.health,p.moisture);
                      return (
                        <div key={p.id} onClick={()=>openPanel(p.id)}
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
          <div className="flex-1 relative">
            <svg
              viewBox={`0 0 910 ${svgH}`}
              width="100%" height={svgH}
              style={{display:"block",minHeight:380}}
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
              {extraRows>0 && <rect x="0" y={GRID_START_Y-12} width="910" height="14" fill="#1f1008" opacity="0.9"/>}
              {extraRows>1 && Array.from({length:extraRows-1},(_,r)=>(
                <rect key={r} x="0" y={GRID_START_Y+(r+1)*(GRID_CELL_H+GRID_GAP)-12} width="910" height="12" fill="#1f1008" opacity="0.85"/>
              ))}
              {/* Irrigation channels */}
              <path d="M888,0 Q870,80 884,228 Q898,320 874,450"
                stroke="#3B82F6" strokeWidth="5" fill="none" opacity="0.3" strokeLinecap="round"/>
              <path d="M0,105 Q140,100 322,105"
                stroke="#3B82F6" strokeWidth="3" fill="none" opacity="0.2" strokeLinecap="round"/>
              {/* Tree clusters */}
              {[{cx:44,cy:24},{cx:66,cy:42},{cx:34,cy:56},{cx:78,cy:18},{cx:54,cy:68}].map((t,i)=>(
                <g key={i}>
                  <circle cx={t.cx} cy={t.cy} r={9} fill="#0d3318" opacity={0.9}/>
                  <circle cx={t.cx} cy={t.cy} r={6} fill="#155e2a" opacity={0.7}/>
                </g>
              ))}

              {/* Plot polygons */}
              {plotData.map((p,i)=>{
                const isSel   = selId===p.id;
                const isPulse = pulse===p.id;
                const isExtra = !POLYS[p.id];
                const nc = ndvi(p.health, p.moisture);
                const st = statusOf(p.health, p.moisture);
                /* Visual size scaling — editing "Size (acres)" visibly grows/shrinks the plot */
                const scale = Math.max(0.6, Math.min(1.32, p.size/4));
                const gTransform = `translate(${p.poly.cx} ${p.poly.cy}) scale(${scale}) translate(${-p.poly.cx} ${-p.poly.cy})`;
                return (
                  <g key={p.id} onClick={()=>openPanel(p.id)} style={{cursor:"pointer"}}>
                  <g transform={gTransform} style={{transition:"transform 0.5s ease"}}>
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
                      strokeDasharray={isExtra?"6 4":undefined}
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
                    {isExtra && (
                      <>
                        <rect x={p.poly.cx-30} y={p.poly.cy+14} width={60} height={13} rx={5} fill="rgba(16,185,129,0.9)"/>
                        <text x={p.poly.cx} y={p.poly.cy+23} textAnchor="middle" fill="#04150a" fontSize="7.5" fontWeight="800" fontFamily="system-ui">+ NEW PLOT</text>
                      </>
                    )}
                    {isPulse && !isExtra && (
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
              {extraRows>0 && (
                <g>
                  <rect x={368} y={svgH-16} width={11} height={11} rx={2} fill="none" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <text x={384} y={svgH-6} fill="#10B981" fontSize="9" fontFamily="system-ui" fontWeight="600">Newly added plot</text>
                </g>
              )}
            </svg>

            {/* Hint overlay */}
            <AnimatePresence>
              {!selPlot && (
                <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}
                  className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold pointer-events-none z-30"
                  style={{background:"rgba(0,0,0,0.72)",backdropFilter:"blur(10px)",border:"1px solid rgba(16,185,129,0.3)",color:"#A7F3D0"}}>
                  👆 Tap any plot to open the live edit panel
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT SIDE PANEL ── */}
        <AnimatePresence>
          {selPlot && (
            <motion.div
              key={selPlot.id}
              initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:40}}
              transition={{type:"spring",damping:30,stiffness:260}}
              className="flex flex-col w-full lg:w-[420px] flex-shrink-0 z-20 max-h-[70vh] lg:max-h-[calc(100vh-96px)] lg:sticky lg:top-[52px] lg:self-start border-t lg:border-t-0 lg:border-l rounded-b-2xl lg:rounded-none"
              style={{
                background:"rgba(5,12,8,0.97)",
                backdropFilter:"blur(24px)",
                borderColor:"rgba(16,185,129,0.18)",
              }}>

              {/* Quick switch — scrollable plot chips (always shows newly added plots) */}
              <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto flex-shrink-0 border-b panel-scroll-dark"
                style={{borderColor:"rgba(255,255,255,0.06)"}}>
                {plotData.map(p=>(
                  <button key={p.id} onClick={()=>openPanel(p.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex-shrink-0 transition-all whitespace-nowrap"
                    style={p.id===selPlot.id
                      ? {background:"linear-gradient(135deg,#059669,#10B981)",color:"#fff"}
                      : {background:"rgba(255,255,255,0.05)",color:"#94A3B8",border:"1px solid rgba(255,255,255,0.08)"}}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{background:ndvi(p.health,p.moisture)}}/>
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Header */}
              <div className="flex items-center justify-between gap-2 px-4 py-3 border-b flex-shrink-0"
                style={{borderColor:"rgba(255,255,255,0.08)"}}>
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <button onClick={prevPlot} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all flex-shrink-0">
                    <ChevronLeft className="w-4 h-4"/>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-white text-base truncate">{selPlot.name}</h2>
                      {(()=>{const st=statusOf(selPlot.health,selPlot.moisture);return(
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{background:st.bg,color:st.c,border:`1px solid ${st.c}40`}}>{st.label}</span>
                      );})()}
                      {liveFlash===selPlot.id && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 animate-pulse flex-shrink-0">● LIVE</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-[11px] truncate">{selPlot.crop} · {selPlot.phase} · {selPlot.size}ac ({(selPlot.size*100).toFixed(0)}¢) · {selPlot.area}</p>
                  </div>
                  <button onClick={nextPlot} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-all flex-shrink-0">
                    <ChevronRight className="w-4 h-4"/>
                  </button>
                </div>
                <button onClick={closePanel}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
                  <X className="w-4 h-4"/>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 px-3 py-2 flex-shrink-0 border-b flex-wrap"
                style={{borderColor:"rgba(255,255,255,0.06)"}}>
                {([
                  {id:"overview",l:"Overview",Icon:Activity},
                  {id:"edit",    l:"Edit All", Icon:Edit3},
                  {id:"trends",  l:"Trends",   Icon:BarChart2},
                ] as const).map(t=>(
                  <button key={t.id} onClick={()=>setTab(t.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                    style={tab===t.id?{background:"linear-gradient(135deg,#059669,#10B981)",color:"#fff"}:{color:"#64748B",border:"1px solid rgba(255,255,255,0.1)"}}>
                    <t.Icon className="w-3.5 h-3.5"/> {t.l}
                  </button>
                ))}
                <AnimatePresence>
                  {savedFlash && (
                    <motion.span initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} exit={{opacity:0}}
                      className="ml-auto flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                      <Save className="w-3 h-3"/> Synced
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 panel-scroll-dark">

                {/* ── OVERVIEW ── */}
                {tab==="overview" && (
                  <>
                    <div className="grid grid-cols-4 gap-2">
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

                    <div className="grid grid-cols-4 gap-2">
                      {[
                        {Icon:Leaf,     l:"Nitrogen",  v:`${selPlot.npk.n}`,             c:"#60A5FA"},
                        {Icon:Sun,      l:"Phosphorus",v:`${selPlot.npk.p}`,             c:"#EC4899"},
                        {Icon:Zap,      l:"Potassium", v:`${selPlot.npk.k}`,             c:"#FCD34D"},
                        {Icon:Activity, l:"Pest Risk", v:selPlot.pestRisk.toUpperCase(), c:selPlot.pestRisk==="high"?"#F43F5E":selPlot.pestRisk==="medium"?"#F59E0B":"#10B981"},
                      ].map(s=>(
                        <div key={s.l} className="rounded-xl p-2.5 text-center flex flex-col items-center gap-1.5"
                          style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)"}}>
                          <s.Icon className="w-3.5 h-3.5" style={{color:s.c}}/>
                          <div className="text-[10px] text-slate-500">{s.l}</div>
                          <div className="text-xs font-bold capitalize" style={{color:s.c}}>{s.v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Auto-irrigation status */}
                    <button onClick={()=>{toggleAutoIrr(selPlot.id); flashSaved();}}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={selPlot.autoIrr
                        ? {background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.35)",color:"#A7F3D0"}
                        : {background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.1)",color:"#94A3B8"}}>
                      <span className="flex items-center gap-2"><Droplets className="w-3.5 h-3.5"/> Auto-Irrigation</span>
                      <span className="flex items-center gap-1.5">
                        {selPlot.autoIrr?"ON":"OFF"}
                        {selPlot.autoIrr ? <ToggleRight className="w-5 h-5"/> : <ToggleLeft className="w-5 h-5"/>}
                      </span>
                    </button>

                    {/* Tips / recommendations */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Guide Tips for {selPlot.name}</p>
                      {[
                        { title:"Irrigation Status", body: selPlot.moisture>70?"Moisture optimal — skip next irrigation cycle to prevent root rot.":"Moisture low — irrigation recommended within 24 hours.", icon:"💧", bg:"rgba(16,185,129,0.08)", border:"rgba(16,185,129,0.25)" },
                        { title:"Pest Watch", body: selPlot.pestRisk==="high"?"HIGH ALERT: Immediate inspection needed. Apply chlorpyrifos 20% EC.":selPlot.pestRisk==="medium"?"Monitor closely — apply neem-based spray as preventive measure.":"Low risk detected. Continue standard monitoring schedule.", icon:"🦗", bg:selPlot.pestRisk==="high"?"rgba(244,63,94,0.08)":selPlot.pestRisk==="medium"?"rgba(245,158,11,0.08)":"rgba(16,185,129,0.08)", border:selPlot.pestRisk==="high"?"rgba(244,63,94,0.25)":selPlot.pestRisk==="medium"?"rgba(245,158,11,0.25)":"rgba(16,185,129,0.25)" },
                        { title:"Fertilizer Tip", body:`Current NPK: N${selPlot.npk.n}/P${selPlot.npk.p}/K${selPlot.npk.k} kg/ha. ${selPlot.npk.n<100?"Nitrogen deficient — apply urea 46% at 50kg/acre.":"NPK levels adequate for current growth stage."}`, icon:"🌱", bg:"rgba(59,130,246,0.08)", border:"rgba(59,130,246,0.25)" },
                        { title:"Soil Health", body:`pH ${selPlot.ph.toFixed(1)} — ${selPlot.ph<6?"Acidic: apply agricultural lime at 100kg/acre.":selPlot.ph>7.5?"Alkaline: add sulfur or gypsum to acidify.":"Optimal pH range. Maintain current soil management."}`, icon:"🧪", bg:"rgba(167,139,250,0.08)", border:"rgba(167,139,250,0.25)" },
                      ].map(r=>(
                        <div key={r.title} className="rounded-xl p-3" style={{background:r.bg,border:`1px solid ${r.border}`}}>
                          <p className="text-xs font-bold text-white mb-1">{r.icon} {r.title}</p>
                          <p className="text-[11px] text-slate-300 leading-relaxed">{r.body}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* ── EDIT ALL ── */}
                {tab==="edit" && (
                  <>
                    <div className="rounded-xl p-3 mb-1 text-[11px] text-green-200 flex items-start gap-2"
                      style={{background:"rgba(16,185,129,0.08)",border:"1px solid rgba(16,185,129,0.2)"}}>
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-green-400"/>
                      Every field below is live — type or drag to update, and it syncs instantly to Land, Dashboard and Field Monitor.
                    </div>

                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity</p>
                    <div className="grid grid-cols-2 gap-3">
                      <EditText label="PLOT NAME" value={selPlot.name} onChange={v=>set1("name",v)}/>
                      <EditText label="CROP" value={selPlot.crop} onChange={v=>set1("crop",v)}/>
                      <EditText label="GROWTH PHASE" value={selPlot.phase} onChange={v=>set1("phase",v)}/>
                      <EditText label="AREA / BLOCK" value={selPlot.area} onChange={v=>set1("area",v)}/>
                    </div>

                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-1">Size</p>
                    <div>
                      <label className="label-xs text-slate-400">SIZE (ACRES) — <span className="text-green-400">{(selPlot.size*100).toFixed(0)} cents</span></label>
                      <input type="number" min={0.1} step={0.1} value={selPlot.size}
                        onChange={e=>setSizeAcres(+e.target.value)}
                        style={{background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",color:"#fff"}}/>
                    </div>

                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-1">Live Sensors</p>
                    <div className="space-y-3">
                      <EditSlider label="Moisture %" value={Math.round(selPlot.moisture)} min={5} max={95} unit="%" color="#38BDF8" onChange={v=>setSensor("moisture",v)}/>
                      <EditSlider label="Health %"   value={Math.round(selPlot.health)}   min={10} max={99} unit="%" color="#10B981" onChange={v=>setSensor("health",v)}/>
                      <EditSlider label="Temperature" value={Number(selPlot.temp.toFixed(1))} min={15} max={48} step={0.1} unit="°C" color="#F59E0B" onChange={v=>setSensor("temp",Math.round(v*10)/10)}/>
                      <EditSlider label="Soil pH" value={Number(selPlot.ph.toFixed(1))} min={4} max={9} step={0.1} unit="" color="#A78BFA" onChange={v=>set1("ph",Math.round(v*10)/10)}/>
                    </div>

                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-1">NPK (kg/ha)</p>
                    <div className="grid grid-cols-3 gap-2">
                      <EditSlider label="Nitrogen" value={selPlot.npk.n} min={0} max={300} unit="" color="#60A5FA" onChange={v=>setNPK("n",v)}/>
                      <EditSlider label="Phosphorus" value={selPlot.npk.p} min={0} max={150} unit="" color="#EC4899" onChange={v=>setNPK("p",v)}/>
                      <EditSlider label="Potassium" value={selPlot.npk.k} min={0} max={300} unit="" color="#FCD34D" onChange={v=>setNPK("k",v)}/>
                    </div>

                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-1">Risk & Automation</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label-xs text-slate-400">PEST RISK</label>
                        <select value={selPlot.pestRisk} onChange={e=>set1("pestRisk",e.target.value)}
                          style={{background:"rgba(30,41,59,0.9)",border:"1.5px solid rgba(255,255,255,0.12)",color:"#fff"}}>
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="label-xs text-slate-400">AUTO-IRRIGATION</label>
                        <button onClick={()=>{toggleAutoIrr(selPlot.id); flashSaved();}}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
                          style={selPlot.autoIrr
                            ? {background:"linear-gradient(135deg,#059669,#10B981)",color:"#fff"}
                            : {background:"rgba(255,255,255,0.06)",border:"1.5px solid rgba(255,255,255,0.12)",color:"#94A3B8"}}>
                          {selPlot.autoIrr ? <ToggleRight className="w-4 h-4"/> : <ToggleLeft className="w-4 h-4"/>}
                          {selPlot.autoIrr?"ON":"OFF"}
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 pt-1">
                      Moisture label: <span className="font-semibold" style={{color:getMoistureColor(selPlot.moisture)}}>{getMoistureLabel(selPlot.moisture)}</span> · Last watered: {selPlot.lastWatered}
                    </div>

                    <button onClick={saveAllChanges}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
                      style={justSaved
                        ? {background:"linear-gradient(135deg,#16A34A,#22C55E)",color:"#fff"}
                        : {background:"linear-gradient(135deg,#059669,#10B981)",color:"#fff",boxShadow:"0 4px 16px rgba(16,185,129,0.3)"}}>
                      {justSaved ? <><Save className="w-4 h-4"/> Saved & Synced Everywhere ✓</> : <><Save className="w-4 h-4"/> Save & Sync All Views</>}
                    </button>
                    <p className="text-[10px] text-slate-500 text-center -mt-1">
                      Edits already apply live as you type — this confirms the sync and updates Land, Dashboard &amp; Field Monitor instantly.
                    </p>
                  </>
                )}

                {/* ── TRENDS ── */}
                {tab==="trends" && (
                  <>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Health Trend — 7 Days</p>
                      <ResponsiveContainer width="100%" height={140}>
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
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Plot Profile</p>
                      <ResponsiveContainer width="100%" height={180}>
                        <RadarChart data={[
                          {s:"Moisture", v:Math.round(selPlot.moisture)},
                          {s:"Health",   v:Math.round(selPlot.health)},
                          {s:"Temp",     v:Math.round((selPlot.temp/45)*100)},
                          {s:"pH",       v:Math.round((selPlot.ph/14)*100)},
                          {s:"NPK",      v:Math.min(100,Math.round((selPlot.npk.n+selPlot.npk.p+selPlot.npk.k)/5))},
                        ]} outerRadius={65}>
                          <PolarGrid stroke="rgba(255,255,255,0.08)"/>
                          <PolarAngleAxis dataKey="s" tick={{fill:"#64748B",fontSize:9}}/>
                          <Radar dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.18} strokeWidth={2}/>
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </div>

              {/* Footer actions */}
              <div className="flex items-center gap-2 px-4 py-3 border-t flex-shrink-0 flex-wrap"
                style={{borderColor:"rgba(255,255,255,0.08)"}}>
                <button onClick={()=>irrigate(selPlot.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{background:"linear-gradient(135deg,#0369A1,#0EA5E9)"}}>
                  <Droplets className="w-3.5 h-3.5"/> Irrigate
                </button>
                <button onClick={()=>exportCSV(selPlot)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-green-300 hover:bg-white/10 transition-all border"
                  style={{borderColor:"rgba(255,255,255,0.1)"}}>
                  <Download className="w-3.5 h-3.5"/> CSV
                </button>
                <button onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ml-auto"
                  style={confirmDel
                    ? {background:"linear-gradient(135deg,#DC2626,#EF4444)",color:"#fff",boxShadow:"0 0 0 3px rgba(239,68,68,0.25)"}
                    : {background:"rgba(244,63,94,0.1)",color:"#FCA5A5",border:"1px solid rgba(244,63,94,0.3)"}}>
                  <Trash2 className="w-3.5 h-3.5"/> {confirmDel?"Confirm Remove?":"Remove Plot"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
