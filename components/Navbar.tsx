"use client";
// ─────────────────────────────────────────────────────────────────────────────
// AgroWave – Navbar
// Features: navigation links, notification bell, mobile drawer, guide button
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Sprout, Cloud, TrendingUp, Package,
  CalendarDays, Map, Bell, Home, Menu, X, ChevronRight,
  HelpCircle, Leaf, AlertCircle, CheckCircle2
} from "lucide-react";

// ── Notification data ────────────────────────────────────────────────────────
const NOTIFICATIONS = [
  {
    id: "n1", type: "alert" as const, read: false,
    title: "Low Stock Alert",
    body: "DAP Fertilizer & Chlorpyrifos 20% EC below minimum threshold.",
    time: "5 min ago", icon: "⚠️",
  },
  {
    id: "n2", type: "info" as const, read: false,
    title: "Rain Forecast",
    body: "80% rain probability on Wednesday. Auto-irrigation paused.",
    time: "1 hr ago", icon: "🌧️",
  },
  {
    id: "n3", type: "success" as const, read: true,
    title: "Soybean Pod Fill Complete",
    body: "West Block reached 82% completion – harvest window approaching.",
    time: "2 hr ago", icon: "✅",
  },
  {
    id: "n4", type: "alert" as const, read: false,
    title: "Pest Risk – South Field",
    body: "High armyworm activity detected. Inspect and apply chlorpyrifos.",
    time: "3 hr ago", icon: "🐛",
  },
  {
    id: "n5", type: "info" as const, read: true,
    title: "Market Update",
    body: "Tomato prices up 6.06% today. Consider spot sale.",
    time: "5 hr ago", icon: "📈",
  },
];

// ── Nav links ────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: "/dashboard",  label: "Dashboard",  icon: LayoutDashboard },
  { href: "/fields",     label: "My Fields",  icon: Sprout },
  { href: "/weather",    label: "Weather",    icon: Cloud },
  { href: "/market",     label: "Market",     icon: TrendingUp },
  { href: "/inventory",  label: "Inventory",  icon: Package },
  { href: "/calendar",   label: "Calendar",   icon: CalendarDays },
  { href: "/land",       label: "Land",       icon: Map,   isNew: true },
];

// ── Feature guides per page ──────────────────────────────────────────────────
const PAGE_GUIDES: Record<string, { title: string; tips: string[] }> = {
  "/":           { title: "Home – AgroWave",   tips: ["Scroll to explore all features","Click 'Open Farm' to enter the dashboard","Contact form at the bottom sends real emails"] },
  "/dashboard":  { title: "Dashboard Guide",   tips: ["Top cards show live farm metrics","Field Overview cards update every 5 sec","Click any Live Farm Map plot for details","Farm Health Radar shows 5 key indicators","Print button (top-right) generates a report"] },
  "/fields":     { title: "My Fields Guide",   tips: ["Cards show each plot's real-time data","Click 'Irrigate' to trigger watering","Add New Plot opens a form at the bottom","Use the search bar to filter fields"] },
  "/weather":    { title: "Weather Guide",     tips: ["7-day forecast with rain probability","Scroll down for hourly breakdown","Alerts section shows critical weather events"] },
  "/market":     { title: "Market Guide",      tips: ["Click a crop tab to see price details","Use P&L Calculator to estimate profit","Set Price Alerts to get notified on thresholds","Charts show 7-day price trend"] },
  "/inventory":  { title: "Inventory Guide",   tips: ["Red items = below minimum stock","Click category pills to filter items","Use + / – buttons to adjust quantities","Low Stock Alert banner lists critical items"] },
  "/calendar":   { title: "Calendar Guide",    tips: ["Click any date to see events","Color-coded by activity type","Add events with the + button","Print monthly plan from the top-right"] },
  "/land":       { title: "Land View Guide",   tips: ["OPEN = plot meets all thresholds","WARNING = one or more metrics borderline","Adjust sliders in Threshold Settings","Click a plot card for 7-day history","Print Report generates a full land report"] },
  "/contact":    { title: "Contact Guide",     tips: ["Fill in all fields to send a message","Messages go directly to the farm manager","Response within 24 hours on working days"] },
};

// ════════════════════════════════════════════════════════════════════════════
export default function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const guide = PAGE_GUIDES[pathname] ?? PAGE_GUIDES["/dashboard"];

  // Close panels when clicking outside
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (guideRef.current && !guideRef.current.contains(e.target as Node)) setGuideOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }

  return (
    <>
      {/* ── Main Navbar ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-screen-2xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-emerald-200 group-hover:shadow-md transition-shadow">
              <Leaf className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <div className="hidden sm:block leading-none">
              <div className="font-black text-slate-900 text-sm tracking-tight">AgroWave</div>
              <div className="text-xs text-slate-500 font-medium tracking-widest uppercase">Smart Farming</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 mx-4">
            {NAV_LINKS.map(({ href, label, icon: Icon, isNew }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                      : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                  {isNew && !active && (
                    <span className="ml-0.5 text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      New
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            {/* Guide button */}
            <div ref={guideRef} className="relative">
              <button
                onClick={() => { setGuideOpen(!guideOpen); setNotifOpen(false); }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                title="Page Guide"
                aria-label="Feature guide"
              >
                <HelpCircle size={18} />
              </button>
              {guideOpen && (
                <div className="guide-panel right-0">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle size={16} className="text-emerald-600" />
                    <span className="font-bold text-slate-900 text-sm">{guide.title}</span>
                  </div>
                  <ul className="space-y-2">
                    {guide.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-slate-400 border-t border-slate-100 pt-3">
                    💡 Hover over any element for more details
                  </p>
                </div>
              )}
            </div>

            {/* Notification bell */}
            <div ref={notifRef} className="relative">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setGuideOpen(false); }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-all relative"
                aria-label="Notifications"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell size={15} className="text-emerald-600" />
                      <span className="font-bold text-slate-900 text-sm">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-emerald-600 font-semibold hover:text-emerald-800">
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!n.read ? "bg-emerald-50/60" : ""}`}
                      >
                        <span className="text-xl mt-0.5 shrink-0">{n.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${n.read ? "text-slate-700" : "text-slate-900"}`}>
                              {n.title}
                            </span>
                            {!n.read && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="px-4 py-2.5 text-center border-t border-slate-100">
                    <span className="text-xs text-slate-500">Real-time alerts from your farm</span>
                  </div>
                </div>
              )}
            </div>

            {/* Home link */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all"
            >
              <Home size={15} />
              <span>Home</span>
            </Link>

            {/* Open Farm CTA */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-emerald-200 hover:shadow-md"
            >
              Open Farm
              <ChevronRight size={15} />
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 hover:bg-slate-100"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* ── Live monitoring bar ─────────────────────────────────────────── */}
        {pathname.startsWith("/dashboard") || pathname.startsWith("/land") || pathname.startsWith("/fields") ? (
          <div className="bg-emerald-600 text-white text-xs font-medium px-4 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-bold tracking-wider uppercase opacity-80">Live Monitoring</span>
              <span>KHARIF 2026 · Day 47 of 120</span>
              <span className="flex items-center gap-1">
                <span className="live-dot" />
                <span>6 Plots Active</span>
              </span>
            </div>
            <span className="opacity-75">Auto-refresh every 5s</span>
          </div>
        ) : null}
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="relative ml-auto w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Leaf size={14} className="text-white" />
                </div>
                <span className="font-black text-slate-900">AgroWave</span>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100">
                <X size={16} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-1">
              {NAV_LINKS.map(({ href, label, icon: Icon, isNew }) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setDrawerOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-emerald-600 text-white"
                        : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                    {isNew && (
                      <span className="ml-auto text-[10px] font-bold bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-100">
              <Link
                href="/dashboard"
                onClick={() => setDrawerOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm"
              >
                Open Farm <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
