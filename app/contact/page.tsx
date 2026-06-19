"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, Phone, ArrowRight, ChevronDown, MessageCircle, Clock, Trophy
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-[64px] min-h-screen">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-16 pb-28 sm:pt-20 sm:pb-32"
        style={{background:"linear-gradient(160deg,#03130A 0%,#0A2818 55%,#062014 100%)"}}>
        {/* decorative glows — varied colours, not just green */}
        <div className="absolute -top-32 -right-20 w-[24rem] h-[24rem] rounded-full opacity-20 blur-3xl pointer-events-none" style={{background:"#10B981"}}/>
        <div className="absolute -bottom-32 -left-24 w-[26rem] h-[26rem] rounded-full opacity-15 blur-3xl pointer-events-none" style={{background:"#3B82F6"}}/>
        <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none" style={{background:"#F59E0B"}}/>
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none"/>

        <div className="container relative text-center">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="inline-flex items-center gap-2 bg-emerald-400/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-5 border border-emerald-400/25">
              <Mail className="w-4 h-4"/> Contact AgroWave
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact <span className="grad-text">AgroWave</span>
            </h1>
            <p className="text-slate-300 text-base max-w-xl mx-auto">
              Questions, partnerships, or feedback — we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── INFO CARDS + FAQ/FORM ── */}
      <section className="section-subtle py-14">
        <div className="container">

          {/* Info cards row — completely self-contained, no overflow/mixed backgrounds */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 max-w-4xl mx-auto -mt-16 relative z-10">
            {/* Card 1 — Kisan Helpline */}
            <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0}}
              className="rounded-2xl p-6 text-center shadow-card"
              style={{background:"#ECFDF5",border:"1.5px solid #A7F3D0"}}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-white shadow-sm"
                style={{border:"1px solid #D1FAE5"}}>
                <Phone className="w-5 h-5 text-emerald-600"/>
              </div>
              <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-1.5">KISAN HELPLINE</div>
              <div className="font-bold text-slate-800 text-base mb-0.5">1800-180-1551</div>
              <div className="text-slate-500 text-xs">Mon–Sat, 6am–10pm</div>
            </motion.div>

            {/* Card 2 — Message Us (replaces email to avoid exposing real address) */}
            <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.08}}
              className="rounded-2xl p-6 text-center shadow-card"
              style={{background:"#EFF6FF",border:"1.5px solid #BFDBFE"}}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-white shadow-sm"
                style={{border:"1px solid #DBEAFE"}}>
                <Mail className="w-5 h-5 text-blue-600"/>
              </div>
              <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-1.5">SEND A MESSAGE</div>
              <div className="font-bold text-slate-800 text-base mb-0.5">Fill the form below</div>
              <div className="text-slate-500 text-xs">We reply to your email within 24h</div>
            </motion.div>

            {/* Card 3 — Built for India (replaces exact location to avoid exposing personal address) */}
            <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.16}}
              className="rounded-2xl p-6 text-center shadow-card"
              style={{background:"#FFFBEB",border:"1.5px solid #FDE68A"}}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-white shadow-sm text-2xl leading-none"
                style={{border:"1px solid #FEF3C7"}}>
                🇮🇳
              </div>
              <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-1.5">BUILT FOR</div>
              <div className="font-bold text-slate-800 text-base mb-0.5">Indian Farmers</div>
              <div className="text-slate-500 text-xs">Designed for Indian agriculture</div>
            </motion.div>
          </div>

          {/* Two-column: LEFT = FAQs + project card, RIGHT = Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* LEFT — FAQs */}
            <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-brand-500"/> Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {[
                  {q:"Is AgroWave free to use?",a:"Yes — AgroWave is completely free. No hidden fees, no credit card required."},
                  {q:"Does it need any hardware?",a:"No hardware needed at all. Just open AgroWave in any browser on your mobile or desktop."},
                  {q:"How accurate are the forecasts?",a:"The weather model is a simulated demo calibrated to feel realistic — it isn't a real forecasting service."},
                  {q:"Are the market prices real?",a:"Prices are simulated from 24 major mandis across India with a live-ticking feed and MSP reference data, not a live government feed."},
                  {q:"Where is my farm data stored?",a:"Your plot data is stored locally in your browser (no server database) and never shared with third parties."},
                  {q:"Can I use this for my hackathon or portfolio?",a:"Yes — this is an open learning/portfolio project built with Next.js, TypeScript, Tailwind, and Recharts."},
                ].map((faq,i)=>(
                  <details key={i} className="rounded-xl overflow-hidden group bg-white border border-slate-200 shadow-card">
                    <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 list-none select-none">
                      {faq.q}
                      <ChevronDown className="w-4 h-4 text-brand-500 flex-shrink-0 group-open:rotate-180 transition-transform"/>
                    </summary>
                    <div className="px-4 pb-3 text-sm text-slate-500 leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <Trophy className="w-4 h-4 text-amber-400"/>
                  <span className="font-bold text-sm">Personal / Portfolio Project</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mb-3">
                  AgroWave is a learning project exploring what a smart-farming dashboard UI could look like for Indian farmers — a small contribution, not a replacement for real agronomy or farm-management software.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Next.js 14","TypeScript","Tailwind CSS","Framer Motion","Recharts","Resend API"].map(t=>(
                    <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/10 text-slate-200">{t}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0"/>
                <div>
                  <div className="text-emerald-700 text-sm font-bold">Response: under 24 hours</div>
                  <div className="text-emerald-600/70 text-xs">Mon–Sat · 8am–8pm IST</div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Contact Form */}
            <ContactForm/>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Contact form ── */
function ContactForm() {
  const [step, setStep] = useState<1|2|3>(1);
  const [form, setForm] = useState({name:"",email:"",phone:"",subject:"",message:""});
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await fetch("/api/contact", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    } catch {}
    setSending(false);
    setStep(3);
  };

  if(step===3) return (
    <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}
      className="rounded-2xl overflow-hidden text-center bg-emerald-50 border border-emerald-200">
      <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-emerald-100 flex items-center justify-between bg-white/50">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-600"/> Your Message</span>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">Step 3 of 3 · Complete ✓</span>
      </div>
      <div className="p-8">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="font-bold text-slate-800 text-xl mb-2">Message Received!</h3>
        <p className="text-slate-500 text-sm mb-4">Our team has received your message and will reply to <strong className="text-emerald-700">{form.email}</strong> within 24 hours.</p>
        <div className="text-left rounded-xl p-4 mb-5 space-y-1.5 bg-white">
          {[["Name",form.name],["Subject",form.subject],["Message",form.message.slice(0,80)+(form.message.length>80?"…":"")]].map(([l,v])=>(
            <div key={l} className="flex gap-2 text-xs"><span className="text-slate-400 w-16 flex-shrink-0">{l}:</span><span className="text-slate-700">{v}</span></div>
          ))}
        </div>
        <button onClick={()=>{setStep(1);setForm({name:"",email:"",phone:"",subject:"",message:""}); }}
          className="text-emerald-600 text-sm font-semibold hover:text-emerald-700">Send another message →</button>
      </div>
    </motion.div>
  );

  return (
    <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
      className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-card">
      {/* Step indicator */}
      <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-brand-500"/> Your Message</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">Step {step} of 3</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {([1,2,3] as const).map(s=>(
            <React.Fragment key={s}>
              <div className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-bold transition-all ${step>=s?"text-brand-700":"text-slate-400"}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all flex-shrink-0 ${step>s?"bg-brand-500 text-white":step===s?"bg-brand-100 text-brand-700 ring-2 ring-brand-300":"bg-slate-100 text-slate-400"}`}>
                  {step>s?"✓":s}
                </div>
                <span className="whitespace-nowrap">{["Fill in","Review","Delivered!"][s-1]}</span>
              </div>
              {s<3&&(
                <div className="flex-1 h-1 rounded-full overflow-hidden bg-slate-100">
                  <motion.div className="h-full rounded-full" style={{background:"linear-gradient(90deg,#059669,#10B981)"}}
                    initial={{width:0}} animate={{width:step>s?"100%":"0%"}} transition={{duration:0.4}}/>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {step===1 && (
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-brand-500"/> Send Us a Message
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-xs">FULL NAME *</label>
              <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Ramesh Kumar"/>
            </div>
            <div>
              <label className="label-xs">PHONE (OPTIONAL)</label>
              <input value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="+91 98765 43210"/>
            </div>
          </div>
          <div>
            <label className="label-xs">EMAIL *</label>
            <input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="farmer@example.com"/>
          </div>
          <div>
            <label className="label-xs">SUBJECT</label>
            <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}>
              <option value="">Select a topic…</option>
              {["General Enquiry","Technical Support","Partnership","Feedback","Bug Report","Other"].map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label-xs">MESSAGE *</label>
            <textarea rows={3} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="Describe your question or feedback in detail…" style={{resize:"vertical"}}/>
            <div className="text-[10px] text-slate-400 text-right mt-0.5">{form.message.length} chars</div>
          </div>
          <button onClick={()=>{if(form.name&&form.email&&form.message)setStep(2);}}
            disabled={!form.name||!form.email||!form.message}
            className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
            style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 4px 16px rgba(16,185,129,0.3)"}}>
            Review Message <ArrowRight className="w-4 h-4"/>
          </button>
        </div>
      )}

      {step===2 && (
        <div className="p-6 space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Confirm your details</h3>
          <div className="space-y-3 rounded-xl p-4 bg-slate-50 border border-slate-100">
            {[["Name",form.name],["Email",form.email],["Phone",form.phone||"—"],["Subject",form.subject||"—"],["Message",form.message]].map(([l,v])=>(
              <div key={l} className="flex gap-3 text-sm items-start">
                <span className="text-slate-400 w-16 flex-shrink-0 text-xs font-bold uppercase pt-0.5">{l}</span>
                <span className="text-slate-700 break-words flex-1">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={()=>setStep(1)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 border border-slate-200">← Edit</button>
            <button onClick={handleSend} disabled={sending}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2"
              style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
              {sending?"Sending…":"✅ Confirm & Send"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
