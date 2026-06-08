"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wind, Droplets, Eye, Gauge, Thermometer, Info, Printer } from "lucide-react";
import Card from "@/components/Card";
import { FORECAST, HOURLY } from "@/lib/utils";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TT = { contentStyle:{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",fontFamily:"DM Sans",fontSize:"12px"} };

const ADVISORY = [
  { icon:"💧", title:"Irrigation Advisory",  sev:"info",    msg:"Rain expected Wed–Thu. Skip irrigation for North Field and West Block on Tuesday. Save approx ₹800 in water costs." },
  { icon:"⚗️", title:"Fertilizer Timing",    sev:"warning", msg:"Do NOT apply DAP until after the rain cycle (Thu). Apply Friday–Saturday morning for best soil uptake and absorption." },
  { icon:"🐛", title:"Post-Rain Pest Risk",  sev:"danger",  msg:"High armyworm activity expected after rains. Inspect South Field on Friday morning. Keep chlorpyrifos ready." },
  { icon:"🌾", title:"Harvest Opportunity",  sev:"success", msg:"Dry window Fri–Sun is ideal for soybean harvest. Schedule combine now — forecast shows 0% rain probability those days." },
];

const sevStyle = {
  info:    { bg:"#EFF6FF", border:"#BFDBFE", title:"#1E40AF", icon:"#60A5FA" },
  warning: { bg:"#FFFBEB", border:"#FDE68A", title:"#92400E", icon:"#F59E0B" },
  danger:  { bg:"#FFF1F2", border:"#FECDD3", title:"#9F1239", icon:"#FB7185" },
  success: { bg:"#ECFDF5", border:"#A7F3D0", title:"#065F46", icon:"#10B981" },
};

export default function Weather() {
  const [unit, setUnit] = useState<"C"|"F">("C");
  const conv = (t:number) => unit==="C" ? t : Math.round(t*9/5+32);
  const now = HOURLY[new Date().getHours()];

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#EFF6FF 0%,#F0FDF4 50%,#FFFBEB 100%)"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-10">
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Weather <span className="grad-text">Intelligence</span></h1>
            <p className="text-slate-400 text-sm">Hyper-local farm forecasts · Telangana, India · Updated every 30 min</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-white/10 border border-white/20 rounded-xl p-1">
              {(["C","F"] as const).map(u => (
                <button key={u} onClick={()=>setUnit(u)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${unit===u?"bg-white text-brand-700":"text-white/70 hover:text-white"}`}>
                  °{u}
                </button>
              ))}
            </div>
            <button onClick={()=>window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
              style={{background:"rgba(255,255,255,0.1)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
              <Printer className="w-4 h-4"/> Print Report
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Hint */}
        <div className="hint-banner mb-6">
          <Info className="w-4 h-4 flex-shrink-0"/>
          <span><strong>Tip:</strong> The Farm Advisory cards below are auto-generated from the 7-day forecast. Check these before any <strong>irrigation, spraying, or fertilizer</strong> application to save costs and avoid waste.</span>
        </div>

        {/* Current + today */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <motion.div className="md:col-span-2" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <Card hover={false} className="p-8 h-full" style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",border:"none"}}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="dot-live" style={{background:"#A7F3D0"}}/>
                    <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">Live · Farm Location</span>
                  </div>
                  <p className="text-slate-300 text-sm">Telangana, India · {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</p>
                </div>
                <span className="text-5xl">{FORECAST[0].icon}</span>
              </div>
              <div className="flex items-end gap-5 mb-6">
                <div>
                  <div className="text-7xl font-bold text-white leading-none">{conv(now.t)}°{unit}</div>
                  <div className="text-slate-400 mt-2 text-base">{FORECAST[0].desc}</div>
                </div>
                <div className="pb-2 space-y-1">
                  <div className="text-green-300 text-sm font-semibold">H: {conv(FORECAST[0].hi)}° / L: {conv(FORECAST[0].lo)}°</div>
                  <div className="text-slate-400 text-sm">Rain: {FORECAST[0].rain}%</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { Icon:Wind,        l:"Wind",     v:`${FORECAST[0].wind} km/h` },
                  { Icon:Droplets,    l:"Humidity", v:`${FORECAST[0].hum}%` },
                  { Icon:Eye,         l:"Visibility",v:"8.5 km" },
                  { Icon:Gauge,       l:"Pressure", v:"1012 hPa" },
                ].map(s=>(
                  <div key={s.l} className="text-center">
                    <s.Icon className="w-4 h-4 text-slate-400 mx-auto mb-1"/>
                    <div className="text-white font-semibold text-sm">{s.v}</div>
                    <div className="text-slate-500 text-xs">{s.l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <Card hover={false} className="h-full p-6">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">7-DAY FORECAST</h3>
              <div className="space-y-3">
                {FORECAST.map((f,i)=>(
                  <div key={f.day} className={`flex items-center justify-between py-2 ${i<FORECAST.length-1?"border-b border-slate-50":""}`}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{f.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{f.day}</div>
                        {f.rain>0 && <div className="text-xs text-sky-500">{f.rain}% rain</div>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{conv(f.hi)}°</div>
                      <div className="text-xs text-slate-400">{conv(f.lo)}°</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Advisory cards */}
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          📋 Farm Advisory This Week
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {ADVISORY.map((a,i)=>{
            const s = sevStyle[a.sev as keyof typeof sevStyle];
            return (
              <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}
                className="rounded-2xl p-5 flex gap-4"
                style={{background:s.bg, border:`1.5px solid ${s.border}`, boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
                <span className="text-2xl mt-0.5">{a.icon}</span>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{color:s.title}}>{a.title}</h4>
                  <p className="text-sm leading-relaxed" style={{color:s.title,opacity:0.85}}>{a.msg}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <Card hover={false}>
            <h3 className="font-bold text-slate-800 mb-1">Rainfall This Week (mm)</h3>
            <p className="text-xs text-slate-400 mb-4">Estimated precipitation by day</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={FORECAST} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="day" tick={{fill:"#94A3B8",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#94A3B8",fontSize:11}} axisLine={false} tickLine={false} unit="%"/>
                <Tooltip {...TT} formatter={(v:any)=>[`${v}%`,"Rain probability"]}/>
                <Bar dataKey="rain" name="Rain %" fill="#38BDF8" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card hover={false}>
            <h3 className="font-bold text-slate-800 mb-1">Temperature (°C)</h3>
            <p className="text-xs text-slate-400 mb-4">Daily high/low forecast range</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={FORECAST.map(f=>({...f,hi:conv(f.hi),lo:conv(f.lo)}))}>
                <defs>
                  <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="day" tick={{fill:"#94A3B8",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#94A3B8",fontSize:11}} axisLine={false} tickLine={false} unit="°"/>
                <Tooltip {...TT} formatter={(v:any,n:any)=>[`${v}°${unit}`, n==="hi"?"High":"Low"]}/>
                <Area type="monotone" dataKey="hi" stroke="#F59E0B" fill="url(#tg)" strokeWidth={2.5} name="hi"/>
                <Area type="monotone" dataKey="lo" stroke="#86EFAC" fill="none"        strokeWidth={2}   name="lo" strokeDasharray="4 4"/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Hourly */}
        <Card hover={false}>
          <h3 className="font-bold text-slate-800 mb-1">Hourly Temperature Today</h3>
          <p className="text-xs text-slate-400 mb-4">24-hour temperature profile for your farm location</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={HOURLY}>
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
              <XAxis dataKey="h" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}
                interval={2} tickFormatter={v=>v.split(":")[0]}/>
              <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false} unit="°" width={30}/>
              <Tooltip {...TT} formatter={(v:any)=>[`${v}°C`,"Temperature"]}/>
              <Area type="monotone" dataKey="t" stroke="#10B981" fill="url(#hg)" strokeWidth={2.5} name="Temp °C"/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
