"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, BarChart3, Sprout, CloudRain, TrendingUp,
  Package, Calendar, Bell, Zap, Shield, Globe,
  CheckCircle2, Map, BookOpen
} from "lucide-react";
import Card from "@/components/Card";

const TECH = [
  {n:"Next.js 14",        d:"React framework with App Router — fast, SEO-friendly, built-in API routes"},
  {n:"TypeScript",        d:"Fully typed codebase — every prop, store action and API response is typed"},
  {n:"Zustand + persist", d:"Lightweight global state — all farm data survives page refresh via localStorage"},
  {n:"Recharts",          d:"Responsive data charts — soil trends, weather, market sparklines and radar"},
  {n:"Framer Motion",     d:"Smooth animations — staggered lists, live sensor pulse, page transitions"},
  {n:"Tailwind CSS",      d:"Utility-first design system with custom tokens, dark sections and print styles"},
  {n:"Resend API",        d:"Server-side email delivery for contact form and market price alerts"},
  {n:"date-fns",          d:"Calendar date formatting and farm event management"},
];

const PAGES = [
  {icon:BarChart3, name:"Dashboard",       desc:"Whole-farm summary — plot health rings, Land Parcels card, farm radar, weather strip and quick-nav to every module.", href:"/dashboard"},
  {icon:Sprout,    name:"My Fields",       desc:"Per-plot sensor detail — moisture, health, temp, pH, NPK, pest risk, auto-irrigation. Add plots, edit everything live.", href:"/field-monitor"},
  {icon:Map,       name:"Land Map",        desc:"NDVI-style satellite map of all plots. Tap any field to open a detail panel. Pesticide & input control per plot.", href:"/land"},
  {icon:CloudRain, name:"Weather",         desc:"7-day forecast with multi-condition alerts — rain, heat, humidity, wind — plus farm advisories and an hourly chart.", href:"/weather"},
  {icon:TrendingUp,name:"Market",          desc:"Live MSP + mandi prices for 8 crops, 24 mandis across India, P&L calculator and price alert emails.", href:"/market"},
  {icon:Package,   name:"Inventory",       desc:"Stock tracking with a category value chart, expandable rows, reorder suggestions and quick restock buttons.", href:"/inventory"},
  {icon:Calendar,  name:"Farm Calendar",   desc:"Monthly task calendar with colour-coded event types, a jump-to-any-month picker and an upcoming tasks sidebar.", href:"/calendar"},
  {icon:Bell,      name:"Notifications",   desc:"Real-time bell with live timestamps. Every irrigation, price alert and weather condition fires a notification.", href:"/dashboard"},
];

export default function About() {
  return (
    <div className="pt-[88px] min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="section" style={{background:"linear-gradient(135deg,#ECFDF5 0%,#EFF6FF 60%,#FEF3C7 100%)"}}>
        <div className="container max-w-4xl text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-sm font-semibold mb-6">
              🏆 Portfolio / Learning Project — Smart Agriculture
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-5 leading-tight">
              About <span className="grad-text">AgroWave</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              AgroWave is a full-stack smart farming dashboard exploring what modern agri-tech could look like — combining live-feel soil data, market prices, weather intelligence and crop management in one open web platform.
            </p>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}
            className="flex justify-center gap-4 flex-wrap">
            <Link href="/dashboard" className="btn btn-primary text-base px-8 py-3.5 rounded-xl">
              Open the Platform <ArrowRight className="w-5 h-5"/>
            </Link>
            <Link href="/contact" className="btn btn-outline text-base px-8 py-3.5 rounded-xl">
              <BookOpen className="w-4 h-4"/> Contact the Team
            </Link>
          </motion.div>
        </div>
      </section>

      {/* What it offers */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <div className="section-label mb-4">What AgroWave Offers</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">One platform, everything in one place</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              From soil readings to live mandi rates — AgroWave brings together everything that matters for smarter farm decisions in a clean, fast, browser-native interface.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {emoji:"💧",title:"Soil Monitoring",         desc:"Moisture, health, temperature, pH and NPK per plot. Auto-irrigation toggle, pest risk level and 7-day health trend all in one panel."},
              {emoji:"📈",title:"Mandi Price Intelligence", desc:"MSP + live-feel prices for 8 crops across 24 major mandis. 30-day sparklines, market pulse summary, P&L calculator and price alert emails."},
              {emoji:"☁️",title:"Weather Alerts",           desc:"Rain, heat, humidity and wind alerts fire independently. Colour-coded banners and bell notifications with farm-specific advisories."},
              {emoji:"🗺️",title:"Interactive Farm Map",     desc:"NDVI-style satellite map with per-plot health colouring. Tap any field to edit values live and sync changes across every page instantly."},
              {emoji:"📅",title:"Farm Task Calendar",       desc:"Schedule irrigation, fertilizer, spraying and harvests. Jump to any month instantly. Colour-coded dot types with upcoming task sidebar."},
              {emoji:"📦",title:"Smart Inventory",          desc:"Category value bar chart, expandable rows, reorder cost estimates and quick restock buttons. Low-stock alerts built in."},
            ].map((f,i)=>(
              <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07}}>
                <Card className="p-6 h-full">
                  <div className="text-3xl mb-3">{f.emoji}</div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="section bg-slate-50">
        <div className="container">
          <div className="text-center mb-12">
            <div className="section-label mb-4">Platform Modules</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">8 fully interactive modules</h2>
            <p className="text-slate-500">Every page works with real simulated data — nothing is a placeholder.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {PAGES.map((p,i)=>{
              const Icon=p.icon;
              return (
                <motion.div key={i} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06}}>
                  <Link href={p.href}>
                    <Card className="p-5 h-full group cursor-pointer hover:shadow-card-hover transition-all">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-3 group-hover:bg-brand-600 group-hover:border-brand-600 transition-all">
                        <Icon className="w-5 h-5 text-brand-600 group-hover:text-white transition-colors"/>
                      </div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1.5 group-hover:text-brand-700 transition-colors">{p.name}</h3>
                      <p className="text-slate-400 text-xs leading-relaxed">{p.desc}</p>
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
          <div className="text-center mb-12">
            <div className="section-label mb-4">Technical Foundation</div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built with production-grade tech</h2>
            <p className="text-slate-500 max-w-xl mx-auto">A modern, type-safe, deploy-ready stack — chosen to show real-world web development skills.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {TECH.map((t,i)=>(
              <motion.div key={i} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.07}}>
                <Card className="flex items-start gap-4 p-5">
                  <div className="w-2 h-2 rounded-full bg-brand-500 mt-2 flex-shrink-0"/>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.n}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t.d}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights CTA */}
      <section className="section" style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
        <div className="container max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3">Built to Work, Out of the Box</h2>
            <p className="text-green-100 max-w-xl mx-auto">No complex setup. No login. No hardware. Just open it and explore.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {Icon:CheckCircle2,title:"No Login Required",    desc:"Open the URL and it works. Farm data lives in your browser — no account, no onboarding."},
              {Icon:Shield,      title:"Data Stays Local",     desc:"All farm data stored locally via Zustand persist. No server ever sees your plot readings."},
              {Icon:Globe,       title:"Works Everywhere",     desc:"No install needed. Fully responsive — works on mobile, tablet or desktop in any browser."},
              {Icon:Zap,         title:"Deploy-Ready",         desc:"One command — vercel --prod — ships the full platform. Email works as soon as you add env vars."},
            ].map((c,i)=>(
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
                <div className="p-6 bg-white/10 rounded-2xl border border-white/20 text-center h-full">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <c.Icon className="w-6 h-6 text-white"/>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-2">{c.title}</h3>
                  <p className="text-green-100 text-xs leading-relaxed">{c.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/dashboard" className="btn text-base px-10 py-4 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold shadow-lg transition-all">
              Explore the Platform <ArrowRight className="w-5 h-5"/>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 bg-slate-100">
        <div className="container max-w-3xl text-center">
          <p className="text-slate-500 text-sm leading-relaxed">
            <strong className="text-slate-700">Note:</strong> AgroWave is a <strong className="text-slate-700">learning and portfolio project</strong>. All sensor data, mandi prices and weather forecasts are <em>simulated</em> — not sourced from real sensors, government APIs or weather services. For real data, consult{" "}
            <a href="https://agmarknet.gov.in" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">Agmarknet</a>,{" "}
            <a href="https://imd.gov.in" target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">IMD</a> or your local Krishi Vigyan Kendra.
          </p>
        </div>
      </section>
    </div>
  );
}
