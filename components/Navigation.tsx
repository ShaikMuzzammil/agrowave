"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sprout, LayoutDashboard, CloudRain, Package, TrendingUp,
  Calendar, Mail, Menu, X, Bell, Home, Map
} from "lucide-react";
import { useStore } from "@/lib/store";

const NAV = [
  { href:"/dashboard",     label:"Dashboard", icon:LayoutDashboard },
  { href:"/land",          label:"land",      icon:Map },
  { href:"/field-monitor", label:"My Fields", icon:Sprout },
  { href:"/weather",       label:"Weather",   icon:CloudRain },
  { href:"/market",        label:"Market",    icon:TrendingUp },
  { href:"/inventory",     label:"Inventory", icon:Package },
  { href:"/calendar",      label:"Calendar",  icon:Calendar },
];

const HOME_SECTIONS = [
  {id:"hero",s:"Home"},{id:"features",s:"Features"},
  {id:"guide",s:"Guide"},{id:"benefits",s:"Benefits"},
  {id:"market-preview",s:"Market"},{id:"testimonials",s:"Stories"},
  {id:"contact-section",s:"Contact"},
];

export default function Navigation() {
  const [open, setOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [showNotifs, setShowNotifs] = useState(false);
  const pathname = usePathname();
  const { notifications, markRead, markAllRead } = useStore();
  const unread = notifications.filter(n => !n.read);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      if (pathname !== "/") return;
      HOME_SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 90 && r.bottom >= 90) setActiveSection(id);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const scroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 no-print ${
        scrolled || pathname !== "/"
          ? "bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm"
          : "bg-transparent"
      }`} style={{ height: "72px" }}>
        <div className="container h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-brand-grad flex items-center justify-center shadow-green">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className={`font-bold text-base leading-none ${scrolled || pathname !== "/" ? "text-slate-900" : "text-slate-900"}`}>
                AgroWave
              </div>
              <div className="text-[9px] font-semibold text-brand-600 uppercase tracking-widest">Smart Farming</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {pathname === "/" ? (
              HOME_SECTIONS.map(s => (
                <button key={s.id} onClick={() => scroll(s.id)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                    activeSection === s.id
                      ? "bg-brand-500 text-white shadow-green"
                      : "text-slate-600 hover:text-brand-700 hover:bg-brand-50"
                  }`}>
                  {s.s}
                </button>
              ))
            ) : (
              NAV.map(n => {
                const active = isActive(n.href);
                return (
                  <Link key={n.href} href={n.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all relative ${
                      active
                        ? "bg-brand-500 text-white shadow-green"
                        : "text-slate-600 hover:text-brand-700 hover:bg-brand-50"
                    }`}
                    style={active ? { boxShadow: "0 0 0 3px rgba(16,185,129,0.18), 0 4px 14px rgba(16,185,129,0.3)" } : {}}>
                    <n.icon className="w-4 h-4" />
                    {n.label}
                    {active && (
                      <motion.span layoutId="nav-glow"
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{ background: "rgba(255,255,255,0.12)" }} />
                    )}
                  </Link>
                );
              })
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2.5 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-100">
                <Bell className="w-5 h-5" />
                {unread.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white" />
                )}
              </button>
              <AnimatePresence>
                {showNotifs && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-float border border-slate-100 overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <span className="font-bold text-slate-800 text-sm">Notifications</span>
                      <div className="flex gap-2">
                        {unread.length > 0 && (
                          <button onClick={markAllRead} className="text-xs text-brand-600 font-semibold hover:text-brand-700">
                            Mark all read
                          </button>
                        )}
                        <button onClick={() => setShowNotifs(false)} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                      {notifications.slice(0, 8).length === 0 ? (
                        <p className="text-center py-8 text-slate-400 text-sm">No notifications</p>
                      ) : notifications.slice(0, 8).map(n => (
                        <div key={n.id} onClick={() => markRead(n.id)}
                          className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${!n.read ? "bg-brand-50/40" : ""}`}>
                          <div className="flex items-start gap-2">
                            {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />}
                            <div className={!n.read ? "" : "pl-4"}>
                              <p className="font-semibold text-slate-800 text-xs">{n.title}</p>
                              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{n.body}</p>
                              <p className="text-slate-400 text-[10px] mt-1">{n.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Home button */}
            {pathname !== "/" && (
              <Link href="/"
                className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-brand-700 hover:bg-brand-50 border border-slate-200 transition-all">
                <Home className="w-4 h-4" /> Home
              </Link>
            )}

            {/* CTA */}
            <Link href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-green transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#059669,#10B981)" }}>
              Open Farm
            </Link>

            {/* Mobile menu */}
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-6 overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <span className="font-bold text-slate-900">Menu</span>
                <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-1">
                {NAV.map(n => {
                  const active = isActive(n.href);
                  return (
                    <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        active ? "bg-brand-500 text-white shadow-green" : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
                      }`}>
                      <n.icon className="w-5 h-5" /> {n.label}
                    </Link>
                  );
                })}
                <Link href="/contact" onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-brand-50 hover:text-brand-700">
                  <Mail className="w-5 h-5" /> Contact
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
