"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wind, Droplets, Eye, Gauge, Printer, Sun, Thermometer, Umbrella, Info } from "lucide-react";
import Card from "@/components/Card";
import { FORECAST, HOURLY } from "@/lib/utils";

const ADVISORY = [
  { icon:"💧", title:"Irrigation Advisory",  sev:"info",    msg:"Rain expected Wed–Thu. Skip irrigation for North Field and West Block on Tuesday. Save approx ₹800 in water costs." },
  { icon:"⚗️", title:"Fertilizer Timing",    sev:"warning", msg:"Do NOT apply DAP until after the rain cycle (Thu). Apply Friday–Saturday morning for best soil uptake and absorption." },
  { icon:"🐛", title:"Post-Rain Pest Risk",  sev:"danger",  msg:"High armyworm activity expected after rains. Inspect South Field on Friday morning. Keep chlorpyrifos ready." },
  { icon:"🌾", title:"Harvest Opportunity",  sev:"success", msg:"Dry window Fri–Sun is ideal for soybean harvest. Schedule combine now — forecast shows 0% rain probability those days." },
];
const sevStyle = {
  info:    { bg:"#EFF6FF", border:"#BFDBFE", title:"#1E40AF" },
  warning: { bg:"#FFFBEB", border:"#FDE68A", title:"#92400E" },
  danger:  { bg:"#FFF1F2", border:"#FECDD3", title:"#9F1239" },
  success: { bg:"#ECFDF5", border:"#A7F3D0", title:"#065F46" },
};

const UV_LABEL: Record<number,string> = {0:"Low",1:"Low",2:"Low",3:"Moderate",4:"Moderate",5:"Moderate",6:"High",7:"High",8:"Very High",9:"Very High",10:"Extreme",11:"Extreme"};

export default function Weather() {
  const [unit, setUnit] = useState<"C"|"F">("C");
  const c = (t:number) => unit==="C" ? t : Math.round(t*9/5+32);
  const today = FORECAST[0];
  const uvIndex = 8;

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#EFF6FF 0%,#F0FDF4 60%,#F8FAFC 100%)"}}>
      {/* Compact header row */}
      <div className="container pt-6 pb-0">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Weather <span className="grad-text">Intelligence</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Hyper-local farm forecasts · Telangana, India · Updated every 30 min
            </p>
          </div>
          <div className="flex items-center gap-3 no-print">
            <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              {(["C","F"] as const).map(u => (
                <button key={u} onClick={()=>setUnit(u)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${unit===u?"bg-brand-600 text-white shadow":"text-slate-500 hover:text-slate-700"}`}>
                  °{u}
                </button>
              ))}
            </div>
            <button onClick={()=>window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700 transition-all shadow-sm">
              <Printer className="w-4 h-4"/> Print
            </button>
          </div>
        </div>

        {/* Hint */}
        <div className="hint-banner mb-5">
          <Info className="w-4 h-4 flex-shrink-0"/>
          <span><strong>Tip:</strong> Farm advisories below are auto-generated from the 7-day forecast. Always check before irrigation, spraying, or fertilizer application.</span>
        </div>
      </div>

      <div className="container pb-10">
        {/* TOP ROW: Current conditions + Today at a glance */}
        <div className="grid md:grid-cols-5 gap-4 mb-5">
          {/* Current conditions — left 3 cols */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="md:col-span-3">
            <div className="rounded-2xl p-6 h-full"
              style={{background:"linear-gradient(135deg,#F0FDF4,#ECFDF5)",border:"1.5px solid #A7F3D0",boxShadow:"0 4px 24px rgba(16,185,129,0.08)"}}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Current Conditions · Farm Location</p>
              <div className="flex items-start gap-6 mb-6">
                <div>
                  <div className="text-8xl font-bold text-slate-900 leading-none">{c(today.lo+3)}°{unit}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3xl">{today.icon}</span>
                    <span className="text-slate-600 font-medium text-lg">{today.desc}</span>
                  </div>
                </div>
                <div className="text-right ml-auto pt-2">
                  <div className="text-slate-400 text-sm mb-1">Feels like</div>
                  <div className="text-4xl font-bold text-slate-700">{c(today.lo+6)}°{unit}</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  {Icon:Droplets,   l:"Humidity",  v:`${today.hum}%`},
                  {Icon:Wind,       l:"Wind",       v:`${today.wind} km/h`},
                  {Icon:Eye,        l:"Visibility", v:"8 km"},
                  {Icon:Gauge,      l:"Pressure",   v:"1012 hPa"},
                ].map(s=>(
                  <div key={s.l} className="text-center bg-white/60 rounded-xl p-3 border border-white">
                    <s.Icon className="w-4 h-4 text-slate-400 mx-auto mb-1.5"/>
                    <div className="text-xs text-slate-400 mb-0.5">{s.l}</div>
                    <div className="font-bold text-slate-800 text-sm">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Today at a glance — right 2 cols */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.08}} className="md:col-span-2">
            <div className="rounded-2xl p-6 h-full bg-white border border-slate-100"
              style={{boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Today at a Glance</p>

              {/* Temp range bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-600 font-medium text-sm">{c(today.lo)}° Low</span>
                  <span className="text-slate-800 font-bold text-sm">{c(today.hi)}° High</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden"
                  style={{background:"linear-gradient(90deg,#3B82F6,#10B981,#F59E0B,#F43F5E)"}}>
                </div>
              </div>

              {/* Rain probability */}
              <div className="p-4 rounded-xl mb-3"
                style={{background:today.rain>40?"#EFF6FF":"#F0FDF4",border:`1.5px solid ${today.rain>40?"#BFDBFE":"#A7F3D0"}`}}>
                <div className="flex items-center gap-2 mb-1">
                  <Umbrella className="w-4 h-4 text-sky-500"/>
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Rain Probability</span>
                </div>
                <div className="text-3xl font-bold text-sky-600">{today.rain}%</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {today.rain<20?"Clear for farm activities":today.rain<50?"Light chance of rain":"Rain likely — plan accordingly"}
                </div>
              </div>

              {/* UV Index */}
              <div className="p-4 rounded-xl"
                style={{background:"#FFFBEB",border:"1.5px solid #FDE68A"}}>
                <div className="flex items-center gap-2 mb-1">
                  <Sun className="w-4 h-4 text-amber-500"/>
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wide">UV Index</span>
                </div>
                <div className="text-3xl font-bold text-amber-600">{uvIndex} · {UV_LABEL[uvIndex]}</div>
                <div className="text-xs text-slate-400 mt-0.5">Avoid outdoor work 11am–3pm</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 7-DAY FORECAST as cards — matching image 15 */}
        <div className="mb-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-100" style={{boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
            <h3 className="font-bold text-slate-800 text-lg mb-4">7-Day Forecast</h3>
            <div className="grid grid-cols-7 gap-2">
              {FORECAST.map((f,i)=>(
                <motion.div key={f.day} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${i===0?"border-brand-200 bg-brand-50":"border-slate-100 bg-white hover:border-slate-200"}`}>
                  <div className="text-xs font-bold text-slate-500 mb-2">{f.day}</div>
                  <div className="text-3xl mb-2">{f.icon}</div>
                  <div className="text-xl font-bold text-slate-900">{c(f.hi)}°</div>
                  <div className="text-sm text-slate-400">{c(f.lo)}°</div>
                  {f.rain > 0 ? (
                    <div className="mt-2 text-center">
                      <div className="text-xs font-bold text-sky-600">{f.rain}%</div>
                      <div className="h-1 w-full rounded-full bg-sky-200 overflow-hidden mt-0.5">
                        <div className="h-full bg-sky-500 rounded-full" style={{width:`${f.rain}%`}}/>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-300">0%</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Advisory cards */}
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">📋 Farm Advisory This Week</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-5">
          {ADVISORY.map((a,i)=>{
            const s = sevStyle[a.sev as keyof typeof sevStyle];
            return (
              <motion.div key={i} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.2+i*0.07}}
                className="rounded-2xl p-4 flex gap-3"
                style={{background:s.bg, border:`1.5px solid ${s.border}`}}>
                <span className="text-2xl mt-0.5">{a.icon}</span>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{color:s.title}}>{a.title}</h4>
                  <p className="text-xs leading-relaxed" style={{color:s.title,opacity:0.85}}>{a.msg}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Hourly bar */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
          <h3 className="font-bold text-slate-800 mb-4">Hourly Temperature Today</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {HOURLY.filter((_,i)=>i%2===0).map((h,i)=>(
              <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0 min-w-[52px]">
                <div className="text-xs text-slate-400 font-medium">{h.h.split(":")[0]}</div>
                <div className="relative w-6 flex-1 min-h-[60px] flex items-end justify-center">
                  <div className="w-2.5 rounded-full transition-all"
                    style={{
                      height:`${Math.max(16,((h.t-20)/(42-20))*60)}px`,
                      background:`hsl(${150-(h.t-20)*3},70%,45%)`,
                      minHeight:"8px"
                    }}/>
                </div>
                <div className="text-xs font-bold text-slate-700">{c(h.t)}°</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
