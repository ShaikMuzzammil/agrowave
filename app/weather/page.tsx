"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Wind, Droplets, Eye, Gauge, Sun, Info, Printer } from "lucide-react";
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
  info:    { bg:"#EFF6FF", border:"#BFDBFE", title:"#1E40AF" },
  warning: { bg:"#FFFBEB", border:"#FDE68A", title:"#92400E" },
  danger:  { bg:"#FFF1F2", border:"#FECDD3", title:"#9F1239" },
  success: { bg:"#ECFDF5", border:"#A7F3D0", title:"#065F46" },
};

function UVBar({ uv }: { uv: number }) {
  const pct = (uv / 11) * 100;
  return (
    <div className="h-2.5 w-full rounded-full overflow-hidden" style={{background:"linear-gradient(to right,#22C55E,#84CC16,#EAB308,#F97316,#EF4444)"}}>
      <div className="h-full w-1 rounded-full bg-white shadow" style={{marginLeft:`calc(${Math.min(pct,96)}% - 2px)`}}/>
    </div>
  );
}

export default function Weather() {
  const [unit, setUnit] = useState<"C"|"F">("C");
  const conv = (t:number) => unit==="C" ? t : Math.round(t*9/5+32);
  const now = HOURLY[new Date().getHours()];
  const uvIndex = 8;

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
          <span><strong>Tip:</strong> The Farm Advisory cards are auto-generated from the 7-day forecast. Always check before any <strong>irrigation, spraying, or fertilizer</strong> application to avoid costly mistakes.</span>
        </div>

        {/* Current + Today at a Glance */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {/* Current conditions — dark card */}
          <motion.div className="md:col-span-2" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <Card hover={false} className="p-8 h-full" style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",border:"none"}}>
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-green-300 text-xs font-bold uppercase tracking-widest mb-0.5">Current Conditions · Farm Location</p>
                  <p className="text-slate-400 text-sm">Telangana, India · {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</p>
                </div>
                <span className="text-5xl">{FORECAST[0].icon}</span>
              </div>
              <div className="flex items-end gap-6 mb-6 mt-4">
                <div>
                  <div className="text-7xl font-bold text-white leading-none">{conv(now.t)}°{unit}</div>
                  <div className="text-slate-300 mt-2 text-lg font-medium">{FORECAST[0].desc}</div>
                </div>
                <div className="pb-2 space-y-1">
                  <div className="text-green-300 text-sm font-semibold">
                    Feels like {conv(now.t + 2)}°{unit}
                  </div>
                  <div className="text-slate-400 text-sm">H: {conv(FORECAST[0].hi)}° / L: {conv(FORECAST[0].lo)}°</div>
                  <div className="text-sky-400 text-sm">{FORECAST[0].rain}% rain chance</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-5 border-t border-white/10">
                {[
                  { Icon:Wind,     l:"Wind",      v:`${FORECAST[0].wind} km/h` },
                  { Icon:Droplets, l:"Humidity",  v:`${FORECAST[0].hum}%` },
                  { Icon:Eye,      l:"Visibility",v:"8 km" },
                  { Icon:Gauge,    l:"Pressure",  v:"1012 hPa" },
                ].map(s=>(
                  <div key={s.l} className="text-center">
                    <s.Icon className="w-4 h-4 text-slate-400 mx-auto mb-1.5"/>
                    <div className="text-white font-semibold text-sm">{s.v}</div>
                    <div className="text-slate-500 text-xs mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Today at a Glance */}
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <Card hover={false} className="h-full p-6">
              <h3 className="font-bold text-slate-500 text-xs uppercase tracking-widest mb-5">Today at a Glance</h3>

              {/* Temp range bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                  <span>{conv(FORECAST[0].lo)}° Low</span>
                  <span>{conv(FORECAST[0].hi)}° High</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden"
                  style={{background:"linear-gradient(to right,#93C5FD,#60A5FA,#FCD34D,#FB923C,#EF4444)"}}>
                </div>
              </div>

              {/* Rain probability */}
              <div className="mb-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Rain Probability</p>
                <p className="text-3xl font-bold text-sky-500 mb-0.5">{FORECAST[0].rain}%</p>
                <p className="text-xs text-slate-400">{FORECAST[0].rain < 20 ? "Clear for farm activities" : FORECAST[0].rain < 60 ? "Light rain possible" : "Heavy rain — stay indoors"}</p>
                <div className="h-2 bg-sky-100 rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-sky-400 rounded-full" style={{width:`${FORECAST[0].rain}%`}}/>
                </div>
              </div>

              {/* UV Index */}
              <div className="mb-5">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">UV Index</p>
                <p className="text-2xl font-bold text-orange-500 mb-0.5">{uvIndex} · Very High</p>
                <p className="text-xs text-slate-400">Avoid outdoor work 11am–3pm</p>
                <div className="mt-2">
                  <UVBar uv={uvIndex}/>
                </div>
              </div>

              {/* Sunrise / Sunset */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <div className="text-lg">🌅</div>
                  <div className="text-sm font-bold text-amber-600">05:42</div>
                  <div className="text-[10px] text-slate-400">Sunrise</div>
                </div>
                <div className="text-center">
                  <div className="text-lg">🌇</div>
                  <div className="text-sm font-bold text-orange-500">19:08</div>
                  <div className="text-[10px] text-slate-400">Sunset</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 7-Day Forecast Cards */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-800 mb-4">📅 7-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {FORECAST.map((f,i)=>(
              <motion.div key={f.day} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
                <Card className={`p-4 text-center ${i===0?"border-brand-200 bg-brand-50":""}`} hover>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">{f.day}</p>
                  <span className="text-3xl block mb-2">{f.icon}</span>
                  <div className="text-sm font-bold text-slate-800">{conv(f.hi)}°</div>
                  <div className="text-xs text-slate-400">{conv(f.lo)}°</div>
                  {f.rain > 0 && (
                    <div className="mt-2 text-xs font-semibold text-sky-500">{f.rain}% 💧</div>
                  )}
                  <div className="h-1 bg-sky-100 rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-sky-400 rounded-full" style={{width:`${f.rain}%`}}/>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
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
        <div className="grid md:grid-cols-2 gap-5">
          <Card hover={false}>
            <h3 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
              🌡️ Weekly Temperature (°C)
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={FORECAST.map(f=>({d:f.day,hi:conv(f.hi),lo:conv(f.lo)}))}>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="d" tick={{fill:"#94A3B8",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#94A3B8",fontSize:11}} axisLine={false} tickLine={false} unit={`°${unit}`} width={32}/>
                <Tooltip {...TT}/>
                <Area type="monotone" dataKey="hi" stroke="#F59E0B" fill="url(#tempGrad)" strokeWidth={2.5} name={`High °${unit}`}/>
                <Area type="monotone" dataKey="lo" stroke="#86EFAC" fill="none" strokeWidth={2} strokeDasharray="4 4" name={`Low °${unit}`}/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card hover={false}>
            <h3 className="font-bold text-slate-700 text-sm mb-4 flex items-center gap-2">
              🌧️ Rainfall This Week (mm)
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={FORECAST.map(f=>({d:f.day,rain:f.rain}))} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="d" tick={{fill:"#94A3B8",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#94A3B8",fontSize:11}} axisLine={false} tickLine={false} unit="%" width={32}/>
                <Tooltip {...TT}/>
                <Bar dataKey="rain" fill="#38BDF8" radius={[5,5,0,0]} name="Rain %"/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* 24-hour chart */}
        <Card hover={false} className="mt-5">
          <h3 className="font-bold text-slate-700 text-sm mb-4">🕐 24-Hour Temperature Curve</h3>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={HOURLY}>
              <defs>
                <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
              <XAxis dataKey="h" tick={{fill:"#94A3B8",fontSize:9}} axisLine={false} tickLine={false}
                interval={3} tickFormatter={(v)=>v.split(":")[0]+":00"}/>
              <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false} unit="°" width={28}/>
              <Tooltip {...TT}/>
              <Area type="monotone" dataKey="t" stroke="#10B981" fill="url(#hourGrad)" strokeWidth={2} name="Temp °C" dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
