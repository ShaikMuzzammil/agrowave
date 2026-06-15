"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, X, Save, Bug, ChevronDown, Trash2, Printer, Map, Info } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { getHealthColor, getMoistureColor, getMoistureLabel } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const TT = { contentStyle:{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",fontFamily:"DM Sans",fontSize:"12px"} };
const RISK_BADGE: Record<string,string> = { high:"badge-red", medium:"badge-amber", low:"badge-green" };

export default function FieldMonitor() {
  const { plots, updateMoisture, irrigate, toggleAutoIrr, addPlot, deletePlot, setField, pushNotif } = useStore();
  const [confirmDelId, setConfirmDelId] = useState<string|null>(null);

  const handleDelete = (id: string) => {
    if (confirmDelId === id) {
      deletePlot(id);
      pushNotif({title:"🗑️ Plot Removed",body:"Plot deleted from farm map.",type:"warning",time:"just now"});
      setConfirmDelId(null);
    } else {
      setConfirmDelId(id);
      setTimeout(() => setConfirmDelId(null), 3500);
    }
  };
  const [sel, setSel]         = useState(plots[0]?.id || "A");
  const [showAdd, setShowAdd] = useState(false);
  const [editNPK, setEditNPK] = useState(false);
  const [npk, setNpk]         = useState({n:0,p:0,k:0});
  const [newPlot, setNewPlot] = useState({
    id:"G", name:"New Plot", crop:"Wheat", size:2.0, moisture:60, health:80, temp:32,
    npk:{n:120,p:40,k:160}, lastWatered:"Just added", autoIrr:false,
    phase:"Sowing", ph:6.5, pestRisk:"low" as "low"|"medium"|"high", area:"New Block"
  });

  const selPlot = plots.find(p => p.id === sel);

  const history = Array.from({length:7},(_,i) => ({
    day:["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i],
    moisture: selPlot ? Math.max(20, Math.min(92, selPlot.moisture + (Math.random()-.5)*18)) : 60,
    health:   selPlot ? Math.max(40, Math.min(98, selPlot.health   + (Math.random()-.5)*10)) : 80,
  }));

  const radarData = plots.map(p => ({
    id: p.id, moisture: p.moisture, health: p.health,
    risk: p.pestRisk==="high"?80:p.pestRisk==="medium"?45:15,
  }));

  const handleAddPlot = () => {
    if (!newPlot.name.trim()) {
      pushNotif({title:"⚠️ Plot name required",body:"Please enter a name for your new plot.",type:"warning",time:"just now"});
      return;
    }
    const IDS = ["A","B","C","D","E","F","G","H","I","J","K","L"];
    const usedIds = new Set(plots.map((p:any)=>p.id));
    const autoId = IDS.find((id:string)=>!usedIds.has(id)) || String.fromCharCode(65+plots.length);
    const plotToAdd = {...newPlot, id: newPlot.id.trim() || autoId};
    addPlot(plotToAdd);
    setSel(plotToAdd.id);
    pushNotif({title:"✅ Plot Added to Farm Map",body:`${newPlot.name} added. Visible on Land Map and Detailed Land View.`,type:"success",time:"just now"});
    setShowAdd(false);
    setNewPlot({id:"",name:"New Plot",crop:"Wheat",size:2.0,moisture:60,health:80,temp:32,npk:{n:120,p:40,k:160},lastWatered:"Just added",autoIrr:false,phase:"Sowing",ph:6.5,pestRisk:"low" as "low"|"medium"|"high",area:"New Block"});
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
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-10">
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Field <span className="grad-text">Monitor</span></h1>
            <p className="text-slate-400 text-sm">Real-time soil intelligence · Click a plot to inspect and edit</p>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
              style={{background:"rgba(255,255,255,0.1)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
              <Printer className="w-4 h-4"/> Print Report
            </button>
            <button onClick={()=>setShowAdd(true)} className="btn btn-primary"
              style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
              <Plus className="w-4 h-4"/> Add Plot
            </button>
          </div>
        </div>
      </div>

      {/* Hint banner */}
      <div className="container pt-5">
        <div className="hint-banner">
          <Info className="w-4 h-4 flex-shrink-0"/>
          <span><strong>Tip:</strong> Select any plot from the list to view detailed analytics. Click <strong>+ Add New Plot</strong> at the bottom to add a custom field. Use <strong>Update NPK</strong> to log fertilizer applications.</span>
        </div>
      </div>

      <div className="container py-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Plot list — scrollable */}
          <div className="lg:col-span-4 flex flex-col" style={{maxHeight:"calc(100vh - 160px)"}}>
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h2 className="font-bold text-slate-800">All Plots <span className="text-xs text-slate-400 font-normal">({plots.length})</span></h2>
              <Link href="/land" className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                <Map className="w-3 h-3"/> Land View
              </Link>
            </div>
            <div className="overflow-y-auto flex-1 space-y-3 pr-1" style={{scrollbarWidth:"thin"}}>
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
                      <span className={`badge ${p.health>80?"badge-green":p.health>60?"badge-amber":"badge-red"}`}>{Math.round(p.health)}%</span>
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
                          <span className="text-[9px] font-mono text-slate-600 w-8 text-right">{Math.round(s.v)}{s.l==="Temp"?"°":"%"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                    <div className="flex gap-2">
                      <span className="text-[10px] text-slate-400">pH {p.ph.toFixed(1)}</span>
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
            <button onClick={()=>setShowAdd(true)}
              className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-slate-300 text-slate-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl text-sm font-semibold transition-all flex-shrink-0 mt-2">
              <Plus className="w-4 h-4"/> Add New Plot
            </button>
            </div>{/* end scroll container */}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8 space-y-4">
            {selPlot ? (
              <>
                <Card hover={false} style={{boxShadow:"0 4px 20px rgba(0,0,0,0.07)"}}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">{selPlot.name}</h2>
                      <p className="text-slate-500 text-sm">
                        {selPlot.crop} · {selPlot.size} acres ({(selPlot.size * 100).toFixed(0)} cents) · {selPlot.area} · {selPlot.phase}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={()=>irrigate(selPlot.id)} className="btn btn-primary text-sm px-4 py-2"
                        style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                        <Droplets className="w-4 h-4"/> Irrigate
                      </button>
                      <button onClick={()=>handleDelete(selPlot.id)} title={confirmDelId===selPlot.id?"Click again to confirm delete":"Delete this plot"}
                        className={`btn btn-ghost text-sm px-3 py-2 border transition-all ${confirmDelId===selPlot.id?"bg-rose-100 text-rose-700 border-rose-300 animate-pulse":"text-rose-400 hover:bg-rose-50 border-rose-100"}`}>
                        {confirmDelId===selPlot.id ? <><Trash2 className="w-4 h-4"/> Confirm?</> : <Trash2 className="w-4 h-4"/>}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    {[
                      {l:"Moisture",    v:`${Math.round(selPlot.moisture)}%`,        c:getMoistureColor(selPlot.moisture)},
                      {l:"Health",      v:`${Math.round(selPlot.health)}%`,          c:getHealthColor(selPlot.health)},
                      {l:"Temperature", v:`${selPlot.temp.toFixed(1)}°C`,            c:"#F59E0B"},
                      {l:"Soil pH",     v:selPlot.ph.toFixed(1),                      c:"#10B981"},
                      {l:"Nitrogen (N)",v:`${selPlot.npk.n} kg/ha`,                  c:"#3B82F6"},
                      {l:"Phosphorus",  v:`${selPlot.npk.p} kg/ha`,                  c:"#8B5CF6"},
                      {l:"Potassium",   v:`${selPlot.npk.k} kg/ha`,                  c:"#F59E0B"},
                      {l:"Pest Risk",   v:selPlot.pestRisk.toUpperCase(),              c:selPlot.pestRisk==="high"?"#F43F5E":selPlot.pestRisk==="medium"?"#F59E0B":"#10B981"},
                    ].map(s=>(
                      <div key={s.l} className="bg-slate-50 rounded-xl p-3 border-2 border-slate-100">
                        <div className="text-xs text-slate-400 mb-1">{s.l}</div>
                        <div className="text-xl font-bold truncate" style={{color:s.c,maxWidth:"100%"}}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button onClick={()=>toggleAutoIrr(selPlot.id)}
                      className={`btn text-sm px-4 py-2 font-bold ${selPlot.autoIrr ? "btn-primary" : "btn-outline"}`}
                      style={selPlot.autoIrr?{background:"linear-gradient(135deg,#059669,#10B981)"}:{}}>
                      <Droplets className="w-4 h-4"/> Auto-Irrigate: {selPlot.autoIrr?"ON":"OFF"}
                    </button>
                    <button onClick={()=>{setNpk(selPlot.npk);setEditNPK(!editNPK);}}
                      className="btn btn-outline text-sm px-4 py-2">
                      <ChevronDown className={`w-4 h-4 transition-transform ${editNPK?"rotate-180":""}`}/> Update NPK
                    </button>
                  </div>
                  <AnimatePresence>
                    {editNPK && (
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
                        className="overflow-hidden">
                        <div className="pt-4 border-t border-slate-100">
                          <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">NPK Values (kg/ha)</p>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            {[
                              {l:"Nitrogen (N)",k:"n",c:"#3B82F6"},
                              {l:"Phosphorus (P)",k:"p",c:"#8B5CF6"},
                              {l:"Potassium (K)",k:"k",c:"#F59E0B"},
                            ].map(f=>(
                              <div key={f.k}>
                                <label className="text-xs font-semibold text-slate-500 block mb-1">{f.l}</label>
                                <input type="number" value={(npk as any)[f.k]}
                                  onChange={e=>setNpk(p=>({...p,[f.k]:+e.target.value}))}
                                  style={{borderColor:f.c+"55"}}/>
                              </div>
                            ))}
                          </div>
                          <button onClick={saveNPK} className="btn btn-primary text-sm px-5 py-2"
                            style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                            <Save className="w-4 h-4"/> Save NPK
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card hover={false}>
                    <h3 className="font-bold text-slate-800 mb-4">7-Day Trend</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <LineChart data={history}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                        <XAxis dataKey="day" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
                        <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false} domain={[0,100]}/>
                        <Tooltip {...TT}/>
                        <Line type="monotone" dataKey="moisture" stroke="#10B981" strokeWidth={2.5} dot={false} name="Moisture %"/>
                        <Line type="monotone" dataKey="health"   stroke="#3B82F6" strokeWidth={2.5} dot={false} name="Health %"/>
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="flex gap-4 mt-2">
                      <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-1.5 rounded bg-brand-500 inline-block"/>Moisture</span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-500"><span className="w-3 h-1.5 rounded bg-sky-500 inline-block"/>Health</span>
                    </div>
                  </Card>
                  <Card hover={false}>
                    <h3 className="font-bold text-slate-800 mb-3">Farm Comparison</h3>
                    <ResponsiveContainer width="100%" height={160}>
                      <RadarChart data={radarData.slice(0,6)}>
                        <PolarGrid stroke="#E2E8F0"/>
                        <PolarAngleAxis dataKey="id" tick={{fill:"#94A3B8",fontSize:10}}/>
                        <Radar name="Moisture" dataKey="moisture" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2}/>
                        <Radar name="Health"   dataKey="health"   stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1}  strokeWidth={2}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                <Card hover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Pest & Soil Advisory</h3>
                    <span className={`badge ${RISK_BADGE[selPlot.pestRisk]}`}><Bug className="w-3 h-3"/> {selPlot.pestRisk} risk</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      { title:"Irrigation Status", body: selPlot.moisture>70?"Moisture optimal — skip next irrigation cycle to prevent root rot.":"Moisture low — irrigation recommended within 24 hours.", icon:"💧", bg:"#ECFDF5", border:"#A7F3D0" },
                      { title:"Pest Watch",        body: selPlot.pestRisk==="high"?"HIGH ALERT: Immediate inspection needed. Apply chlorpyrifos 20% EC.":selPlot.pestRisk==="medium"?"Monitor closely — apply neem-based spray as preventive measure.":"Low risk detected. Continue standard monitoring schedule.", icon:"🦗", bg:selPlot.pestRisk==="high"?"#FFF1F2":selPlot.pestRisk==="medium"?"#FFFBEB":"#ECFDF5", border:selPlot.pestRisk==="high"?"#FECDD3":selPlot.pestRisk==="medium"?"#FDE68A":"#A7F3D0" },
                      { title:"Fertilizer Tip",    body:`Current NPK: N${selPlot.npk.n}/P${selPlot.npk.p}/K${selPlot.npk.k} kg/ha. ${selPlot.npk.n<100?"Nitrogen deficient — apply urea 46% at 50kg/acre.":"NPK levels adequate for current growth stage."}`, icon:"🌱", bg:"#EFF6FF", border:"#BFDBFE" },
                      { title:"Soil Health",       body:`pH ${selPlot.ph.toFixed(1)} — ${selPlot.ph<6?"Acidic: apply agricultural lime at 100kg/acre.":selPlot.ph>7.5?"Alkaline: add sulfur or gypsum to acidify.":"Optimal pH range. Maintain current soil management."}`, icon:"🧪", bg:"#F5F3FF", border:"#DDD6FE" },
                    ].map((a,i)=>(
                      <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                        className="rounded-xl p-4" style={{background:a.bg,border:`1.5px solid ${a.border}`}}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{a.icon}</span>
                          <span className="font-semibold text-slate-800 text-sm">{a.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{a.body}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <p className="text-lg font-medium">Select a plot to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ADD NEW PLOT MODAL — CENTRED OVERLAY ── */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="modal-overlay"
            onClick={(e)=>{ if(e.target===e.currentTarget) setShowAdd(false); }}>
            <motion.div
              initial={{scale:0.92,opacity:0,y:24}}
              animate={{scale:1,opacity:1,y:0}}
              exit={{scale:0.92,opacity:0,y:24}}
              transition={{type:"spring",damping:24,stiffness:280}}
              className="modal-card">
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">➕ Add New Plot</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Fill in details — plot will auto-appear on Land Map & Dashboard</p>
                </div>
                <button onClick={()=>setShowAdd(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              {/* Form grid */}
              <div className="modal-grid mb-4">
                <div>
                  <label className="label-xs">PLOT ID</label>
                  <input placeholder="e.g. G" value={newPlot.id}
                    onChange={e=>setNewPlot(p=>({...p,id:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="label-xs">PLOT NAME</label>
                  <input placeholder="e.g. North Extension" value={newPlot.name}
                    onChange={e=>setNewPlot(p=>({...p,name:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="label-xs">CROP</label>
                  <input placeholder="e.g. Wheat" value={newPlot.crop}
                    onChange={e=>setNewPlot(p=>({...p,crop:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="label-xs">SIZE (ACRES) — <span className="text-brand-500">{(newPlot.size*100).toFixed(0)} cents</span></label>
                  <input type="number" step="0.5" min="0.5" value={newPlot.size}
                    onChange={e=>setNewPlot(p=>({...p,size:+e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="label-xs">PHASE</label>
                  <select value={newPlot.phase} onChange={e=>setNewPlot(p=>({...p,phase:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                    {["Sowing","Germination","Tillering","Vegetative","Flowering","Fruiting","Pod Fill","Boll Formation","Silking","Panicle Init.","Bulb Dev.","Maturity","Harvesting"].map(ph=>(
                      <option key={ph} value={ph}>{ph}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label-xs">SOIL PH</label>
                  <input type="number" step="0.1" min="4" max="9" value={newPlot.ph}
                    onChange={e=>setNewPlot(p=>({...p,ph:+e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="label-xs">PEST RISK</label>
                  <select value={newPlot.pestRisk} onChange={e=>setNewPlot(p=>({...p,pestRisk:e.target.value as any}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div>
                  <label className="label-xs">AREA NAME</label>
                  <input placeholder="e.g. North Block" value={newPlot.area}
                    onChange={e=>setNewPlot(p=>({...p,area:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
              </div>

              {/* NPK Row */}
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">NPK VALUES (kg/ha)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {l:"Nitrogen (N)", k:"n", c:"#3B82F6"},
                    {l:"Phosphorus (P)", k:"p", c:"#8B5CF6"},
                    {l:"Potassium (K)", k:"k", c:"#F59E0B"},
                  ].map(f=>(
                    <div key={f.k}>
                      <label className="text-[10px] font-semibold block mb-1" style={{color:f.c}}>{f.l}</label>
                      <input type="number" value={(newPlot.npk as any)[f.k]}
                        onChange={e=>setNewPlot(p=>({...p,npk:{...p.npk,[f.k]:+e.target.value}}))}
                        style={{background:"#F8FAFC",border:`2px solid ${f.c}44`}}/>
                    </div>
                  ))}
                </div>
              </div>

              {/* Initial readings */}
              <div className="mb-6 p-4 rounded-xl" style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0"}}>
                <p className="text-xs font-bold text-brand-700 mb-3 uppercase tracking-wider">Initial Sensor Readings</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">MOISTURE %</label>
                    <input type="range" min="10" max="95" value={newPlot.moisture}
                      onChange={e=>setNewPlot(p=>({...p,moisture:+e.target.value}))}
                      className="w-full accent-green-500"/>
                    <span className="text-xs font-bold text-brand-700">{newPlot.moisture}%</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">HEALTH %</label>
                    <input type="range" min="20" max="100" value={newPlot.health}
                      onChange={e=>setNewPlot(p=>({...p,health:+e.target.value}))}
                      className="w-full accent-green-500"/>
                    <span className="text-xs font-bold text-brand-700">{newPlot.health}%</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 block mb-1">TEMP °C</label>
                    <input type="range" min="15" max="45" value={newPlot.temp}
                      onChange={e=>setNewPlot(p=>({...p,temp:+e.target.value}))}
                      className="w-full accent-amber-500"/>
                    <span className="text-xs font-bold text-amber-600">{newPlot.temp}°C</span>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button onClick={()=>setShowAdd(false)} className="btn btn-ghost px-6 py-2.5">Cancel</button>
                <button onClick={handleAddPlot} className="btn btn-primary px-8 py-2.5"
                  style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                  <Plus className="w-4 h-4"/> Add Plot
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
