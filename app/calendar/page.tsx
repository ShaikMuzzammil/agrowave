"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Printer } from "lucide-react";
import { CALENDAR_EVENTS, CalendarEvent } from "@/lib/farmData";

const CATEGORY_COLORS: Record<CalendarEvent["category"], string> = {
  irrigation:"bg-sky-100 text-sky-700 border-sky-200",
  fertilizer:"bg-green-100 text-green-700 border-green-200",
  pesticide:"bg-amber-100 text-amber-700 border-amber-200",
  harvest:"bg-yellow-100 text-yellow-800 border-yellow-200",
  inspection:"bg-violet-100 text-violet-700 border-violet-200",
  market:"bg-emerald-100 text-emerald-700 border-emerald-200",
};
const CATEGORY_ICONS: Record<CalendarEvent["category"], string> = {
  irrigation:"💧", fertilizer:"🌱", pesticide:"🐛", harvest:"🌾", inspection:"🔍", market:"📈",
};
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_OF_WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function CalendarPage() {
  const today = new Date(2026, 5, 3); // June 3, 2026
  const [view, setView] = useState<"month"|"list">("month");
  const [current, setCurrent] = useState({ year: 2026, month: 5 }); // June=5
  const [selected, setSelected] = useState<string>("2026-06-03");
  const [filter, setFilter] = useState<CalendarEvent["category"]|"all">("all");

  const firstDay = new Date(current.year, current.month, 1).getDay();
  const daysInMonth = new Date(current.year, current.month+1, 0).getDate();
  const cells = Array.from({length: firstDay + daysInMonth}, (_,i) => i < firstDay ? null : i - firstDay + 1);

  function getDateStr(day: number) {
    return `${current.year}-${String(current.month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  }
  function getEventsForDay(day: number) {
    return CALENDAR_EVENTS.filter(e=>e.date===getDateStr(day));
  }

  const selectedEvents = CALENDAR_EVENTS.filter(e=>e.date===selected &&
    (filter==="all" || e.category===filter));
  const allFiltered = CALENDAR_EVENTS.filter(e=>filter==="all" || e.category===filter);

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Farm Calendar</h1>
          <p className="text-sm text-slate-500 mt-0.5">KHARIF 2026 · {CALENDAR_EVENTS.length} upcoming activities</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={()=>setView(view==="month"?"list":"month")}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all">
            {view==="month" ? "📋 List View" : "📅 Month View"}
          </button>
          <button onClick={()=>window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all">
            <Printer size={13} /> Print
          </button>
        </div>
      </div>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap">
        {(["all","irrigation","fertilizer","pesticide","harvest","inspection","market"] as const).map(c=>(
          <button key={c} onClick={()=>setFilter(c)}
            className={`filter-pill capitalize ${filter===c?"active":""}`}>
            {c!=="all" && <span className="mr-1">{CATEGORY_ICONS[c as CalendarEvent["category"]]}</span>}
            {c==="all"?"All Activities":c}
          </button>
        ))}
      </div>

      {view==="month" ? (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          {/* Calendar grid */}
          <div className="terra-card p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <button onClick={()=>setCurrent(c=>c.month===0?{year:c.year-1,month:11}:{...c,month:c.month-1})}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                <ChevronLeft size={16}/>
              </button>
              <h2 className="font-black text-slate-900">{MONTHS[current.month]} {current.year}</h2>
              <button onClick={()=>setCurrent(c=>c.month===11?{year:c.year+1,month:0}:{...c,month:c.month+1})}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                <ChevronRight size={16}/>
              </button>
            </div>

            <div className="grid grid-cols-7 border-b border-slate-100">
              {DAYS_OF_WEEK.map(d=>(
                <div key={d} className="py-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="min-h-[80px] border-b border-r border-slate-50" />;
                const dateStr = getDateStr(day);
                const dayEvents = getEventsForDay(day);
                const filteredDayEvents = dayEvents.filter(e=>filter==="all"||e.category===filter);
                const isToday = current.year===2026 && current.month===5 && day===3;
                const isSelected = dateStr===selected;
                return (
                  <button key={day}
                    onClick={()=>setSelected(dateStr)}
                    className={`min-h-[80px] border-b border-r border-slate-50 p-1.5 text-left transition-colors hover:bg-emerald-50/50 ${
                      isSelected?"bg-emerald-50 border-emerald-200":""
                    }`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                      isToday?"bg-emerald-600 text-white":isSelected?"bg-emerald-100 text-emerald-700":"text-slate-700"
                    }`}>{day}</div>
                    <div className="space-y-0.5">
                      {filteredDayEvents.slice(0,2).map(e=>(
                        <div key={e.id} className={`text-[9px] font-semibold px-1 py-0.5 rounded truncate border ${CATEGORY_COLORS[e.category]}`}>
                          {CATEGORY_ICONS[e.category]} {e.title}
                        </div>
                      ))}
                      {filteredDayEvents.length>2 && (
                        <div className="text-[9px] text-slate-400 px-1">+{filteredDayEvents.length-2} more</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day panel */}
          <div className="space-y-3">
            <div className="terra-card">
              <h3 className="font-bold text-slate-900 mb-1">
                {new Date(selected+"T00:00:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
              </h3>
              <p className="text-xs text-slate-400 mb-4">{selectedEvents.length} activities scheduled</p>
              {selectedEvents.length===0 ? (
                <div className="py-8 text-center">
                  <div className="text-3xl mb-2">📅</div>
                  <p className="text-slate-400 text-sm">No activities this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedEvents.map(e=>(
                    <div key={e.id} className={`p-3 rounded-xl border ${CATEGORY_COLORS[e.category]}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span>{CATEGORY_ICONS[e.category]}</span>
                        <span className="font-bold text-sm">{e.title}</span>
                        <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          e.priority==="high"?"bg-rose-100 text-rose-700":
                          e.priority==="medium"?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-600"
                        }`}>{e.priority}</span>
                      </div>
                      {e.plot && <p className="text-xs opacity-70 capitalize">Plot: {e.plot}</p>}
                      <p className="text-xs opacity-80 mt-1 leading-relaxed">{e.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upcoming events */}
            <div className="terra-card">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">All Upcoming</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allFiltered.sort((a,b)=>a.date.localeCompare(b.date)).map(e=>(
                  <button key={e.id} onClick={()=>setSelected(e.date)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-colors hover:bg-slate-50 ${
                      selected===e.date?"bg-emerald-50 border-emerald-200":"border-slate-100"
                    }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{CATEGORY_ICONS[e.category]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{e.title}</p>
                        <p className="text-[10px] text-slate-400">{new Date(e.date+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 rounded-full ${
                        e.priority==="high"?"bg-rose-100 text-rose-700":
                        e.priority==="medium"?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-600"
                      }`}>{e.priority}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {allFiltered.sort((a,b)=>a.date.localeCompare(b.date)).map(e=>(
            <div key={e.id} className={`terra-card border-l-4 ${
              e.priority==="high"?"border-l-rose-500":e.priority==="medium"?"border-l-amber-500":"border-l-slate-300"
            }`}>
              <div className="flex items-start gap-4">
                <span className="text-2xl">{CATEGORY_ICONS[e.category]}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900">{e.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[e.category]} capitalize`}>{e.category}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      e.priority==="high"?"bg-rose-100 text-rose-700":e.priority==="medium"?"bg-amber-100 text-amber-700":"bg-slate-100 text-slate-600"
                    }`}>{e.priority}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {new Date(e.date+"T00:00:00").toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
                    {e.plot && ` · Plot: ${e.plot}`}
                  </p>
                  <p className="text-sm text-slate-600 mt-1">{e.notes}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
