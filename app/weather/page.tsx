"use client";
import { useState } from "react";
import { Cloud, Droplets, Thermometer, Wind, Eye, AlertTriangle, Sun } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { FORECAST, RAINFALL_WEEK } from "@/lib/farmData";

const HOURLY = [
  {h:"6am",temp:26,rain:5,hum:72},{h:"8am",temp:28,rain:8,hum:70},{h:"10am",temp:31,rain:10,hum:65},
  {h:"12pm",temp:34,rain:12,hum:58},{h:"2pm",temp:36,rain:15,hum:52},{h:"4pm",temp:35,rain:10,hum:55},
  {h:"6pm",temp:32,rain:8,hum:62},{h:"8pm",temp:29,rain:5,hum:68},{h:"10pm",temp:27,rain:3,hum:73},
];

const WEATHER_ALERTS = [
  { type:"warning", icon:"⛈️", title:"Heavy Rain Alert – Wednesday", msg:"80% probability of thunderstorms. Secure loose equipment and pause aerial spraying. Auto-irrigation will pause." },
  { type:"info", icon:"💨", title:"Wind Advisory – Thursday", msg:"Wind speeds of 25-35 km/h expected post-rain. Delay pesticide application to avoid drift." },
  { type:"success", icon:"☀️", title:"Ideal Harvest Window – Fri to Sun", msg:"Clear skies and 0% rain forecast Friday through Sunday. Optimal for soybean and onion harvest." },
];

export default function WeatherPage() {
  const [tab, setTab] = useState<"7day"|"hourly">("7day");

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Weather Intelligence</h1>
        <p className="text-sm text-slate-500 mt-0.5">KHARIF 2026 · Hyderabad, Telangana · Updated just now</p>
      </div>

      {/* Current weather hero */}
      <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-6xl">🌤️</span>
              <div>
                <div className="text-5xl font-black">32°C</div>
                <div className="text-sky-200 font-medium">Mostly Sunny</div>
              </div>
            </div>
            <p className="text-sky-100 text-sm">Feels like 35°C · Humidity 62% · Visibility 12 km</p>
            <p className="text-sky-200/70 text-xs mt-1">Today: Low 24°C · High 36°C · Rain: 10%</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Droplets size={18}/>, label:"Humidity", value:"62%", color:"bg-sky-500/30" },
              { icon: <Wind size={18}/>, label:"Wind", value:"14 km/h", color:"bg-sky-500/30" },
              { icon: <Eye size={18}/>, label:"Visibility", value:"12 km", color:"bg-sky-500/30" },
              { icon: <Sun size={18}/>, label:"UV Index", value:"7 High", color:"bg-sky-500/30" },
            ].map(s=>(
              <div key={s.label} className={`${s.color} backdrop-blur rounded-xl p-3`}>
                <div className="flex items-center gap-1.5 text-sky-200 mb-1">{s.icon}<span className="text-xs">{s.label}</span></div>
                <div className="font-bold text-white">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2">
        {(["7day","hourly"] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={`filter-pill ${tab===t?"active":""}`}>
            {t==="7day" ? "7-Day Forecast" : "Hourly Today"}
          </button>
        ))}
      </div>

      {tab==="7day" ? (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Forecast cards */}
          <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {FORECAST.map(f=>(
              <div key={f.day} className="terra-card flex items-center gap-4">
                <span className="text-3xl">{f.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{f.day}</span>
                    <span className="text-sm font-bold text-slate-700">{f.tempMin}°–{f.tempMax}°C</span>
                  </div>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="moisture-bar-track flex-1">
                      <div className="moisture-bar-fill" style={{width:`${f.rainChance}%`,background:"#3b82f6"}} />
                    </div>
                    <span className="text-xs text-blue-600 font-medium w-12 text-right">{f.rainChance}% rain</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 space-y-5">
            <div className="terra-card">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">7-Day Rain Probability (%)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={FORECAST}>
                  <defs>
                    <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
                  <YAxis domain={[0,100]} tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #e2e8f0"}} />
                  <Area type="monotone" dataKey="rainChance" stroke="#3b82f6" strokeWidth={2} fill="url(#rainGrad)" name="Rain %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="terra-card">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Weekly Rainfall Total (mm)</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={RAINFALL_WEEK}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #e2e8f0"}} />
                  <Bar dataKey="mm" fill="#22c55e" radius={[6,6,0,0]} name="mm" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="terra-card">
          <h3 className="font-bold text-slate-900 mb-4">Hourly Forecast – Today</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-3 min-w-max pb-2">
              {HOURLY.map(h=>(
                <div key={h.h} className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-xl border border-slate-100 min-w-[90px]">
                  <span className="text-xs font-semibold text-slate-500">{h.h}</span>
                  <span className="text-2xl">{h.rain>50?"⛈️":h.rain>20?"🌧️":h.rain>8?"🌦️":"🌤️"}</span>
                  <span className="font-black text-slate-900">{h.temp}°C</span>
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Droplets size={10}/>{h.rain}%
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Cloud size={10}/>{h.hum}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      <div>
        <h2 className="section-title mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-500" /> Weather Alerts
        </h2>
        <div className="space-y-3">
          {WEATHER_ALERTS.map(a=>(
            <div key={a.title} className={`flex items-start gap-4 p-4 rounded-xl border ${
              a.type==="warning"?"bg-amber-50 border-amber-200":
              a.type==="info"?"bg-sky-50 border-sky-200":"bg-emerald-50 border-emerald-200"
            }`}>
              <span className="text-2xl">{a.icon}</span>
              <div>
                <h4 className={`font-bold text-sm ${
                  a.type==="warning"?"text-amber-800":a.type==="info"?"text-sky-800":"text-emerald-800"
                }`}>{a.title}</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{a.msg}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
