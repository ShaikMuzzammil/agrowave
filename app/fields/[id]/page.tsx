"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Activity, Map, History, Droplets, Thermometer, Bug, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { getHealthColor, getMoistureColor } from "@/lib/utils";

const PLOT_GEOJSON: Record<string,any> = {
  A:{ name:"North Field",   crop:"Wheat",   size:4.5, health:94, moisture:72, temp:32, ph:6.8, pestRisk:"low",    npk:{n:142,p:46,k:180}, phase:"Tillering",      acres:"4.5 ac / 1.82 ha", status:"Open",    centroid:[17.3850,78.4867] },
  B:{ name:"East Block",    crop:"Rice",    size:3.2, health:78, moisture:48, temp:34, ph:6.2, pestRisk:"medium", npk:{n:118,p:38,k:165}, phase:"Panicle Init.",  acres:"3.2 ac / 1.29 ha", status:"Warning", centroid:[17.3855,78.4872] },
  C:{ name:"South Field",   crop:"Cotton",  size:5.0, health:45, moisture:24, temp:37, ph:7.1, pestRisk:"high",   npk:{n:95,p:52,k:140},  phase:"Boll Formation", acres:"5.0 ac / 2.02 ha", status:"Warning", centroid:[17.3845,78.4878] },
  D:{ name:"West Block",    crop:"Soybean", size:3.8, health:88, moisture:68, temp:31, ph:6.5, pestRisk:"low",    npk:{n:155,p:48,k:195}, phase:"Pod Fill",       acres:"3.8 ac / 1.54 ha", status:"Open",    centroid:[17.3840,78.4860] },
  E:{ name:"Central Plot",  crop:"Maize",   size:4.0, health:82, moisture:56, temp:33, ph:6.9, pestRisk:"low",    npk:{n:133,p:42,k:175}, phase:"Silking",        acres:"4.0 ac / 1.62 ha", status:"Open",    centroid:[17.3850,78.4870] },
  F:{ name:"Border Strip",  crop:"Onion",   size:2.5, health:91, moisture:62, temp:30, ph:6.4, pestRisk:"low",    npk:{n:148,p:55,k:198}, phase:"Bulb Dev.",      acres:"2.5 ac / 1.01 ha", status:"Open",    centroid:[17.3860,78.4880] },
};

const HISTORY = [
  { date:"Jun 5", action:"Irrigated — moisture +18%", by:"Auto-Irrigate" },
  { date:"Jun 3", action:"NPK updated: N142/P46/K180", by:"Manual Entry" },
  { date:"Jun 1", action:"Pest inspection — Low risk confirmed", by:"Field Check" },
  { date:"May 28", action:"Fertilizer applied: DAP 50kg/acre", by:"Manual Entry" },
  { date:"May 24", action:"Plot created and calibrated", by:"System" },
];

const TABS_DEF = ["← Back to Fields","Overview","Health","Boundaries","History"] as const;

export default function ParcelDetail() {
  const { id } = useParams<{id:string}>();
  const [tab, setTab] = useState<typeof TABS_DEF[number]>("Overview");
  const plot = PLOT_GEOJSON[id as string] || PLOT_GEOJSON.A;
  const mc = getMoistureColor(plot.moisture);
  const hc = getHealthColor(plot.health);

  const handleBack = () => {
    if (window.opener) window.close();
    else window.location.href = "/land";
  };

  return (
    <div className="min-h-screen" style={{background:"#F0FDF4"}}>
      {/* Tab bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-0 overflow-x-auto">
          {TABS_DEF.map(t=>(
            <button key={t} onClick={()=>{ if(t==="← Back to Fields") handleBack(); else setTab(t); }}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                t===tab && t!=="← Back to Fields"
                  ? "border-brand-500 text-brand-700 bg-brand-50"
                  : t==="← Back to Fields"
                  ? "border-transparent text-slate-500 hover:text-brand-600 hover:bg-brand-50"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              {t==="← Back to Fields" && <ArrowLeft className="w-4 h-4"/>}
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{plot.name}</h1>
              <p className="text-slate-500 mt-1">{plot.crop} · {plot.phase} · {plot.acres}</p>
            </div>
            <span className={`badge text-sm px-4 py-1.5 ${plot.status==="Open"?"badge-green":"badge-amber"}`}>{plot.status}</span>
          </div>
        </motion.div>

        {tab === "Overview" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                {l:"Moisture",   v:`${plot.moisture}%`,     c:mc},
                {l:"Health",     v:`${plot.health}%`,       c:hc},
                {l:"Temperature",v:`${plot.temp}°C`,        c:"#F59E0B"},
                {l:"Soil pH",    v:plot.ph.toFixed(1),      c:"#10B981"},
                {l:"Nitrogen",   v:`${plot.npk.n} kg/ha`,  c:"#3B82F6"},
                {l:"Phosphorus", v:`${plot.npk.p} kg/ha`,  c:"#8B5CF6"},
                {l:"Potassium",  v:`${plot.npk.k} kg/ha`,  c:"#F59E0B"},
                {l:"Pest Risk",  v:plot.pestRisk.toUpperCase(), c:plot.pestRisk==="high"?"#F43F5E":plot.pestRisk==="medium"?"#F59E0B":"#10B981"},
              ].map(s=>(
                <div key={s.l} className="card p-4 text-center border-2 border-slate-100">
                  <div className="text-2xl font-bold mb-1" style={{color:s.c}}>{s.v}</div>
                  <div className="text-xs text-slate-400 font-semibold">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3">Location Data</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-slate-400">Coordinates</span><div className="font-mono text-sm text-slate-700 mt-1">{plot.centroid[0].toFixed(4)}° N, {plot.centroid[1].toFixed(4)}° E</div></div>
                <div><span className="text-xs text-slate-400">Area</span><div className="font-semibold text-slate-800 mt-1">{plot.acres}</div></div>
                <div><span className="text-xs text-slate-400">Season</span><div className="font-semibold text-slate-800 mt-1">KHARIF 2026</div></div>
                <div><span className="text-xs text-slate-400">Last Irrigated</span><div className="font-semibold text-slate-800 mt-1">2 hours ago</div></div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === "Health" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="card p-6 mb-4">
              <h3 className="font-bold text-slate-800 mb-4">Health Status</h3>
              <div className="space-y-4">
                {[
                  {l:"Overall Health",  v:plot.health,   max:100, c:hc},
                  {l:"Soil Moisture",   v:plot.moisture, max:100, c:mc},
                  {l:"Nitrogen Level",  v:plot.npk.n,    max:200, c:"#3B82F6"},
                  {l:"Phosphorus",      v:plot.npk.p,    max:100, c:"#8B5CF6"},
                  {l:"Potassium",       v:plot.npk.k,    max:200, c:"#F59E0B"},
                ].map(s=>(
                  <div key={s.l}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-700">{s.l}</span>
                      <span className="text-sm font-bold" style={{color:s.c}}>{s.v}{s.l==="Overall Health"||s.l==="Soil Moisture"?"%":""}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div initial={{width:0}} animate={{width:`${(s.v/s.max)*100}%`}} transition={{duration:0.8}}
                        className="h-full rounded-full" style={{background:s.c}}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3">Pest Advisory</h3>
              <div className={`p-4 rounded-xl border-2 ${plot.pestRisk==="high"?"bg-rose-50 border-rose-200":plot.pestRisk==="medium"?"bg-amber-50 border-amber-200":"bg-brand-50 border-brand-200"}`}>
                <p className="font-semibold text-sm capitalize">{plot.pestRisk} risk detected</p>
                <p className="text-xs text-slate-600 mt-1">
                  {plot.pestRisk==="high"?"Immediate inspection required. Apply chlorpyrifos 20% EC.":plot.pestRisk==="medium"?"Apply neem-based preventive spray. Monitor closely.":"Low risk. Continue standard monitoring schedule."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {tab === "Boundaries" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="card p-6 mb-4">
              <h3 className="font-bold text-slate-800 mb-4">Parcel Boundary Stats</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-brand-50 border border-brand-100">
                  <div className="text-2xl font-bold text-brand-700">{plot.size} ac</div>
                  <div className="text-xs text-slate-400">Total Area (acres)</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-sky-50 border border-sky-100">
                  <div className="text-2xl font-bold text-sky-700">{(plot.size*0.4047).toFixed(2)} ha</div>
                  <div className="text-xs text-slate-400">Total Area (hectares)</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="text-2xl font-bold text-amber-700">{(plot.size*4047).toFixed(0)} m²</div>
                  <div className="text-xs text-slate-400">Total Area (sq meters)</div>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                This parcel has irregular polygon boundaries computed via Turf.js geometry. 
                For full border editing tools — add vertices, split parcels, merge adjacent plots —
                use the Land View on desktop with the editing toolbar.
              </p>
            </div>
            <div className="card p-4 text-center py-10" style={{background:"linear-gradient(135deg,#F0FDF4,#F8FAFC)"}}>
              <Map className="w-10 h-10 text-brand-400 mx-auto mb-3"/>
              <p className="font-semibold text-slate-700">Open Land View for full boundary editing</p>
              <button onClick={handleBack} className="btn btn-primary mt-3 px-6 py-2" style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                ← Open Land View
              </button>
            </div>
          </motion.div>
        )}

        {tab === "History" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="card p-6">
              <h3 className="font-bold text-slate-800 mb-4">Edit & Activity Log</h3>
              <div className="space-y-3">
                {HISTORY.map((h,i)=>(
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                      <History className="w-4 h-4 text-brand-600"/>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800 text-sm">{h.action}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{h.by} · {h.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
