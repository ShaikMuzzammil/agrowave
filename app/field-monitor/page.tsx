"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, X, Save, Bug, ChevronDown, Trash2, Printer, Map, Info, Leaf, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { getHealthColor, getMoistureColor, getMoistureLabel } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const TT = { contentStyle:{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",fontFamily:"DM Sans",fontSize:"12px"} };
const RISK_BADGE: Record<string,string> = { high:"badge-red", medium:"badge-amber", low:"badge-green" };
const COMPLETIONS: Record<string,number> = {
  A:93.95571812921074, B:74.71632610612846, C:62.98277071487386,
  D:82.18390979790693, E:88.52486644323442, F:77.83659463739020,
};

export default function FieldMonitor() {
  const { plots, updateMoisture, irrigate, toggleAutoIrr, addPlot, deletePlot, setField, pushNotif } = useStore();
  const [sel, setSel]       = useState(plots[0]?.id || "A");
  const [showAdd, setShowAdd] = useState(false);
  const [editNPK, setEditNPK] = useState(false);
  const [npk, setNpk]       = useState({n:0,p:0,k:0});
  const [filterPest, setFilterPest] = useState<"all"|"low"|"medium"|"high">("all");
  const listRef = useRef<HTMLDivElement>(null);
  const [newPlot, setNewPlot] = useState({
    id:"G", name:"New Plot", crop:"Wheat", size:2.0, moisture:60, health:80, temp:32,
    npk:{n:120,p:40,k:160}, lastWatered:"Just added", autoIrr:false,
    phase:"Sowing", ph:6.5, pestRisk:"low" as "low"|"medium"|"high", area:"New Block"
  });

  const selPlot = plots.find(p => p.id === sel);
  const filtered = plots.filter(p => filterPest==="all" || p.pestRisk===filterPest);

  useEffect(() => {
    // Auto-irrigation: if autoIrr enabled and moisture low, irrigate
    const iv = setInterval(() => {
      plots.forEach(p => {
        if (p.autoIrr && p.moisture < 35) {
          irrigate(p.id);
        }
      });
    }, 30000);
    return () => clearInterval(iv);
  }, [plots, irrigate]);

  const history = Array.from({length:7},(_,i) => ({
    day:["Mon","Tue","Wed","Thu","Fri","Sat","Today"][i],
    moisture: selPlot ? Math.max(20, Math.min(92, selPlot.moisture + (Math.random()-.5)*16)) : 60,
    health:   selPlot ? Math.max(40, Math.min(98, selPlot.health   + (Math.random()-.5)*10)) : 80,
  }));

  const radarData = plots.map(p => ({
    id:p.id, moisture:p.moisture, health:p.health,
    risk:p.pestRisk==="high"?80:p.pestRisk==="medium"?45:15,
  }));

  const handleAddPlot = () => {
    if (!newPlot.name.trim()) {
      pushNotif({title:"⚠️ Plot name required",body:"Please enter a name for the new plot.",type:"warning",time:"just now"});
      return;
    }
    addPlot({...newPlot});
    setSel(newPlot.id);
    pushNotif({title:"✅ Plot Added",body:`${newPlot.name} added to your farm.`,type:"success",time:"just now"});
    setShowAdd(false);
  };

  const saveNPK = () => {
    if(!selPlot) return;
    setField(selPlot.id,"npk",npk);
    pushNotif({title:"🌱 NPK Updated",body:`${selPlot.name}: N${npk.n}/P${npk.p}/K${npk.k}.`,type:"success",time:"just now"});
    setEditNPK(false);
  };

  const handleAutoIrr = (id:string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleAutoIrr(id);
    const p = plots.find(x=>x.id===id);
    if(p) pushNotif({title:`💧 Auto-Irrigate ${!p.autoIrr?"ON":"OFF"}`,body:`${p.name} auto-irrigation ${!p.autoIrr?"enabled":"disabled"}.`,type:"info",time:"just now"});
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#F8FAFC 100%)"}}>
      {/* Sticky header */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-slate-100 shadow-sm">
        <div className="container py-3 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Field <span className="grad-text">Monitor</span></h1>
            <p className="text-slate-500 text-xs">{plots.length} plots active · KHARIF 2026</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Pest filter pills */}
            <div className="flex gap-1.5 flex-wrap">
              {(["all","low","medium","high"] as const).map(f=>(
                <button key={f} onClick={()=>setFilterPest(f)}
                  className={`filter-pill text-xs py-1.5 px-3${filterPest===f?" active":""}`}>
                  {f==="all"?"All Plots":f.charAt(0).toUpperCase()+f.slice(1)+" Pest"}
                </button>
              ))}
            </div>
            <button onClick={()=>window.print()} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-700 no-print">
              <Printer className="w-3.5 h-3.5"/> Print
            </button>
            <button onClick={()=>setShowAdd(true)} className="btn btn-primary text-sm px-4 py-2"
              style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
              <Plus className="w-4 h-4"/> Add Plot
            </button>
          </div>
        </div>
      </div>

      {/* Hint */}
      <div className="container pt-4 pb-2">
        <div className="hint-banner">
          <Info className="w-4 h-4 flex-shrink-0"/>
          <span><strong>Tip:</strong> Select a plot to view full analytics. The <strong>AUTO</strong> button enables automatic irrigation when moisture drops below 35%. Use pest filter pills above to filter by risk level.</span>
        </div>
      </div>

      <div className="container py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Plot list */}
          <div className="lg:col-span-4">
            <div ref={listRef} className="space-y-3 overflow-y-auto" style={{maxHeight:"calc(100vh - 220px)"}}>
              {filtered.map((p,i) => {
                const mc = getMoistureColor(p.moisture);
                const hc = getHealthColor(p.health);
                return (
                  <motion.div key={p.id} initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                    onClick={()=>setSel(p.id)}
                    className={`card cursor-pointer transition-all border-2 ${
                      sel===p.id?"border-brand-400 ring-2 ring-brand-100":"border-slate-200 hover:border-brand-200"
                    }`} style={{boxShadow:sel===p.id?"0 4px 20px rgba(16,185,129,0.14)":"0 2px 8px rgba(0,0,0,0.04)"}}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-tight">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.crop} · {p.size}ac · {p.phase}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`badge text-xs ${RISK_BADGE[p.pestRisk]}`}><Bug className="w-2.5 h-2.5"/> {p.pestRisk}</span>
                        <span className="font-mono text-xs text-brand-600 font-bold">{COMPLETIONS[p.id]?.toFixed(2)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
                          <circle cx="24" cy="24" r="19" fill="none" stroke="#F1F5F9" strokeWidth="5"/>
                          <circle cx="24" cy="24" r="19" fill="none" strokeWidth="5"
                            stroke={mc} strokeDasharray={`${(p.moisture/100)*119.4} 119.4`} strokeLinecap="round"/>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[9px] font-bold text-slate-700">{Math.round(p.moisture)}%</span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[
                          {l:"Moisture", v:p.moisture, max:100, c:mc},
                          {l:"Health",   v:p.health,   max:100, c:hc},
                          {l:"Temp",     v:p.temp,     max:45,  c:"#F59E0B"},
                        ].map(s=>(
                          <div key={s.l} className="flex items-center gap-1.5">
                            <span className="text-[9px] text-slate-400 w-12 shrink-0">{s.l}</span>
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-700"
                                style={{width:`${(s.v/s.max)*100}%`,background:s.c}}/>
                            </div>
                            <span className="text-[9px] font-mono text-slate-600 w-7 text-right">{s.v}{s.l==="Temp"?"°":"%"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Badges + AUTO button row */}
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-50 flex-wrap">
                      <span className={`badge text-[9px] ${getMoistureLabel(p.moisture)==="Optimal"||getMoistureLabel(p.moisture)==="Good"?"badge-green":"badge-amber"}`}>
                        {getMoistureLabel(p.moisture)}
                      </span>
                      <span className={`badge text-[9px] ${p.health>80?"badge-green":p.health>60?"badge-amber":"badge-red"}`}>
                        {p.health>80?"Good":p.health>60?"Fair":"Critical"}
                      </span>
                      {/* AUTO IRRIGATE TOGGLE — visible and working */}
                      <button
                        onClick={e => handleAutoIrr(p.id, e)}
                        className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border-2 transition-all ${
                          p.autoIrr
                            ? "bg-brand-500 text-white border-brand-500 shadow-sm"
                            : "bg-white text-slate-500 border-slate-300 hover:border-brand-400 hover:text-brand-600"
                        }`}>
                        <Droplets className="w-3 h-3"/>
                        AUTO {p.autoIrr?"ON":"OFF"}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
              <button onClick={()=>setShowAdd(true)}
                className="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-dashed border-slate-300 text-slate-500 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl text-sm font-semibold transition-all">
                <Plus className="w-4 h-4"/> Add New Plot
              </button>
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-8 space-y-4">
            {selPlot ? (
              <>
                <Card hover={false}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{selPlot.name}</h2>
                      <p className="text-slate-500 text-sm">{selPlot.crop} · {selPlot.size}ac · {selPlot.area} · {selPlot.phase}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <button onClick={()=>irrigate(selPlot.id)} className="btn btn-primary text-sm px-4 py-2"
                        style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                        <Droplets className="w-4 h-4"/> Irrigate
                      </button>
                      <Link href="/land" className="btn btn-outline text-sm px-4 py-2 flex items-center gap-1.5">
                        <Map className="w-4 h-4"/> Land View
                      </Link>
                      <button onClick={()=>deletePlot(selPlot.id)} className="btn text-sm px-3 py-2 text-rose-500 hover:bg-rose-50 border border-rose-100 rounded-xl">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  </div>

                  {/* Metrics grid — no overflow */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {[
                      {l:"Moisture",     v:`${Math.round(selPlot.moisture)}%`,  c:getMoistureColor(selPlot.moisture)},
                      {l:"Health",       v:`${selPlot.health}%`,               c:getHealthColor(selPlot.health)},
                      {l:"Temperature",  v:`${selPlot.temp}°C`,                c:"#F59E0B"},
                      {l:"Soil pH",      v:selPlot.ph.toFixed(1),              c:"#10B981"},
                      {l:"Nitrogen",     v:`${selPlot.npk.n}`,                 c:"#3B82F6"},
                      {l:"Phosphorus",   v:`${selPlot.npk.p}`,                 c:"#8B5CF6"},
                      {l:"Potassium",    v:`${selPlot.npk.k}`,                 c:"#F59E0B"},
                      {l:"Season %",     v:`${COMPLETIONS[selPlot.id]?.toFixed(1)}%`, c:"#10B981"},
                    ].map(s=>(
                      <div key={s.l} className="bg-slate-50 rounded-xl p-3 border-2 border-slate-100">
                        <div className="text-[10px] text-slate-400 mb-1 font-semibold uppercase tracking-wide truncate">{s.l}</div>
                        <div className="text-lg font-bold truncate" style={{color:s.c}}>{s.v}</div>
                      </div>
                    ))}
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={()=>{ toggleAutoIrr(selPlot.id); pushNotif({title:`💧 Auto-Irrigate ${!selPlot.autoIrr?"ON":"OFF"}`,body:`${selPlot.name} auto-irrigation ${!selPlot.autoIrr?"enabled":"disabled"}.`,type:"info",time:"just now"}); }}
                      className={`btn text-sm px-4 py-2 ${selPlot.autoIrr?"btn-primary":"btn-outline"}`}
                      style={selPlot.autoIrr?{background:"linear-gradient(135deg,#059669,#10B981)"}:{}}>
                      <Droplets className="w-4 h-4"/> Auto-Irrigate: <strong>{selPlot.autoIrr?"ON":"OFF"}</strong>
                    </button>
                    <button onClick={()=>{setNpk(selPlot.npk);setEditNPK(!editNPK);}}
                      className="btn btn-outline text-sm px-4 py-2">
                      <Leaf className="w-4 h-4"/>
                      <ChevronDown className={`w-3 h-3 transition-transform ${editNPK?"rotate-180":""}`}/> Update NPK
                    </button>
                  </div>

                  <AnimatePresence>
                    {editNPK && (
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>
                        <div className="pt-4 mt-3 border-t border-slate-100">
                          <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">NPK (kg/ha)</p>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            {[{l:"N",k:"n",c:"#3B82F6"},{l:"P",k:"p",c:"#8B5CF6"},{l:"K",k:"k",c:"#F59E0B"}].map(f=>(
                              <div key={f.k}>
                                <label className="text-xs font-bold block mb-1" style={{color:f.c}}>Nitrogen (N)</label>
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
                    <ResponsiveContainer width="100%" height={150}>
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
                    <h3 className="font-bold text-slate-800 mb-3">Farm Radar</h3>
                    <ResponsiveContainer width="100%" height={150}>
                      <RadarChart data={radarData.slice(0,6)}>
                        <PolarGrid stroke="#E2E8F0"/>
                        <PolarAngleAxis dataKey="id" tick={{fill:"#94A3B8",fontSize:10}}/>
                        <Radar name="Moisture" dataKey="moisture" stroke="#10B981" fill="#10B981" fillOpacity={0.15} strokeWidth={2}/>
                      </RadarChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                {/* Advisories */}
                <Card hover={false}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">Pest & Soil Advisory</h3>
                    <span className={`badge ${RISK_BADGE[selPlot.pestRisk]}`}><Bug className="w-3 h-3"/> {selPlot.pestRisk} risk</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      {title:"Irrigation",body:selPlot.moisture>70?"Moisture optimal — skip next cycle.":"Moisture low — irrigate within 24h.",icon:"💧",bg:"#ECFDF5",border:"#A7F3D0"},
                      {title:"Pest Watch",body:selPlot.pestRisk==="high"?"ALERT: Apply chlorpyrifos immediately.":selPlot.pestRisk==="medium"?"Apply neem spray preventively.":"Low risk. Standard monitoring.",icon:"🦗",bg:selPlot.pestRisk==="high"?"#FFF1F2":"#ECFDF5",border:selPlot.pestRisk==="high"?"#FECDD3":"#A7F3D0"},
                      {title:"Fertilizer",body:`NPK ${selPlot.npk.n}/${selPlot.npk.p}/${selPlot.npk.k} kg/ha. ${selPlot.npk.n<100?"Nitrogen low — apply urea.":"Levels adequate."}`,icon:"🌱",bg:"#EFF6FF",border:"#BFDBFE"},
                      {title:"Soil pH",body:`pH ${selPlot.ph.toFixed(1)} — ${selPlot.ph<6?"Acidic: add lime.":selPlot.ph>7.5?"Alkaline: add sulfur.":"Optimal range."}`,icon:"🧪",bg:"#F5F3FF",border:"#DDD6FE"},
                    ].map((a,i)=>(
                      <div key={i} className="rounded-xl p-4" style={{background:a.bg,border:`1.5px solid ${a.border}`}}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-lg">{a.icon}</span>
                          <span className="font-semibold text-slate-800 text-sm">{a.title}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{a.body}</p>
                      </div>
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

      {/* ADD NEW PLOT MODAL */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false);}}>
            <motion.div initial={{scale:0.92,opacity:0,y:24}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.92,opacity:0,y:24}}
              transition={{type:"spring",damping:24,stiffness:280}} className="modal-card">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Add New Plot</h2>
                  <p className="text-sm text-slate-400 mt-0.5">Will appear in Dashboard + Land View instantly</p>
                </div>
                <button onClick={()=>setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <div className="modal-grid mb-4">
                {[
                  {l:"PLOT ID",   k:"id",   ph:"G",           t:"text"},
                  {l:"PLOT NAME", k:"name", ph:"New Plot",     t:"text"},
                  {l:"CROP",      k:"crop", ph:"Wheat",        t:"text"},
                  {l:"AREA (AC)", k:"size", ph:"2",            t:"number"},
                ].map(f=>(
                  <div key={f.k}>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">{f.l}</label>
                    <input type={f.t} placeholder={f.ph} value={(newPlot as any)[f.k]}
                      onChange={e=>setNewPlot(p=>({...p,[f.k]:f.t==="number"?+e.target.value:e.target.value}))}
                      style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                  </div>
                ))}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">PHASE</label>
                  <select value={newPlot.phase} onChange={e=>setNewPlot(p=>({...p,phase:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                    {["Sowing","Germination","Tillering","Vegetative","Flowering","Pod Fill","Boll Formation","Silking","Panicle Init.","Bulb Dev.","Maturity","Harvesting"].map(ph=>(
                      <option key={ph} value={ph}>{ph}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">PEST RISK</label>
                  <select value={newPlot.pestRisk} onChange={e=>setNewPlot(p=>({...p,pestRisk:e.target.value as any}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">SOIL pH</label>
                  <input type="number" step="0.1" min="4" max="9" value={newPlot.ph}
                    onChange={e=>setNewPlot(p=>({...p,ph:+e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">AREA NAME</label>
                  <input placeholder="e.g. North Block" value={newPlot.area}
                    onChange={e=>setNewPlot(p=>({...p,area:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
              </div>
              <div className="mb-5 p-4 rounded-xl" style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0"}}>
                <p className="text-xs font-bold text-brand-700 mb-3 uppercase tracking-wider">Initial Sensor Readings</p>
                <div className="grid grid-cols-3 gap-3">
                  {[{l:"Moisture %",k:"moisture",c:"accent-green-500",min:10,max:95},{l:"Health %",k:"health",c:"accent-green-500",min:20,max:100},{l:"Temp °C",k:"temp",c:"accent-amber-500",min:15,max:45}].map(f=>(
                    <div key={f.k}>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">{f.l}</label>
                      <input type="range" min={f.min} max={f.max} value={(newPlot as any)[f.k]}
                        onChange={e=>setNewPlot(p=>({...p,[f.k]:+e.target.value}))}
                        className={`w-full ${f.c}`}/>
                      <span className="text-xs font-bold text-brand-700">{(newPlot as any)[f.k]}{f.k==="temp"?"°C":"%"}</span>
                    </div>
                  ))}
                </div>
              </div>
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
