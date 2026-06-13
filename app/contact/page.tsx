"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mail, Phone, MapPin, CheckCircle2,
  MessageSquare, ChevronDown, X, Clock,
  ChevronRight, ArrowLeft, User, Sparkles
} from "lucide-react";
import Card from "@/components/Card";
import Link from "next/link";

const SUBJECTS = [
  "Technical Support","Feature Request","Partnership / Business",
  "Bug Report","General Feedback","Other"
];
const FAQS = [
  { q:"Is AgroWave free to use?",      a:"Yes — 100% free. No subscription, no hidden fees, no sign-up needed." },
  { q:"Does it need any hardware?",     a:"No sensors required. All data is simulated live in your browser for demo purposes." },
  { q:"How accurate are forecasts?",    a:"Weather data is hyper-local to Telangana, updated hourly with real patterns." },
  { q:"Are the market prices real?",    a:"Prices are simulated MSP-linked values, refreshed automatically every 60 seconds." },
  { q:"Where is my farm data stored?",  a:"All data stays in your browser — nothing is sent to any external server." },
  { q:"Can I use this for a hackathon?",a:"Absolutely — that's exactly what it was built for. MIT licensed." },
];
const FIELD_LABELS: Record<string,string> = {
  name:"Full Name", phone:"Phone Number", email:"Email Address",
  subject:"Topic / Subject", message:"Your Message"
};

export default function Contact() {
  const [form, setForm]   = useState({ name:"", phone:"", email:"", subject:"", message:"" });
  const [step, setStep]   = useState<1|2|3>(1);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  const set = (k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>
    setForm(p=>({...p,[k]:e.target.value}));

  const goToReview = ()=>{
    if(!form.name||!form.email||!form.message){
      setError("Please fill in Name, Email and Message."); return;
    }
    setError(""); setStep(2);
    // Animate through each field with highlight
    const keys = Object.keys(form);
    keys.forEach((_,i)=>{
      setTimeout(()=>setHighlighted(i), i*380);
    });
    setTimeout(()=>setHighlighted(-1), keys.length*380+400);
  };

  const handleSend = async ()=>{
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/contact",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          name:form.name, email:form.email, phone:form.phone||"—",
          subject:form.subject||"General Inquiry", message:form.message,
        }),
      });
      if(res.ok){ setStep(3); }
      else{ const d=await res.json(); setError(d.error||"Unable to send. Please try again."); }
    } catch { setError("Network error — please check your connection."); }
    finally { setBusy(false); }
  };

  const reset = ()=>{ setForm({name:"",phone:"",email:"",subject:"",message:""}); setStep(1); setError(""); };

  return (
    <div className="pt-[88px] min-h-screen"
      style={{background:"linear-gradient(160deg,#F0FDF4 0%,#EFF6FF 60%,#FFFBEB 100%)"}}>

      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-14">
        <div className="container text-center max-w-xl mx-auto">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <Mail className="w-4 h-4"/> Get in Touch
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Contact{" "}
              <span style={{background:"linear-gradient(135deg,#34D399,#10B981)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                AgroWave
              </span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              Questions, partnerships, or feedback — our team responds within 24 hours.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Info cards */}
      <div className="container">
        <div className="grid sm:grid-cols-3 gap-4 -mt-6 relative z-10 mb-10">
          {[
            {Icon:Phone,  t:"Kisan Helpline",v:"1800-180-1551",  sub:"Mon–Sat, 6am–10pm", col:"#10B981",bg:"#ECFDF5",br:"#A7F3D0"},
            {Icon:Mail,   t:"Email",         v:"hello@agrowave.farm",sub:"Reply within 24h",col:"#3B82F6",bg:"#EFF6FF",br:"#BFDBFE"},
            {Icon:MapPin, t:"Location",      v:"Hyderabad, India",   sub:"Telangana — 500032",col:"#F59E0B",bg:"#FFFBEB",br:"#FDE68A"},
          ].map((c,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
              <Card className="flex flex-col items-center text-center gap-3 py-7 px-5"
                style={{background:c.bg,border:`1.5px solid ${c.br}`,boxShadow:"0 8px 32px rgba(0,0,0,0.07)"}}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{background:`${c.col}20`}}>
                  <c.Icon className="w-6 h-6" style={{color:c.col}}/>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{c.t}</p>
                  <p className="font-bold text-slate-900 text-base mt-0.5">{c.v}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* 2-col: FORM (left 3/5) + FAQ (right 2/5) */}
        <div className="grid md:grid-cols-5 gap-8 max-w-5xl mx-auto pb-16">

          {/* ─── FORM ─── */}
          <motion.div className="md:col-span-3" initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}}>
            <Card hover={false} className="p-8" style={{boxShadow:"0 8px 48px rgba(0,0,0,0.09)"}}>

              {/* Step progress */}
              <div className="flex items-center gap-2 mb-6">
                {[1,2,3].map(s=>(
                  <div key={s} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step>s?"bg-brand-500 text-white":step===s?"bg-brand-600 text-white ring-2 ring-brand-200":"bg-slate-100 text-slate-400"
                    }`}>
                      {step>s ? "✓" : s}
                    </div>
                    <span className={`text-xs font-medium ${step===s?"text-brand-600":"text-slate-400"}`}>
                      {s===1?"Fill in":s===2?"Review":"Delivered!"}
                    </span>
                    {s<3 && <ChevronRight className="w-3 h-3 text-slate-300"/>}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">

                {/* ── STEP 1: Form ── */}
                {step===1 && (
                  <motion.div key="s1" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                    <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-brand-500"/> Send Us a Message
                    </h2>
                    <p className="text-slate-400 text-sm mb-5">
                      Fill in the form below — your message goes directly to our team.
                    </p>
                    {error && (
                      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                        <X className="w-4 h-4 flex-shrink-0"/>{error}
                      </div>
                    )}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-xs">FULL NAME <span className="text-rose-400">*</span></label>
                          <input required placeholder="Ramesh Kumar" value={form.name} onChange={set("name")}
                            style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                        </div>
                        <div>
                          <label className="label-xs">PHONE <span className="text-slate-300">(optional)</span></label>
                          <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")}
                            style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                        </div>
                      </div>
                      <div>
                        <label className="label-xs">EMAIL <span className="text-rose-400">*</span></label>
                        <input required type="email" placeholder="farmer@example.com" value={form.email} onChange={set("email")}
                          style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                      </div>
                      <div>
                        <label className="label-xs">SUBJECT</label>
                        <div className="relative">
                          <select value={form.subject} onChange={set("subject")} className="appearance-none pr-10"
                            style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                            <option value="">Select a topic…</option>
                            {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                        </div>
                      </div>
                      <div>
                        <label className="label-xs">MESSAGE <span className="text-rose-400">*</span></label>
                        <textarea required rows={4}
                          placeholder="Describe your question or feedback in detail — the more context, the better we can help…"
                          value={form.message} onChange={set("message")}
                          style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                        <p className="text-[10px] text-slate-400 mt-1 text-right">{form.message.length} chars</p>
                      </div>
                      <button onClick={goToReview}
                        className="btn btn-primary w-full py-3.5 text-base font-semibold flex items-center justify-center gap-2"
                        style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 4px 20px rgba(16,185,129,0.35)"}}>
                        Review Message <ChevronRight className="w-4 h-4"/>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 2: Review ── */}
                {step===2 && (
                  <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:20}}>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Review Your Message</h2>
                    <p className="text-slate-400 text-sm mb-5">
                      Confirm everything looks right before sending to our team.
                    </p>
                    {error && (
                      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                        <X className="w-4 h-4"/>{error}
                      </div>
                    )}
                    <div className="space-y-2.5 mb-6">
                      {Object.entries(form).map(([k,v],i)=>(
                        <motion.div key={k}
                          initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
                          className="flex items-start gap-3 p-3 rounded-xl transition-all duration-300"
                          style={{
                            background:highlighted===i?"rgba(16,185,129,0.1)":"#F8FAFC",
                            border:highlighted===i?"2px solid #10B981":"2px solid #E2E8F0",
                            boxShadow:highlighted===i?"0 0 0 3px rgba(16,185,129,0.15)":"none",
                          }}>
                          <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-brand-600 text-[10px] font-bold">{i+1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{FIELD_LABELS[k]}</p>
                            <p className="text-sm font-semibold text-slate-800 mt-0.5 break-words">
                              {v || <span className="text-slate-300 italic">—</span>}
                            </p>
                          </div>
                          {highlighted===i && <span className="text-brand-500 text-xs font-bold flex-shrink-0 mt-1">✓</span>}
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={()=>setStep(1)} className="btn btn-outline flex items-center gap-2 px-5 py-3">
                        <ArrowLeft className="w-4 h-4"/> Edit
                      </button>
                      <button onClick={handleSend} disabled={busy}
                        className="btn btn-primary flex-1 py-3 font-semibold flex items-center justify-center gap-2"
                        style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                        {busy ? (
                          <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>Sending…</>
                        ) : (
                          <><Send className="w-4 h-4"/> Confirm & Send to Team</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP 3: Success ── */}
                {step===3 && (
                  <motion.div key="s3" initial={{scale:.94,opacity:0}} animate={{scale:1,opacity:1}} className="py-4 text-center">
                    <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",delay:0.2}}
                      className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-5">
                      <CheckCircle2 className="w-10 h-10 text-brand-600"/>
                    </motion.div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Delivered! 🎉</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                      Our team has received your message and will reply to{" "}
                      <span className="text-brand-600 font-semibold">{form.email}</span>{" "}
                      within 24 hours.
                    </p>
                    {/* Summary */}
                    <div className="rounded-xl p-4 text-left mb-6"
                      style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0"}}>
                      <p className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5"/> Message received by our team
                      </p>
                      <div className="space-y-1.5">
                        {[
                          {l:"From",   v:form.name},
                          {l:"Email",  v:form.email},
                          {l:"Phone",  v:form.phone||"—"},
                          {l:"Topic",  v:form.subject||"General Inquiry"},
                        ].map(r=>(
                          <div key={r.l} className="flex gap-3 text-sm">
                            <span className="text-slate-400 w-12 flex-shrink-0">{r.l}:</span>
                            <span className="text-slate-700 font-medium break-words">{r.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button onClick={reset} className="btn btn-outline w-full py-2.5 text-sm">
                      Send Another Message
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>
            </Card>
          </motion.div>

          {/* ─── FAQ ─── */}
          <motion.div className="md:col-span-2" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:0.1}}>
            <h2 className="text-xl font-bold text-slate-800 mb-4">💬 FAQs</h2>
            <div className="space-y-2 mb-6">
              {FAQS.map((faq,i)=>(
                <div key={i} className={`rounded-xl overflow-hidden border transition-all ${openFaq===i?"border-brand-300":"border-slate-200"}`}>
                  <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                    className={`w-full text-left flex items-center justify-between px-4 py-3 text-sm font-semibold transition-colors ${openFaq===i?"text-brand-700 bg-brand-50":"text-slate-700 hover:bg-slate-50"}`}>
                    <span className="pr-2">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${openFaq===i?"rotate-180 text-brand-500":""}`}/>
                  </button>
                  <AnimatePresence>
                    {openFaq===i && (
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} transition={{duration:0.2}}>
                        <p className="px-4 pb-3 pt-1 text-sm text-slate-500 leading-relaxed border-t border-brand-100">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Response time */}
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0"}}>
              <Clock className="w-5 h-5 text-brand-600 flex-shrink-0"/>
              <div>
                <p className="font-semibold text-brand-800 text-sm">Response: under 24 hours</p>
                <p className="text-xs text-brand-600">Mon–Sat · 8am–8pm IST</p>
              </div>
            </div>

            {/* Hackathon card */}
            <div className="rounded-2xl p-5 mt-4"
              style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",border:"1px solid rgba(16,185,129,0.3)"}}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏆</span>
                <div>
                  <h3 className="font-bold text-white text-sm">Hackathon Project</h3>
                  <p className="text-green-300 text-xs">AgroWave Smart Farming Platform</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["Next.js 14","TypeScript","Tailwind","Recharts","Framer Motion","Zustand","Resend API","Vercel"].map(t=>(
                  <span key={t} className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{background:"rgba(16,185,129,0.12)",color:"#A7F3D0",border:"1px solid rgba(16,185,129,0.25)"}}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
