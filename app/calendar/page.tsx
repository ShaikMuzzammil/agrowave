"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, CheckCircle2, Circle, Trash2, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";

const TYPE_CFG = {
  irrigation:{ dot:"bg-sky-400",   badge:"bg-sky-100 text-sky-700",   label:"Irrigation" },
  fertilizer:{ dot:"bg-amber-400", badge:"bg-amber-100 text-amber-700",label:"Fertilizer" },
  pesticide: { dot:"bg-rose-400",  badge:"bg-rose-100 text-rose-700",  label:"Pesticide"  },
  harvest:   { dot:"bg-brand-400", badge:"bg-brand-100 text-brand-700",label:"Harvest"    },
  planting:  { dot:"bg-violet-400",badge:"bg-violet-100 text-violet-700",label:"Planting" },
  other:     { dot:"bg-slate-400", badge:"bg-slate-100 text-slate-700", label:"Other"     },
} as const;

const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function FarmCalendar() {
  const { events, addEvent, toggleEvent, deleteEvent, pushNotif } = useStore();
  const [view, setView] = useState(new Date());
  const [selDate, setSelDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:"", type:"irrigation" as keyof typeof TYPE_CFG, plot:"", notes:"" });

  const year=view.getFullYear(), month=view.getMonth();
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const today=new Date().toISOString().split("T")[0];

  const calDays=Array.from({length:42},(_,i)=>{ const d=i-firstDay+1; return d>=1&&d<=daysInMonth?d:null; });

  const dayFmt=(d:number)=>`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const dayEvents=(d:number)=>events.filter(e=>e.date===dayFmt(d));

  const selEvents=events.filter(e=>e.date===selDate).sort((a,b)=>a.done?1:-1);
  const upcoming=events.filter(e=>!e.done&&e.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8);

  const handleAdd=()=>{
    if(!form.title) return;
    addEvent({...form, id:Date.now().toString(), date:selDate, done:false});
    pushNotif({title:"📅 Event Scheduled",body:`${form.title} added for ${new Date(selDate+"T12:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"})}.`,type:"info",time:"just now"});
    setForm({title:"",type:"irrigation",plot:"",notes:""});
    setShowAdd(false);
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#FFFBEB 0%,#F0FDF4 100%)"}}>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-1">Farm <span className="grad-text">Calendar</span></h1>
            <p className="text-slate-500 text-sm">Schedule irrigation, fertilizer, harvests and farm activities</p>
          </div>
          <button onClick={()=>setShowAdd(true)} className="btn btn-primary"><Plus className="w-4 h-4"/> Add Event</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card hover={false}>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={()=>setView(new Date(year,month-1,1))} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"><ChevronLeft className="w-5 h-5"/></button>
                <h2 className="font-bold text-lg text-slate-800">{MONTHS[month]} {year}</h2>
                <button onClick={()=>setView(new Date(year,month+1,1))} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"><ChevronRight className="w-5 h-5"/></button>
              </div>
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d=><div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((day,i)=>{
                  if(!day) return <div key={i}/>;
                  const ds=dayFmt(day);
                  const devs=dayEvents(day);
                  const isToday=ds===today, isSel=ds===selDate;
                  return (
                    <button key={i} onClick={()=>setSelDate(ds)}
                      className={`relative min-h-[56px] p-1.5 rounded-xl text-left transition-all ${isSel?"bg-brand-600 text-white shadow-green":isToday?"bg-brand-50 border border-brand-300":"hover:bg-slate-50 border border-transparent"}`}>
                      <span className={`text-xs font-semibold ${isSel?"text-white":isToday?"text-brand-700":"text-slate-600"}`}>{day}</span>
                      {devs.length>0 && (
                        <div className="mt-1 flex gap-0.5 flex-wrap">
                          {devs.slice(0,3).map((e,j)=>(
                            <div key={j} className={`w-1.5 h-1.5 rounded-full ${TYPE_CFG[e.type]?.dot||"bg-slate-300"} ${e.done?"opacity-30":""} ${isSel?"opacity-80":""}`}/>
                          ))}
                          {devs.length>3 && <span className={`text-[8px] ${isSel?"text-white/70":"text-slate-400"}`}>+{devs.length-3}</span>}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-slate-100">
                {Object.entries(TYPE_CFG).map(([k,v])=>(
                  <span key={k} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className={`w-2.5 h-2.5 rounded-full ${v.dot}`}/>{v.label}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Selected day */}
            <Card hover={false}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-slate-800">{new Date(selDate+"T12:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short"})}</p>
                  <p className="text-xs text-slate-400">{selEvents.length} event{selEvents.length!==1?"s":""} scheduled</p>
                </div>
                <button onClick={()=>setShowAdd(true)} className="p-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 transition-all"><Plus className="w-4 h-4"/></button>
              </div>
              {selEvents.length===0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-2"/>
                  <p className="text-sm text-slate-400">Nothing scheduled</p>
                  <button onClick={()=>setShowAdd(true)} className="text-xs text-brand-600 font-semibold mt-2 hover:underline">+ Add event</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {selEvents.map(ev=>{
                    const cfg=TYPE_CFG[ev.type]||TYPE_CFG.other;
                    return (
                      <div key={ev.id} className={`flex items-start gap-3 p-3 rounded-xl border ${ev.done?"bg-slate-50 border-slate-100":"bg-white border-slate-200"}`}>
                        <button onClick={()=>toggleEvent(ev.id)} className="mt-0.5 flex-shrink-0">
                          {ev.done?<CheckCircle2 className="w-4 h-4 text-brand-500"/>:<Circle className="w-4 h-4 text-slate-300"/>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${ev.done?"line-through text-slate-400":"text-slate-800"}`}>{ev.title}</p>
                          {ev.plot && <p className="text-xs text-slate-400 mt-0.5">Plot: {ev.plot}</p>}
                          {ev.notes && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{ev.notes}</p>}
                          <span className={`badge text-[9px] mt-1 ${cfg.badge}`}>{cfg.label}</span>
                        </div>
                        <button onClick={()=>deleteEvent(ev.id)} className="text-slate-300 hover:text-rose-400 transition-colors flex-shrink-0"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Upcoming */}
            <Card hover={false}>
              <h3 className="font-bold text-slate-800 mb-4">Upcoming (14 days)</h3>
              {upcoming.length===0 ? (
                <p className="text-sm text-slate-400 text-center py-4">No upcoming events.</p>
              ) : (
                <div className="space-y-2">
                  {upcoming.map(ev=>{
                    const cfg=TYPE_CFG[ev.type]||TYPE_CFG.other;
                    const d=new Date(ev.date+"T12:00");
                    return (
                      <div key={ev.id} onClick={()=>setSelDate(ev.date)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                        <div className={`w-1.5 h-8 rounded-full flex-shrink-0 ${cfg.dot}`}/>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-brand-700">{ev.title}</p>
                          <p className="text-[10px] text-slate-400">{cfg.label}{ev.plot?` · Plot ${ev.plot}`:""}</p>
                        </div>
                        <div className="text-[10px] font-semibold text-slate-400 flex-shrink-0">
                          {d.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {showAdd && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" onClick={()=>setShowAdd(false)}/>
            <motion.div initial={{opacity:0,scale:.95,y:16}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.95}}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4">
              <Card hover={false} className="shadow-float border-brand-200">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">Add Farm Event</h3>
                    <p className="text-xs text-slate-400 mt-0.5">For {new Date(selDate+"T12:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
                  </div>
                  <button onClick={()=>setShowAdd(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400"><X className="w-5 h-5"/></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">EVENT TITLE *</label>
                    <input placeholder="e.g. Irrigate North Field" value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))}/>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1.5">TYPE</label>
                      <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value as any}))}>
                        {Object.entries(TYPE_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 block mb-1.5">DATE</label>
                      <input type="date" value={selDate} onChange={e=>setSelDate(e.target.value)} className="[color-scheme:light]"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">PLOT (optional)</label>
                    <input placeholder="e.g. North Field, East Block" value={form.plot} onChange={e=>setForm(p=>({...p,plot:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1.5">NOTES</label>
                    <textarea rows={2} placeholder="Dosage, timing, special instructions…" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
                  </div>
                  <button onClick={handleAdd} className="btn btn-primary w-full py-3">Schedule Event</button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
