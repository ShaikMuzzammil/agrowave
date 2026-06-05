"use client";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, TrendingUp, Droplets, CloudRain,
  Sprout, BarChart3, Shield, Zap, Star, Play, Bug, Package,
  Calendar, Bell, ChevronDown, Mail
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

export default function Home() {
  const [prices, setPrices] = useState<Record<string,any>>({});
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    setPrices(getLivePrices());
    const iv = setInterval(() => { setPrices(getLivePrices()); setNow(new Date()); }, 60000);
    const cl = setInterval(() => setNow(new Date()), 1000);
    return () => { clearInterval(iv); clearInterval(cl); };
  },[]);

  return (
    <div className="pt-[72px]">
      {/* HERO */}
      <section id="hero" className="hero-pattern grid-bg min-h-[92vh] flex items-center relative overflow-hidden">
        {/* Decorative blobs */}
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

            {/* Live clock */}
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
              <Link href="/about" className="btn btn-outline text-base px-8 py-3.5 rounded-xl">
                <Play className="w-4 h-4"/> See How It Works
              </Link>
            </motion.div>
          </div>

          {/* Hero stat cards */}
          <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.8}}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-4xl mx-auto">
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

        <button onClick={() => document.getElementById("features")?.scrollIntoView({behavior:"smooth"})}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 rounded-full bg-white shadow-card border border-slate-200 text-slate-400 hover:text-brand-600 transition-colors animate-float">
          <ChevronDown className="w-5 h-5"/>
        </button>
      </section>

      {/* PRICE TICKER */}
      <PriceTicker/>

      {/* STATS */}
      <section className="py-16" style={{background:"#fff",borderTop:"2px solid #E2E8F0",borderBottom:"2px solid #E2E8F0"}}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <StatCounter end={24000000} prefix="₹" label="Revenue Tracked" sub="This kharif season"/>
            <StatCounter end={12}       suffix="+"  label="Districts Active" sub="Across India"/>
            <StatCounter end={99.2}     suffix="%"  label="Forecast Accuracy" sub="vs national average"/>
            <StatCounter end={47}       suffix="+"  label="Commodities Tracked" sub="Live mandi data"/>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="section" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#F8FAFC 100%)",paddingTop:"96px",paddingBottom:"96px"}}>
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

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="section" style={{background:"#ffffff",paddingTop:"96px",paddingBottom:"96px"}}>
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

      {/* BENEFITS */}
      <section id="benefits" className="section" style={{background:"linear-gradient(135deg,#ECFDF5 0%,#EFF6FF 100%)",paddingTop:"96px",paddingBottom:"96px"}}>
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

      {/* LIVE MARKET PREVIEW */}
      <section id="market-preview" className="section" style={{background:"linear-gradient(160deg,#fff 0%,#F8FAFC 100%)",paddingTop:"96px",paddingBottom:"96px"}}>
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

      {/* CROP CALENDAR */}
      <section className="section" style={{background:"linear-gradient(160deg,#FFFBEB 0%,#FEF9C3 50%,#F0FDF4 100%)",paddingTop:"96px",paddingBottom:"96px"}}>
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

      {/* TESTIMONIALS */}
      <section id="testimonials" className="section" style={{background:"linear-gradient(160deg,#fff 0%,#F0F9FF 100%)",paddingTop:"96px",paddingBottom:"96px"}}>
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
              <Link href="/about" className="btn text-base px-10 py-4 rounded-xl border-2 border-white/50 text-white hover:bg-white/10 font-semibold transition-all">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CONTACT HOME SECTION */}
      <section id="contact-section" className="section" style={{background:"linear-gradient(160deg,#0F172A 0%,#1E293B 50%,#0F2027 100%)",paddingTop:"96px",paddingBottom:"96px"}}>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <div className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <Mail className="w-4 h-4"/> Get In Touch
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Questions about<br/><span className="grad-text">AgroWave?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                We're here to help Indian farmers succeed. Reach out for support, partnerships, or feedback.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  {icon:"📞", label:"Kisan Helpline", val:"1800-180-1551"},
                  {icon:"📧", label:"Email", val:"hello@agrowave.farm"},
                  {icon:"📍", label:"Location", val:"Hyderabad, Telangana"},
                ].map((c,i)=>(
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xl">{c.icon}</span>
                    <div>
                      <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide">{c.label}</div>
                      <div className="text-white font-semibold">{c.val}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn btn-primary text-base px-8 py-3.5 rounded-xl" style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                Open Contact Page <ArrowRight className="w-5 h-5"/>
              </Link>
            </motion.div>
            <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <ContactMiniForm/>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactMiniForm() {
  const [form, setForm] = React.useState({name:"",email:"",msg:""});
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.msg) return;
    setBusy(true);
    try {
      await fetch("/api/contact", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({name:form.name,email:form.email,message:form.msg,subject:"Home Page Contact"}) });
      setSent(true);
    } finally { setBusy(false); }
  };

  if (sent) return (
    <div className="rounded-2xl p-8 text-center" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(16,185,129,0.3)"}}>
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
      <p className="text-slate-400">We'll reply to <span className="text-green-400">{form.email}</span> within 24h.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-8 space-y-4" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",backdropFilter:"blur(10px)"}}>
      <h3 className="font-bold text-xl text-white mb-5 flex items-center gap-2">📩 Quick Message</h3>
      <div><label className="text-xs font-semibold text-slate-400 block mb-1.5">YOUR NAME</label>
        <input required placeholder="Ramesh Kumar" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
          style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",color:"#fff"}}/>
      </div>
      <div><label className="text-xs font-semibold text-slate-400 block mb-1.5">EMAIL</label>
        <input required type="email" placeholder="farmer@example.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
          style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",color:"#fff"}}/>
      </div>
      <div><label className="text-xs font-semibold text-slate-400 block mb-1.5">MESSAGE</label>
        <textarea required rows={3} placeholder="How can AgroWave help?" value={form.msg} onChange={e=>setForm(p=>({...p,msg:e.target.value}))}
          style={{background:"rgba(255,255,255,0.08)",border:"1.5px solid rgba(255,255,255,0.15)",color:"#fff"}}/>
      </div>
      <button type="submit" disabled={busy} className="btn btn-primary w-full py-3" style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
        {busy ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
