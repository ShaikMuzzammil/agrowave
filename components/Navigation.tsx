"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout, LayoutDashboard, CloudRain, Package, TrendingUp,
  Calendar, Mail, Menu, X, Bell, ChevronRight, Home,
  Info, Map
} from "lucide-react";
import { useStore } from "@/lib/store";

const NAV = [
  { href:"/dashboard",     label:"Dashboard",  icon:LayoutDashboard },
  { href:"/land",          label:"Land",       icon:Map },
  { href:"/field-monitor", label:"My Fields",  icon:Sprout },
  { href:"/weather",       label:"Weather",    icon:CloudRain },
  { href:"/market",        label:"Market",     icon:TrendingUp },
  { href:"/inventory",     label:"Inventory",  icon:Package },
  { href:"/calendar",      label:"Calendar",   icon:Calendar },
  { href:"/contact",       label:"Contact",    icon:Mail },
];

const HOME_SECTIONS = [
  {id:"hero",s:"Home"},{id:"features",s:"Features"},
  {id:"how-it-works",s:"How It Works"},{id:"benefits",s:"Benefits"},
  {id:"market-preview",s:"Market"},{id:"testimonials",s:"Stories"},
  {id:"contact-section",s:"Contact"},
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [showNotifs, setShowNotifs] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { notifications, markRead, markAllRead } = useStore();
  const unread = notifications.filter(n=>!n.read);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      if (pathname !== "/") return;
      HOME_SECTIONS.forEach(({id}) => {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 90 && r.bottom >= 90) setActiveSection(id);
        }
      });
    };
    window.addEventListener("scroll", onScroll, {passive:true});
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const scroll = (id:string) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/80" : "bg-transparent"
      }`}>
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-brand-grad flex items-center justify-center shadow-green" style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                <Sprout className="w-5 h-5 text-white"/>
              </div>
              <div>
                <span className="font-bold text-slate-800 text-lg tracking-tight block leading-none">AgroWave</span>
                <span className="text-[10px] text-brand-600 font-semibold tracking-widest">SMART FARMING</span>
              </div>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-1">
              {pathname === "/" ? (
                HOME_SECTIONS.map(s => (
                  <button key={s.id} onClick={() => scroll(s.id)}
                    className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeSection===s.id ? "text-brand-600 bg-brand-50" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}>
                    {s.s}
                    {activeSection===s.id && <motion.div layoutId="navUnderline" className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-brand-500 rounded-full"/>}
                  </button>
                ))
              ) : NAV.slice(0,7).map(n => {
                const active = pathname===n.href || (n.href!=="/dashboard" && n.href!=="/" && pathname.startsWith(n.href));
                const Icon = n.icon;
                const isLand = n.href === "/land";
                return (
                  <Link key={n.href} href={n.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                      active
                        ? isLand ? "text-white bg-brand-600 shadow-green" : "text-brand-600 bg-brand-50"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                    style={isLand && !active ? {border:"1.5px solid #A7F3D0",color:"#047857"} : {}}>
                    <Icon className="w-4 h-4"/>
                    {isLand ? <span className="font-bold">land</span> : n.label}
                    {active && !isLand && <motion.div layoutId="navActive" className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-brand-500 rounded-full"/>}
                  </Link>
                );
              })}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all">
                  <Bell className="w-5 h-5"/>
                  {unread.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
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
                          <div className="py-8 text-center text-slate-400 text-sm">No notifications</div>
                        ) : notifications.slice(0,10).map(n => (
                          <button key={n.id} onClick={() => markRead(n.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 ${!n.read ? "bg-brand-50/50" : ""}`}>
                            <span className="text-lg mt-0.5">{n.type==="success"?"✅":n.type==="warning"?"⚠️":n.type==="error"?"🚨":"ℹ️"}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${!n.read?"text-slate-800":"text-slate-600"}`}>{n.title}</p>
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

              {pathname !== "/" && (
                <button onClick={() => router.push("/")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 text-sm font-medium transition-all">
                  <Home className="w-4 h-4"/> Home
                </button>
              )}

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

        {/* Live strip */}
        <div className="hidden sm:flex bg-brand-600 px-6 py-1.5 items-center justify-between" style={{background:"#059669"}}>
          <div className="flex items-center gap-3">
            <span className="dot-live" style={{background:"#A7F3D0"}}/>
            <span className="text-green-100 text-[11px] font-semibold tracking-widest">LIVE MONITORING</span>
            <span className="text-green-200 text-[11px]">KHARIF 2026 · Day 47 of 120</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-green-200">
            <span>6 Plots Active</span>
            <span>·</span>
            <span className={unread.length > 0 ? "text-yellow-300 font-semibold" : ""}>{unread.length} New Alerts</span>
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
            <motion.div initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:25,stiffness:200}}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-float lg:hidden overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-bold text-slate-800">Menu</span>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-4 space-y-1">
                {NAV.map(n => { const Icon=n.icon; const isLand=n.href==="/land"; return (
                  <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                      pathname===n.href
                        ? isLand ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}>
                    <Icon className="w-4 h-4"/> {isLand ? "land" : n.label}
                    {isLand && <span className="ml-auto badge badge-green text-[9px]">NEW</span>}
                  </Link>
                );})}
                <div className="pt-3 border-t">
                  <Link href="/dashboard" onClick={() => setOpen(false)} className="btn btn-primary w-full justify-center"
                    style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>Open Farm Dashboard</Link>
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
