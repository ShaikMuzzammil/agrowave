"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Sprout, BarChart3, Cloud, ShoppingCart,
  Package, Calendar, Map, Zap, Shield, TrendingUp,
  Users, CheckCircle, Star, ChevronDown, Mail, Phone,
  Droplets, Thermometer, Activity, Globe, Award, Leaf,
  Bot, Wifi, LineChart, FlaskConical
} from "lucide-react";
import { useRef } from "react";

const NAV_LINKS = [
  {href:"/dashboard",     label:"Dashboard"},
  {href:"/field-monitor", label:"My Fields"},
  {href:"/weather",       label:"Weather"},
  {href:"/market",        label:"Market"},
  {href:"/inventory",     label:"Inventory"},
  {href:"/calendar",      label:"Calendar"},
  {href:"#contact",       label:"Contact"},
];

const FEATURES = [
  {icon:BarChart3, title:"Real-Time Dashboard",    desc:"Live soil moisture, temperature, health and NPK data across all 6 plots with animated progress rings.",              color:"#059669", bg:"#ECFDF5"},
  {icon:Cloud,     title:"7-Day Weather Forecast", desc:"Hyper-local rainfall and temperature forecasts with AI-powered irrigation recommendations.",                          color:"#3B82F6", bg:"#EFF6FF"},
  {icon:TrendingUp,title:"Market Intelligence",    desc:"Live MSP + mandi rates from 600+ markets. P&L calculator with break-even and ROI analysis.",                          color:"#F59E0B", bg:"#FFFBEB"},
  {icon:Package,   title:"Inventory Hub",          desc:"Track seeds, fertilizers, pesticides and tools with real-time low-stock alerts and total value.",                      color:"#8B5CF6", bg:"#F5F3FF"},
  {icon:Map,       title:"Real-Land Satellite View",desc:"Live satellite + terrain overlay of all farm sections. Click any plot for detailed analytics.",                       color:"#EC4899", bg:"#FDF2F8"},
  {icon:Bot,       title:"AI Farm Assistant",      desc:"Ask questions about your farm and get GPT-4 powered insights streamed in real time.",                                  color:"#0EA5E9", bg:"#F0F9FF"},
  {icon:Calendar,  title:"Smart Calendar",          desc:"Schedule irrigation, spraying and harvests with conflict detection and weekly advisory.",                               color:"#10B981", bg:"#ECFDF5"},
  {icon:Wifi,      title:"WebSocket Updates",       desc:"Data refreshes every 5 seconds via WebSocket. No page reload — moisture and temperature always live.",                 color:"#F43F5E", bg:"#FFF1F2"},
];

const STATS = [
  {v:"6",      l:"Live Farm Plots",      icon:"🌾"},
  {v:"99.2%",  l:"Forecast Accuracy",    icon:"🎯"},
  {v:"600+",   l:"Markets Tracked",      icon:"📊"},
  {v:"5s",     l:"WebSocket Refresh",    icon:"⚡"},
];

const WHY_CARDS = [
  {icon:"🧑‍🌾", title:"Built for Indian Farmers",   desc:"MSP data, Kharif/Rabi seasons, INR pricing, and mandi rates from Azadpur to Yeshwantpur — all tailored for India."},
  {icon:"📱",  title:"Works on Any Device",         desc:"Fully responsive on mobile, tablet and desktop. Use it on your phone in the field, or on a laptop in the office."},
  {icon:"🔒",  title:"Your Data Stays with You",    desc:"No account required. All farm data is stored locally in your browser — no cloud, no server, no privacy risk."},
  {icon:"⚡",  title:"Real-Time Intelligence",      desc:"WebSocket-powered live updates every 5 seconds. Satellite land view, AI assistant and live market prices."},
  {icon:"📈",  title:"Actionable Profitability",    desc:"The P&L calculator tells you exactly when to sell, break-even price per quintal, and ROI across all crops."},
  {icon:"🌱",  title:"Zero Hardware Required",      desc:"Start immediately with manual data entry. IoT sensor integration can be added later — no upfront hardware cost."},
];

const PLOT_PREVIEW = [
  {name:"North Field",  crop:"Wheat",   moisture:91, health:94, temp:32.1, badge:"Optimal",   color:"#10B981"},
  {name:"East Block",   crop:"Rice",    moisture:49, health:75, temp:34.0, badge:"Medium",     color:"#F59E0B"},
  {name:"West Block",   crop:"Soybean", moisture:68, health:88, temp:30.7, badge:"Good",       color:"#10B981"},
  {name:"South Field",  crop:"Cotton",  moisture:24, health:63, temp:32.2, badge:"Critical",   color:"#F43F5E"},
  {name:"Central Plot", crop:"Maize",   moisture:57, health:82, temp:31.8, badge:"Good",       color:"#10B981"},
  {name:"Border Strip", crop:"Onion",   moisture:62, health:91, temp:29.6, badge:"Optimal",    color:"#10B981"},
];

const COMPARISONS = [
  {feature:"Real-time soil monitoring",         ours:true,  basic:false, manual:false},
  {feature:"AI-powered insights",               ours:true,  basic:false, manual:false},
  {feature:"Live market & mandi prices",        ours:true,  basic:true,  manual:false},
  {feature:"Satellite land view",               ours:true,  basic:false, manual:false},
  {feature:"P&L profitability calculator",      ours:true,  basic:true,  manual:false},
  {feature:"7-day weather forecasts",           ours:true,  basic:true,  manual:false},
  {feature:"WebSocket live data (5s refresh)",  ours:true,  basic:false, manual:false},
  {feature:"Zero cost, no account needed",      ours:true,  basic:false, manual:true},
];

const TESTIMONIALS = [
  {name:"Rajesh Patel",    loc:"Gujarat",       text:"AgroWave showed me my South Field cotton was at 24% moisture — I would have missed the irrigation window. Saved the season.", stars:5},
  {name:"Meena Kulkarni",  loc:"Maharashtra",   text:"The P&L calculator helped me realize I was selling at below break-even. Now I wait for the right mandi price.",             stars:5},
  {name:"Arjun Reddy",     loc:"Telangana",     text:"The 7-day forecast warned me about 80% rain on Wednesday. I skipped irrigation on Tuesday and saved ₹800.",                  stars:5},
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY       = useTransform(scrollY, [0, 400], [0, -80]);

  return (
    <main className="overflow-x-hidden">
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden"
        style={{background:"linear-gradient(160deg,#0F172A 0%,#1E293B 40%,#0F2D27 100%)"}}>
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30"/>
          {[...Array(20)].map((_,i)=>(
            <motion.div key={i}
              initial={{opacity:0, scale:0}}
              animate={{opacity:[0,.5,0], scale:[0,1,0], x:[0,(i%2?1:-1)*50,0], y:[0,-80,0]}}
              transition={{duration:4+i*0.3, repeat:Infinity, delay:i*0.5, ease:"easeInOut"}}
              className="absolute rounded-full"
              style={{
                width:4+i%6*4, height:4+i%6*4,
                background:`hsl(${140+i*12},80%,${60+i%3*10}%)`,
                left:`${5+i*5}%`, top:`${20+i*3}%`,
              }}/>
          ))}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{background:"radial-gradient(circle,rgba(16,185,129,0.12),transparent)"}}/>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl"
            style={{background:"radial-gradient(circle,rgba(59,130,246,0.08),transparent)"}}/>
        </div>

        <motion.div style={{opacity:heroOpacity,y:heroY}} className="container relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
                <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 text-green-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <span className="dot-live"/>  KHARIF 2026 · Day 47 of 120 · 6 Plots Active
                </div>
              </motion.div>

              <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                className="text-5xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
                Smart Farming<br/>
                <span className="grad-text">Intelligence</span><br/>
                Platform
              </motion.h1>

              <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.35}}
                className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                Monitor 6 live farm plots with real-time soil data, AI insights, satellite land view, and live market prices — all in one dashboard. Built for Kharif 2026.
              </motion.p>

              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}
                className="flex flex-wrap gap-4">
                <Link href="/dashboard" className="btn btn-primary text-base px-7 py-3.5"
                  style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 8px 28px rgba(16,185,129,0.4)"}}>
                  Open Dashboard <ArrowRight className="w-5 h-5"/>
                </Link>
                <Link href="/land" className="btn btn-outline text-base px-7 py-3.5 text-white border-white/20 hover:bg-white/8 hover:border-white/40">
                  <Map className="w-5 h-5"/> Land View
                </Link>
              </motion.div>

              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}}
                className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/10">
                {STATS.map((s,i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-2xl font-bold text-white">{s.v}</div>
                    <div className="text-xs text-slate-400">{s.l}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Hero: Live Plot Preview Cards */}
            <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{delay:0.4}}
              className="hidden lg:grid grid-cols-2 gap-3">
              {PLOT_PREVIEW.map((p,i) => (
                <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5+i*0.08}}
                  whileHover={{scale:1.03,y:-2}} className="rounded-2xl p-4 cursor-pointer"
                  style={{
                    background:"rgba(255,255,255,0.05)",
                    border:"1px solid rgba(255,255,255,0.1)",
                    backdropFilter:"blur(12px)",
                  }}>
                  <div className="flex justify-between mb-3">
                    <div>
                      <p className="font-bold text-white text-sm">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.crop}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{background:`${p.color}25`,color:p.color}}>{p.badge}</span>
                  </div>
                  <div className="relative w-10 h-10 mb-3">
                    <svg viewBox="0 0 40 40" className="w-full h-full -rotate-90">
                      <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
                      <circle cx="20" cy="20" r="16" fill="none" strokeWidth="4"
                        stroke={p.color} strokeDasharray={`${(p.moisture/100)*100} 100`}
                        strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">{p.moisture}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex justify-between">
                    <span>🌡 {p.temp}°C</span>
                    <span>💪 {p.health}%</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-slate-400"/>
        </div>
      </section>

      {/* ─── WHY AGROWAVE ─────────────────────────────────────── */}
      <section className="section" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#F8FAFC 100%)"}}>
        <div className="container">
          <div className="text-center mb-14">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
              <span className="section-label mb-4"><Leaf className="w-3.5 h-3.5"/> Why AgroWave</span>
              <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-4">
                Designed for the <span className="grad-text">Modern Farmer</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                AgroWave transforms raw farm data into actionable intelligence — so every irrigation, every spray, every market decision is data-driven.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CARDS.map((c,i) => (
              <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}
                whileHover={{scale:1.02,y:-3}}
                className="card p-7 border-2 border-slate-100 hover:border-brand-200 transition-all"
                style={{boxShadow:"0 2px 16px rgba(0,0,0,0.05)"}}>
                <div className="text-4xl mb-4">{c.icon}</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{c.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────────────── */}
      <section className="section" style={{background:"linear-gradient(160deg,#EFF6FF 0%,#F0FDF4 100%)"}}>
        <div className="container">
          <div className="text-center mb-14">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
              <span className="section-label mb-4"><Zap className="w-3.5 h-3.5"/> Platform Features</span>
              <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-4">
                Everything Your Farm <span className="grad-text">Needs</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-xl mx-auto">
                Eight powerful modules working together in one unified smart farming platform.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f,i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} initial={{opacity:0,scale:.95}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*0.06}}
                  whileHover={{scale:1.03,y:-4}}
                  className="card p-6 border-2 border-slate-100 hover:border-brand-200 transition-all cursor-default"
                  style={{boxShadow:"0 2px 16px rgba(0,0,0,0.04)"}}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{background:f.bg}}>
                    <Icon className="w-6 h-6" style={{color:f.color}}/>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 leading-tight">{f.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── LIVE PLOT PREVIEW ────────────────────────────────── */}
      <section className="section" style={{background:"linear-gradient(135deg,#0F172A 0%,#1E293B 50%,#0F2D27 100%)"}}>
        <div className="container">
          <div className="text-center mb-14">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
              <span className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
                <span className="dot-live"/> KHARIF 2026 — LIVE DATA
              </span>
              <h2 className="text-4xl font-bold text-white mb-4">
                6 Plots · <span className="grad-text">Real-Time Monitoring</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Every card shows live moisture, health, temperature and NPK. Data updates via WebSocket every 5 seconds.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {PLOT_PREVIEW.map((p,i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07}}
                whileHover={{scale:1.02}}
                className="rounded-2xl p-5 cursor-pointer transition-all"
                style={{
                  background:"rgba(255,255,255,0.06)",
                  border:`1.5px solid ${p.color}30`,
                  backdropFilter:"blur(12px)",
                }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-white">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.crop} · Kharif 2026</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full border"
                    style={{background:`${p.color}20`,color:p.color,borderColor:`${p.color}40`}}>{p.badge}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6"/>
                      <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6"
                        stroke={p.color} strokeDasharray={`${(p.moisture/100)*163} 163`}
                        strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{p.moisture}%</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      {l:"Health",   v:p.health,  max:100, c:p.color},
                      {l:"Temp",     v:p.temp,    max:45,  c:"#F59E0B"},
                    ].map(s=>(
                      <div key={s.l}>
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[10px] text-slate-400">{s.l}</span>
                          <span className="text-[10px] text-slate-300 font-mono">{s.v}{s.l==="Temp"?"°C":"%"}</span>
                        </div>
                        <div className="h-1.5 rounded-full" style={{background:"rgba(255,255,255,0.1)"}}>
                          <div className="h-full rounded-full" style={{width:`${(s.v/s.max)*100}%`,background:s.c}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/dashboard" className="btn btn-primary text-base px-8 py-3.5"
              style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 8px 24px rgba(16,185,129,0.4)"}}>
              Open Live Dashboard <ArrowRight className="w-5 h-5"/>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON TABLE ─────────────────────────────────── */}
      <section className="section" style={{background:"linear-gradient(160deg,#FFFBEB 0%,#F0FDF4 100%)"}}>
        <div className="container max-w-4xl">
          <div className="text-center mb-14">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
              <span className="section-label mb-4"><Award className="w-3.5 h-3.5"/> Comparison</span>
              <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-4">
                AgroWave vs <span className="grad-text">The Alternatives</span>
              </h2>
            </motion.div>
          </div>

          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            className="card overflow-hidden p-0" style={{boxShadow:"0 8px 40px rgba(0,0,0,0.08)"}}>
            <table className="w-full">
              <thead>
                <tr style={{background:"linear-gradient(135deg,#F0FDF4,#F8FAFC)",borderBottom:"2px solid #E2E8F0"}}>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-600">Feature</th>
                  <th className="px-6 py-4 text-center text-sm font-bold" style={{color:"#059669"}}>🌾 AgroWave</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-500">Basic App</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-400">Manual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISONS.map((r,i)=>(
                  <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{r.feature}</td>
                    {[r.ours,r.basic,r.manual].map((v,j)=>(
                      <td key={j} className="px-6 py-4 text-center">
                        {v ? <CheckCircle className="w-5 h-5 mx-auto" style={{color:"#059669"}}/>
                           : <span className="text-slate-200 text-xl">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="section" style={{background:"linear-gradient(160deg,#F5F3FF 0%,#EDE9FE 30%,#F0FDF4 100%)"}}>
        <div className="container">
          <div className="text-center mb-14">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
              <span className="section-label mb-4"><Star className="w-3.5 h-3.5"/> Testimonials</span>
              <h2 className="text-4xl font-bold text-slate-900 mt-4 mb-4">
                Trusted by <span className="grad-text">Real Farmers</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t,i) => (
              <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                whileHover={{scale:1.02,y:-3}}
                className="card p-7 border-2 border-slate-100 hover:border-violet-200"
                style={{boxShadow:"0 4px 20px rgba(139,92,246,0.06)"}}>
                <div className="flex mb-4">
                  {[...Array(t.stars)].map((_,j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.loc}, India</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─────────────────────────────────────────── */}
      <section id="contact" className="section" style={{background:"linear-gradient(135deg,#0F172A 0%,#1E293B 50%,#0F2D27 100%)"}}>
        <div className="container max-w-3xl text-center">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <span className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Mail className="w-4 h-4"/> Contact Us
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Get in <span className="grad-text">Touch</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Questions, partnerships, or feedback? We'd love to hear from you.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {[
                {icon:Phone, title:"Kisan Helpline", val:"1800-180-1551",  sub:"Mon–Sat, 6am–10pm"},
                {icon:Mail,  title:"Email Us",       val:"hello@agrowave.farm", sub:"Reply < 24 hours"},
                {icon:Globe, title:"Headquarters",   val:"Hyderabad, TG", sub:"India"},
              ].map((c,i)=>{
                const Icon = c.icon;
                return (
                  <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                    className="rounded-2xl p-6 text-center"
                    style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)"}}>
                    <Icon className="w-6 h-6 text-green-400 mx-auto mb-3"/>
                    <p className="text-xs text-slate-400 mb-1">{c.title}</p>
                    <p className="font-bold text-white">{c.val}</p>
                    <p className="text-xs text-slate-500 mt-1">{c.sub}</p>
                  </motion.div>
                );
              })}
            </div>

            <Link href="/contact" className="btn btn-primary text-base px-8 py-3.5 inline-flex"
              style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 8px 24px rgba(16,185,129,0.4)"}}>
              Send a Message <ArrowRight className="w-5 h-5"/>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ────────────────────────────────────────────── */}
      <footer style={{background:"#060F0C",borderTop:"1px solid rgba(16,185,129,0.15)"}} className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white"/>
                </div>
                <div>
                  <p className="font-bold text-white text-sm">AgroWave</p>
                  <p className="text-[10px] text-green-400 uppercase tracking-wider">Smart Farming</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">AI-powered precision agriculture platform for Kharif 2026 — built with Next.js 14, WebSockets, and real-time data.</p>
            </div>
            {[
              {title:"Platform", links:[
                {l:"Dashboard",      h:"/dashboard"},
                {l:"My Fields",      h:"/field-monitor"},
                {l:"Land View",      h:"/land"},
                {l:"Weather",        h:"/weather"},
              ]},
              {title:"Tools", links:[
                {l:"Market Prices",  h:"/market"},
                {l:"Inventory Hub",  h:"/inventory"},
                {l:"Farm Calendar",  h:"/calendar"},
                {l:"AI Assistant",   h:"/dashboard"},
              ]},
              {title:"Company", links:[
                {l:"Contact Us",     h:"/contact"},
                {l:"About",          h:"/about"},
                {l:"Privacy Policy", h:"#"},
                {l:"Open Farm →",    h:"/dashboard"},
              ]},
            ].map((col,i)=>(
              <div key={i}>
                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-widest mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l=>(
                    <li key={l.l}><Link href={l.h} className="text-slate-500 hover:text-green-400 transition-colors text-sm">{l.l}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">© 2026 AgroWave Smart Farming. Built for Kharif 2026.</p>
            <p className="text-slate-600 text-xs">Made with 💚 for Indian Farmers · Next.js 14 + WebSockets + AI</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
