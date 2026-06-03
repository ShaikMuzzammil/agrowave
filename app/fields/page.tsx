"use client";
import { useState } from "react";
import { Search, Plus, X, Droplets, Thermometer, Activity } from "lucide-react";
import { FARM_PLOTS, FarmPlot } from "@/lib/farmData";

function ProgressRing({ pct, color, size = 64 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2; const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black" style={{ color }}>{Math.round(pct)}%</span>
      </div>
    </div>
  );
}

interface NewPlot {
  plotId: string; plotName: string; crop: string; area: number;
  phase: string; soilPh: number; pestRisk: string; notes: string;
}
const EMPTY: NewPlot = { plotId: "", plotName: "New Plot", crop: "Wheat", area: 2, phase: "Sowing", soilPh: 6.5, pestRisk: "low", notes: "" };

export default function FieldsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewPlot>(EMPTY);
  const [plots, setPlots] = useState<FarmPlot[]>(FARM_PLOTS);
  const [irrigating, setIrrigating] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const filtered = plots.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.crop.toLowerCase().includes(search.toLowerCase())
  );

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.plotId || !form.plotName) return;
    setSubmitted(true);
    setTimeout(() => { setShowModal(false); setSubmitted(false); setForm(EMPTY); }, 1800);
  }

  function handleIrrigate(id: string) {
    setIrrigating(id);
    setTimeout(() => setIrrigating(null), 2500);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Fields</h1>
          <p className="text-sm text-slate-500 mt-0.5">{plots.length} plots · {plots.reduce((s,p)=>s+p.acreage,0)} acres</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-sm">
          <Plus size={15} /> Add New Plot
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="terra-input pl-9" placeholder="Search fields..." value={search}
          onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Field cards grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(plot => {
          const ringColor = plot.status === "OPEN" ? "#22c55e" : plot.status === "WARNING" ? "#f59e0b" : "#94a3b8";
          const mColor = plot.moisture < 30 ? "#ef4444" : plot.moisture < 60 ? "#f59e0b" : "#22c55e";
          return (
            <div key={plot.id} className={`terra-card border-2 transition-all ${
              plot.status === "WARNING" ? "border-amber-200" : "border-slate-200 hover:border-emerald-200"
            }`}>
              <div className="flex items-start gap-4">
                <ProgressRing pct={plot.completionPercent} color={ringColor} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900">{plot.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      plot.status === "OPEN" ? "badge-open" : plot.status === "WARNING" ? "badge-warning" : "badge-closed"
                    }`}>{plot.status}</span>
                  </div>
                  <p className="text-sm text-slate-500">{plot.crop} · {plot.acreage}ac · {plot.stage}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs">
                  <Droplets size={13} className="text-sky-500 shrink-0" />
                  <span className="text-slate-500 w-20">Moisture</span>
                  <div className="flex-1 moisture-bar-track">
                    <div className="moisture-bar-fill" style={{ width:`${plot.moisture}%`, background: mColor }} />
                  </div>
                  <span className="font-bold w-9 text-right" style={{ color: mColor }}>{plot.moisture}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Activity size={13} className="text-blue-500 shrink-0" />
                  <span className="text-slate-500 w-20">Health</span>
                  <div className="flex-1 moisture-bar-track">
                    <div className="moisture-bar-fill" style={{ width:`${plot.health}%`, background:"#3b82f6" }} />
                  </div>
                  <span className="font-bold text-blue-600 w-9 text-right">{plot.health}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Thermometer size={13} className="text-amber-500 shrink-0" />
                  <span className="text-slate-500 w-20">Temp</span>
                  <div className="flex-1 moisture-bar-track">
                    <div className="moisture-bar-fill" style={{ width:`${((plot.temperature-20)/20)*100}%`, background:"#f59e0b" }} />
                  </div>
                  <span className="font-bold text-amber-600 w-9 text-right">{Math.round(plot.temperature)}°C</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    plot.pestLevel==="low pest" ? "bg-emerald-100 text-emerald-700" :
                    plot.pestLevel==="medium pest" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                  }`}>{plot.pestLevel}</span>
                  <span className="text-xs text-slate-400">pH {plot.soilPH}</span>
                  <span className="text-xs text-slate-400">NPK {plot.npk.n}/{plot.npk.p}/{plot.npk.k}</span>
                </div>
                <button onClick={() => handleIrrigate(plot.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    irrigating===plot.id
                      ? "bg-sky-600 text-white" : "bg-sky-50 text-sky-600 hover:bg-sky-100 border border-sky-200"
                  }`}>
                  <Droplets size={11} />
                  {irrigating===plot.id ? "Irrigating…" : "Irrigate"}
                </button>
              </div>

              {/* Precise completion on hover tooltip */}
              <p className="text-[10px] text-slate-300 mt-2 truncate" title={plot.completionPrecise}>
                Completion: {plot.completionPercent.toFixed(6)}% (hover for full precision)
              </p>
            </div>
          );
        })}

        {/* Add plot card */}
        <button id="add-plot" onClick={() => setShowModal(true)}
          className="terra-card border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 flex flex-col items-center justify-center gap-3 min-h-[280px] text-slate-400 hover:text-emerald-600 transition-all">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 hover:bg-emerald-100 flex items-center justify-center transition-colors">
            <Plus size={24} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">Add New Plot</p>
            <p className="text-xs mt-0.5">Click to register a new farm plot</p>
          </div>
        </button>
      </div>

      {/* Add New Plot Modal — centered overlay */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="modal-content">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <Activity size={28} className="text-emerald-600" />
                </div>
                <p className="font-black text-slate-900 text-xl">Plot Added! 🎉</p>
                <p className="text-slate-500 text-sm">Your new plot has been registered.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-slate-900">Add New Plot</h2>
                  <button onClick={() => setShowModal(false)}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                    <X size={16} className="text-slate-600" />
                  </button>
                </div>
                <form onSubmit={handleAdd} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Plot ID *</label>
                      <input className="terra-input" placeholder="e.g. G" maxLength={4}
                        value={form.plotId} onChange={e=>setForm({...form,plotId:e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Plot Name *</label>
                      <input className="terra-input" placeholder="New Plot"
                        value={form.plotName} onChange={e=>setForm({...form,plotName:e.target.value})} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Crop</label>
                      <select className="terra-select w-full" value={form.crop} onChange={e=>setForm({...form,crop:e.target.value})}>
                        {["Wheat","Rice","Maize","Soybean","Cotton","Onion","Tomato","Potato","Sugarcane","Barley"].map(c=>(
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Area (Acres)</label>
                      <input type="number" step="0.1" min="0.1" max="100" className="terra-input"
                        value={form.area} onChange={e=>setForm({...form,area:Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Growth Phase</label>
                      <select className="terra-select w-full" value={form.phase} onChange={e=>setForm({...form,phase:e.target.value})}>
                        {["Sowing","Germination","Tillering","Vegetative","Flowering","Silking","Pod Fill","Boll Formation","Bulb Dev.","Harvest"].map(p=>(
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Soil pH</label>
                      <input type="number" step="0.1" min="4" max="9" className="terra-input"
                        value={form.soilPh} onChange={e=>setForm({...form,soilPh:Number(e.target.value)})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Pest Risk Level</label>
                    <div className="flex gap-2">
                      {["low","medium","high"].map(r=>(
                        <button key={r} type="button"
                          onClick={()=>setForm({...form,pestRisk:r})}
                          className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                            form.pestRisk===r
                              ? r==="low" ? "bg-emerald-600 text-white border-emerald-600"
                                : r==="medium" ? "bg-amber-500 text-white border-amber-500" : "bg-rose-500 text-white border-rose-500"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                          }`}>{r.charAt(0).toUpperCase()+r.slice(1)}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Notes</label>
                    <textarea className="terra-input resize-none" rows={2} placeholder="Additional notes..."
                      value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={()=>setShowModal(false)}
                      className="flex-1 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm">
                      Add Plot
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
