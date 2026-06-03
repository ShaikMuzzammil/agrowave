"use client";
// ─────────────────────────────────────────────────────────────────────────────
// Land View Page – AgroWave
// Real satellite-style land visualization with 6 plots, thresholds, print
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useCallback } from "react";
import { Settings2, Printer, Map, ChevronDown, ChevronUp, X, BarChart2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { FARM_PLOTS, FarmPlot, DEFAULT_THRESHOLDS, LandThresholds } from "@/lib/farmData";

// ── Plot status calculation ──────────────────────────────────────────────
function calcStatus(plot: FarmPlot, thresh: LandThresholds): "OPEN"|"WARNING"|"CLOSED" {
  const pestMap = { "low pest": 0, "medium pest": 1, "high pest": 2 };
  const issues: string[] = [];
  if (plot.health < thresh.minHealth) issues.push("health");
  if (plot.moisture < thresh.minMoisture) issues.push("moisture");
  if (pestMap[plot.pestLevel] > thresh.maxPestLevel) issues.push("pest");
  if (plot.soilPH < thresh.minPH || plot.soilPH > thresh.maxPH) issues.push("pH");
  if (issues.length === 0) return "OPEN";
  if (issues.length <= 1) return "WARNING";
  return "CLOSED";
}

// ── Real-Land SVG satellite view ─────────────────────────────────────────
function LandSVG({ plots, statuses, selected, onSelect }: {
  plots: FarmPlot[];
  statuses: Record<string,string>;
  selected: string|null;
  onSelect: (id:string)=>void;
}) {
  // 6 plot coordinates in the SVG (3×2 grid approximation)
  const positions = [
    { id:"north",  x:30,  y:20,  w:180, h:130, label:"North Field" },
    { id:"east",   x:225, y:20,  w:160, h:130, label:"East Block" },
    { id:"west",   x:400, y:20,  w:170, h:130, label:"West Block" },
    { id:"south",  x:30,  y:165, w:180, h:130, label:"South Field" },
    { id:"central",x:225, y:165, w:160, h:130, label:"Central Plot" },
    { id:"border", x:400, y:165, w:170, h:130, label:"Border Strip" },
  ];

  function getStatusColor(id: string) {
    const s = statuses[id];
    return s==="OPEN" ? "#22c55e" : s==="WARNING" ? "#f59e0b" : "#94a3b8";
  }
  function getPlotFill(id: string) {
    const s = statuses[id];
    return s==="OPEN" ? "rgba(34,197,94,0.18)" : s==="WARNING" ? "rgba(245,158,11,0.18)" : "rgba(148,163,184,0.15)";
  }
  function getCropRows(x:number,y:number,w:number,h:number,id:string) {
    const rows: React.ReactNode[] = [];
    const rowColor = statuses[id]==="OPEN" ? "#22c55e" : statuses[id]==="WARNING" ? "#d97706" : "#94a3b8";
    const spacing = 14;
    for (let ry = y+8; ry < y+h-8; ry += spacing) {
      rows.push(<line key={ry} x1={x+6} y1={ry} x2={x+w-6} y2={ry} stroke={rowColor} strokeWidth="1.5" opacity="0.35"/>);
    }
    return rows;
  }

  return (
    <svg viewBox="0 0 600 310" className="w-full h-full" style={{borderRadius:16}}>
      {/* Background terrain */}
      <rect x="0" y="0" width="600" height="310" fill="#1a3020" rx="16"/>
      {/* Subtle terrain texture */}
      <rect x="0" y="0" width="600" height="310" fill="url(#terrainGrad)" rx="16" opacity="0.6"/>
      <defs>
        <linearGradient id="terrainGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3"/>
          <stop offset="50%" stopColor="#15803d" stopOpacity="0.1"/>
          <stop offset="100%" stopColor="#14532d" stopOpacity="0.3"/>
        </linearGradient>
      </defs>

      {/* Dirt paths between plots */}
      <rect x="210" y="0" width="12" height="310" fill="#92400e" opacity="0.35" rx="2"/>
      <rect x="388" y="0" width="12" height="310" fill="#92400e" opacity="0.35" rx="2"/>
      <rect x="0" y="152" width="600" height="10" fill="#92400e" opacity="0.35" rx="2"/>

      {/* Water stream */}
      <path d="M 575 0 Q 565 80 570 155 Q 575 230 568 310" stroke="#3b82f6" strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round"/>

      {/* Tree clusters (top-right) */}
      {[[10,8],[18,14],[14,22],[25,10],[5,18]].map(([tx,ty],i)=>(
        <circle key={i} cx={580-tx*1.2} cy={ty*1.5} r={4+i%3} fill="#15803d" opacity="0.6"/>
      ))}

      {/* Plot rectangles */}
      {positions.map(pos=>{
        const plot = plots.find(p=>p.id===pos.id)!;
        const sc = getStatusColor(pos.id);
        const fill = getPlotFill(pos.id);
        const isSelected = selected===pos.id;
        return (
          <g key={pos.id} onClick={()=>onSelect(pos.id)} style={{cursor:"pointer"}}>
            {/* Plot base */}
            <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} fill={fill} rx="8"
              stroke={sc} strokeWidth={isSelected?3:1.5} opacity="0.95"/>
            {/* Crop rows */}
            {getCropRows(pos.x,pos.y,pos.w,pos.h,pos.id)}
            {/* Plot name */}
            <rect x={pos.x+6} y={pos.y+6} width={pos.w-12} height={24} rx="5" fill="rgba(0,0,0,0.55)"/>
            <text x={pos.x+pos.w/2} y={pos.y+22} textAnchor="middle" fill="white" fontSize="10" fontWeight="700">
              {pos.label}
            </text>
            {/* Completion label */}
            <text x={pos.x+pos.w/2} y={pos.y+pos.h-18} textAnchor="middle" fill={sc} fontSize="9" fontWeight="600">
              {plot.completionPercent.toFixed(4)}% · {statuses[pos.id]}
            </text>
            {/* Moisture indicator dot */}
            <circle cx={pos.x+pos.w-14} cy={pos.y+14} r={5}
              fill={plot.moisture<30?"#ef4444":plot.moisture<60?"#f59e0b":"#22c55e"} opacity="0.9"/>
            {/* Selected highlight */}
            {isSelected && <rect x={pos.x} y={pos.y} width={pos.w} height={pos.h} rx="8" fill="none"
              stroke="white" strokeWidth="2" opacity="0.5" strokeDasharray="6 3"/>}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(10, 285)">
        <circle cx="8" cy="8" r="5" fill="#22c55e"/>
        <text x="16" y="12" fill="white" fontSize="8" opacity="0.8">Open</text>
        <circle cx="55" cy="8" r="5" fill="#f59e0b"/>
        <text x="63" y="12" fill="white" fontSize="8" opacity="0.8">Warning</text>
        <circle cx="110" cy="8" r="5" fill="#94a3b8"/>
        <text x="118" y="12" fill="white" fontSize="8" opacity="0.8">Closed</text>
      </g>
    </svg>
  );
}

// ── 7-day health sparkline ──────────────────────────────────────────────
function Sparkline({ plotId }: { plotId: string }) {
  const data = Array.from({length:7},(_,i)=>({
    day:["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i],
    value: 60 + Math.round(Math.sin(i+plotId.length)*20 + Math.random()*10)
  }));
  return (
    <ResponsiveContainer width="100%" height={80}>
      <LineChart data={data}>
        <XAxis dataKey="day" tick={{fontSize:9,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
        <YAxis domain={[40,100]} hide />
        <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:"1px solid #e2e8f0",padding:"4px 8px"}}/>
        <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} dot={false} name="Health"/>
      </LineChart>
    </ResponsiveContainer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
export default function LandPage() {
  const [thresholds, setThresholds] = useState<LandThresholds>(DEFAULT_THRESHOLDS);
  const [showThresh, setShowThresh] = useState(false);
  const [selected, setSelected] = useState<string|null>(null);
  const [terrainOverlay, setTerrainOverlay] = useState(false);

  const statuses = Object.fromEntries(
    FARM_PLOTS.map(p=>[p.id, calcStatus(p, thresholds)])
  );
  const openCount = Object.values(statuses).filter(s=>s==="OPEN").length;
  const warnCount = Object.values(statuses).filter(s=>s==="WARNING").length;
  const closedCount = Object.values(statuses).filter(s=>s==="CLOSED").length;
  const selectedPlot = selected ? FARM_PLOTS.find(p=>p.id===selected) : null;

  function handlePrint() { window.print(); }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-5">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Map size={22} className="text-emerald-600"/> Land View
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">6 plots · KHARIF 2026 · Click any plot on map for details</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={()=>setShowThresh(!showThresh)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium border rounded-lg transition-all ${
              showThresh?"bg-emerald-600 text-white border-emerald-600":"bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}>
            <Settings2 size={14}/> Thresholds {showThresh?<ChevronUp size={13}/>:<ChevronDown size={13}/>}
          </button>
          <button onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all">
            <Printer size={14}/> Print Report
          </button>
        </div>
      </div>

      {/* ── Status summary ────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        <div className="terra-card text-center">
          <div className="text-3xl font-black text-emerald-600">{openCount}</div>
          <div className="text-sm font-semibold text-slate-700 mt-0.5">Open Plots</div>
          <div className="text-xs text-slate-400">All thresholds met</div>
        </div>
        <div className="terra-card text-center">
          <div className="text-3xl font-black text-amber-600">{warnCount}</div>
          <div className="text-sm font-semibold text-slate-700 mt-0.5">Warning</div>
          <div className="text-xs text-slate-400">1 metric borderline</div>
        </div>
        <div className="terra-card text-center">
          <div className="text-3xl font-black text-slate-500">{closedCount}</div>
          <div className="text-sm font-semibold text-slate-700 mt-0.5">Closed</div>
          <div className="text-xs text-slate-400">Intervention needed</div>
        </div>
      </div>

      {/* ── Threshold settings panel ───────────────────────────────────── */}
      {showThresh && (
        <div className="terra-card border-emerald-200 bg-emerald-50/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Settings2 size={16} className="text-emerald-600"/> Threshold Settings
            </h3>
            <p className="text-xs text-slate-400">Changes instantly recalculate plot status</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { key:"minHealth" as const, label:"Min Health Score", min:0, max:100, unit:"" },
              { key:"minMoisture" as const, label:"Min Moisture %", min:0, max:100, unit:"%" },
              { key:"maxPestLevel" as const, label:"Max Pest Level (0=Low,1=Med,2=High)", min:0, max:2, unit:"" },
              { key:"minPH" as const, label:"Min Soil pH", min:4.0, max:7.0, unit:"", step:0.1 },
              { key:"maxPH" as const, label:"Max Soil pH", min:7.0, max:9.0, unit:"", step:0.1 },
            ].map(({ key, label, min, max, unit, step=1 }) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-600">{label}</label>
                  <span className="text-sm font-black text-emerald-700">{thresholds[key]}{unit}</span>
                </div>
                <input type="range" min={min} max={max} step={step}
                  value={thresholds[key]}
                  onChange={e=>setThresholds({...thresholds,[key]:Number(e.target.value)})}
                  className="w-full h-2 rounded-full appearance-none bg-emerald-200 accent-emerald-600 cursor-pointer"/>
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>{min}</span><span>{max}</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={()=>setThresholds(DEFAULT_THRESHOLDS)}
            className="mt-4 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all">
            Reset to Defaults
          </button>
        </div>
      )}

      {/* ── Main content: plot list + satellite map ────────────────────── */}
      <div className="grid xl:grid-cols-[300px_1fr] gap-5">
        {/* Plot list */}
        <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          {FARM_PLOTS.map(plot=>{
            const status = statuses[plot.id];
            const statusColor = status==="OPEN"?"#22c55e":status==="WARNING"?"#f59e0b":"#94a3b8";
            const isSelected = selected===plot.id;
            return (
              <button key={plot.id} onClick={()=>setSelected(isSelected?null:plot.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected?"border-emerald-400 bg-emerald-50 shadow-sm":"border-slate-200 bg-white hover:border-emerald-200"
                }`}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{plot.name}</span>
                    <p className="text-xs text-slate-500">{plot.crop} · {plot.stage}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black" style={{color:statusColor}}>
                      {plot.completionPercent.toFixed(2)}%
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      status==="OPEN"?"badge-open":status==="WARNING"?"badge-warning":"badge-closed"
                    }`}>{status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>💧 {plot.moisture}%</span>
                  <span>🌡️ {Math.round(plot.temperature)}°C</span>
                  <span>❤️ {plot.health}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right panel: satellite map + selected plot detail */}
        <div className="space-y-4">
          {/* Real-Land SVG */}
          <div className="terra-card p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                🌍 Real-Land View <span className="text-xs font-normal text-slate-400">(Satellite / Terrain)</span>
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Terrain overlay</span>
                <button onClick={()=>setTerrainOverlay(!terrainOverlay)}
                  className={`relative w-10 h-5 rounded-full transition-all ${terrainOverlay?"bg-emerald-600":"bg-slate-200"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${terrainOverlay?"right-0.5":"left-0.5"}`}/>
                </button>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden" style={{height:320}}>
              <LandSVG plots={FARM_PLOTS} statuses={statuses} selected={selected} onSelect={setSelected}/>
            </div>
            {/* Status legend */}
            <div className="flex items-center gap-4 mt-3 text-xs">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"/>Open ({openCount})</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block"/>Warning ({warnCount})</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-400 inline-block"/>Closed ({closedCount})</span>
            </div>
          </div>

          {/* Selected plot detail modal */}
          {selectedPlot && (
            <div className="terra-card border-2 border-emerald-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">{selectedPlot.name} – Full Details</h3>
                <button onClick={()=>setSelected(null)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                  <X size={14}/>
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  {[
                    {label:"Crop", value:`${selectedPlot.icon} ${selectedPlot.crop}`},
                    {label:"Stage", value:selectedPlot.stage},
                    {label:"Acreage", value:`${selectedPlot.acreage} ac`},
                    {label:"Soil pH", value:selectedPlot.soilPH.toString()},
                  ].map(m=>(
                    <div key={m.label} className="flex justify-between text-sm border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500 font-medium">{m.label}</span>
                      <span className="font-semibold text-slate-900">{m.value}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    {label:"Moisture", value:`${selectedPlot.moisture}%`},
                    {label:"Health", value:selectedPlot.health.toString()},
                    {label:"Temperature", value:`${selectedPlot.temperature.toFixed(2)}°C`},
                    {label:"NPK", value:`${selectedPlot.npk.n}/${selectedPlot.npk.p}/${selectedPlot.npk.k}`},
                  ].map(m=>(
                    <div key={m.label} className="flex justify-between text-sm border-b border-slate-50 pb-1.5">
                      <span className="text-slate-500 font-medium">{m.label}</span>
                      <span className="font-semibold text-slate-900">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <BarChart2 size={12}/> 7-Day Health History
                </div>
                <Sparkline plotId={selectedPlot.id}/>
              </div>
              <p className="text-xs text-slate-400 mt-2 font-mono bg-slate-50 p-2 rounded-lg">
                Completion: {selectedPlot.completionPrecise}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Print-only land report ─────────────────────────────────────── */}
      <div className="hidden print:block">
        <div className="print-header">
          <h1>AgroWave Land Report</h1>
          <p>KHARIF 2026 · Generated {new Date().toLocaleString()} · 6 Plots Active</p>
        </div>
        <table className="print-table">
          <thead>
            <tr>
              <th>Plot</th><th>Crop</th><th>Stage</th><th>Status</th>
              <th>Completion</th><th>Moisture</th><th>Health</th><th>Temp°C</th><th>pH</th>
            </tr>
          </thead>
          <tbody>
            {FARM_PLOTS.map(p=>(
              <tr key={p.id}>
                <td>{p.name}</td><td>{p.crop}</td><td>{p.stage}</td>
                <td><strong>{statuses[p.id]}</strong></td>
                <td>{p.completionPercent.toFixed(6)}%</td>
                <td>{p.moisture}%</td><td>{p.health}</td>
                <td>{p.temperature.toFixed(2)}</td><td>{p.soilPH}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{marginTop:24}}>
          <h2 style={{fontSize:14,fontWeight:700}}>Threshold Settings Used</h2>
          <p>Min Health: {thresholds.minHealth} · Min Moisture: {thresholds.minMoisture}% ·
            Max Pest: {thresholds.maxPestLevel} · pH: {thresholds.minPH}–{thresholds.maxPH}</p>
        </div>
      </div>
    </div>
  );
}
