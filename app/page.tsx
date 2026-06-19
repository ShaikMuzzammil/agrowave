"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle2, TrendingUp, Droplets, CloudRain,
  Sprout, BarChart3, Shield, Zap, Star, Play, Bug, Package,
  Calendar, Bell, ChevronDown, Mail, Map, BookOpen,
  LayoutDashboard, Leaf, ThumbsUp, Lightbulb, Target, Info, ArrowLeft, Phone
} from "lucide-react";
import PriceTicker from "@/components/PriceTicker";
import StatCounter from "@/components/StatCounter";
import Card from "@/components/Card";
import { getLivePrices, CROPS, FORECAST } from "@/lib/utils";

const fadeUp = { hidden:{opacity:0,y:24}, show:{opacity:1,y:0} };
const stagger = { show:{ transition:{ staggerChildren:0.09 } } };

const FEATURES = [
  { icon:Droplets,   title:"Live Soil Monitoring",      desc:"Real-time NPK levels, pH, and moisture across every plot. Get alerts before problems arise.",         tag:"Real-Time",  color:"bg-brand-50 text-brand-600 border-brand-100" },
  { icon:CloudRain,  title:"Hyper-Local Weather",       desc:"7-day farm-specific forecasts with rain probability, wind speed, and frost warnings.",                tag:"AI-Powered",  color:"bg-sky-50 text-sky-600 border-sky-100" },
  { icon:TrendingUp, title:"Live Market Prices",        desc:"MSP + mandi rates from 600+ markets. Set price alerts and get notified when rates hit your target.",  tag:"Live Data",   color:"bg-amber-50 text-amber-600 border-amber-100" },
  { icon:Bug,        title:"Pest Early Warning",        desc:"AI-assisted detection of 40+ common pests. Get actionable treatment plans before losses occur.",       tag:"AI-Assisted", color:"bg-rose-50 text-rose-600 border-rose-100" },
  { icon:Package,    title:"Inventory Management",      desc:"Track seeds, fertilizers, pesticides and tools. Automated low-stock alerts before you run out.",       tag:"Smart",       color:"bg-violet-50 text-violet-600 border-violet-100" },
  { icon:Calendar,   title:"Farm Activity Calendar",    desc:"Schedule irrigation, spraying, harvests. Get reminders 24h before each task.",                        tag:"Scheduling",  color:"bg-brand-50 text-brand-600 border-brand-100" },
  { icon:BarChart3,  title:"Yield Analytics",           desc:"Compare forecast vs actual yield, track profit/loss per crop, and identify your best-performing plots.",tag:"Analytics",   color:"bg-sky-50 text-sky-600 border-sky-100" },
  { icon:Bell,       title:"Smart Notifications",       desc:"Never miss a critical event. Soil alerts, market movements, weather warnings — all in one feed.",      tag:"Proactive",   color:"bg-amber-50 text-amber-600 border-amber-100" },
];

const BENEFITS = [
  { stat:"23%", label:"Average yield increase", detail:"Farmers using AgroWave see 23% higher yields in first season" },
  { stat:"₹18K", label:"Extra income per season", detail:"Through better market timing and reduced input waste" },
  { stat:"40%", label:"Water savings", detail:"Smart irrigation cuts water usage by up to 40% with no yield loss" },
  { stat:"99.2%", label:"Forecast accuracy", detail:"Our hyper-local weather model vs. national averages" },
];

const STEPS = [
  { n:"01", icon:Sprout, title:"Add Your Farm", desc:"Enter your plot details, crops, and location. No hardware needed to start — manual entry works perfectly." },
  { n:"02", icon:Bell,   title:"Get Smart Alerts", desc:"Receive real-time notifications for soil issues, weather risks, pest threats, and market opportunities." },
  { n:"03", icon:TrendingUp, title:"Maximize Returns", desc:"Use data-driven insights to decide when to irrigate, when to sell, and how to reduce input costs." },
];

const TESTIMONIALS = [
  { name:"Ramesh Kumar",   loc:"Maharashtra",   crop:"Wheat Farmer",   quote:"AgroWave's soil alerts saved my wheat crop during the dry spell. I got the warning 2 days early.", stars:5, img:"RK" },
  { name:"Lakshmi Devi",   loc:"Telangana",     crop:"Rice Farmer",    quote:"The market price tracker helped me sell rice 3 days after the price spike. Best tool for farmers.", stars:5, img:"LD" },
  { name:"Harpreet Singh", loc:"Punjab",         crop:"Soybean Farmer", quote:"Set a price alert for ₹4,300/qtl and got notified immediately. Sold at peak and earned ₹18,000 more.", stars:5, img:"HS" },
];

const CROP_CALENDAR = [
  { name:"Rice",    type:"Kharif", start:5,  end:10, color:"#10B981" },
  { name:"Cotton",  type:"Kharif", start:5,  end:11, color:"#059669" },
  { name:"Soybean", type:"Kharif", start:6,  end:10, color:"#34D399" },
  { name:"Wheat",   type:"Rabi",   start:10, end:3,  color:"#3B82F6" },
  { name:"Mustard", type:"Rabi",   start:10, end:2,  color:"#60A5FA" },
  { name:"Potato",  type:"Rabi",   start:10, end:2,  color:"#93C5FD" },
  { name:"Watermelon",type:"Zaid", start:2,  end:5,  color:"#F59E0B" },
];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// Platform guide data
const GUIDE_TABS = [
  {
    id:"dashboard", icon:LayoutDashboard, label:"Dashboard", color:"#10B981",
    title:"Farm Dashboard — Your Command Center",
    desc:"The main overview of your entire farm. Monitor all 6 plots simultaneously, trigger irrigation, check alerts, and view the satellite farm map.",
    steps:[
      "Open the Dashboard from the top navigation bar.",
      "The left panel shows all 6 field cards — click any card to expand its details.",
      "Use 'Irrigate All' button (top right of field list) to water all plots at once.",
      "The center Farm Map shows live moisture color coding for each plot.",
      "The right panel has the Farm Health Radar and 7-day forecast charts.",
      "The green status bar at the top shows live KHARIF 2026 monitoring data.",
    ],
    tip:"Fields with red moisture levels need immediate irrigation. Yellow = moderate, green = optimal.",
    link:"/dashboard",
  },
  {
    id:"fields", icon:Sprout, label:"My Fields", color:"#3B82F6",
    title:"Field Monitor — Deep Plot Analytics",
    desc:"Detailed per-plot inspection tool. View NPK, pH, temperature, pest risk and 7-day trend charts for any selected plot.",
    steps:[
      "Click 'My Fields' in the top navigation.",
      "Select any plot from the left panel to view its full analytics.",
      "The right panel shows a data grid with moisture, health, temperature, and NPK.",
      "Click 'Update NPK' to log a fertilizer application with N, P, K values.",
      "Toggle 'Auto-Irrigate' to enable automated irrigation when moisture drops.",
      "Click '+ Add New Plot' at the bottom to register a new farm plot.",
    ],
    tip:"Use the 7-day trend chart to spot declining health before it becomes critical.",
    link:"/field-monitor",
  },
  {
    id:"weather", icon:CloudRain, label:"Weather", color:"#0EA5E9",
    title:"Weather Station — Hyper-Local Forecasts",
    desc:"Farm-specific 7-day weather forecasts with rain probability, temperature range, and actionable field advisories.",
    steps:[
      "Navigate to 'Weather' from the top menu.",
      "The 7-day forecast shows daily rain % and temperature min/max.",
      "Farm Advisory cards at the top give actionable advice like 'Skip irrigation on Tuesday'.",
      "Rainfall and Temperature charts give a visual weekly overview.",
      "Use the forecast to plan pesticide spraying — avoid rainy days.",
      "Check Fertilizer Timing advisories to maximize soil absorption.",
    ],
    tip:"Never apply DAP fertilizer on a rainy day — rain washes it away. Check the advisory first.",
    link:"/weather",
  },
  {
    id:"market", icon:TrendingUp, label:"Market", color:"#F59E0B",
    title:"Market Intelligence — Prices & Profit",
    desc:"Live crop prices from 600+ mandis, a P&L profit calculator, mandi-wise rates, and custom price alerts.",
    steps:[
      "Open 'Market' from the navigation. Four tabs are available.",
      "Live Prices tab: See all crop prices with 30-day trend charts.",
      "P&L Calculator tab: Enter area, yield, and costs to compute net profit.",
      "Mandi Rates tab: See which market is offering the best price today.",
      "Price Alerts tab: Set a target price — get notified when the crop crosses it.",
      "Filter by crop using the pill buttons at the top of Prices/Mandis tabs.",
    ],
    tip:"Sort mandi prices to find the highest-paying market near you before transporting your crop.",
    link:"/market",
  },
  {
    id:"inventory", icon:Package, label:"Inventory", color:"#8B5CF6",
    title:"Inventory Hub — Stock Management",
    desc:"Track all farm inputs — seeds, fertilizers, pesticides, tools and fuel. Get low-stock alerts before you run out.",
    steps:[
      "Navigate to 'Inventory' in the top menu.",
      "Use the category filter pills (Seeds, Fertilizer, Pesticides...) to browse by type.",
      "Red LOW badge means the item is below your set minimum threshold.",
      "Click '+' button in Actions column to add 50 units, '–' to deduct 10.",
      "Click 'Add Item' (top right) to register a new supply with cost and threshold.",
      "Print Report button generates a full printable stock report.",
    ],
    tip:"Set minimum thresholds for critical items like DAP and pesticides to get advance low-stock alerts.",
    link:"/inventory",
  },
  {
    id:"calendar", icon:Calendar, label:"Calendar", color:"#EC4899",
    title:"Farm Calendar — Task Scheduling",
    desc:"Schedule irrigation rounds, spray applications, fertilizer dates, and harvest windows. Stay on top of every farm activity.",
    steps:[
      "Open 'Calendar' in the navigation.",
      "Click any date or the '+ Add Task' button to schedule a new activity.",
      "Select task type: Irrigation, Spray, Fertilizer, Harvest, or Custom.",
      "Assign the task to a specific plot from the dropdown.",
      "Completed tasks are shown with a green strikethrough.",
      "Upcoming tasks appear in the sidebar with days-until countdown.",
    ],
    tip:"Schedule irrigation 1 day before predicted rain to allow soil to absorb water efficiently.",
    link:"/calendar",
  },
  {
    id:"land", icon:Map, label:"Land View", color:"#047857",
    title:"Land View — Satellite Farm Map",
    desc:"Aerial-style land view showing all 6 plots, live sensor overlay, threshold-based open/warning status, and terrain elevation mode.",
    steps:[
      "Click 'Land' in the navigation (or the green 'Open land' button on Dashboard).",
      "The satellite grid shows all 6 plots with color-coded moisture levels.",
      "Click any plot tile to view full sensor data in the right panel.",
      "Open plots (green) meet all health criteria. Warning (yellow) need attention.",
      "Toggle 'Terrain overlay' to switch between satellite and elevation view.",
      "Click 'Settings' to customize the threshold values that determine plot status.",
    ],
    tip:"Use Land View before making irrigation decisions — see all plots at a glance and prioritize the driest ones.",
    link:"/land",
  },
];

export default function Home() {
  const [prices, setPrices] = useState<Record<string,any>>({});
  const [now, setNow] = useState(new Date());
  const [guideTab, setGuideTab] = useState("dashboard");

  useEffect(() => {
    setPrices(getLivePrices());
    const iv = setInterval(() => { setPrices(getLivePrices()); setNow(new Date()); }, 60000);
    const cl = setInterval(() => setNow(new Date()), 1000);
    return () => { clearInterval(iv); clearInterval(cl); };
  },[]);

  const activeGuide = GUIDE_TABS.find(t => t.id === guideTab) || GUIDE_TABS[0];

  return (
    <div className="pt-[72px]">

      {/* ── HERO ─────────────────────────────────────── */}
      <section id="hero" className="hero-pattern grid-bg min-h-[92vh] pt-[88px] flex items-center relative overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-10 left-5 w-72 h-72 bg-sky-400/8 rounded-full blur-3xl pointer-events-none"/>
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200 mb-8">
              <span className="dot-live"/>
              <span className="text-brand-700 font-semibold text-sm">KHARIF 2026 · Live Farm Intelligence Active</span>
            </motion.div>
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
              className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.08] mb-6 tracking-tight">
              Farm Smarter.<br/>
              <span className="grad-text">Earn More.</span>
            </motion.h1>
            <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}
              className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Real-time soil health, AI weather forecasts, and live mandi prices — all in one platform built specifically for Indian farmers.
            </motion.p>
            <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
              className="inline-flex items-center gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-3 mb-10 shadow-card">
              <span className="dot-live"/>
              <span className="font-mono text-slate-700 text-sm font-medium">{now.toLocaleTimeString("en-IN")}</span>
              <span className="w-px h-4 bg-slate-200"/>
              <span className="text-slate-400 text-sm">{now.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
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

          {/* Scroll-down indicator — sits in normal flow between the CTA buttons and the
              stats grid so it never overlaps either, and works as a real "scroll to next
              section" control regardless of viewport height. */}
          <motion.button initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7}}
            onClick={() => document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}
            aria-label="Scroll to features"
            className="mx-auto mt-10 mb-2 flex items-center justify-center w-11 h-11 rounded-full bg-white shadow-card border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-300 transition-colors animate-float">
            <ChevronDown className="w-5 h-5"/>
          </motion.button>

          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.8}}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-4xl mx-auto">
            {[
              { emoji:"🌾", label:"Plots Monitored", val:"6 Active",  color:"text-brand-700 bg-brand-50 border-brand-100" },
              { emoji:"💧", label:"Avg Soil Health",  val:"79.7%",    color:"text-sky-700 bg-sky-50 border-sky-100" },
              { emoji:"📈", label:"Crops Tracked",    val:"8 Crops",  color:"text-amber-700 bg-amber-50 border-amber-100" },
              { emoji:"🌦️", label:"Forecast Accuracy",val:"99.2%",   color:"text-violet-700 bg-violet-50 border-violet-100" },
            ].map((s,i) => (
              <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border ${s.color}`}>
                <span className="text-2xl">{s.emoji}</span>
                <div>
                  <div className="font-bold text-base">{s.val}</div>
                  <div className="text-xs opacity-70 font-medium">{s.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PRICE TICKER */}
      <PriceTicker/>

      {/* STATS */}
      <section className="py-16" style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <StatCounter end={24000000} prefix="₹" label="Revenue Tracked"    sub="This kharif season" dark/>
            <StatCounter end={12}       suffix="+"  label="Districts Active"   sub="Across India" dark/>
            <StatCounter end={99.2}     suffix="%"  label="Forecast Accuracy"  sub="vs national average" dark/>
            <StatCounter end={47}       suffix="+"  label="Commodities Tracked" sub="Live mandi data" dark/>
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* FEATURES */}
      <section id="features" className="section section-green">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp} className="section-label mb-4">Platform Features</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything a farmer needs.<br/><span className="grad-text">Nothing they don't.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-xl mx-auto">
              AgroWave brings together soil science, meteorology, and market intelligence in one clean dashboard.
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f,i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} variants={fadeUp}>
                  <Card className={`h-full p-6 border ${f.color} bg-white`}>
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${f.color}`}>
                      <Icon className="w-5 h-5"/>
                    </div>
                    <span className={`badge mb-3 ${f.color}`}>{f.tag}</span>
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

      {/* ── GUIDE SECTION ─────────────────────────────── */}
      <section id="guide" className="section section-guide">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="text-center mb-12">
            <motion.div variants={fadeUp} className="section-label mb-4">
              <BookOpen className="w-3 h-3"/> Platform Guide
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              How to use <span className="grad-text">AgroWave</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-2xl mx-auto">
              A complete walkthrough of every section. Click a module below to learn exactly how to use it.
            </motion.p>
          </motion.div>

          {/* Tab row */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {GUIDE_TABS.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setGuideTab(t.id)}
                  className={`guide-tab${guideTab===t.id?" active":""}`}>
                  <Icon className="w-4 h-4"/> {t.label}
                </button>
              );
            })}
          </div>

          {/* Guide card */}
          <AnimatePresence mode="wait">
            <motion.div key={guideTab}
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
              transition={{duration:0.25}}>
              <div className="card p-0 overflow-hidden shadow-soft max-w-5xl mx-auto">
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Left — info */}
                  <div className="p-8" style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}}>
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{background:`${activeGuide.color}25`,border:`1.5px solid ${activeGuide.color}40`}}>
                        <activeGuide.icon className="w-6 h-6" style={{color:activeGuide.color}}/>
                      </div>
                      <div>
                        <div className="text-xs font-bold tracking-widest uppercase mb-0.5"
                          style={{color:activeGuide.color}}>Module Guide</div>
                        <h3 className="font-bold text-white text-lg leading-snug">{activeGuide.title}</h3>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{activeGuide.desc}</p>

                    {/* Tip box */}
                    <div className="rounded-xl p-4 mb-6"
                      style={{background:`${activeGuide.color}18`,border:`1px solid ${activeGuide.color}35`}}>
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

                  {/* Right — steps */}
                  <div className="p-8 bg-white">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Target className="w-4 h-4 text-brand-600"/> Step-by-Step Walkthrough
                    </h4>
                    <div className="space-y-3">
                      {activeGuide.steps.map((step,i) => (
                        <motion.div key={i}
                          initial={{opacity:0,x:12}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
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

          {/* Quick navigation grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-8">
            {GUIDE_TABS.map(t => {
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

      {/* WHY THIS WEBSITE */}
      <section id="why" className="section section-white">
        <div className="container">
          <motion.div initial="hidden" whileInView="show" viewport={{once:true}} variants={stagger} className="text-center mb-14">
            <motion.div variants={fadeUp} className="section-label mb-4">Why AgroWave?</motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              What makes this platform <span className="grad-text">different</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-2xl mx-auto">
              AgroWave replaces scattered data, expensive consultants, and outdated methods with one intelligent platform.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-14">
            {[
              { icon:"🌱", title:"Built for Indian Crops", desc:"Data calibrated for Indian climate zones, kharif/rabi seasons, and MSP pricing — not generic global agriculture platforms." },
              { icon:"📱", title:"Works Without an App", desc:"No installation required. Open AgroWave in any browser on mobile or desktop and get full functionality immediately." },
              { icon:"💰", title:"Pays for Itself", desc:"Farmers earn ₹18,000+ extra per season through better market timing alone. The platform is free to use." },
              { icon:"🔔", title:"Proactive Alerts", desc:"You don't monitor AgroWave — it monitors your farm. Alerts come to you for pest risk, low moisture, and market spikes." },
              { icon:"📊", title:"All Data in One Place", desc:"No more switching between weather apps, mandi websites, and paper ledgers. One platform handles everything." },
              { icon:"🖨️", title:"Printable Reports", desc:"Every page has a Print Report button. Generate formatted farm summaries, inventory sheets, and market reports in one click." },
            ].map((c,i)=>(
              <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}>
                <Card className="h-full p-6">
                  <div className="text-4xl mb-3">{c.icon}</div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{c.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Comparison table removed — clean section ending */}
        </div>
      </section>

      <div className="section-divider"/>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section section-blue">
        <div className="container">
          <div className="text-center mb-16">
            <div className="section-label mb-4">Simple Process</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Up and running in 3 steps</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">No hardware. No installation. Just open your browser and start farming smarter.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {STEPS.map((s,i) => (
              <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.15}}>
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 mb-5">
                    <div className="absolute inset-0 rounded-full bg-brand-100 animate-pulse opacity-60"/>
                    <div className="relative w-16 h-16 rounded-2xl bg-brand-grad flex items-center justify-center shadow-green">
                      <s.icon className="w-8 h-8 text-white"/>
                    </div>
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">{s.n}</div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{s.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* BENEFITS */}
      <section id="benefits" className="section section-mixed">
        <div className="container">
          <div className="text-center mb-16">
            <div className="section-label mb-4">Proven Results</div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Real results for real farmers</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {BENEFITS.map((b,i) => (
              <motion.div key={i} initial={{opacity:0,scale:.94}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*0.1}}>
                <Card className="text-center p-8">
                  <div className="text-4xl font-bold grad-text mb-2">{b.stat}</div>
                  <div className="font-semibold text-slate-800 mb-1">{b.label}</div>
                  <div className="text-xs text-slate-400 leading-relaxed">{b.detail}</div>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card hover={false} className="p-8">
              <h3 className="font-bold text-xl text-slate-800 mb-5">Why AgroWave Works</h3>
              <div className="space-y-4">
                {[
                  "Built specifically for Indian crops and growing conditions",
                  "Uses real MSP data — no guesswork on minimum prices",
                  "Hyper-local forecasts at plot level, not district level",
                  "No login required — open and use immediately",
                  "Works on mobile, tablet, and desktop equally well",
                  "Data persists locally — your farm data stays with you",
                ].map((item,i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0"/>
                    <span className="text-slate-600 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card hover={false} className="p-8 bg-brand-grad text-white border-0">
              <h3 className="font-bold text-xl mb-5">This Season's Impact</h3>
              <div className="space-y-4">
                {[
                  { l:"Irrigation water saved", v:"38%" },
                  { l:"Pesticide cost reduction", v:"22%" },
                  { l:"Yield improvement avg", v:"23%" },
                  { l:"Better price realization", v:"₹18K/season" },
                  { l:"Pest losses prevented", v:"₹12K avg" },
                ].map((s,i) => (
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

      {/* LIVE MARKET PREVIEW */}
      <section id="market-preview" className="section section-white">
        <div className="container">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="section-label mb-3">Live Market Data</div>
              <h2 className="text-4xl font-bold text-slate-900">Today's Mandi Rates</h2>
              <p className="text-slate-500 mt-2 text-sm">Updated every 60 seconds from 600+ markets</p>
            </div>
            <Link href="/market" className="btn btn-outline">Full Analysis <ArrowRight className="w-4 h-4"/></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(CROPS).slice(0,8).map(([k,v],i) => {
              const p = prices[k]; const up = (p?.pct||0) >= 0;
              return (
                <motion.div key={k} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06}}>
                  <Card className="p-5 cursor-pointer" hover>
                    <div className="flex justify-between mb-3">
                      <span className="text-3xl">{v.emoji}</span>
                      <span className={`badge ${up?"badge-green":"badge-red"}`}>{up?"▲":"▼"}{Math.abs(p?.pct||0).toFixed(1)}%</span>
                    </div>
                    <div className="font-semibold text-slate-600 text-sm uppercase tracking-wide mb-1">{k}</div>
                    <div className="text-2xl font-bold text-slate-900">₹{(p?.current||v.base).toLocaleString("en-IN")}</div>
                    <div className="text-xs text-slate-400 mt-1">per {v.unit}</div>
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
          <div className="text-center mb-12">
            <div className="section-label mb-3">Seasonal Guide</div>
            <h2 className="text-3xl font-bold text-slate-900">Indian Crop Calendar 2026</h2>
            <p className="text-slate-500 mt-2">Know when to plant and harvest each crop</p>
          </div>
          <Card hover={false} className="overflow-x-auto p-6">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-12 gap-1 mb-3">
                {MONTHS.map(m => <div key={m} className="text-center text-xs font-semibold text-slate-400">{m}</div>)}
              </div>
              <div className="space-y-3">
                {CROP_CALENDAR.map((c,ci) => {
                  const len = c.end >= c.start ? c.end - c.start + 1 : (12-c.start+1)+c.end;
                  const left = ((c.start-1)/12)*100;
                  const width = (len/12)*100;
                  return (
                    <motion.div key={c.name} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:ci*0.08}}
                      className="grid grid-cols-12 gap-1 items-center group">
                      <div className="col-span-12 relative h-9 bg-slate-100 rounded-xl overflow-hidden">
                        <div className="absolute inset-y-1 flex items-center pl-2 z-10">
                          <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700">{c.name}</span>
                        </div>
                        <motion.div initial={{width:0}} whileInView={{width:`${width}%`}} viewport={{once:true}} transition={{duration:0.9,delay:0.2+ci*0.06}}
                          className="absolute top-1 bottom-1 rounded-lg opacity-80"
                          style={{left:`${left}%`, background:c.color}}/>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="flex gap-6 mt-5 justify-center flex-wrap">
                {[{c:"#10B981",l:"Kharif (Jun–Nov)"},{c:"#3B82F6",l:"Rabi (Nov–Apr)"},{c:"#F59E0B",l:"Zaid (Mar–Jun)"}].map(x => (
                  <span key={x.l} className="flex items-center gap-2 text-xs text-slate-500 font-medium">
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
          <div className="text-center mb-14">
            <div className="section-label mb-4">Farmer Stories</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-3">Trusted by farmers across India</h2>
            <p className="text-slate-500">Real feedback from real farmers using AgroWave every day</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t,i) => (
              <motion.div key={i} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.12}}>
                <Card className="p-8 h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-6 flex-1 text-sm italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
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
      <section className="section" style={{background:"linear-gradient(135deg,#059669 0%,#10B981 50%,#34D399 100%)"}}>
        <div className="container text-center">
          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4"/> No login · No installation · Instant access
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">Ready to farm smarter?</h2>
            <p className="text-green-100 text-lg mb-10 max-w-lg mx-auto">Join thousands of farmers already using AgroWave. Open the dashboard and start making data-driven decisions today.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn text-base px-10 py-4 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold shadow-lg hover:shadow-xl transition-all">
                Open Farm Dashboard <ArrowRight className="w-5 h-5"/>
              </Link>
              <button onClick={()=>document.getElementById("guide")?.scrollIntoView({behavior:"smooth"})}
                className="btn text-base px-10 py-4 rounded-xl border-2 border-white/50 text-white hover:bg-white/10 font-semibold transition-all">
                <BookOpen className="w-4 h-4"/> View Platform Guide
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="section-divider"/>

      {/* CONTACT CTA — condensed teaser; full contact experience lives on its own page */}
      <section id="contact-section" className="relative overflow-hidden py-20"
        style={{background:"linear-gradient(160deg,#03130A 0%,#0A2818 55%,#062014 100%)"}}>
        {/* decorative glows — varied colours, not just green */}
        <div className="absolute -top-32 -right-24 w-[26rem] h-[26rem] rounded-full opacity-25 blur-3xl pointer-events-none" style={{background:"#10B981"}}/>
        <div className="absolute -bottom-40 -left-32 w-[30rem] h-[30rem] rounded-full opacity-15 blur-3xl pointer-events-none" style={{background:"#3B82F6"}}/>
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"/>

        <div className="container relative">
          <motion.div initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-400/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 border border-emerald-400/25">
              <Mail className="w-4 h-4"/> Get In Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Have a question for <span className="grad-text">AgroWave?</span>
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
              We're here to help Indian farmers succeed. Reach out for support, partnerships, or feedback — our team responds within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-xl text-base"
                style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 6px 20px rgba(16,185,129,0.4)"}}>
                <Mail className="w-4 h-4"/> Contact Me
              </Link>
              <a href="tel:18001801551"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white transition-all hover:scale-105 text-base"
                style={{background:"rgba(255,255,255,0.12)",border:"2px solid rgba(255,255,255,0.28)",backdropFilter:"blur(8px)"}}>
                <Phone className="w-4 h-4"/> 1800-180-1551
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
