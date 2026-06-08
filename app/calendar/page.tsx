"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, CheckCircle2, Circle, Trash2, ChevronLeft, ChevronRight, Info, Printer } from "lucide-react";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";

const TYPE_CFG = {
  irrigation:{ dot:"#38BDF8", badge:"bg-sky-100 text-sky-700",     label:"Irrigation", emoji:"💧" },
  fertilizer:{ dot:"#F59E0B", badge:"bg-amber-100 text-amber-700", label:"Fertilizer", emoji:"🌱" },
  pesticide: { dot:"#F87171", badge:"bg-rose-100 text-rose-700",   label:"Pesticide",  emoji:"🐛" },
  harvest:   { dot:"#10B981", badge:"bg-brand-100 text-brand-700", label:"Harvest",    emoji:"🌾" },
  planting:  { dot:"#A78BFA", badge:"bg-violet-100 text-violet-700",label:"Planting",  emoji:"🪴" },
  other:     { dot:"#94A3B8", badge:"bg-slate-100 text-slate-600", label:"Other",      emoji:"📋" },
} as const;
type EventType = keyof typeof TYPE_CFG;

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function FarmCalendar() {
  const { events, plots, addEvent, toggleEvent, deleteEvent, pushNotif } = useStore();
  const [view, setView]     = useState(new Date());
  const [selDate, setSelDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]     = useState({ title:"", type:"irrigation" as EventType, plot:"", notes:"", priority:"normal" as "low"|"normal"|"high" });

  const year = view.getFullYear(), month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date().toISOString().split("T")[0];
  const calDays = Array.from({ length: 42 }, (_, i) => { const d = i - firstDay + 1; return d >= 1 && d <= daysInMonth ? d : null; });
  const dayFmt  = (d: number) => `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const dayEvents = (d: number) => events.filter(e => e.date === dayFmt(d));

  const upcoming = events.filter(e => !e.done && e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 12);
  const todayEvents = events.filter(e => e.date === today);

  const handleAdd = () => {
    if (!form.title) { pushNotif({ title:"⚠️ Title required", body:"Enter a task title.", type:"warning", time:"just now" }); return; }
    addEvent({ ...form, id:Date.now().toString(), date:selDate, done:false });
    pushNotif({ title:`📅 ${TYPE_CFG[form.type].emoji} Event Scheduled`, body:`${form.title} on ${new Date(selDate+"T12:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"})}.`, type:"info", time:"just now" });
    setForm({ title:"", type:"irrigation", plot:"", notes:"", priority:"normal" });
    setShowAdd(false);
  };

  const selEvents = events.filter(e => e.date === selDate).sort((a,b) => a.done ? 1 : -1);

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#FFFBEB 0%,#F0FDF4 50%,#EFF6FF 100%)"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-8">
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-0.5">Farm <span className="grad-text">Calendar</span></h1>
            <p className="text-slate-400 text-sm">Schedule irrigation, fertilizer, harvests & activities</p>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
              style={{background:"rgba(255,255,255,0.1)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
              <Printer className="w-4 h-4"/> Print Schedule
            </button>
            <button onClick={()=>setShowAdd(true)} className="btn btn-primary"
              style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
              <Plus className="w-4 h-4"/> Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Hint */}
        <div className="hint-banner mb-5">
          <Info className="w-4 h-4 flex-shrink-0"/>
          <span><strong>Tip:</strong> Click any date to view/add events. Coloured dots on dates show pending (amber) or done (green) tasks. Upcoming events are listed on the right sorted by due date.</span>
        </div>

        {todayEvents.filter(e=>!e.done).length > 0 && (
          <div className="flex items-center gap-3 p-4 mb-5 rounded-2xl border-2 border-amber-200 bg-amber-50">
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-bold text-amber-800 text-sm">{todayEvents.filter(e=>!e.done).length} task{todayEvents.filter(e=>!e.done).length>1?"s":""} due today</p>
              <p className="text-amber-600 text-xs">Click today on the calendar to mark complete</p>
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {[
            {l:"Total",   v:events.length,                    c:"text-brand-700 bg-brand-50 border-brand-200"},
            {l:"Done",    v:events.filter(e=>e.done).length,  c:"text-sky-700 bg-sky-50 border-sky-200"},
            {l:"Pending", v:events.filter(e=>!e.done).length, c:"text-amber-700 bg-amber-50 border-amber-200"},
            {l:"Today",   v:todayEvents.filter(e=>!e.done).length, c:todayEvents.filter(e=>!e.done).length>0?"text-rose-700 bg-rose-50 border-rose-200":"text-slate-500 bg-slate-50 border-slate-200"},
          ].map((s,i)=>(
            <div key={i} className={`card p-4 text-center border-2 ${s.c}`}>
              <div className="text-2xl font-bold">{s.v}</div>
              <div className="text-xs font-semibold opacity-70">{s.l}</div>
            </div>
          ))}
        </div>

        {/* MAIN LAYOUT: Calendar left + Events right */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* LEFT: Calendar + selected day */}
          <div className="lg:col-span-2 space-y-4">
            {/* Calendar */}
            <Card hover={false} className="p-6">
              <div className="flex items-center justify-between mb-5">
                <button onClick={()=>setView(new Date(year,month-1,1))}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all">
                  <ChevronLeft className="w-4 h-4"/>
                </button>
                <h2 className="font-bold text-xl text-slate-800">{MONTHS[month]} {year}</h2>
                <button onClick={()=>setView(new Date(year,month+1,1))}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all">
                  <ChevronRight className="w-4 h-4"/>
                </button>
              </div>
              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => <div key={d} className="text-center text-xs font-bold text-slate-400 py-1.5">{d}</div>)}
              </div>
              {/* Calendar cells */}
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((day, i) => {
                  if (!day) return <div key={i}/>;
                  const ds = dayFmt(day);
                  const devs = dayEvents(day);
                  const isToday = ds === today, isSel = ds === selDate;
                  const pending = devs.filter(e=>!e.done).length;
                  const done    = devs.filter(e=>e.done).length;
                  return (
                    <button key={i} onClick={()=>setSelDate(ds)}
                      className={`relative min-h-[56px] p-2 rounded-xl text-left transition-all border-2 ${
                        isSel    ? "border-brand-400"
                        : isToday ? "border-brand-200 bg-brand-50"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                      }`}
                      style={isSel ? {background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 4px 14px rgba(16,185,129,0.35)"} : {}}>
                      <span className={`text-sm font-bold ${isSel?"text-white":isToday?"text-brand-700":"text-slate-700"}`}>{day}</span>
                      {devs.length > 0 && (
                        <div className="flex flex-col gap-0.5 mt-1">
                          {pending > 0 && <span className="w-full h-1 rounded-full bg-amber-400"/>}
                          {done > 0    && <span className="w-full h-1 rounded-full bg-brand-400"/>}
                        </div>
                      )}
                      {devs.length > 0 && (
                        <span className={`absolute top-1 right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${isSel?"bg-white/30 text-white":"bg-brand-100 text-brand-700"}`}>
                          {devs.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-5 mt-4 pt-4 border-t border-slate-100 flex-wrap">
                {Object.entries(TYPE_CFG).map(([k,v])=>(
                  <span key={k} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full" style={{background:v.dot}}/>{v.label}
                  </span>
                ))}
              </div>
            </Card>

            {/* Selected day events */}
            <Card hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">
                  {new Date(selDate+"T12:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
                </h3>
                <button onClick={()=>setShowAdd(true)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-100">
                  <Plus className="w-3 h-3"/> Add
                </button>
              </div>
              {selEvents.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-5">No events — click Add to schedule one.</p>
              ) : (
                <div className="space-y-2">
                  {selEvents.map((ev,i) => {
                    const cfg = TYPE_CFG[ev.type as EventType] || TYPE_CFG.other;
                    return (
                      <motion.div key={ev.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${ev.done?"opacity-60 border-slate-100 bg-slate-50":"border-slate-100 bg-white hover:border-brand-200"}`}>
                        <button onClick={()=>toggleEvent(ev.id)} className="mt-0.5 flex-shrink-0">
                          {ev.done ? <CheckCircle2 className="w-5 h-5 text-brand-500"/> : <Circle className="w-5 h-5 text-slate-300 hover:text-brand-400"/>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`font-semibold text-slate-800 text-sm ${ev.done?"line-through":""}`}>{ev.title}</span>
                            <span className={`badge text-[10px] ${cfg.badge}`}>{cfg.emoji} {cfg.label}</span>
                            {ev.plot && <span className="badge badge-slate text-[10px]">{ev.plot}</span>}
                          </div>
                          {ev.notes && <p className="text-xs text-slate-400 mt-1">{ev.notes}</p>}
                        </div>
                        <button onClick={()=>deleteEvent(ev.id)} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-3.5 h-3.5"/>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT: Upcoming events list */}
          <div className="space-y-4">
            <Card hover={false} className="h-full">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"/>
                Upcoming Tasks
              </h3>
              {upcoming.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No upcoming tasks.</p>
                  <button onClick={()=>setShowAdd(true)}
                    className="mt-3 btn btn-outline text-xs px-4 py-2">+ Schedule One</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcoming.map((ev,i) => {
                    const cfg = TYPE_CFG[ev.type as EventType] || TYPE_CFG.other;
                    const dDate = new Date(ev.date+"T12:00");
                    const diff  = Math.round((dDate.getTime()-new Date().setHours(0,0,0,0))/(1000*60*60*24));
                    return (
                      <motion.div key={ev.id} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                        className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer group"
                        onClick={()=>setSelDate(ev.date)}>
                        <span className="text-lg mt-0.5 flex-shrink-0">{cfg.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:cfg.dot}}/>
                            <p className="font-semibold text-slate-800 text-xs truncate">{ev.title}</p>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            {dDate.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
                            {ev.plot ? ` · ${ev.plot}` : ""}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${
                          diff===0 ? "bg-rose-100 text-rose-700"
                          : diff===1 ? "bg-amber-100 text-amber-700"
                          : diff<=3 ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-500"
                        }`}>
                          {diff===0?"Today":diff===1?"Tomorrow":`${diff}d`}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* ADD EVENT MODAL */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false);}}>
            <motion.div initial={{scale:0.92,opacity:0,y:24}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.92,opacity:0,y:24}}
              transition={{type:"spring",damping:24,stiffness:280}} className="modal-card" style={{maxWidth:"480px"}}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Add Farm Event</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(selDate+"T12:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</p>
                </div>
                <button onClick={()=>setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <div className="space-y-4 mb-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">TASK TITLE <span className="text-rose-500">*</span></label>
                  <input placeholder="e.g. Irrigate North Field" value={form.title}
                    onChange={e=>setForm(p=>({...p,title:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">TYPE</label>
                    <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value as EventType}))}
                      style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                      {Object.entries(TYPE_CFG).map(([k,v])=>(
                        <option key={k} value={k}>{v.emoji} {v.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">PLOT</label>
                    <select value={form.plot} onChange={e=>setForm(p=>({...p,plot:e.target.value}))}
                      style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                      <option value="">All Plots</option>
                      {["North Field","East Block","South Field","West Block","Central Plot","Border Strip"].map(n=>(
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">PRIORITY</label>
                  <div className="flex gap-2">
                    {(["low","normal","high"] as const).map(p=>(
                      <button key={p} onClick={()=>setForm(x=>({...x,priority:p}))}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 capitalize transition-all ${
                          form.priority===p
                            ? p==="high"?"bg-rose-500 text-white border-rose-500"
                              :p==="normal"?"bg-amber-500 text-white border-amber-500"
                              :"bg-brand-500 text-white border-brand-500"
                            :"border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}>{p}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">NOTES</label>
                  <textarea rows={2} placeholder="Any additional details…" value={form.notes}
                    onChange={e=>setForm(p=>({...p,notes:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button onClick={()=>setShowAdd(false)} className="btn btn-ghost px-5 py-2.5">Cancel</button>
                <button onClick={handleAdd} className="btn btn-primary px-7 py-2.5"
                  style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                  <Plus className="w-4 h-4"/> Add Event
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
