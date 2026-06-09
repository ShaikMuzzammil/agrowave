"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sprout, ArrowRight, Zap, Shield, Globe, Code2, Database, Wifi, Bot, BarChart3 } from "lucide-react";
import Card from "@/components/Card";

const TECH = [
  { layer:"Frontend",   items:["Next.js 14","React 18","TypeScript","Tailwind CSS","Framer Motion"],     color:"#3B82F6", icon:"⚛️" },
  { layer:"Charts",     items:["Recharts","Radix UI","Lucide Icons","DM Sans Font"],                    color:"#10B981", icon:"📊" },
  { layer:"State",      items:["Zustand (persist)","React Hooks","Custom WebSocket hook"],              color:"#8B5CF6", icon:"🔄" },
  { layer:"Backend",    items:["Next.js API Routes","Resend Email API","Node.js runtime"],              color:"#F59E0B", icon:"⚙️" },
  { layer:"Real-Time",  items:["WebSocket simulation (5s)","SSE for AI stream","Live market drift"],   color:"#F43F5E", icon:"⚡" },
  { layer:"Data",       items:["LocalStorage (Zustand persist)","MongoDB-ready schemas","Mock IoT data"],color:"#0EA5E9", icon:"🗄️" },
];

const TIMELINE = [
  { year:"Phase 1", desc:"Manual data entry + dashboard UI" },
  { year:"Phase 2", desc:"WebSocket real-time updates + AI assistant" },
  { year:"Phase 3", desc:"IoT sensor integration + satellite imagery" },
  { year:"Phase 4", desc:"Multi-farm collaboration + mobile app" },
];

export default function About() {
  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#EFF6FF 100%)"}}>
      {/* Hero */}
      <section style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-20">
        <div className="container text-center">
          <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Sprout className="w-4 h-4"/> About AgroWave
            </div>
            <h1 className="text-5xl font-bold text-white mb-5">
              Smart Farming for <span className="grad-text">Bharat</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              AgroWave is a precision agriculture intelligence platform built for Indian farmers.
              We combine real-time soil monitoring, AI-powered insights, live market prices, and satellite land view — so every farm decision is data-driven.
            </p>
            <Link href="/dashboard" className="btn btn-primary text-base px-8 py-3.5"
              style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 8px 24px rgba(16,185,129,0.4)"}}>
              Open the Platform <ArrowRight className="w-5 h-5"/>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section" style={{background:"linear-gradient(160deg,#F0FDF4,#F8FAFC)"}}>
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <span className="section-label mb-4"><Globe className="w-3.5 h-3.5"/> Our Mission</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-5 mb-4">
              Empowering Every <span className="grad-text">Kisan</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon:"🎯", t:"Precision", d:"Turn raw soil and weather data into precise, field-specific actions — so no water, fertilizer or labour is wasted." },
              { icon:"📊", t:"Profitability", d:"The P&L calculator and live mandi prices help farmers decide exactly when and where to sell for maximum profit." },
              { icon:"🌱", t:"Sustainability", d:"Optimal irrigation and fertilizer scheduling reduces chemical runoff and conserves water across all 6 farm plots." },
            ].map((c,i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                className="card p-7 text-center border-2 border-slate-100 hover:border-brand-200" whileHover={{scale:1.02,y:-3}}>
                <div className="text-5xl mb-4">{c.icon}</div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{c.t}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{c.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <Code2 className="w-4 h-4"/> Tech Stack
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Built with <span className="grad-text">Modern Tools</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Every layer is chosen for performance, developer experience, and the specific needs of a real-time agricultural platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TECH.map((t,i) => (
              <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07}}
                className="rounded-2xl p-5" style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)"}}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{t.icon}</span>
                  <h3 className="font-bold text-white">{t.layer}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {t.items.map(item => (
                    <span key={item} className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{background:`${t.color}20`,color:t.color,border:`1px solid ${t.color}40`}}>
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="section" style={{background:"linear-gradient(160deg,#F5F3FF,#EDE9FE,#F0FDF4)"}}>
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <span className="section-label mb-4"><Zap className="w-3.5 h-3.5"/> Roadmap</span>
            <h2 className="text-4xl font-bold text-slate-900 mt-5 mb-4">
              What's <span className="grad-text">Coming Next</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-brand-100"/>
            <div className="space-y-8">
              {TIMELINE.map((t,i) => (
                <motion.div key={i} initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                  className="flex items-start gap-5 pl-14 relative">
                  <div className="absolute left-3 top-1 w-6 h-6 rounded-full border-4 border-brand-500 bg-white flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${i===0?"bg-brand-500":"bg-slate-300"}`}/>
                  </div>
                  <div className="card p-5 flex-1 border-2 border-slate-100">
                    <p className="text-xs font-bold text-brand-600 mb-1 uppercase tracking-wide">{t.year}</p>
                    <p className="text-slate-700 font-medium">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{background:"linear-gradient(135deg,#059669,#047857)"}}>
        <div className="container text-center">
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
            <h2 className="text-4xl font-bold text-white mb-4">Start Farming Smarter Today</h2>
            <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">No signup. No hardware. Open AgroWave and see your farm's intelligence dashboard immediately.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/dashboard" className="btn text-base px-8 py-3.5 text-brand-700"
                style={{background:"#fff",boxShadow:"0 8px 24px rgba(0,0,0,0.15)"}}>
                Open Dashboard <ArrowRight className="w-5 h-5"/>
              </Link>
              <Link href="/contact" className="btn btn-outline text-base px-8 py-3.5 text-white border-white/40 hover:bg-white/10">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="h-16"/>
    </div>
  );
}
