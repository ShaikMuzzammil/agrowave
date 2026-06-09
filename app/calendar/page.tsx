"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, CheckCircle2, Circle, Trash2, ChevronLeft, ChevronRight, Calendar, Info, Printer } from "lucide-react";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";

const TYPE_CFG = {
  irrigation:{ dot:"bg-sky-400",    badge:"bg-sky-100 text-sky-700",     label:"Irrigation", emoji:"💧" },
  fertilizer:{ dot:"bg-amber-400",  badge:"bg-amber-100 text-amber-700", label:"Fertilizer", emoji:"🌱" },
  pesticide: { dot:"bg-rose-400",   badge:"bg-rose-100 text-rose-700",   label:"Pesticide",  emoji:"🐛" },
  harvest:   { dot:"bg-brand-400",  badge:"bg-brand-100 text-brand-700", label:"Harvest",    emoji:"🌾" },
  planting:  { dot:"bg-violet-400", badge:"bg-violet-100 text-violet-700",label:"Planting",  emoji:"🪴" },
  other:     { dot:"bg-slate-400",  badge:"bg-slate-100 text-slate-600", label:"Other",      emoji:"📋" },
} as const;

const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function FarmCalendar() {
  const { events, plots, addEvent, toggleEvent, deleteEvent, pushNotif } = useStore();
  const [view, setView]     = useState(new Date());
  const [selDate, setSelDate] = useState(new Date().toISOString().split("T")[0]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]     = useState({ title:"", type:"irrigation" as keyof typeof TYPE_CFG, plot:"", notes:"", priority:"normal" as "low"|"normal"|"high" });

  const year=view.getFullYear(), month=view.getMonth();
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const today=new Date().toISOString().split("T")[0];

  const calDays=Array.from({length:42},(_,i)=>{ const d=i-firstDay+1; return d>=1&&d<=daysInMonth?d:null; });
  const dayFmt=(d:number)=>`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const dayEvents=(d:number)=>events.filter(e=>e.date===dayFmt(d));
  const selEvents=events.filter(e=>e.date===selDate).sort((a,b)=>a.done?1:-1);
  const upcoming=events.filter(e=>!e.done&&e.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8);
  const todayCount=events.filter(e=>e.date===today&&!e.done).length;

  const handleAdd=()=>{
    if(!form.title){ pushNotif({title:"⚠️ Title required",body:"Please enter a task title.",type:"warning",time:"just now"}); return; }
    addEvent({...form,id:Date.now().toString(),date:selDate,done:false});
    pushNotif({title:`📅 ${TYPE_CFG[form.type].emoji} Event Scheduled`,body:`${form.title} — ${new Date(selDate+"T12:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"})}.`,type:"info",time:"just now"});
    setForm({title:"",type:"irrigation",plot:"",notes:"",priority:"normal"});
    setShowAdd(false);
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#FFFBEB 0%,#F0FDF4 50%,#EFF6FF 100%)"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-10">
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Farm <span className="grad-text">Calendar</span></h1>
            <p className="text-slate-400 text-sm">Schedule irrigation, fertilizer, harvests and all farm activities</p>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
              style={{background:"rgba(255,255,255,0.1)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
              <Printer className="w-4 h-4"/> Print Schedule
            </button>
            <button onClick={()=>setShowAdd(true)} className="btn btn-primary" style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
              <Plus className="w-4 h-4"/> Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Hint */}
        <div className="hint-banner mb-6">
          <Info className="w-4 h-4 flex-shrink-0"/>
          <span><strong>Tip:</strong> Click any <strong>date on the calendar</strong> to see or add events for that day. Use <strong>+ Add Event</strong> to schedule irrigation, sprays, or harvests. Green dates have completed tasks, red dates have pending ones.</span>
        </div>

        {/* Today summary */}
        {todayCount > 0 && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl border-2 border-amber-200 bg-amber-50"
            style={{boxShadow:"0 4px 16px rgba(245,158,11,0.1)"}}>
            <span className="text-2xl">⏰</span>
            <div>
              <p className="font-bold text-amber-800 text-sm">{todayCount} task{todayCount>1?"s":""} due today</p>
              <p className="text-amber-600 text-xs">Click Today on the calendar to view and mark complete</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card hover={false} style={{boxShadow:"0 4px 24px rgba(0,0,0,0.07)"}}>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={()=>setView(new Date(year,month-1,1))}
                  className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition-all">
                  <ChevronLeft className="w-4 h-4"/>
                </button>
                <h2 className="font-bold text-xl text-slate-800">{MONTHS[month]} {year}</h2>
                <button onClick={()=>setView(new Date(year,month+1,1))}
                  className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition-all">
                  <ChevronRight className="w-4 h-4"/>
                </button>
              </div>
              <div className="grid grid-cols-7 mb-2">
                {DAYS.map(d=><div key={d} className="text-center text-xs font-bold text-slate-400 py-2">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((day,i)=>{
                  if(!day) return <div key={i}/>;
                  const ds=dayFmt(day);
                  const devs=dayEvents(day);
                  const isToday=ds===today, isSel=ds===selDate;
                  const done=devs.filter(e=>e.done).length;
                  const pending=devs.filter(e=>!e.done).length;
                  return (
                    <button key={i} onClick={()=>setSelDate(ds)}
                      className={`relative min-h-[58px] p-2 rounded-xl text-left transition-all border-2 ${
                        isSel    ? "border-brand-400 shadow-green"
                        : isToday ? "border-brand-200 bg-brand-50"
                        : "border-transparent hover:border-slate-200 hover:bg-slate-50"
                      }`}
                      style={isSel?{background:"linear-gradient(135deg,#059669,#10B981)"}:{}}>
                      <span className={`text-sm font-bold ${isSel?"text-white":isToday?"text-brand-700":"text-slate-700"}`}>{day}</span>
                      {devs.length>0 && (
                        <div className="flex flex-col gap-0.5 mt-1">
                          {pending>0&&<span className="w-full h-1 rounded-full bg-amber-400 opacity-80"/>}
                          {done>0  &&<span className="w-full h-1 rounded-full bg-brand-400 opacity-80"/>}
                        </div>
                      )}
                      {devs.length>0 && (
                        <span className={`absolute top-1 right-1 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ${isSel?"bg-white/30 text-white":"bg-brand-100 text-brand-700"}`}>
                          {devs.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100 flex-wrap">
                {[
                  {c:"bg-amber-400",l:"Pending"},
                  {c:"bg-brand-400",l:"Completed"},
                  {c:"border-2 border-brand-400",l:"Selected"},
                  {c:"border-2 border-brand-200 bg-brand-50",l:"Today"},
                ].map((x,i)=>(
                  <span key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className={`w-3 h-3 rounded-sm ${x.c}`}/>
                    {x.l}
                  </span>
                ))}
              </div>
            </Card>

            {/* Selected day events */}
            <Card hover={false} className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">
                  {new Date(selDate+"T12:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
                </h3>
                <button onClick={()=>setShowAdd(true)} className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-100">
                  <Plus className="w-3 h-3"/> Add
                </button>
              </div>
              {selEvents.length===0 ? (
                <p className="text-slate-400 text-sm text-center py-6">No events — click + Add to schedule one.</p>
              ) : (
                <div className="space-y-3">
                  {selEvents.map((ev,i)=>{
                    const cfg=TYPE_CFG[ev.type as keyof typeof TYPE_CFG]||TYPE_CFG.other;
                    return (
                      <motion.div key={ev.id} initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                        className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${ev.done?"opacity-60 border-slate-100 bg-slate-50":"border-slate-100 bg-white hover:border-brand-200"}`}>
                        <button onClick={()=>toggleEvent(ev.id)} className="mt-0.5">
                          {ev.done ? <CheckCircle2 className="w-5 h-5 text-brand-500"/> : <Circle className="w-5 h-5 text-slate-300 hover:text-brand-400"/>}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-slate-800 text-sm">{ev.title}</span>
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

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {l:"Total Events",  v:events.length,                  c:"text-brand-700 bg-brand-50 border-brand-200"},
                {l:"Completed",     v:events.filter(e=>e.done).length, c:"text-sky-700 bg-sky-50 border-sky-200"},
                {l:"Pending",       v:events.filter(e=>!e.done).length,c:"text-amber-700 bg-amber-50 border-amber-200"},
                {l:"Due Today",     v:todayCount,                      c:todayCount>0?"text-rose-700 bg-rose-50 border-rose-200":"text-slate-500 bg-slate-50 border-slate-200"},
              ].map((s,i)=>(
                <div key={i} className={`card p-4 text-center border-2 ${s.c}`}>
                  <div className="text-2xl font-bold">{s.v}</div>
                  <div className="text-xs font-semibold opacity-70">{s.l}</div>
                </div>
              ))}
            </div>

            {/* Upcoming */}
            <Card hover={false} style={{boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
              <h3 className="font-bold text-slate-800 mb-4">Upcoming Tasks</h3>
              {upcoming.length===0 ? (
                <p className="text-slate-400 text-xs text-center py-4">No upcoming tasks. Schedule your farm activities!</p>
              ) : (
                <div className="space-y-2.5">
                  {upcoming.map((ev,i)=>{
                    const cfg=TYPE_CFG[ev.type as keyof typeof TYPE_CFG]||TYPE_CFG.other;
                    const dDate=new Date(ev.date+"T12:00");
                    const diff=Math.round((dDate.getTime()-new Date().setHours(0,0,0,0))/(1000*60*60*24));
                    return (
                      <motion.div key={ev.id} initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                        className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition-all cursor-pointer"
                        onClick={()=>setSelDate(ev.date)}>
                        <span className="text-lg mt-0.5">{cfg.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-xs truncate">{ev.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {dDate.toLocaleDateString("en-IN",{day:"numeric",month:"short"})}
                            {ev.plot && ` · ${ev.plot}`}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${diff===0?"bg-rose-100 text-rose-700":diff===1?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-500"}`}>
                          {diff===0?"Today":diff===1?"Tomorrow":`${diff}d`}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Type legend */}
            <Card hover={false}>
              <h3 className="font-bold text-slate-800 mb-3 text-sm">Event Types</h3>
              <div className="space-y-2">
                {Object.entries(TYPE_CFG).map(([k,v])=>{
                  const count=events.filter(e=>e.type===k).length;
                  return (
                    <div key={k} className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="text-base">{v.emoji}</span>{v.label}
                      </span>
                      <span className={`badge text-[10px] ${v.badge}`}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ADD EVENT MODAL */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="modal-overlay"
            onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false);}}>
            <motion.div
              initial={{scale:0.92,opacity:0,y:24}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.92,opacity:0,y:24}}
              transition={{type:"spring",damping:24,stiffness:280}}
              className="modal-card" style={{maxWidth:"480px"}}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Add Farm Event</h2>
                  <p className="text-sm text-slate-400 mt-1">
                    For: {new Date(selDate+"T12:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
                  </p>
                </div>
                <button onClick={()=>setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">TASK TITLE <span className="text-rose-500">*</span></label>
                  <input placeholder="e.g. Irrigate North Field" value={form.title}
                    onChange={e=>setForm(p=>({...p,title:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">TASK TYPE</label>
                    <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value as any}))}
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
                      {plots.map(p=><option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">PRIORITY</label>
                  <div className="flex gap-2">
                    {(["low","normal","high"] as const).map(prio=>(
                      <button key={prio} onClick={()=>setForm(p=>({...p,priority:prio}))}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all capitalize ${
                          form.priority===prio
                            ? prio==="high"?"bg-rose-500 text-white border-rose-500"
                              :prio==="normal"?"bg-amber-500 text-white border-amber-500"
                              :"bg-brand-500 text-white border-brand-500"
                            :"border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}>
                        {prio}
                      </button>
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
                <button onClick={()=>setShowAdd(false)} className="btn btn-ghost px-6 py-2.5">Cancel</button>
                <button onClick={handleAdd} className="btn btn-primary px-8 py-2.5" style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
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
