"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle2, TrendingUp, Droplets, CloudRain,
  Sprout, BarChart3, Shield, Zap, Star, Bug, Package,
  Calendar, Bell, ChevronDown, Mail, Map, BookOpen,
  LayoutDashboard, Leaf, Lightbulb, Target, Info, X
} from "lucide-react";
import PriceTicker from "@/components/PriceTicker";
import StatCounter from "@/components/StatCounter";
import Card from "@/components/Card";
import { getLivePrices, CROPS, FORECAST } from "@/lib/utils";

const fadeUp = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0} };
const stagger = { show:{ transition:{ staggerChildren:0.09 } } };

const FEATURES = [
  { icon:Droplets,   title:"Live Soil Monitoring",   desc:"Real-time NPK levels, pH, and moisture across every plot.",  tag:"Real-Time",  c:"bg-brand-50 text-brand-600 border-brand-100" },
  { icon:CloudRain,  title:"Hyper-Local Weather",    desc:"7-day farm-specific forecasts with rain and frost warnings.", tag:"AI-Powered",  c:"bg-sky-50 text-sky-600 border-sky-100" },
  { icon:TrendingUp, title:"Live Market Prices",     desc:"MSP + mandi rates from 600+ markets. Set price alerts.",     tag:"Live Data",   c:"bg-amber-50 text-amber-600 border-amber-100" },
  { icon:Bug,        title:"Pest Early Warning",     desc:"AI-assisted detection of 40+ common pests.",                 tag:"AI-Assisted", c:"bg-rose-50 text-rose-600 border-rose-100" },
  { icon:Package,    title:"Inventory Management",   desc:"Track seeds, fertilizers, pesticides. Low-stock alerts.",    tag:"Smart",       c:"bg-violet-50 text-violet-600 border-violet-100" },
  { icon:Calendar,   title:"Farm Calendar",          desc:"Schedule irrigation, spraying, harvests. Reminders.",        tag:"Scheduling",  c:"bg-brand-50 text-brand-600 border-brand-100" },
  { icon:BarChart3,  title:"Yield Analytics",        desc:"Compare forecast vs actual yield and profit per crop.",      tag:"Analytics",   c:"bg-sky-50 text-sky-600 border-sky-100" },
  { icon:Bell,       title:"Smart Notifications",    desc:"Soil alerts, market spikes, weather warnings — one feed.",   tag:"Proactive",   c:"bg-amber-50 text-amber-600 border-amber-100" },
];

const GUIDE_TABS = [
  { id:"dashboard", icon:LayoutDashboard, label:"Dashboard",  color:"#10B981",
    title:"Farm Dashboard — Your Command Center",
    desc:"Live overview of all 6 plots, Farm Health Radar, 7-day forecast and the satellite land map.",
    steps:["Open Dashboard from the top nav.","Left panel: 6 field cards — click any to expand.","Use 'Irrigate All' to water all plots at once.","Centre map shows live moisture per plot colour-coded.","Right panel: Farm Health Radar + 7-day forecast.","Green status bar shows live KHARIF 2026 progress."],
    tip:"Red moisture = needs irrigation. Yellow = moderate. Green = optimal.", link:"/dashboard" },
  { id:"fields", icon:Sprout, label:"My Fields", color:"#3B82F6",
    title:"Field Monitor — Deep Plot Analytics",
    desc:"Detailed per-plot inspection with NPK editing, auto-irrigation, pest toggle and trend charts.",
    steps:["Click 'My Fields' in navigation.","Select any plot from the left panel.","Right side shows moisture, health, NPK, pH, temp.","Click 'Update NPK' to log a fertilizer application.","Toggle 'Auto-Irrigate' — auto-waters when moisture drops below 35%.","Use pest filter pills to filter by Low/Medium/High risk."],
    tip:"AUTO button in each card shows ON/OFF clearly — tap to toggle.", link:"/field-monitor" },
  { id:"weather", icon:CloudRain, label:"Weather", color:"#0EA5E9",
    title:"Weather Station — Hyper-Local Forecasts",
    desc:"7-day forecast cards, farm advisories, hourly temperature, rain probability.",
    steps:["Navigate to 'Weather' from top menu.","Current conditions card shows temp, humidity, wind, UV.","7-day cards show high/low and rain probability per day.","Farm Advisories auto-generate from the forecast.","Check before scheduling irrigation or pesticide sprays.","Rain % bar shows at a glance which days to avoid."],
    tip:"Never apply DAP on a rainy day — check the advisory first.", link:"/weather" },
  { id:"market", icon:TrendingUp, label:"Market", color:"#F59E0B",
    title:"Market Intelligence — Prices & Profit",
    desc:"Live crop prices, P&L calculator, mandi-wise rates, price alerts.",
    steps:["Open 'Market' from nav — 4 tabs available.","Live Prices: see all crops with 30-day trend.","P&L Calculator: enter area/yield/costs for net profit.","Mandi Rates: find the best-paying market near you.","Price Alerts: get notified when crop hits your target.","Filter by crop using the pill buttons."],
    tip:"Sort mandi prices to find the highest-paying market before transporting.", link:"/market" },
  { id:"inventory", icon:Package, label:"Inventory", color:"#8B5CF6",
    title:"Inventory Hub — Stock Management",
    desc:"Track seeds, fertilizers, pesticides, tools. Low-stock alerts.",
    steps:["Navigate to 'Inventory' in top menu.","Use category filter pills — active pill is green.","Red LOW badge = item below minimum threshold.","+ adds 50 units, – deducts 10 from stock.","'Add Item' opens a centered modal with cost + threshold.","Print Report generates a full printable stock sheet."],
    tip:"Set minimum thresholds for DAP and pesticides to get advance low-stock alerts.", link:"/inventory" },
  { id:"calendar", icon:Calendar, label:"Calendar", color:"#EC4899",
    title:"Farm Calendar — Task Scheduling",
    desc:"Schedule irrigation, fertilizer, harvests. See upcoming tasks on the right side.",
    steps:["Open 'Calendar' in navigation.","Click any date on the calendar grid to select it.","'Add Event' opens a modal — pick type, plot, priority, notes.","Amber dot = pending task. Green dot = completed.","Right panel shows all upcoming tasks sorted by due date.","Click any upcoming task to jump to that date."],
    tip:"Schedule irrigation 1 day before predicted rain for best soil absorption.", link:"/calendar" },
  { id:"land", icon:Map, label:"Land View", color:"#047857",
    title:"Land View — Real Satellite Parcel Map",
    desc:"Realistic SVG polygon parcels with NDVI health colours, selection glow, new-tab detail view.",
    steps:["Click 'Land' in navigation or 'Open Farm' button.","SVG map shows all 6 parcels as irregular polygon shapes.","Colour fill is NDVI-style: red = low health, green = high.","Click any parcel to select — it gets a pulsing glow border.","Double-click or click 'Open Detail' to open in a NEW TAB.","Toggle Terrain/Satellite/Hybrid basemap at top right."],
    tip:"Use the Thresholds panel to customise what makes a plot 'Warning' vs 'Open'.", link:"/land" },
];

const TESTIMONIALS = [
  { name:"Ramesh Kumar",   loc:"Maharashtra",  crop:"Wheat Farmer",   quote:"The soil alerts saved my wheat crop during the dry spell. Got the warning 2 days early and acted in time.", stars:5, img:"RK" },
  { name:"Lakshmi Devi",   loc:"Telangana",    crop:"Rice Farmer",    quote:"The market price tracker helped me sell rice exactly when prices peaked. Earned ₹12,000 more than last season.", stars:5, img:"LD" },
  { name:"Harpreet Singh", loc:"Punjab",        crop:"Soybean Farmer", quote:"Set a price alert and got notified the moment soybean hit my target. Sold at peak — best harvest season yet.", stars:5, img:"HS" },
];

const CROP_CALENDAR = [
  { name:"Rice",    start:5, end:10, color:"#10B981" },
  { name:"Cotton",  start:5, end:11, color:"#059669" },
  { name:"Soybean", start:6, end:10, color:"#34D399" },
  { name:"Wheat",   start:10,end:3,  color:"#3B82F6" },
  { name:"Mustard", start:10,end:2,  color:"#60A5FA" },
  { name:"Potato",  start:10,end:2,  color:"#93C5FD" },
];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function Home() {
  const [prices, setPrices] = useState<Record<string,any>>({});
  const [now, setNow]       = useState(new Date());
  const [guideTab, setGuideTab] = useState("dashboard");

  useEffect(() => {
    setPrices(getLivePrices());
    const iv = setInterval(() => { setPrices(getLivePrices()); setNow(new Date()); }, 60000);
    const cl = setInterval(() => setNow(new Date()), 1000);
    return () => { clearInterval(iv); clearInterval(cl); };
  }, []);

  const activeGuide = GUIDE_TABS.find(t => t.id === guideTab) || GUIDE_TABS[0];

  return (
    <div className="pt-[72px]">

      {/* ── HERO ── */}
      <section id="hero" className="hero-pattern grid-bg min-h-[88vh] flex items-center relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-8">
              <span className="dot-live"/><span className="text-brand-700 font-semibold text-sm">KHARIF 2026 · Live Farm Intelligence Active</span>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
              className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.08] mb-6 tracking-tight">
              Farm Smarter.<br/><span className="grad-text">Earn More.</span>
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
              className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time soil health, AI weather forecasts, and live mandi prices — all in one platform built for Indian farmers.
            </motion.p>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
              className="inline-flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-3 mb-10 shadow-card">
              <span className="dot-live"/><span className="font-mono text-slate-700 text-sm">{now.toLocaleTimeString("en-IN")}</span>
              <span className="w-px h-4 bg-slate-200"/>
              <span className="text-brand-600 text-sm font-semibold">{FORECAST[0].icon} {FORECAST[0].hi}°C · {FORECAST[0].desc}</span>
            </motion.div>
            <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.6}}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard" className="btn btn-primary text-base px-8 py-3.5 rounded-xl shadow-green">
                Open Farm Dashboard <ArrowRight className="w-5 h-5"/>
              </Link>
              <button onClick={()=>document.getElementById("guide")?.scrollIntoView({behavior:"smooth"})}
                className="btn btn-outline text-base px-8 py-3.5 rounded-xl">
                <BookOpen className="w-4 h-4"/> Platform Guide
              </button>
            </motion.div>
          </div>
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.8}}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {[
              {emoji:"🌾",label:"Plots Monitored",val:"6 Active",  c:"text-brand-700 bg-brand-50 border-brand-100"},
              {emoji:"💧",label:"Avg Soil Health", val:"79.7%",    c:"text-sky-700 bg-sky-50 border-sky-100"},
              {emoji:"📈",label:"Crops Tracked",   val:"8 Crops",  c:"text-amber-700 bg-amber-50 border-amber-100"},
              {emoji:"🌦️",label:"Forecast Acc.",   val:"99.2%",   c:"text-violet-700 bg-violet-50 border-violet-100"},
            ].map((s,i)=>(
              <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border ${s.c}`}>
                <span className="text-2xl">{s.emoji}</span>
                <div><div className="font-bold">{s.val}</div><div className="text-xs opacity-70">{s.label}</div></div>
              </div>
            ))}
          </motion.div>
        </div>
        <button onClick={()=>document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 rounded-full bg-white shadow-card border border-slate-200 text-slate-400 hover:text-brand-600 transition-colors animate-float">
          <ChevronDown className="w-5 h-5"/>
        </button>
      </section>

      {/* PRICE TICKER */}
      <PriceTicker/>

      {/* STATS BANNER */}
      <section className="py-14" style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <StatCounter end={24000000} prefix="₹" label="Revenue Tracked"      sub="This kharif season" dark/>
            <StatCounter end={12}       suffix="+"  label="Districts Active"     sub="Across India" dark/>
            <StatCounter end={99.2}     suffix="%"  label="Forecast Accuracy"    sub="vs national average" dark/>
            <StatCounter end={47}       suffix="+"  label="Commodities Tracked"  sub="Live mandi data" dark/>
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* FEATURES */}
      <section id="features" className="section section-green">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="text-center mb-14">
            <motion.div variants={fadeUp} className="section-label mb-4">Platform Features</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything a farmer needs.<br/><span className="grad-text">Nothing they don't.</span>
            </motion.h2>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f,i)=>{
              const Icon = f.icon;
              return (
                <motion.div key={i} variants={fadeUp}>
                  <Card className={`h-full p-6 border ${f.c}`}>
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${f.c}`}>
                      <Icon className="w-5 h-5"/>
                    </div>
                    <span className={`badge mb-3 ${f.c}`}>{f.tag}</span>
                    <h3 className="font-bold text-slate-800 text-base mb-2">{f.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* GUIDE SECTION */}
      <section id="guide" className="section section-guide">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="text-center mb-10">
            <motion.div variants={fadeUp} className="section-label mb-4"><BookOpen className="w-3 h-3"/> Platform Guide</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              How to use <span className="grad-text">AgroWave</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-2xl mx-auto">
              A complete walkthrough of every module. Click any tab to learn step by step.
            </motion.p>
          </motion.div>
          {/* Tab row */}
          <div className="flex flex-wrap gap-2 justify-center mb-7">
            {GUIDE_TABS.map(t=>{
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={()=>setGuideTab(t.id)}
                  className={`guide-tab${guideTab===t.id?" active":""}`}>
                  <Icon className="w-4 h-4"/> {t.label}
                </button>
              );
            })}
          </div>
          {/* Guide card */}
          <AnimatePresence mode="wait">
            <motion.div key={guideTab} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.22}}>
              <div className="card p-0 overflow-hidden shadow-soft max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2">
                  <div className="p-8" style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{background:`${activeGuide.color}25`,border:`1.5px solid ${activeGuide.color}40`}}>
                        <activeGuide.icon className="w-6 h-6" style={{color:activeGuide.color}}/>
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{color:activeGuide.color}}>Module Guide</div>
                        <h3 className="font-bold text-white text-base leading-snug">{activeGuide.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-5">{activeGuide.desc}</p>
                    <div className="rounded-xl p-4 mb-5" style={{background:`${activeGuide.color}18`,border:`1px solid ${activeGuide.color}35`}}>
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" style={{color:activeGuide.color}}/>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{color:activeGuide.color}}>Pro Tip</p>
                          <p className="text-slate-300 text-xs leading-relaxed">{activeGuide.tip}</p>
                        </div>
                      </div>
                    </div>
                    <Link href={activeGuide.link} className="btn btn-primary w-full py-3 text-sm"
                      style={{background:`linear-gradient(135deg,${activeGuide.color},${activeGuide.color}CC)`}}>
                      Open {activeGuide.label} <ArrowRight className="w-4 h-4"/>
                    </Link>
                  </div>
                  <div className="p-8 bg-white">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-brand-600"/> Step-by-Step Walkthrough
                    </h4>
                    <div className="space-y-2.5">
                      {activeGuide.steps.map((step,i)=>(
                        <motion.div key={i} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                          className="guide-step">
                          <div className="guide-step-num">{String(i+1).padStart(2,"0")}</div>
                          <p className="text-slate-700 text-sm leading-relaxed">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Quick nav grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-6">
            {GUIDE_TABS.map(t=>{
              const Icon = t.icon;
              return (
                <Link key={t.id} href={t.link}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-brand-200 hover:bg-brand-50 transition-all group">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{background:`${t.color}15`,border:`1.5px solid ${t.color}30`}}>
                    <Icon className="w-5 h-5" style={{color:t.color}}/>
                  </div>
                  <span className="text-xs font-semibold text-slate-600 group-hover:text-brand-700">{t.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* BENEFITS */}
      <section id="benefits" className="section section-mixed">
        <div className="container">
          <div className="text-center mb-12">
            <div className="section-label mb-3">Proven Results</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Real results, real farms</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
            {[
              {stat:"23%",  label:"Yield increase",       detail:"Average first-season improvement"},
              {stat:"₹18K", label:"Extra income",         detail:"Through better market timing"},
              {stat:"40%",  label:"Water savings",        detail:"Smart irrigation optimization"},
              {stat:"99.2%",label:"Forecast accuracy",    detail:"vs national district averages"},
            ].map((b,i)=>(
              <motion.div key={i} initial={{opacity:0,scale:.94}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*0.1}}>
                <Card className="text-center p-7">
                  <div className="text-4xl font-bold grad-text mb-1">{b.stat}</div>
                  <div className="font-semibold text-slate-800 mb-1">{b.label}</div>
                  <div className="text-xs text-slate-400">{b.detail}</div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-7 max-w-4xl mx-auto">
            <Card hover={false} className="p-7">
              <h3 className="font-bold text-xl text-slate-800 mb-4">Why it works</h3>
              <div className="space-y-3">
                {[
                  "Built specifically for Indian crops and kharif/rabi seasons",
                  "Uses real MSP data — no guesswork on minimum prices",
                  "Hyper-local forecasts at plot level, not district level",
                  "No login required — open and use immediately",
                  "Works on mobile, tablet, and desktop equally well",
                  "Data persists locally — your farm data stays with you",
                ].map((item,i)=>(
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0"/>
                    <span className="text-slate-600 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card hover={false} className="p-7 bg-brand-grad text-white border-0">
              <h3 className="font-bold text-xl mb-4">This Season's Impact</h3>
              <div className="space-y-3">
                {[
                  {l:"Irrigation water saved",  v:"38%"},
                  {l:"Pesticide cost reduction", v:"22%"},
                  {l:"Yield improvement avg",    v:"23%"},
                  {l:"Better price realisation", v:"₹18K/season"},
                  {l:"Pest losses prevented",    v:"₹12K avg"},
                ].map((s,i)=>(
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-green-100 text-sm">{s.l}</span>
                    <span className="font-bold text-white">{s.v}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* MARKET PREVIEW */}
      <section id="market-preview" className="section section-white">
        <div className="container">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="section-label mb-3">Live Market</div>
              <h2 className="text-3xl font-bold text-slate-900">Today's Mandi Rates</h2>
            </div>
            <Link href="/market" className="btn btn-outline">Full Analysis <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(CROPS).slice(0,8).map(([k,v],i)=>{
              const p = prices[k]; const up = (p?.pct||0)>=0;
              return (
                <motion.div key={k} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06}}>
                  <Card hover className="p-5">
                    <div className="flex justify-between mb-2">
                      <span className="text-3xl">{v.emoji}</span>
                      <span className={`badge ${up?"badge-green":"badge-red"}`}>{up?"▲":"▼"}{Math.abs(p?.pct||0).toFixed(1)}%</span>
                    </div>
                    <div className="font-semibold text-slate-500 text-xs uppercase mb-1">{k}</div>
                    <div className="text-2xl font-bold text-slate-900">₹{(p?.current||v.base).toLocaleString("en-IN")}</div>
                    <div className="text-xs text-slate-400 mt-0.5">per {v.unit}</div>
                    {v.msp>0 && <div className="text-xs text-brand-600 font-medium mt-1">MSP ₹{v.msp.toLocaleString("en-IN")}</div>}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* CROP CALENDAR */}
      <section className="section section-amber">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <div className="section-label mb-3">Seasonal Guide</div>
            <h2 className="text-3xl font-bold text-slate-900">Indian Crop Calendar 2026</h2>
          </div>
          <Card hover={false} className="overflow-x-auto p-6">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-12 gap-1 mb-2">
                {MONTHS.map(m=><div key={m} className="text-center text-xs font-semibold text-slate-400">{m}</div>)}
              </div>
              <div className="space-y-2.5">
                {CROP_CALENDAR.map((c,ci)=>{
                  const len = c.end >= c.start ? c.end - c.start + 1 : (12-c.start+1)+c.end;
                  const left = ((c.start-1)/12)*100;
                  const width = (len/12)*100;
                  return (
                    <motion.div key={c.name} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:ci*0.08}}>
                      <div className="relative h-9 bg-slate-100 rounded-xl overflow-hidden">
                        <div className="absolute inset-y-1 flex items-center pl-2 z-10">
                          <span className="text-xs font-semibold text-slate-600">{c.name}</span>
                        </div>
                        <motion.div initial={{width:0}} whileInView={{width:`${width}%`}} viewport={{once:true}} transition={{duration:0.9,delay:0.1+ci*0.06}}
                          className="absolute top-1 bottom-1 rounded-lg opacity-75"
                          style={{left:`${left}%`,background:c.color}}/>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex gap-5 mt-4 justify-center">
                {[{c:"#10B981",l:"Kharif"},{c:"#3B82F6",l:"Rabi"},{c:"#F59E0B",l:"Zaid"}].map(x=>(
                  <span key={x.l} className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-3 h-3 rounded" style={{background:x.c}}/>{x.l}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <div className="section-divider"/>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="section section-subtle">
        <div className="container">
          <div className="text-center mb-12">
            <div className="section-label mb-3">Farmer Stories</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Trusted across India</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.12}}>
                <Card className="p-7 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[1,2,3,4,5].map(s=><Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-5 flex-1 text-sm italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-100 border border-brand-200 flex items-center justify-center font-bold text-brand-700 text-sm">{t.img}</div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.loc} · {t.crop}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* CTA */}
      <section className="section" style={{background:"linear-gradient(135deg,#059669,#10B981,#34D399)"}}>
        <div className="container text-center">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <Zap className="w-4 h-4"/> No login · No installation · Instant access
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Ready to farm smarter?</h2>
            <p className="text-green-100 text-lg mb-8 max-w-lg mx-auto">Open the dashboard and start making data-driven decisions today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn text-base px-10 py-4 rounded-xl bg-white text-brand-700 font-bold shadow-lg">
                Open Farm Dashboard <ArrowRight className="w-5 h-5"/>
              </Link>
              <button onClick={()=>document.getElementById("guide")?.scrollIntoView({behavior:"smooth"})}
                className="btn text-base px-10 py-4 rounded-xl border-2 border-white/50 text-white hover:bg-white/10 font-semibold">
                <BookOpen className="w-4 h-4"/> View Guide
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* CONTACT — info only, link to page */}
      <section id="contact-section" className="section section-dark">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
              <div className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <Mail className="w-4 h-4"/> Get In Touch
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Questions about<br/><span className="grad-text">AgroWave?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10">
                We're here to help Indian farmers succeed. Reach out for support, partnerships, or feedback.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-10">
                {[
                  {icon:"📞", label:"Kisan Helpline", val:"1800-180-1551"},
                  {icon:"📧", label:"Email",           val:"hello@agrowave.farm"},
                  {icon:"📍", label:"Location",        val:"Hyderabad, Telangana"},
                ].map((c,i)=>(
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div className="text-left">
                      <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide">{c.label}</div>
                      <div className="text-white font-bold">{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn text-base px-10 py-4 rounded-xl font-bold inline-flex items-center gap-2"
                style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 8px 32px rgba(16,185,129,0.4)"}}>
                Open Contact Page <ArrowRight className="w-5 h-5"/>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
}
