"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets, Plus, X, Save, Bug, ChevronDown, Trash2, Printer,
  Map, Activity, Thermometer, Sprout, Eye, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { getHealthColor, getMoistureColor, getMoistureLabel } from "@/lib/utils";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis
} from "recharts";

const TT = { contentStyle:{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",fontFamily:"DM Sans",fontSize:"12px"} };
const RISK_BADGE: Record<string,string> = { high:"badge-red", medium:"badge-amber", low:"badge-green" };

export default function FieldMonitor() {
  const { plots, updateMoisture, irrigate, toggleAutoIrr, addPlot, deletePlot, setField, pushNotif } = useStore();
  const [sel, setSel]         = useState(plots[0]?.id || "A");
  const [showAdd, setShowAdd] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [editNPK, setEditNPK] = useState(false);
  const [npk, setNpk]         = useState({n:0,p:0,k:0});
  const [newPlot, setNewPlot] = useState({
    id:"G", name:"New Plot", crop:"Wheat", size:2.0, moisture:60, health:80, temp:32,
    npk:{n:120,p:40,k:160}, lastWatered:"Just added", autoIrr:false,
    phase:"Sowing", ph:6.5, pestRisk:"low" as "low"|"medium"|"high", area:"New Block",
    soilType:"Loamy", drainage:"Good", elevation:320, notes:""
  });

  const selPlot = plots.find(p => p.id === sel);

  const history = Array.from({length:7},(_,i) => ({
    day:["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i],
    moisture: selPlot ? Math.max(20, Math.min(92, selPlot.moisture + (Math.random()-.5)*18)) : 60,
    health:   selPlot ? Math.max(40, Math.min(98, selPlot.health   + (Math.random()-.5)*10)) : 80,
  }));

  const handleAddPlot = () => {
    if (!newPlot.name.trim()) {
      pushNotif({title:"⚠️ Plot name required",body:"Please enter a name for your new plot.",type:"warning",time:"just now"});
      return;
    }
    addPlot({...newPlot});
    pushNotif({title:"✅ New Plot Added",body:`${newPlot.name} has been added to your farm.`,type:"success",time:"just now"});
    setShowAdd(false);
    setShowAdvanced(false);
  };

  const saveNPK = () => {
    if(!selPlot) return;
    setField(selPlot.id,"npk",npk);
    pushNotif({title:"🌱 NPK Updated",body:`${selPlot.name}: N${npk.n}/P${npk.p}/K${npk.k} applied.`,type:"success",time:"just now"});
    setEditNPK(false);
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#F8FAFC 100%)"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-12">
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="dot-live" style={{background:"#A7F3D0"}}/>
              <span className="text-green-300 text-xs font-bold tracking-widest">FIELD MONITOR</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-1">Field <span className="grad-text">Monitor</span></h1>
            <p className="text-slate-400 text-sm">Real-time soil intelligence · Click a plot to inspect and edit</p>
          </div>
          <div className="flex gap-3">
            <Link href="/land" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{background:"rgba(255,255,255,0.08)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.25)"}}>
              <Map className="w-4 h-4"/> Land View
            </Link>
            <button onClick={()=>window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
              style={{background:"rgba(255,255,255,0.1)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
              <Printer className="w-4 h-4"/> Print
            </button>
            <button onClick={()=>setShowAdd(true)} className="btn btn-primary"
              style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
              <Plus className="w-4 h-4"/> Add Plot
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Plot list */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-slate-800">All Plots ({plots.length})</h2>
            </div>
            {plots.map((p,i) => {
              const mc = getMoistureColor(p.moisture);
              const hc = getHealthColor(p.health);
              return (
                <motion.div key={p.id} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.07}}
                  onClick={()=>setSel(p.id)}
                  className={`card cursor-pointer transition-all border-2 ${
                    sel===p.id
                      ? "border-brand-400 ring-2 ring-brand-100 shadow-soft"
                      : "border-slate-200 hover:border-brand-200"
                  }`} style={{boxShadow:sel===p.id?"0 4px 20px rgba(16,185,129,0.14)":"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.crop} · {p.size} ac · {p.phase}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${RISK_BADGE[p.pestRisk]}`}>{p.pestRisk} pest</span>
                      <span className={`badge ${p.health>80?"badge-green":p.health>60?"badge-amber":"badge-red"}`}>{p.health}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="#F1F5F9" strokeWidth="6"/>
                        <circle cx="28" cy="28" r="22" fill="none" strokeWidth="6"
                          stroke={mc} strokeDasharray={`${(p.moisture/100)*138} 138`}
                          strokeLinecap="round" style={{transition:"stroke-dasharray 1s ease"}}/>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-[9px] font-bold text-slate-700">{Math.round(p.moisture)}%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      {[
                        {l:"Moisture",v:p.moisture,max:100,c:mc},
                        {l:"Health",  v:p.health,  max:100,c:hc},
                        {l:"Temp",    v:p.temp,    max:45, c:"#F59E0B"},
                      ].map(s=>(
                        <div key={s.l} className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-400 w-12">{s.l}</span>
                          <div className="flex-1 progress"><div className="progress-fill" style={{width:`${(s.v/s.max)*100}%`,background:s.c}}/></div>
                          <span className="text-[9px] font-mono text-slate-600 w-7 text-right">{s.v}{s.l==="Temp"?"°":""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                    <div className="flex gap-2">
                      <span className="text-[10px] text-slate-400">pH {p.ph}</span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">NPK {p.npk.n}/{p.npk.p}/{p.npk.k}</span>
                    </div>
                    <span className={`badge text-[9px] ${getMoistureLabel(p.moisture)==="Critical"?"badge-red":getMoistureLabel(p.moisture)==="Low"?"badge-amber":"badge-green"}`}>
                      {getMoistureLabel(p.moisture)}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* Add New Plot trigger */}
            <button onClick={()=>setShowAdd(true)}
              className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-slate-300 text-slate-500 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50 rounded-xl text-sm font-semibold transition-all">
              <Plus className="w-4 h-4"/> Add New Plot
            </button>
          </div>

          {/* Right: detail panel */}
          {selPlot && (
            <div className="lg:col-span-8 space-y-5">
              {/* Plot header */}
              <Card hover={false} className="p-6" style={{background:"linear-gradient(135deg,#F0FDF4,#fff)"}}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selPlot.name}</h2>
                    <p className="text-slate-500 mt-1">{selPlot.crop} · {selPlot.size} acres · {selPlot.phase}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>irrigate(selPlot.id)} className="btn btn-primary text-sm px-4 py-2"
                      style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                      <Droplets className="w-4 h-4"/> Irrigate
                    </button>
                    <button onClick={()=>deletePlot(selPlot.id)} className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 border border-slate-200 transition-all">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    {l:"Moisture",v:`${Math.round(selPlot.moisture)}%`,c:getMoistureColor(selPlot.moisture)},
                    {l:"Health",  v:`${selPlot.health}%`,             c:getHealthColor(selPlot.health)},
                    {l:"Temp",    v:`${selPlot.temp}°C`,              c:"#F59E0B"},
                    {l:"Soil pH", v:selPlot.ph,                       c:"#3B82F6"},
                  ].map(s=>(
                    <div key={s.l} className="text-center p-3 rounded-xl" style={{background:"rgba(248,250,252,0.8)",border:"1px solid #E2E8F0"}}>
                      <div className="text-xl font-bold mb-1" style={{color:s.c}}>{s.v}</div>
                      <div className="text-xs text-slate-400 font-semibold">{s.l}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Chart */}
              <Card hover={false} className="p-6">
                <h3 className="font-bold text-slate-800 mb-4">7-Day Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={history} margin={{top:4,right:4,left:-20,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                    <XAxis dataKey="day" tick={{fontSize:11,fill:"#94A3B8"}} tickLine={false}/>
                    <YAxis tick={{fontSize:11,fill:"#94A3B8"}} tickLine={false} axisLine={false}/>
                    <Tooltip {...TT}/>
                    <Line type="monotone" dataKey="moisture" stroke="#10B981" strokeWidth={2.5} dot={{fill:"#10B981",r:3}}/>
                    <Line type="monotone" dataKey="health"   stroke="#3B82F6" strokeWidth={2.5} dot={{fill:"#3B82F6",r:3}}/>
                  </LineChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-3 justify-center">
                  <span className="flex items-center gap-2 text-xs text-slate-500"><span className="w-4 h-1 rounded" style={{background:"#10B981"}}/> Moisture</span>
                  <span className="flex items-center gap-2 text-xs text-slate-500"><span className="w-4 h-1 rounded" style={{background:"#3B82F6"}}/> Health</span>
                </div>
              </Card>

              {/* NPK Edit */}
              <Card hover={false} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">NPK Nutrients</h3>
                  {!editNPK ? (
                    <button onClick={()=>{setNpk(selPlot.npk);setEditNPK(true);}} className="btn btn-outline text-sm px-4 py-2">
                      Edit NPK
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={()=>setEditNPK(false)} className="btn btn-ghost text-sm px-4 py-2">Cancel</button>
                      <button onClick={saveNPK} className="btn btn-primary text-sm px-4 py-2"><Save className="w-4 h-4"/> Save</button>
                    </div>
                  )}
                </div>
                {editNPK ? (
                  <div className="grid grid-cols-3 gap-4">
                    {(["n","p","k"] as const).map(k=>(
                      <div key={k}>
                        <label className="block mb-1.5">{k.toUpperCase()} (kg/acre)</label>
                        <input type="number" min={0} value={npk[k]} onChange={e=>setNpk(p=>({...p,[k]:+e.target.value}))}/>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      {k:"Nitrogen (N)",  v:selPlot.npk.n, c:"#10B981", icon:"🌿"},
                      {k:"Phosphorus (P)",v:selPlot.npk.p, c:"#F59E0B", icon:"🌾"},
                      {k:"Potassium (K)", v:selPlot.npk.k, c:"#3B82F6", icon:"💧"},
                    ].map(n=>(
                      <div key={n.k} className="rounded-xl p-4 text-center" style={{background:"#F8FAFC",border:"1.5px solid #E2E8F0"}}>
                        <div className="text-2xl mb-2">{n.icon}</div>
                        <div className="text-xl font-bold mb-1" style={{color:n.c}}>{n.v}</div>
                        <div className="text-xs text-slate-500">{n.k}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* ── ADD NEW PLOT MODAL — Centered, Advanced visible ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="modal-overlay"
            onClick={e=>{if(e.target===e.currentTarget){setShowAdd(false);setShowAdvanced(false);}}}>
            <motion.div initial={{opacity:0,scale:.92,y:24}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.92,y:24}}
              className="modal-card" style={{maxWidth:"680px"}}>

              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100"
                style={{background:"linear-gradient(135deg,#F0FDF4,#fff)"}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Sprout className="w-5 h-5 text-brand-600"/>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Add New Plot</h3>
                    <p className="text-xs text-slate-400">Enter plot details below · Advanced options available</p>
                  </div>
                </div>
                <button onClick={()=>{setShowAdd(false);setShowAdvanced(false);}}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Core fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5">PLOT ID</label>
                    <input value={newPlot.id} onChange={e=>setNewPlot(p=>({...p,id:e.target.value.toUpperCase()}))} placeholder="G"/>
                  </div>
                  <div>
                    <label className="block mb-1.5">PLOT NAME</label>
                    <input value={newPlot.name} onChange={e=>setNewPlot(p=>({...p,name:e.target.value}))} placeholder="New Plot"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5">CROP</label>
                    <input value={newPlot.crop} onChange={e=>setNewPlot(p=>({...p,crop:e.target.value}))} placeholder="Wheat"/>
                  </div>
                  <div>
                    <label className="block mb-1.5">AREA (ACRES)</label>
                    <input type="number" step={0.5} min={0} value={newPlot.size}
                      onChange={e=>setNewPlot(p=>({...p,size:+e.target.value}))}/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5">PHASE</label>
                    <input value={newPlot.phase} onChange={e=>setNewPlot(p=>({...p,phase:e.target.value}))} placeholder="Sowing"/>
                  </div>
                  <div>
                    <label className="block mb-1.5">SOIL PH</label>
                    <input type="number" step={0.1} min={0} max={14} value={newPlot.ph}
                      onChange={e=>setNewPlot(p=>({...p,ph:+e.target.value}))}/>
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5">PEST RISK</label>
                  <div className="flex gap-3">
                    {(["low","medium","high"] as const).map(r=>(
                      <button key={r} onClick={()=>setNewPlot(p=>({...p,pestRisk:r}))}
                        className={`filter-pill flex-1 justify-center capitalize${newPlot.pestRisk===r?" filter-pill-active":""}`}>
                        {r==="low"?"🟢":r==="medium"?"🟡":"🔴"} {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced toggle — visible and accessible */}
                <button className="advanced-toggle w-full" onClick={()=>setShowAdvanced(!showAdvanced)}>
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4"/> Advanced Options
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced?"rotate-180":""}`}/>
                </button>

                {/* Advanced section — fully visible when opened */}
                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
                      className="overflow-hidden">
                      <div className="space-y-4 pt-1 p-4 rounded-xl" style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0"}}>
                        <p className="text-xs font-bold text-brand-700 uppercase tracking-wide flex items-center gap-1.5">
                          <Sprout className="w-3.5 h-3.5"/> Advanced Plot Settings
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block mb-1.5">MOISTURE (%)</label>
                            <input type="number" min={0} max={100} value={newPlot.moisture}
                              onChange={e=>setNewPlot(p=>({...p,moisture:+e.target.value}))}/>
                          </div>
                          <div>
                            <label className="block mb-1.5">HEALTH (%)</label>
                            <input type="number" min={0} max={100} value={newPlot.health}
                              onChange={e=>setNewPlot(p=>({...p,health:+e.target.value}))}/>
                          </div>
                          <div>
                            <label className="block mb-1.5">TEMP (°C)</label>
                            <input type="number" step={0.5} value={newPlot.temp}
                              onChange={e=>setNewPlot(p=>({...p,temp:+e.target.value}))}/>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block mb-1.5">N (kg/acre)</label>
                            <input type="number" min={0} value={newPlot.npk.n}
                              onChange={e=>setNewPlot(p=>({...p,npk:{...p.npk,n:+e.target.value}}))}/>
                          </div>
                          <div>
                            <label className="block mb-1.5">P (kg/acre)</label>
                            <input type="number" min={0} value={newPlot.npk.p}
                              onChange={e=>setNewPlot(p=>({...p,npk:{...p.npk,p:+e.target.value}}))}/>
                          </div>
                          <div>
                            <label className="block mb-1.5">K (kg/acre)</label>
                            <input type="number" min={0} value={newPlot.npk.k}
                              onChange={e=>setNewPlot(p=>({...p,npk:{...p.npk,k:+e.target.value}}))}/>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-1.5">SOIL TYPE</label>
                            <select value={newPlot.soilType} onChange={e=>setNewPlot(p=>({...p,soilType:e.target.value}))}>
                              {["Loamy","Sandy","Clay","Silty","Peaty","Chalky","Sandy Loam"].map(s=><option key={s}>{s}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block mb-1.5">DRAINAGE</label>
                            <select value={newPlot.drainage} onChange={e=>setNewPlot(p=>({...p,drainage:e.target.value}))}>
                              {["Excellent","Good","Moderate","Poor"].map(d=><option key={d}>{d}</option>)}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block mb-1.5">NOTES</label>
                          <textarea rows={2} placeholder="Any additional notes about this plot…" value={newPlot.notes}
                            onChange={e=>setNewPlot(p=>({...p,notes:e.target.value}))}/>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3 pt-2">
                  <button onClick={()=>{setShowAdd(false);setShowAdvanced(false);}} className="btn btn-outline flex-1">Cancel</button>
                  <button onClick={handleAddPlot} className="btn btn-primary flex-1"
                    style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                    <Plus className="w-4 h-4"/> Add Plot
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
