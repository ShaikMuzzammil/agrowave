"use client";
// ─────────────────────────────────────────────────────────────────────────────
// AgroWave – Home / Landing Page
// Features: Cinematic intro animation, hero, features, stats, contact section
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sprout, BarChart3, Cloud, TrendingUp, Package, Map,
  ChevronRight, Leaf, Star, ArrowRight, Mail, Phone,
  MapPin, Send, CheckCircle2, Zap, Shield, Users
} from "lucide-react";

// ── Floating particle ─────────────────────────────────────────────────────
function Particle({ x, y, size, duration, delay, color }: {
  x: number; y: number; size: number; duration: number; delay: number; color: string;
}) {
  return (
    <div
      className="intro-particle"
      style={{
        left: `${x}%`, bottom: "-20px", width: size, height: size,
        background: color, opacity: 0.7,
        animationDuration: `${duration}s`, animationDelay: `${delay}s`,
      }}
    />
  );
}

// ── Animated crop rows (SVG) ─────────────────────────────────────────────
function CropRows() {
  return (
    <svg viewBox="0 0 800 400" className="w-full h-full opacity-30" preserveAspectRatio="xMidYMid slice">
      {Array.from({ length: 20 }, (_, i) => (
        <g key={i}>
          <line x1={i * 42} y1="0" x2={i * 42} y2="400" stroke="#22c55e" strokeWidth="1" />
          {Array.from({ length: 12 }, (_, j) => (
            <circle key={j}
              cx={i * 42 + 21} cy={j * 35 + 17}
              r={4 + Math.sin(i + j) * 2}
              fill="#22c55e" opacity={0.6 + Math.random() * 0.4}
            >
              <animate attributeName="r" values={`${3 + Math.sin(i + j) * 1.5};${5 + Math.sin(i + j) * 1.5};${3 + Math.sin(i + j) * 1.5}`}
                dur={`${2 + Math.random() * 2}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      ))}
      {/* Diagonal paths */}
      <path d="M 0 200 Q 200 150 400 200 Q 600 250 800 200" stroke="#4ade80" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M 0 100 Q 400 50 800 100" stroke="#86efac" strokeWidth="1" fill="none" opacity="0.3" />
    </svg>
  );
}

// ════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [introPhase, setIntroPhase] = useState<"loading" | "ready" | "exiting">("loading");
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 8,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 6,
      color: ["#22c55e", "#4ade80", "#86efac", "#bbf7d0", "#fbbf24", "#a3e635"][Math.floor(Math.random() * 6)],
    }))
  );
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const contactRef = useRef<HTMLElement>(null);

  // Intro sequence
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("ready"), 1200);
    return () => clearTimeout(t1);
  }, []);

  function handleStart() {
    setIntroPhase("exiting");
    setTimeout(() => setShowIntro(false), 600);
  }

  async function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactStatus("sent");
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setContactStatus("error");
      }
    } catch {
      setContactStatus("error");
    }
    setTimeout(() => setContactStatus("idle"), 5000);
  }

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (showIntro) {
    return (
      <div
        className="intro-canvas"
        style={{
          opacity: introPhase === "exiting" ? 0 : 1,
          transition: "opacity 0.6s ease-in-out",
        }}
      >
        {/* Animated crop rows background */}
        <div className="absolute inset-0 overflow-hidden">
          <CropRows />
        </div>

        {/* Floating particles */}
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}

        {/* Ambient glow orbs */}
        <div className="glow-green w-96 h-96 -top-20 -left-20" />
        <div className="glow-green w-80 h-80 bottom-10 right-10" style={{ background: "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)" }} />

        {/* Main intro content */}
        <div
          className="relative z-10 text-center px-6 flex flex-col items-center gap-8"
          style={{
            opacity: introPhase === "loading" ? 0 : 1,
            transform: introPhase === "loading" ? "translateY(24px)" : "translateY(0)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          {/* Logo mark */}
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30"
            style={{ animation: "live-pulse 2s infinite" }}>
            <Leaf className="text-white" size={36} />
          </div>

          {/* Title */}
          <div>
            <h1 className="text-6xl font-black text-white leading-none tracking-tight">
              Agro<span className="text-emerald-400">Wave</span>
            </h1>
            <p className="text-emerald-300/80 text-lg font-medium tracking-widest uppercase mt-2">
              Smart Farming Platform
            </p>
          </div>

          {/* Farm context */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-emerald-200/70 text-sm font-medium">KHARIF 2026 · Day 47 of 120</p>
            <div className="flex items-center gap-2 text-emerald-300/60 text-xs">
              <span className="live-dot" />
              <span>6 Plots Active · 23.0 Acres Under Cultivation</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8 text-center">
            {[
              { label: "Total Acreage", value: "23 ac" },
              { label: "Avg Health", value: "79%" },
              { label: "Plots Active", value: "6" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="text-2xl font-black text-emerald-400">{s.value}</span>
                <span className="text-xs text-emerald-200/60 uppercase tracking-wider">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Start button */}
          <button onClick={handleStart} className="start-btn">
            <span className="relative z-10 flex items-center gap-3">
              <span>🌾</span>
              Start Experience
              <ChevronRight size={20} />
            </span>
          </button>

          <p className="text-emerald-300/40 text-xs">
            Click to enter your farm dashboard
          </p>
        </div>

        {/* Loading indicator */}
        {introPhase === "loading" && (
          <div className="absolute bottom-8 flex flex-col items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-1.5 h-6 bg-emerald-500/50 rounded-full"
                  style={{ animation: `live-pulse ${0.5 + i * 0.15}s ease-in-out infinite` }} />
              ))}
            </div>
            <p className="text-emerald-400/50 text-xs">Initialising farm data...</p>
          </div>
        )}
      </div>
    );
  }

  // ── Main landing page ────────────────────────────────────────────────────
  return (
    <div className="bg-white">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 min-h-[600px] flex items-center">
        {/* Background crop pattern */}
        <div className="absolute inset-0 opacity-10">
          <CropRows />
        </div>
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/30">
              <span className="live-dot" />
              KHARIF 2026 — Day 47 of 120
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              Your Farm,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                Intelligently
              </span>{" "}
              Managed
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              AgroWave brings real-time crop monitoring, AI-powered advisories, live market
              prices, and precision irrigation control — all in one seamless dashboard.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:scale-105">
                Open Dashboard <ArrowRight size={18} />
              </Link>
              <Link href="/land"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all">
                View Land Map <Map size={18} />
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-2">
              {[["23 ac", "Total Acreage"], ["6", "Active Plots"], ["79%", "Avg Health"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black text-emerald-400">{v}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card preview */}
          <div className="hidden lg:block">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">Live Farm Status</span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-xs">
                  <span className="live-dot" /> Live
                </span>
              </div>
              {[
                { name: "North Field", crop: "Wheat · Tillering", pct: 94, moisture: 91, status: "OPEN" },
                { name: "East Block", crop: "Rice · Panicle Init.", pct: 75, moisture: 49, status: "OPEN" },
                { name: "South Field", crop: "Cotton · Boll Formation", pct: 45, moisture: 24, status: "WARNING" },
              ].map((p) => (
                <div key={p.name} className="bg-white/5 rounded-xl p-3.5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">{p.name}</p>
                      <p className="text-slate-400 text-xs">{p.crop}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.status === "OPEN" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                        "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}>{p.status}</span>
                      <span className="text-white font-bold text-sm">{p.pct}%</span>
                    </div>
                  </div>
                  <div className="moisture-bar-track">
                    <div className="moisture-bar-fill"
                      style={{ width: `${p.moisture}%`, background: p.moisture < 30 ? "#ef4444" : p.moisture < 60 ? "#f59e0b" : "#22c55e" }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{p.moisture}% moisture</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features grid ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Everything Your Farm Needs</h2>
            <p className="text-slate-500 mt-2 text-lg">Six integrated modules, one unified platform</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { href: "/dashboard", icon: BarChart3, color: "from-emerald-500 to-green-400", bg: "bg-emerald-50", title: "Smart Dashboard", desc: "Real-time metrics for all 6 plots — moisture, health, temperature, growth completion, and instant irrigation controls." },
              { href: "/fields", icon: Sprout, color: "from-green-500 to-teal-400", bg: "bg-green-50", title: "My Fields", desc: "Detailed per-plot analytics with health history charts, NPK levels, pest risk assessment, and manual override." },
              { href: "/weather", icon: Cloud, color: "from-sky-500 to-blue-400", bg: "bg-sky-50", title: "Weather Intelligence", desc: "7-day forecast with rain probability, temperature ranges, and automatic irrigation scheduling based on rainfall." },
              { href: "/market", icon: TrendingUp, color: "from-amber-500 to-yellow-400", bg: "bg-amber-50", title: "Market Prices", desc: "Live crop prices with 7-day trends, MSP comparison, P&L calculator, and price alert notifications." },
              { href: "/inventory", icon: Package, color: "from-violet-500 to-purple-400", bg: "bg-violet-50", title: "Inventory Manager", desc: "Track seeds, fertilizers, pesticides, fuel, and tools. Auto-alerts when stock falls below minimum threshold." },
              { href: "/land", icon: Map, color: "from-teal-500 to-emerald-400", bg: "bg-teal-50", title: "Land View", desc: "Real satellite-style land visualization with plot status overlays, threshold controls, and printable reports." },
            ].map(({ href, icon: Icon, color, bg, title, desc }) => (
              <Link key={href} href={href}
                className="group terra-card hover:border-emerald-200 hover:-translate-y-1 flex flex-col gap-4 transition-all">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                  <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center shadow-sm`}>
                    <Icon size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                    {title} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-emerald-700 to-emerald-500">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-white text-center">
          {[
            { icon: <Zap size={24} />, value: "< 5s", label: "Data Refresh Rate" },
            { icon: <Shield size={24} />, value: "99.9%", label: "Monitoring Uptime" },
            { icon: <Users size={24} />, value: "6", label: "Active Farm Plots" },
            { icon: <Star size={24} />, value: "23 ac", label: "Total Managed Area" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">{s.icon}</div>
              <div className="text-3xl font-black">{s.value}</div>
              <div className="text-emerald-100/80 text-sm uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Advisory preview ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Farm Advisory This Week</h2>
            <p className="text-slate-500 mt-2">AI-powered actionable insights for your crops</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { emoji: "💧", title: "Irrigation Advisory", color: "border-sky-200 bg-sky-50", tc: "text-sky-700",
                msg: "Rain expected Wed–Thu. Skip irrigation for North Field and West Block on Tuesday. Save approx ₹800 in water costs." },
              { emoji: "🐛", title: "Post-Rain Pest Risk", color: "border-rose-200 bg-rose-50", tc: "text-rose-700",
                msg: "High armyworm activity expected after rains. Inspect South Field on Friday morning. Keep chlorpyrifos ready." },
              { emoji: "🌱", title: "Fertilizer Timing", color: "border-amber-200 bg-amber-50", tc: "text-amber-700",
                msg: "Do NOT apply DAP until after the rain cycle (Thu). Apply Friday–Saturday morning for best soil uptake and absorption." },
              { emoji: "🌾", title: "Harvest Opportunity", color: "border-emerald-200 bg-emerald-50", tc: "text-emerald-700",
                msg: "Dry window Fri–Sun is ideal for soybean harvest. Schedule combine now — forecast shows 0% rain probability those days." },
            ].map((a) => (
              <div key={a.title} className={`flex items-start gap-4 p-5 rounded-xl border ${a.color}`}>
                <span className="text-3xl">{a.emoji}</span>
                <div>
                  <h4 className={`font-bold ${a.tc} text-sm`}>{a.title}</h4>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">{a.msg}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all">
              View Full Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Contact section ─────────────────────────────────────────────────── */}
      <section id="contact-section" ref={contactRef} className="py-20 bg-slate-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Get in Touch</h2>
            <p className="text-slate-500 mt-2">Have a question about your farm? We reply within 24 hours.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info cards */}
            <div className="space-y-4">
              {[
                { icon: Mail, color: "bg-emerald-100 text-emerald-700", title: "Email Support", value: "farm@agrowave.in", sub: "Response within 24 hours" },
                { icon: Phone, color: "bg-sky-100 text-sky-700", title: "Phone / WhatsApp", value: "+91 98765 43210", sub: "Mon–Sat, 8am–6pm IST" },
                { icon: MapPin, color: "bg-amber-100 text-amber-700", title: "Farm Location", value: "Hyderabad, Telangana", sub: "KHARIF 2026 Season" },
              ].map(({ icon: Icon, color, title, value, sub }) => (
                <div key={title} className="terra-card flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{title}</p>
                    <p className="text-slate-700 text-sm font-medium">{value}</p>
                    <p className="text-slate-400 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2 terra-card">
              <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                <Mail size={18} className="text-emerald-600" />
                Send a Message
              </h3>
              {contactStatus === "sent" ? (
                <div className="flex flex-col items-center gap-4 py-10 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Message Sent!</p>
                    <p className="text-slate-500 text-sm mt-1">We'll get back to you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Your Name *</label>
                      <input className="terra-input" placeholder="Rajesh Kumar"
                        value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address *</label>
                      <input type="email" className="terra-input" placeholder="rajesh@farm.in"
                        value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Subject</label>
                    <input className="terra-input" placeholder="e.g. Irrigation schedule query"
                      value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message *</label>
                    <textarea rows={4} className="terra-input resize-none" placeholder="Describe your query or issue..."
                      value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required />
                  </div>
                  {contactStatus === "error" && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                      ❌ Failed to send. Please try again or email us directly.
                    </p>
                  )}
                  <button type="submit"
                    disabled={contactStatus === "sending"}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-sm">
                    {contactStatus === "sending" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                  <p className="text-xs text-slate-400 text-center">
                    Messages are delivered via Resend API. Your email is never shared.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Leaf size={16} />
            </div>
            <div>
              <div className="font-black text-sm">AgroWave</div>
              <div className="text-xs text-slate-400 tracking-widest uppercase">TerraForge AI</div>
            </div>
          </div>
          <p className="text-slate-400 text-sm">KHARIF 2026 · Day 47 of 120 · 6 Plots Active</p>
          <p className="text-slate-500 text-xs">© 2026 AgroWave. Built for precision farming.</p>
        </div>
      </footer>
    </div>
  );
}
