"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap, Shield, Globe, BarChart3, Sprout, CloudRain, TrendingUp, Package, Calendar, Bell } from "lucide-react";
import Card from "@/components/Card";

const TECH = [
  {n:"Next.js 14",    d:"React framework with App Router for fast, SEO-friendly pages"},
  {n:"Zustand",       d:"Lightweight state management — all farm data persists locally"},
  {n:"Recharts",      d:"Responsive data visualizations for soil, weather, and market charts"},
  {n:"Framer Motion", d:"Smooth, professional animations throughout the interface"},
  {n:"Tailwind CSS",  d:"Utility-first styling for a clean, responsive design system"},
  {n:"TypeScript",    d:"Fully typed codebase for reliability and maintainability"},
];

const PAGES = [
  {icon:BarChart3,  name:"Dashboard",    desc:"Central command center with live plot health, farm map, weather strip, and activity charts. Click any plot to inspect.", href:"/dashboard"},
  {icon:Sprout,     name:"Field Monitor",desc:"Per-plot soil intelligence: NPK editing, moisture slider, pest risk toggle, auto-irrigation toggle, 7-day trend chart.", href:"/field-monitor"},
  {icon:CloudRain,  name:"Weather",      desc:"7-day hyper-local forecast, 24-hour temperature and rain chart, and actionable farm advisory for the week ahead.", href:"/weather"},
  {icon:TrendingUp, name:"Market",       desc:"Live crop prices with sparklines, 30-day price history, P&L calculator, mandi rates, and custom price alert system.", href:"/market"},
  {icon:Package,    name:"Inventory",    desc:"Full CRUD inventory management with category filters, low-stock alerts, total value tracking, and add/adjust/delete.", href:"/inventory"},
  {icon:Calendar,   name:"Calendar",     desc:"Monthly calendar view for scheduling irrigation, fertilizer, spraying, harvests. Upcoming events sidebar with dot indicators.", href:"/calendar"},
  {icon:Bell,       name:"Notifications",desc:"Real-time in-app notification center with toast popups. Every farm action — irrigation, price alerts, low stock — generates a notification.", href:"/dashboard"},
];

const PROBLEMS = [
  {prob:"Farmers irrigate by guesswork",       sol:"Live soil moisture data tells exactly when and how much to irrigate"},
  {prob:"Selling crops at wrong price",         sol:"Live MSP + mandi rates and custom price alerts for 8 crops"},
  {prob:"Pest damage discovered too late",      sol:"Plot-level pest risk indicators with severity classifications"},
  {prob:"Weather surprises ruin farm plans",    sol:"7-day hyper-local forecast with specific farm advisories"},
  {prob:"Manual inventory tracking fails",      sol:"Digital inventory with automatic low-stock alerts"},
  {prob:"No visibility across multiple plots",  sol:"Farm map with per-plot health, moisture, and NPK at a glance"},
];

export default function About() {
  return (
    <div className="pt-[88px] min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="section" style={{background:"linear-gradient(135deg,#ECFDF5 0%,#EFF6FF 60%,#FEF3C7 100%)"}}>
        <div className="container max-w-4xl text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold mb-6">
              🏆 Hackathon Project — Smart Agriculture
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-5 leading-tight">
              About <span className="grad-text">AgroWave</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              AgroWave is a full-stack smart farming intelligence platform built to solve the most critical information gaps facing Indian farmers today — from soil health and weather to market prices and inventory.
            </p>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}} className="flex justify-center gap-4 flex-wrap">
            <Link href="/dashboard" className="btn btn-primary text-base px-8 py-3.5 rounded-xl">Open the Platform <ArrowRight className="w-5 h-5"/></Link>
            <Link href="/contact"   className="btn btn-outline text-base px-8 py-3.5 rounded-xl">Contact the Team</Link>
          </motion.div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-14">
            <div className="section-label mb-4">The Problem We're Solving</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Indian farmers lack access to real-time data</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">With 58% of India's population dependent on agriculture, poor access to timely, actionable information costs farmers thousands of rupees each season.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {PROBLEMS.map((p,i)=>(
              <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.08}}>
                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-rose-600 text-sm">✗</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500 mb-1">{p.prob}</p>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand-500 mt-0.5 flex-shrink-0"/>
                        <p className="text-sm text-brand-700 font-medium">{p.sol}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="section bg-slate-50">
        <div className="container">
          <div className="text-center mb-14">
            <div className="section-label mb-4">Platform Modules</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">7 fully functional modules</h2>
            <p className="text-slate-500">Every page is interactive with real data — nothing is a placeholder</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {PAGES.map((p,i)=>{
              const Icon=p.icon;
              return (
                <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07}}>
                  <Link href={p.href}>
                    <Card className="p-6 h-full group cursor-pointer">
                      <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:border-brand-600 transition-all">
                        <Icon className="w-5 h-5 text-brand-600 group-hover:text-white transition-colors"/>
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2 group-hover:text-brand-700 transition-colors">{p.name}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="section bg-white">
        <div className="container max-w-4xl">
          <div className="text-center mb-14">
            <div className="section-label mb-4">Technical Foundation</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built with production-grade tech</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {TECH.map((t,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.08}}>
                <Card className="flex items-start gap-4 p-5">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0"/>
                  <div>
                    <p className="font-bold text-slate-800">{t.n}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{t.d}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key highlights */}
      <section className="section" style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Key Platform Highlights</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {icon:Zap,    title:"No Login Required",  desc:"Open the URL, it works immediately. Farm data saved locally in your browser — no account needed."},
              {icon:Shield, title:"Data Stays With You",desc:"All farm data is stored locally using Zustand persist. No server, no tracking, no privacy risk."},
              {icon:Globe,  title:"Deploy-Ready",       desc:"One command — vercel --prod — deploys the full platform. Built for production from day one."},
            ].map((c,i)=>{
              const Icon=c.icon;
              return (
                <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
                  <div className="text-center p-6 bg-white/10 rounded-2xl border border-white/20">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-white"/>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{c.title}</h3>
                    <p className="text-green-100 text-sm leading-relaxed">{c.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/dashboard" className="btn text-base px-10 py-4 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold shadow-lg transition-all">
              Explore the Platform <ArrowRight className="w-5 h-5"/>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
