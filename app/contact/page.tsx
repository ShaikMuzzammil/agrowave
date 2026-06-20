"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ChevronDown, MessageCircle, Clock, Trophy, AlertCircle, CheckCircle2, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-[64px] min-h-screen" style={{background:"linear-gradient(180deg,#F0FDF4 0%,#F8FAFC 60%,#EFF6FF 100%)"}}>

      {/* ── HERO — dark green, tall enough so cards overlap nicely ── */}
      <section className="relative overflow-hidden pt-14 pb-36 sm:pt-18 sm:pb-40"
        style={{background:"linear-gradient(160deg,#03130A 0%,#0A2818 55%,#062014 100%)"}}>
        <div className="absolute -top-24 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none" style={{background:"#10B981"}}/>
        <div className="absolute -bottom-24 -left-24 w-[28rem] h-[28rem] rounded-full opacity-12 blur-3xl pointer-events-none" style={{background:"#3B82F6"}}/>
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

      {/* ── INFO CARDS — overlapping the dark hero ── */}
      <div className="container relative z-10 -mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0}}
            className="rounded-2xl p-6 text-center" style={{background:"#ECFDF5",border:"1.5px solid #A7F3D0",boxShadow:"0 8px 32px rgba(16,185,129,0.1)"}}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-white" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <Phone className="w-5 h-5 text-emerald-600"/>
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-1.5">KISAN HELPLINE</div>
            <div className="font-bold text-slate-800 text-base mb-0.5">1800-180-1551</div>
            <div className="text-slate-500 text-xs">Mon–Sat, 6am–10pm IST</div>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.08}}
            className="rounded-2xl p-6 text-center" style={{background:"#EFF6FF",border:"1.5px solid #BFDBFE",boxShadow:"0 8px 32px rgba(59,130,246,0.08)"}}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-white" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              <Mail className="w-5 h-5 text-blue-600"/>
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-1.5">SEND A MESSAGE</div>
            <div className="font-bold text-slate-800 text-base mb-0.5">Fill the form below</div>
            <div className="text-slate-500 text-xs">We reply to your email within 24h</div>
          </motion.div>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.16}}
            className="rounded-2xl p-6 text-center" style={{background:"#FFFBEB",border:"1.5px solid #FDE68A",boxShadow:"0 8px 32px rgba(245,158,11,0.08)"}}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-white text-2xl leading-none" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
              🇮🇳
            </div>
            <div className="text-[10px] font-bold tracking-widest text-slate-400 mb-1.5">BUILT FOR</div>
            <div className="font-bold text-slate-800 text-base mb-0.5">Indian Farmers</div>
            <div className="text-slate-500 text-xs">Made for Indian agriculture</div>
          </motion.div>
        </div>
      </div>

      {/* ── FAQ + FORM ── */}
      <section className="py-14">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

            {/* LEFT — FAQs */}
            <motion.div initial={{opacity:0,x:-20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-brand-500"/> Frequently Asked Questions
              </h3>
              <div className="space-y-2.5">
                {[
                  {q:"Is AgroWave free to use?",           a:"Yes — completely free, no sign-up or credit card needed."},
                  {q:"Does it need any hardware?",          a:"No hardware required. Works in any browser on mobile or desktop."},
                  {q:"How accurate are the forecasts?",     a:"Weather and crop data is simulated for demo purposes — not a real forecast service."},
                  {q:"Are the market prices real?",         a:"Prices are simulated from 24 major Indian mandis with realistic live-feel updates. Not a live government feed."},
                  {q:"Where is my farm data stored?",       a:"Everything is stored locally in your browser — never sent to any server or database."},
                  {q:"Can I use this for a hackathon?",     a:"Absolutely — it's an open portfolio/learning project built with Next.js 14, TypeScript and Tailwind."},
                ].map((f,i)=>(
                  <details key={i} className="group rounded-xl overflow-hidden bg-white border border-slate-200" style={{boxShadow:"0 1px 6px rgba(0,0,0,0.04)"}}>
                    <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900 list-none select-none gap-2">
                      <span>{f.q}</span>
                      <ChevronDown className="w-4 h-4 text-brand-500 flex-shrink-0 group-open:rotate-180 transition-transform"/>
                    </summary>
                    <div className="px-4 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-2">{f.a}</div>
                  </details>
                ))}
              </div>

              {/* Portfolio project card */}
              <div className="mt-5 p-4 rounded-2xl bg-slate-900 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-4 h-4 text-amber-400"/>
                  <span className="font-bold text-sm">Personal / Portfolio Project</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mb-3">
                  AgroWave explores what a smart-farming dashboard could look like for Indian farmers — a learning project, not a replacement for real agronomy software or IoT sensors.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {["Next.js 14","TypeScript","Tailwind CSS","Framer Motion","Recharts","Resend API","Zustand"].map(t=>(
                    <span key={t} className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/10 text-slate-200">{t}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 p-4 rounded-2xl flex items-center gap-3" style={{background:"#F0FDF4",border:"1px solid #BBF7D0"}}>
                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0"/>
                <div>
                  <div className="text-emerald-700 text-sm font-bold">Response: under 24 hours</div>
                  <div className="text-emerald-600/70 text-xs">Mon–Sat · 8am–8pm IST</div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Contact Form (no confirm step, inline validation) */}
            <ContactForm/>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactForm() {
  const [form, setForm]       = useState({name:"",email:"",phone:"",subject:"",message:""});
  const [errors, setErrors]   = useState<Record<string,string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone]       = useState(false);
  const [serverErr, setServerErr] = useState("");

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.name.trim())    e.name    = "Please enter your name.";
    if (!form.email.trim())   e.email   = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "That doesn't look like a valid email.";
    if (!form.message.trim()) e.message = "Please write a message before sending.";
    return e;
  };

  const handleSend = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setSending(true);
    setServerErr("");
    try {
      const res = await fetch("/api/contact", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        setServerErr(data.error || "Something went wrong. Please try again.");
        setSending(false);
        return;
      }
    } catch {
      setServerErr("Network error. Please check your connection and try again.");
      setSending(false);
      return;
    }
    setSending(false);
    setDone(true);
  };

  if (done) return (
    <motion.div initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}}
      className="rounded-2xl overflow-hidden text-center bg-white border border-emerald-200" style={{boxShadow:"0 8px 32px rgba(16,185,129,0.1)"}}>
      <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-600"/> Your Message</span>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">✓ Delivered</span>
      </div>
      <div className="p-10">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="font-bold text-slate-800 text-xl mb-2">Message Received!</h3>
        <p className="text-slate-500 text-sm mb-2 max-w-xs mx-auto">
          Your message has been sent. We'll reply to <strong className="text-emerald-700">{form.email}</strong> within 24 hours.
        </p>
        <p className="text-slate-400 text-xs mb-6">Powered by Resend — delivered instantly to our inbox.</p>
        <div className="text-left rounded-xl p-4 mb-6 space-y-2 bg-slate-50 border border-slate-100">
          {[["Name",form.name],["Subject",form.subject||"General Inquiry"],
            ["Message",form.message.length>90?form.message.slice(0,90)+"…":form.message]].map(([l,v])=>(
            <div key={l} className="flex gap-2 text-xs">
              <span className="text-slate-400 w-16 flex-shrink-0 font-semibold">{l}:</span>
              <span className="text-slate-700">{v}</span>
            </div>
          ))}
        </div>
        <button onClick={()=>{setDone(false);setForm({name:"",email:"",phone:"",subject:"",message:""});setErrors({});}}
          className="text-emerald-600 text-sm font-semibold hover:text-emerald-700 transition-colors">
          Send another message →
        </button>
      </div>
    </motion.div>
  );

  const Field = ({id,label,req,children,err}:{id:string;label:string;req?:boolean;children:React.ReactNode;err?:string}) => (
    <div>
      <label className="label-xs">{label}{req&&<span className="text-rose-500 ml-0.5">*</span>}</label>
      {children}
      <AnimatePresence>
        {err && (
          <motion.p initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}} exit={{opacity:0}}
            className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3 h-3 flex-shrink-0"/>{err}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <motion.div initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}}
      className="rounded-2xl overflow-hidden bg-white border border-slate-200" style={{boxShadow:"0 8px 32px rgba(0,0,0,0.06)"}}>

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
        <span className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <Mail className="w-4 h-4 text-brand-500"/> Send Us a Message
        </span>
        <span className="text-[10px] text-slate-400 font-medium">Powered by Resend API · replies go to your email</span>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field id="name" label="FULL NAME" req err={errors.name}>
            <input value={form.name} placeholder="Ramesh Kumar"
              onChange={e=>{setForm(p=>({...p,name:e.target.value}));if(errors.name)setErrors(p=>({...p,name:""}));}}
              style={errors.name?{borderColor:"#FCA5A5"}:{}}/>
          </Field>
          <Field id="phone" label="PHONE (OPTIONAL)">
            <input value={form.phone} placeholder="+91 98765 43210"
              onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
          </Field>
        </div>

        <Field id="email" label="EMAIL" req err={errors.email}>
          <input type="email" value={form.email} placeholder="farmer@example.com"
            onChange={e=>{setForm(p=>({...p,email:e.target.value}));if(errors.email)setErrors(p=>({...p,email:""}));}}
            style={errors.email?{borderColor:"#FCA5A5"}:{}}/>
        </Field>

        <Field id="subject" label="SUBJECT / TOPIC">
          <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}>
            <option value="">Select a topic…</option>
            {["General Enquiry","Technical Support","Partnership","Feedback","Bug Report","Other"].map(s=>(
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field id="message" label="MESSAGE" req err={errors.message}>
          <textarea rows={4} value={form.message}
            placeholder="Describe your question or feedback in detail — the more context, the better we can help…"
            onChange={e=>{setForm(p=>({...p,message:e.target.value}));if(errors.message)setErrors(p=>({...p,message:""}));}}
            style={{resize:"vertical",...(errors.message?{borderColor:"#FCA5A5"}:{})}}/>
          <div className="text-[10px] text-slate-400 text-right -mt-0.5">{form.message.length} chars</div>
        </Field>

        {/* Server error */}
        <AnimatePresence>
          {serverErr && (
            <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              className="flex items-start gap-2 p-3 rounded-xl text-sm text-rose-700 bg-rose-50 border border-rose-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/>{serverErr}
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={handleSend} disabled={sending}
          className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70"
          style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 4px 16px rgba(16,185,129,0.3)"}}>
          {sending ? (
            <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending…</>
          ) : (
            <><Send className="w-4 h-4"/> Send Message</>
          )}
        </button>
        <p className="text-[10px] text-slate-400 text-center -mt-1">
          Your message goes directly to our inbox. We reply to your email address within 24 hours.
        </p>
      </div>
    </motion.div>
  );
}
