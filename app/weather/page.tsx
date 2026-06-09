"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wind, Droplets, Eye, Gauge, Thermometer } from "lucide-react";
import Card from "@/components/Card";
import { FORECAST, HOURLY } from "@/lib/utils";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TT = { contentStyle:{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",fontFamily:"DM Sans",fontSize:"12px"} };

const ADVISORY = [
  { icon:"💧", title:"Irrigation Advisory",    sev:"info",    msg:"Rain expected Wed–Thu. Skip irrigation for North Field and West Block on Tuesday. Save approx ₹800 in water costs." },
  { icon:"⚗️", title:"Fertilizer Timing",      sev:"warning", msg:"Do NOT apply DAP until after the rain cycle (Thu). Apply Friday–Saturday morning for best soil uptake and absorption." },
  { icon:"🐛", title:"Post-Rain Pest Risk",    sev:"danger",  msg:"High armyworm activity expected after rains. Inspect South Field on Friday morning. Keep chlorpyrifos ready." },
  { icon:"🌾", title:"Harvest Opportunity",    sev:"success", msg:"Dry window Fri–Sun is ideal for soybean harvest. Schedule combine now — forecast shows 0% rain probability those days." },
];

const sevStyle = {
  info:    "bg-sky-50 border-sky-200 text-sky-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  danger:  "bg-rose-50 border-rose-200 text-rose-800",
  success: "bg-brand-50 border-brand-200 text-brand-800",
};

export default function Weather() {
  const [unit, setUnit] = useState<"C"|"F">("C");
  const conv = (t:number) => unit==="C" ? t : Math.round(t*9/5+32);
  const now = HOURLY[new Date().getHours()];

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#EFF6FF 0%,#F0FDF4 100%)"}}>
      <div className="container py-8">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1">Weather <span className="grad-text">Intelligence</span></h1>
            <p className="text-slate-500 text-sm">Hyper-local farm forecasts · Telangana, India · Updated every 30 min</p>
          </div>
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
            {(["C","F"] as const).map(u => (
              <button key={u} onClick={()=>setUnit(u)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${unit===u?"bg-brand-600 text-white":"text-slate-500 hover:text-slate-700"}`}>
                °{u}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Current + today */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <motion.div className="md:col-span-2" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <Card hover={false} className="p-8" style={{background:"linear-gradient(135deg,#ECFDF5,#EFF6FF)"}}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-xs font-semibold text-slate-400 tracking-wider mb-2">CURRENT CONDITIONS · FARM LOCATION</p>
                  <div className="flex items-end gap-4">
                    <span className="text-7xl font-bold text-slate-900">{conv(now?.t||33)}°{unit}</span>
                    <div className="pb-2">
                      <div className="text-4xl mb-1">{FORECAST[0].icon}</div>
                      <div className="font-semibold text-slate-700 text-lg">{FORECAST[0].desc}</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Feels like</p>
                  <p className="text-2xl font-bold text-slate-700">{conv((now?.t||33)+2)}°{unit}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 border-t border-slate-200/60 pt-5">
                {[
                  {icon:Droplets,    l:"Humidity",   v:`${FORECAST[0].hum}%`},
                  {icon:Wind,        l:"Wind",       v:`${FORECAST[0].wind} km/h`},
                  {icon:Eye,         l:"Visibility", v:"8 km"},
                  {icon:Gauge,       l:"Pressure",   v:"1012 hPa"},
                ].map(s=>(
                  <div key={s.l} className="text-center">
                    <s.icon className="w-5 h-5 text-slate-400 mx-auto mb-1.5"/>
                    <div className="text-xs text-slate-400 mb-0.5">{s.l}</div>
                    <div className="font-bold text-slate-700">{s.v}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <Card hover={false} className="h-full">
              <p className="text-xs font-semibold text-slate-400 mb-4">TODAY AT A GLANCE</p>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
                    <span>{conv(FORECAST[0].lo)}° Low</span>
                    <span>{conv(FORECAST[0].hi)}° High</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{background:"linear-gradient(to right,#93C5FD,#FDE68A,#FCA5A5)"}}>
                    <div className="h-full w-full opacity-80"/>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400 mb-1">Rain Probability</p>
                  <div className="text-4xl font-bold text-sky-600">{FORECAST[0].rain}%</div>
                  <p className="text-xs text-slate-400 mt-1">{FORECAST[0].rain>50?"Rain likely — postpone field work":"Clear for farm activities"}</p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400 mb-1">UV Index</p>
                  <div className="text-2xl font-bold text-amber-500">8 · Very High</div>
                  <p className="text-xs text-slate-400 mt-1">Avoid outdoor work 11am–3pm</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Hourly chart */}
        <Card hover={false} className="mb-6">
          <p className="font-bold text-slate-800 mb-4">24-Hour Temperature & Rainfall</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={HOURLY} margin={{top:5,right:10,left:0,bottom:5}}>
              <defs>
                <linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
              <XAxis dataKey="h" tick={{fill:"#94A3B8",fontSize:9}} axisLine={false} tickLine={false} interval={3}/>
              <YAxis tick={{fill:"#94A3B8",fontSize:9}} axisLine={false} tickLine={false}/>
              <Tooltip {...TT} formatter={(v:any,n)=>[`${Number(v).toFixed(1)}${n==="t"?"°C":" mm"}`,n==="t"?"Temp":"Rain"]}/>
              <Area type="monotone" dataKey="t" stroke="#F59E0B" fill="url(#tg2)" strokeWidth={2.5} name="t"/>
              <Area type="monotone" dataKey="r" stroke="#3B82F6" fill="url(#rg2)" strokeWidth={1.5} name="r"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* 7-day forecast */}
        <Card hover={false} className="mb-6">
          <p className="font-bold text-slate-800 mb-5">7-Day Forecast</p>
          <div className="grid grid-cols-7 gap-2">
            {FORECAST.map((d,i)=>(
              <motion.div key={d.day} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                className={`text-center p-3 rounded-xl border transition-all ${i===0?"border-brand-300 bg-brand-50":"border-slate-100 hover:border-brand-200 hover:bg-brand-50/50"}`}>
                <div className="text-xs font-semibold text-slate-500 mb-2">{d.day}</div>
                <div className="text-2xl mb-2">{d.icon}</div>
                <div className="font-bold text-slate-800 text-sm">{conv(d.hi)}°</div>
                <div className="text-xs text-slate-400 mb-2">{conv(d.lo)}°</div>
                <div className={`text-xs font-semibold ${d.rain>50?"text-sky-600":d.rain>20?"text-amber-500":"text-slate-300"}`}>{d.rain}%</div>
                <div className="mt-1.5 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{width:`${d.rain}%`}}/>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Farm advisory */}
        <div>
          <h2 className="font-bold text-xl text-slate-800 mb-4">📋 Farm Advisory This Week</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {ADVISORY.map((a,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.08}}>
                <div className={`p-4 rounded-xl border ${(sevStyle as any)[a.sev]}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{a.icon}</span>
                    <div>
                      <p className="font-bold text-sm mb-1">{a.title}</p>
                      <p className="text-sm opacity-80 leading-relaxed">{a.msg}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
