"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout, LayoutDashboard, CloudRain, Package, TrendingUp,
  Calendar, Menu, X, Bell, ChevronRight, Map, Mail
} from "lucide-react";
import { useStore } from "@/lib/store";

/* Farm app nav — Contact intentionally excluded */
const NAV = [
  { href:"/dashboard",     label:"Dashboard", icon:LayoutDashboard },
  { href:"/land",          label:"land",      icon:Map,             isLand:true },
  { href:"/field-monitor", label:"My Fields", icon:Sprout },
  { href:"/weather",       label:"Weather",   icon:CloudRain },
  { href:"/market",        label:"Market",    icon:TrendingUp },
  { href:"/inventory",     label:"Inventory", icon:Package },
  { href:"/calendar",      label:"Calendar",  icon:Calendar },
];

const HOME_SECTIONS = [
  {id:"hero",s:"Home"},{id:"features",s:"Features"},{id:"guide",s:"Guide"},
  {id:"why",s:"Why AgroWave"},{id:"how-it-works",s:"How It Works"},
  {id:"benefits",s:"Benefits"},{id:"market-preview",s:"Market"},
  {id:"testimonials",s:"Stories"},{id:"contact-section",s:"Contact"},
];

export default function Navigation() {
  const [open, setOpen]           = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [activeSection, setActive] = useState("hero");
  const [showNotifs, setShowNotifs]= useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const { notifications, markRead, markAllRead } = useStore();
  const unread = notifications.filter(n=>!n.read);
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      if (!isHome) return;
      HOME_SECTIONS.forEach(({id}) => {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 90 && r.bottom >= 90) setActive(id);
        }
      });
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const scroll = (id:string) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/97 backdrop-blur-xl shadow-sm border-b border-slate-200/80" : "bg-transparent"
      }`}>
        <div className="container">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-green"
                style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                <Sprout className="w-5 h-5 text-white"/>
              </div>
              <div>
                <span className="font-bold text-slate-800 text-lg tracking-tight block leading-none">AgroWave</span>
                <span className="text-[10px] text-brand-600 font-semibold tracking-widest">SMART FARMING</span>
              </div>
            </Link>

            {/* ── Desktop nav links ── */}
            <div className="hidden lg:flex items-center nav-links-wrap overflow-x-auto">
              {isHome ? (
                /* Home page — scroll sections */
                <div className="flex items-center gap-0.5">
                  {HOME_SECTIONS.map(s => (
                    <button key={s.id} onClick={() => scroll(s.id)}
                      className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeSection===s.id
                          ? "text-brand-600 bg-brand-50 shadow-sm"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}>
                      {s.s}
                      {activeSection===s.id && (
                        <motion.div layoutId="navUnderline"
                          className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-brand-500 rounded-full"/>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                /* Farm app — main pages + Contact separator */
                <div className="flex items-center gap-0.5">
                  {NAV.map(n => {
                    const active = pathname===n.href ||
                      (n.href!=="/" && n.href!=="/dashboard" && pathname.startsWith(n.href));
                    const Icon = n.icon;
                    return (
                      <Link key={n.href} href={n.href}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative whitespace-nowrap ${
                          active
                            ? n.isLand
                              ? "text-white font-bold"
                              : "text-brand-700 font-semibold"
                            : n.isLand
                              ? "text-brand-700 hover:bg-brand-50"
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                        style={active
                          ? n.isLand
                            ? {background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 0 0 2px rgba(16,185,129,0.25)"}
                            : {background:"linear-gradient(135deg,#ECFDF5,#D1FAE5)",boxShadow:"0 0 0 2px rgba(16,185,129,0.18)"}
                          : n.isLand
                            ? {border:"1.5px solid #A7F3D0"}
                            : {}
                        }>
                        <Icon className="w-4 h-4 flex-shrink-0"/>
                        {n.label}
                        {active && !n.isLand && (
                          <motion.div layoutId="navActive"
                            className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-brand-500 rounded-full"/>
                        )}
                      </Link>
                    );
                  })}

                  {/* ── Contact separator link — left side, direct to /contact ── */}
                  <div className="flex items-center ml-1">
                    <div className="w-px h-5 bg-slate-200 mx-2"/>
                    <Link href="/contact"
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        pathname==="/contact"
                          ? "text-brand-700 bg-brand-50 font-semibold"
                          : "text-slate-400 hover:text-brand-600 hover:bg-brand-50"
                      }`}>
                      <Mail className="w-3.5 h-3.5"/>
                      Contact
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right side — Bell + Open Farm only (Home button removed) ── */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Notification bell */}
              <div className="relative">
                <button onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all">
                  <Bell className="w-5 h-5"/>
                  {unread.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center notif-badge-pulse">
                      {unread.length > 9 ? "9+" : unread.length}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifs && (
                    <motion.div initial={{opacity:0,y:8,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:.96}}
                      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-float border border-slate-200 overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-brand-600"/>
                          <span className="font-semibold text-slate-800">Notifications</span>
                          {unread.length > 0 && <span className="badge badge-red">{unread.length} new</span>}
                        </div>
                        <button onClick={markAllRead} className="text-xs text-brand-600 hover:text-brand-700 font-medium">Mark all read</button>
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-sm">No notifications yet</div>
                        ) : notifications.slice(0,10).map(n => (
                          <button key={n.id} onClick={() => markRead(n.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${!n.read?"bg-brand-50/50":""}`}>
                            <span className="text-lg mt-0.5">{n.type==="success"?"✅":n.type==="warning"?"⚠️":n.type==="error"?"🚨":"ℹ️"}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${!n.read?"text-slate-800":"text-slate-600"}`}>{n.title}</p>
                              <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{n.body}</p>
                              <p className="text-[10px] text-slate-300 mt-1">{n.time}</p>
                            </div>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0"/>}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Open Farm button */}
              <Link href="/dashboard" className="btn btn-primary hidden md:flex text-sm px-5 py-2.5"
                style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                Open Farm <ChevronRight className="w-4 h-4"/>
              </Link>

              <button onClick={() => setOpen(!open)} className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 text-slate-500">
                {open ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
              </button>
            </div>
          </div>
        </div>

        {/* Live status strip */}
        <div className="hidden sm:flex items-center justify-between px-6 py-1.5"
          style={{background:"linear-gradient(90deg,#047857,#059669)"}}>
          <div className="flex items-center gap-3">
            <span className="dot-live" style={{background:"#A7F3D0"}}/>
            <span className="text-green-100 text-[11px] font-semibold tracking-widest">LIVE MONITORING</span>
            <span className="text-green-200 text-[11px]">KHARIF 2026 · Day 47 of 120</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-green-200">
            <span>6 Plots Active</span>
            <span>·</span>
            <span className={unread.length > 0 ? "text-yellow-300 font-semibold animate-pulse" : ""}>
              {unread.length > 0 ? `⚠ ${unread.length} New Alerts` : "✓ All Clear"}
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}/>
            <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}}
              transition={{type:"spring",damping:25,stiffness:200}}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-float lg:hidden overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                    <Sprout className="w-4 h-4 text-white"/>
                  </div>
                  <span className="font-bold text-slate-800">AgroWave</span>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5"/>
                </button>
              </div>
              <div className="p-4 space-y-1">
                {NAV.map(n => {
                  const Icon = n.icon;
                  const active = pathname===n.href;
                  return (
                    <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                        active
                          ? n.isLand ? "text-white" : "text-brand-700 bg-brand-50"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                      style={active && n.isLand ? {background:"linear-gradient(135deg,#059669,#10B981)"} : {}}>
                      <Icon className="w-4 h-4"/>
                      {n.label}
                    </Link>
                  );
                })}
                {/* Contact in mobile drawer */}
                <div className="border-t pt-2 mt-1">
                  <Link href="/contact" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm text-slate-500 hover:bg-slate-50">
                    <Mail className="w-4 h-4"/> Contact
                  </Link>
                </div>
                <div className="pt-2 border-t">
                  <Link href="/dashboard" onClick={() => setOpen(false)}
                    className="btn btn-primary w-full justify-center"
                    style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                    Open Farm Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showNotifs && <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)}/>}
    </>
  );
}
