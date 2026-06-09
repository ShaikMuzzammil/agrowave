"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map, Layers, Satellite, Mountain, Droplets, Thermometer,
  Activity, Zap, Info, X, ChevronRight, Printer, Globe,
  Wind, Eye, AlertTriangle, CheckCircle, ToggleLeft, ToggleRight
} from "lucide-react";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { getMoistureColor, getHealthColor } from "@/lib/utils";

/* ── Satellite tile colours — real farm palette ── */
const PLOT_CONFIGS = [
  { id:"north",   name:"North Field",   crop:"Wheat",   area:4.5, color:"#15803D", satHue:"140", health:94, warning:false },
  { id:"east",    name:"East Block",    crop:"Rice",    area:3.2, color:"#0EA5E9", satHue:"160", health:75, warning:false },
  { id:"west",    name:"West Block",    crop:"Soybean", area:5.0, color:"#16A34A", satHue:"145", health:88, warning:false },
  { id:"south",   name:"South Field",   crop:"Cotton",  area:5.0, color:"#DC2626", satHue:"100", health:63, warning:true  },
  { id:"central", name:"Central Plot",  crop:"Maize",   area:4.0, color:"#CA8A04", satHue:"130", health:82, warning:false },
  { id:"border",  name:"Border Strip",  crop:"Onion",   area:2.5, color:"#9333EA", satHue:"150", health:91, warning:false },
];

const LAYERS = [
  { id:"moisture",     label:"Moisture",     icon:"💧", desc:"Soil water content per plot" },
  { id:"health",       label:"Crop Health",  icon:"🌿", desc:"Overall plant vitality index" },
  { id:"temperature",  label:"Temperature",  icon:"🌡️", desc:"Surface temperature (°C)" },
  { id:"ndvi",         label:"NDVI Index",   icon:"📡", desc:"Vegetation density index" },
  { id:"irrigation",   label:"Irrigation",   icon:"💦", desc:"Irrigation status & schedule" },
];

/* Generates a realistic-looking SVG farm tile */
function FarmTile({ plot, moisture, health, selected, layer, onClick }: any) {
  const mc   = getMoistureColor(moisture);
  const hc   = getHealthColor(health);
  const warn = moisture < 30 || health < 65;
  const isOpen = health > 70 && moisture > 25;

  /* organic crop-row SVG pattern */
  const rows = Array.from({ length: 8 }, (_, i) => i);

  return (
    <motion.div
      whileHover={{ scale: 1.03, zIndex: 10 }}
      onClick={onClick}
      className="relative cursor-pointer rounded-2xl overflow-hidden transition-all"
      style={{
        minHeight: 130,
        border: selected
          ? "3px solid #10B981"
          : warn
          ? "2px solid #F43F5E"
          : "2px solid rgba(255,255,255,0.15)",
        boxShadow: selected
          ? "0 0 0 3px rgba(16,185,129,0.25), 0 8px 32px rgba(16,185,129,0.2)"
          : warn
          ? "0 4px 16px rgba(244,63,94,0.2)"
          : "0 4px 16px rgba(0,0,0,0.25)",
      }}
    >
      {/* Satellite-style background — layered SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 130" preserveAspectRatio="xMidYMid slice">
        {/* Base soil */}
        <rect width="200" height="130"
          fill={`hsl(${plot.satHue}, ${moisture > 60 ? 55 : moisture > 30 ? 40 : 25}%, ${moisture > 60 ? 28 : moisture > 30 ? 35 : 42}%)`}/>

        {/* Crop rows — diagonal lines like aerial satellite */}
        {rows.map(i => (
          <g key={i}>
            <line x1={i * 28 - 10} y1="0" x2={i * 28 + 10} y2="130"
              stroke={`hsl(${plot.satHue}, 60%, ${health > 75 ? 48 : health > 55 ? 38 : 28}%)`}
              strokeWidth="10" strokeOpacity="0.85"/>
            <line x1={i * 28 - 5} y1="0" x2={i * 28 + 5} y2="130"
              stroke={`hsl(${plot.satHue}, 80%, ${health > 75 ? 58 : health > 55 ? 44 : 33}%)`}
              strokeWidth="4" strokeOpacity="0.6"/>
          </g>
        ))}

        {/* Irrigation channels */}
        <path d="M0 65 Q50 55 100 65 Q150 75 200 65" fill="none"
          stroke="rgba(14,165,233,0.4)" strokeWidth="3"/>
        <path d="M100 0 L100 130" fill="none"
          stroke="rgba(14,165,233,0.25)" strokeWidth="2"/>

        {/* Corner trees */}
        {[[8,8],[192,8],[8,122],[192,122]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="9"
            fill={`hsl(140, 70%, ${health > 70 ? 25 : 20}%)`} opacity="0.9"/>
        ))}

        {/* Moisture overlay */}
        <rect width="200" height="130" fill={mc} opacity={moisture / 400}/>
      </svg>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col justify-between p-3"
        style={{background:"linear-gradient(0deg,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.1) 60%)"}}>
        {/* Top badges */}
        <div className="flex justify-between items-start">
          <span className="text-[10px] font-bold px-2 py-1 rounded-full"
            style={{background: warn ? "rgba(244,63,94,0.85)" : "rgba(16,185,129,0.85)", color:"#fff"}}>
            {warn ? "⚠ WARNING" : "✓ OPEN"}
          </span>
          {selected && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-brand-500 text-white">SELECTED</span>
          )}
        </div>

        {/* Bottom info */}
        <div>
          <p className="font-bold text-white text-sm leading-tight">{plot.name}</p>
          <p className="text-green-200 text-[10px]">{plot.crop} · {plot.area}ac</p>
          <div className="flex gap-3 mt-1.5">
            <span className="text-[10px] text-blue-200">💧{moisture}%</span>
            <span className="text-[10px] text-green-200">💪{health}%</span>
          </div>
          {/* Progress bar */}
          <div className="h-1 rounded-full mt-1.5 overflow-hidden" style={{background:"rgba(255,255,255,0.2)"}}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{width:`${moisture}%`,background:mc}}/>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LandPage() {
  const { plots, irrigate, pushNotif } = useStore();
  const [selPlot, setSelPlot] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState("moisture");
  const [terrainMode, setTerrainMode] = useState(false);
  const [showGrid, setShowGrid]       = useState(true);
  const [tick, setTick]               = useState(0);

  /* Simulate real-time updates every 5s */
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 5000);
    return () => clearInterval(iv);
  }, []);

  const getPlotData = (id: string) => {
    const p = plots.find(p => p.id.toLowerCase().includes(id) || p.name.toLowerCase().includes(id));
    return p || { moisture: 60, health: 80, temp: 31, npk: { n: 120, p: 40, k: 160 }, ph: 6.5 };
  };

  const selected = PLOT_CONFIGS.find(p => p.id === selPlot);
  const selData  = selPlot ? getPlotData(selPlot) : null;

  const handleIrrigate = (id: string, name: string) => {
    const p = plots.find(p => p.id.toLowerCase().includes(id) || p.name.toLowerCase().includes(id));
    if (p) { irrigate(p.id); }
    pushNotif({ title: `💧 Irrigation Started — ${name}`, body: `Water flow initiated for ${name}. Expected +15% moisture in 2 hours.`, type: "success", time: "just now" });
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{ background: "linear-gradient(160deg,#F0FDF4 0%,#1E293B 100%)" }}>

      {/* ── Hero strip ── */}
      <div style={{ background: "linear-gradient(135deg,#0F172A,#1E293B)" }} className="py-12">
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="dot-live" style={{ background: "#A7F3D0" }} />
              <span className="text-green-300 text-xs font-bold tracking-widest">REAL-LAND SATELLITE VIEW</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-1">
              Farm <span className="grad-text">Land Dashboard</span>
            </h1>
            <p className="text-slate-400 text-sm">
              KHARIF 2026 · 6 Plots · Satellite + Terrain overlay · Click any plot to inspect
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
              style={{ background: "rgba(255,255,255,0.1)", color: "#A7F3D0", border: "1px solid rgba(167,243,208,0.3)" }}>
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

          {/* ── Left sidebar: controls ── */}
          <div className="xl:col-span-1 space-y-4">

            {/* Layer selector */}
            <Card hover={false} className="p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600" /> Data Layers
              </h3>
              <div className="space-y-1.5">
                {LAYERS.map(l => (
                  <button key={l.id} onClick={() => setActiveLayer(l.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                      activeLayer === l.id
                        ? "font-bold text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                    style={activeLayer === l.id
                      ? { background: "linear-gradient(135deg,#059669,#10B981)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }
                      : {}}>
                    <span className="text-base">{l.icon}</span>
                    <div>
                      <p className={`text-xs font-bold ${activeLayer === l.id ? "text-white" : "text-slate-700"}`}>{l.label}</p>
                      <p className={`text-[10px] ${activeLayer === l.id ? "text-green-100" : "text-slate-400"}`}>{l.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* View controls */}
            <Card hover={false} className="p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-600" /> View Options
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Terrain Overlay", state: terrainMode, set: setTerrainMode },
                  { label: "Plot Grid",        state: showGrid,    set: setShowGrid },
                ].map(c => (
                  <div key={c.label} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{c.label}</span>
                    <button onClick={() => c.set(!c.state)}
                      className={`w-12 h-6 rounded-full transition-all relative ${c.state ? "bg-brand-500" : "bg-slate-200"}`}>
                      <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-all ${c.state ? "left-6" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Legend */}
            <Card hover={false} className="p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Legend</h3>
              <div className="space-y-2">
                {[
                  { c: "#10B981", l: "Open · Healthy" },
                  { c: "#F59E0B", l: "Moderate Alert" },
                  { c: "#F43F5E", l: "Warning · Low" },
                ].map(l => (
                  <div key={l.l} className="flex items-center gap-2 text-xs text-slate-600">
                    <div className="w-4 h-4 rounded" style={{ background: l.c }} />
                    {l.l}
                  </div>
                ))}
                <div className="border-t border-slate-100 mt-2 pt-2 text-[10px] text-slate-400">
                  Updates every 5s via WebSocket
                </div>
              </div>
            </Card>
          </div>

          {/* ── Main: satellite grid ── */}
          <div className="xl:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-600" />
                <span className="font-bold text-slate-200">Real-Land View</span>
                <span className="text-xs text-slate-400">
                  ({terrainMode ? "Terrain" : "Satellite"} · {activeLayer})
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold">
                <span className="dot-live" /> LIVE
              </span>
            </div>

            {/* 3×2 satellite plot grid */}
            <div className="sat-grid" style={{ gap: 6 }}>
              {PLOT_CONFIGS.map((plot) => {
                const d = getPlotData(plot.id);
                return (
                  <FarmTile key={plot.id} plot={plot}
                    moisture={Math.round(d.moisture + (tick % 3 === 0 ? (Math.random() - 0.5) * 2 : 0))}
                    health={d.health}
                    selected={selPlot === plot.id}
                    layer={activeLayer}
                    onClick={() => setSelPlot(selPlot === plot.id ? null : plot.id)}
                  />
                );
              })}
            </div>

            {/* Status bar below grid */}
            <div className="flex flex-wrap gap-3 py-4 px-5 rounded-2xl" style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(16,185,129,0.2)" }}>
              {[
                { c: "#10B981", l: "Open", n: PLOT_CONFIGS.filter(p => !p.warning).length },
                { c: "#F59E0B", l: "Warning", n: PLOT_CONFIGS.filter(p => p.warning).length },
                { c: "#64748B", l: "Closed", n: 0 },
              ].map(s => (
                <div key={s.l} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: s.c }} />
                  {s.l} ({s.n})
                </div>
              ))}
              <span className="ml-auto text-[10px] text-slate-500">Tick #{tick} · 5s refresh</span>
            </div>

            {/* Terrain-mode extra section */}
            {terrainMode && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-5" style={{ background: "rgba(15,23,42,0.85)", border: "1px solid rgba(16,185,129,0.2)" }}>
                <h4 className="font-bold text-green-300 text-sm mb-4 flex items-center gap-2">
                  <Mountain className="w-4 h-4" /> Terrain & Elevation Profile
                </h4>
                <svg viewBox="0 0 400 80" className="w-full" style={{ background: "rgba(0,0,0,0.3)", borderRadius: 12 }}>
                  <defs>
                    <linearGradient id="terrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                  <path d="M0,70 L40,55 L80,45 L120,50 L160,35 L200,40 L240,30 L280,42 L320,38 L360,48 L400,70 Z"
                    fill="url(#terrGrad)" stroke="#10B981" strokeWidth="2"/>
                  {[
                    [60, 44, "North\n320m"], [160, 34, "West\n345m"],
                    [240, 29, "Central\n352m"], [340, 37, "East\n338m"],
                  ].map(([x, y, l], i) => (
                    <g key={i}>
                      <circle cx={x} cy={y} r="4" fill="#10B981" />
                      <text x={x} y={Number(y) - 8} textAnchor="middle" fontSize="7" fill="#86EFAC">{String(l).split("\n")[1]}</text>
                    </g>
                  ))}
                  <text x="200" y="76" textAnchor="middle" fontSize="8" fill="#64748B">Elevation Profile — KHARIF 2026 Farm</text>
                </svg>
              </motion.div>
            )}
          </div>

          {/* ── Right sidebar: detail + analytics ── */}
          <div className="xl:col-span-1 space-y-4">

            {/* Selected plot detail */}
            <AnimatePresence>
              {selected && selData ? (
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                  <Card hover={false} className="p-5 border-brand-200"
                    style={{ background: "linear-gradient(135deg,#F0FDF4,#fff)", boxShadow: "0 4px 20px rgba(16,185,129,0.12)" }}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-800">{selected.name}</h3>
                        <p className="text-xs text-slate-400">{selected.crop} · {selected.area} ac</p>
                      </div>
                      <button onClick={() => setSelPlot(null)} className="text-slate-300 hover:text-slate-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 mb-4">
                      {[
                        { l: "Moisture",    v: `${Math.round(selData.moisture)}%`, c: getMoistureColor(selData.moisture), pct: selData.moisture },
                        { l: "Health",      v: `${selData.health}%`,              c: getHealthColor(selData.health),    pct: selData.health },
                        { l: "Temperature", v: `${selData.temp}°C`,              c: "#F59E0B",                          pct: (selData.temp / 45) * 100 },
                      ].map(s => (
                        <div key={s.l}>
                          <div className="flex justify-between mb-1 text-xs">
                            <span className="text-slate-500">{s.l}</span>
                            <span className="font-bold" style={{ color: s.c }}>{s.v}</span>
                          </div>
                          <div className="progress">
                            <div className="progress-fill" style={{ width: `${s.pct}%`, background: s.c }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                      {[
                        { l: "N", v: (selData as any).npk?.n ?? 120, c: "#10B981" },
                        { l: "P", v: (selData as any).npk?.p ?? 40,  c: "#F59E0B" },
                        { l: "K", v: (selData as any).npk?.k ?? 160, c: "#3B82F6" },
                      ].map(n => (
                        <div key={n.l} className="rounded-xl py-2 px-1" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                          <div className="font-bold text-sm" style={{ color: n.c }}>{n.v}</div>
                          <div className="text-[10px] text-slate-400">{n.l} kg/ac</div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-center text-xs">
                      <div className="rounded-xl py-2 px-1" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                        <div className="font-bold text-slate-700">{(selData as any).ph ?? 6.5}</div>
                        <div className="text-slate-400">Soil pH</div>
                      </div>
                      <div className="rounded-xl py-2 px-1" style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                        <div className="font-bold text-slate-700">{selected.area} ac</div>
                        <div className="text-slate-400">Area</div>
                      </div>
                    </div>

                    <button onClick={() => handleIrrigate(selected.id, selected.name)}
                      className="btn btn-primary w-full text-sm py-2.5"
                      style={{ background: "linear-gradient(135deg,#059669,#10B981)" }}>
                      <Droplets className="w-4 h-4" /> Irrigate Now
                    </button>
                  </Card>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card hover={false} className="p-5 text-center"
                    style={{ background: "rgba(15,23,42,0.5)", border: "1px solid rgba(16,185,129,0.15)" }}>
                    <Globe className="w-8 h-8 text-green-400 mx-auto mb-3 opacity-60" />
                    <p className="text-slate-400 text-sm font-medium">Click a plot tile</p>
                    <p className="text-slate-600 text-xs mt-1">to view detailed analytics</p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Farm summary stats */}
            <Card hover={false} className="p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Farm Summary</h3>
              <div className="space-y-3">
                {[
                  { l: "Total Area",     v: "24 acres",    icon: "📐" },
                  { l: "Active Plots",   v: "6 / 6",       icon: "✅" },
                  { l: "Avg Moisture",   v: "58.5%",       icon: "💧" },
                  { l: "Avg Health",     v: "82%",         icon: "💪" },
                  { l: "Warning Plots",  v: `${PLOT_CONFIGS.filter(p => p.warning).length}`,  icon: "⚠️" },
                  { l: "Season",         v: "Kharif 2026", icon: "🌾" },
                ].map(s => (
                  <div key={s.l} className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-1.5"><span>{s.icon}</span>{s.l}</span>
                    <span className="font-bold text-slate-800">{s.v}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick actions */}
            <Card hover={false} className="p-5">
              <h3 className="font-bold text-slate-800 text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { l: "Irrigate All", icon: Droplets, color: "#3B82F6",
                    action: () => { PLOT_CONFIGS.forEach(p => handleIrrigate(p.id, p.name)); } },
                  { l: "Print Report", icon: Printer, color: "#8B5CF6",
                    action: () => window.print() },
                  { l: "Field Monitor", icon: Activity, color: "#10B981",
                    action: () => { window.location.href = "/field-monitor"; } },
                ].map(a => {
                  const Icon = a.icon;
                  return (
                    <button key={a.l} onClick={a.action}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all text-white"
                      style={{ background: a.color }}>
                      <Icon className="w-4 h-4" /> {a.l}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>

        {/* ── Per-plot analytics table ── */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-200 text-lg">Plot Analytics Table</h2>
            <button onClick={() => window.print()} className="btn btn-outline text-sm px-4 py-2 no-print"
              style={{ color: "#A7F3D0", borderColor: "rgba(167,243,208,0.3)", background: "rgba(16,185,129,0.1)" }}>
              <Printer className="w-4 h-4" /> Export
            </button>
          </div>
          <Card hover={false} className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: "linear-gradient(135deg,#F0FDF4,#F8FAFC)", borderBottom: "2px solid #E2E8F0" }}>
                    {["Plot","Crop","Area","Moisture","Health","Temperature","NPK","pH","Status"].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PLOT_CONFIGS.map((plot, i) => {
                    const d = getPlotData(plot.id);
                    const mc = getMoistureColor(d.moisture);
                    const hc = getHealthColor(d.health);
                    return (
                      <motion.tr key={plot.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }} className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelPlot(plot.id === selPlot ? null : plot.id)}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ background: plot.color }} />
                            <span className="font-semibold text-slate-800 text-sm">{plot.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{plot.crop}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{plot.area} ac</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 progress">
                              <div className="progress-fill" style={{ width: `${d.moisture}%`, background: mc }} />
                            </div>
                            <span className="text-sm font-bold" style={{ color: mc }}>{Math.round(d.moisture)}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-sm" style={{ color: hc }}>{d.health}%</span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600 font-mono">{d.temp}°C</td>
                        <td className="px-5 py-4 text-xs text-slate-500">
                          {(d as any).npk?.n ?? 120}/{(d as any).npk?.p ?? 40}/{(d as any).npk?.k ?? 160}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{(d as any).ph ?? 6.5}</td>
                        <td className="px-5 py-4">
                          <span className={`badge ${plot.warning ? "badge-red" : "badge-green"}`}>
                            {plot.warning ? "⚠ Warning" : "✓ Open"}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
