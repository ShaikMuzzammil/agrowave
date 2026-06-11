"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send, Mail, Phone, MapPin, CheckCircle2, Info,
  User, MessageSquare, ChevronDown, X, Clock, Globe
} from "lucide-react";
import Card from "@/components/Card";

const SUBJECTS = [
  "Technical Support",
  "Feature Request",
  "Partnership / Business",
  "Bug Report",
  "General Feedback",
  "Other",
];

const FAQS = [
  { q:"Is AgroWave free to use?",            a:"Yes — 100% free. No subscription, no hidden fees." },
  { q:"Does it need any hardware?",           a:"No sensors required. All data is simulated for demo use." },
  { q:"How accurate are the forecasts?",      a:"Weather data is hyper-local to Telangana via hourly simulation." },
  { q:"Are the market prices real?",          a:"Prices are simulated MSP-linked values updated every 60 seconds." },
  { q:"Where is my farm data stored?",        a:"All data stays in your browser — nothing is sent to a server." },
  { q:"Can I use this for my hackathon?",     a:"Absolutely — that's exactly what it was built for!" },
];

export default function Contact() {
  const [form, setForm] = useState({
    name:"", phone:"", email:"", subject:"", message:""
  });
  const [sent, setSent]     = useState(false);
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState("");
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  const set = (k:string) => (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(p=>({...p,[k]:e.target.value}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields."); return;
    }
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          name:    form.name,
          email:   form.email,
          phone:   form.phone || "—",
          subject: form.subject || "General Inquiry",
          message: form.message,
        }),
      });
      if (res.ok) { setSent(true); }
      else {
        const d = await res.json();
        setError(d.error || "Failed to send. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally { setBusy(false); }
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#EFF6FF 60%,#FFFBEB 100%)"}}>

      {/* ── Hero ── */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-16">
        <div className="container text-center max-w-2xl mx-auto">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <Mail className="w-4 h-4"/> Contact AgroWave
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Contact <span style={{background:"linear-gradient(135deg,#34D399,#10B981)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>AgroWave</span>
            </h1>
            <p className="text-slate-400 text-lg">Questions, partnerships, or feedback — we'd love to hear from you.</p>
          </motion.div>
        </div>
      </div>

      {/* ── 3 info cards ── */}
      <div className="container">
        <div className="grid sm:grid-cols-3 gap-4 -mt-6 relative z-10 mb-10">
          {[
            { Icon:Phone,  title:"Kisan Helpline", val:"1800-180-1551", sub:"Mon–Sat, 6am–10pm", col:"#10B981", bg:"#ECFDF5", border:"#A7F3D0" },
            { Icon:Mail,   title:"Email",           val:"hello@agrowave.farm", sub:"Reply within 24h", col:"#3B82F6", bg:"#EFF6FF", border:"#BFDBFE" },
            { Icon:MapPin, title:"Location",        val:"Hyderabad, India", sub:"Telangana — 500032", col:"#F59E0B", bg:"#FFFBEB", border:"#FDE68A" },
          ].map((c,i)=>(
            <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}>
              <Card className="flex flex-col items-center text-center gap-3 py-7 px-5"
                style={{background:c.bg, border:`1.5px solid ${c.border}`, boxShadow:"0 8px 32px rgba(0,0,0,0.07)"}}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{background:`${c.col}20`}}>
                  <c.Icon className="w-6 h-6" style={{color:c.col}}/>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{c.title}</p>
                  <p className="font-bold text-slate-900 text-base mt-0.5">{c.val}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{c.sub}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* ── Main 2-col: Form | FAQ ── */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto pb-16">

          {/* FORM */}
          <motion.div initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}}>
            <Card hover={false} className="p-8" style={{boxShadow:"0 8px 48px rgba(0,0,0,0.09)"}}>

              <AnimatePresence mode="wait">
                {sent ? (
                  /* ── SUCCESS — show everything entered ── */
                  <motion.div key="success" initial={{scale:.94,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:.94,opacity:0}}
                    className="py-4">
                    <div className="flex justify-center mb-5">
                      <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center">
                        <CheckCircle2 className="w-10 h-10 text-brand-600"/>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 text-center mb-1">Message Sent! 🎉</h3>
                    <p className="text-slate-500 text-center text-sm mb-6">
                      We'll reply to <span className="text-brand-600 font-semibold">{form.email}</span> within 24 hours.
                    </p>

                    {/* What you entered — summary */}
                    <div className="rounded-xl p-5 space-y-3 mb-6"
                      style={{background:"#F8FAFC",border:"1.5px solid #E2E8F0"}}>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Message Summary</p>
                      {[
                        { Icon:User,          label:"Name",    val:form.name },
                        { Icon:Mail,          label:"Email",   val:form.email },
                        { Icon:Phone,         label:"Phone",   val:form.phone || "—" },
                        { Icon:Globe,         label:"Subject", val:form.subject || "General Inquiry" },
                        { Icon:MessageSquare, label:"Message", val:form.message, wrap:true },
                      ].map((r,i)=>(
                        <div key={i} className={`flex gap-3 ${r.wrap ? "items-start" : "items-center"}`}>
                          <div className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <r.Icon className="w-3.5 h-3.5 text-brand-600"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{r.label}</p>
                            <p className={`text-sm text-slate-700 font-medium mt-0.5 ${r.wrap ? "whitespace-pre-wrap break-words" : "truncate"}`}>
                              {r.val}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => { setSent(false); setForm({name:"",phone:"",email:"",subject:"",message:""}); }}
                      className="btn btn-outline w-full py-2.5 text-sm">
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  /* ── FORM ── */
                  <motion.div key="form" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <MessageSquare className="w-6 h-6 text-brand-500"/> Send a Message
                    </h2>
                    <p className="text-slate-400 text-sm mb-6">Fill in the form — we'll reply to your email address.</p>

                    {/* Tip banner */}
                    <div className="flex items-start gap-2 p-3 rounded-xl mb-5 text-xs"
                      style={{background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.2)",color:"#047857"}}>
                      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"/>
                      <span>Your message is sent via <strong>Resend API</strong> — delivered instantly to our inbox. You'll see a summary of exactly what was sent after submission.</span>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                        <X className="w-4 h-4 flex-shrink-0"/>
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-xs">FULL NAME <span className="text-rose-400">*</span></label>
                          <input required placeholder="Ramesh Kumar" value={form.name} onChange={set("name")}
                            style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                        </div>
                        <div>
                          <label className="label-xs">PHONE</label>
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
                          <select value={form.subject} onChange={set("subject")}
                            className="appearance-none pr-10"
                            style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                            <option value="">Select a topic…</option>
                            {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                        </div>
                      </div>

                      <div>
                        <label className="label-xs">MESSAGE <span className="text-rose-400">*</span></label>
                        <textarea required rows={5}
                          placeholder="Describe your question or feedback in detail — the more context, the better we can help…"
                          value={form.message} onChange={set("message")}
                          style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                        <p className="text-[10px] text-slate-400 mt-1 text-right">{form.message.length} chars</p>
                      </div>

                      <button type="submit" disabled={busy}
                        className="btn btn-primary w-full py-3.5 text-base font-semibold flex items-center justify-center gap-2"
                        style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 4px 20px rgba(16,185,129,0.35)"}}>
                        {busy ? (
                          <>
                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Sending via Resend…
                          </>
                        ) : (
                          <><Send className="w-4 h-4"/> Send Message via Resend</>
                        )}
                      </button>
                      <p className="text-center text-[11px] text-slate-400">
                        Powered by Resend — messages delivered to our inbox instantly
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{delay:0.1}}>
            <h2 className="text-2xl font-bold text-slate-800 mb-5 flex items-center gap-2">
              <span className="text-2xl">💬</span> Frequently Asked Questions
            </h2>

            <div className="space-y-2 mb-8">
              {FAQS.map((faq,i) => (
                <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.1+i*0.05}}>
                  <div className={`rounded-xl overflow-hidden border transition-all ${openFaq===i?"border-brand-300 shadow-sm":"border-slate-200"}`}>
                    <button onClick={() => setOpenFaq(openFaq===i?null:i)}
                      className={`w-full text-left flex items-center justify-between px-5 py-4 font-semibold text-sm transition-colors ${
                        openFaq===i ? "text-brand-700 bg-brand-50" : "text-slate-700 hover:bg-slate-50"
                      }`}>
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 flex-shrink-0 ml-3 transition-transform ${openFaq===i?"rotate-180 text-brand-500":""}`}/>
                    </button>
                    <AnimatePresence>
                      {openFaq===i && (
                        <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
                          transition={{duration:0.2}}>
                          <p className="px-5 pb-4 pt-1 text-sm text-slate-500 leading-relaxed border-t border-brand-100">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Hackathon card */}
            <div className="rounded-2xl p-6"
              style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",border:"1px solid rgba(16,185,129,0.3)"}}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <h3 className="font-bold text-white text-base">Hackathon Project</h3>
                  <p className="text-green-300 text-xs font-semibold">AgroWave Smart Farming Platform</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Built to showcase how modern web tech can transform Indian agriculture. Full-stack, production-ready, zero hardware required.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {["Next.js 14","TypeScript","Tailwind CSS","Recharts","Framer Motion","Resend API"].map(t=>(
                  <span key={t} className="text-center text-[10px] font-bold px-2 py-1.5 rounded-lg"
                    style={{background:"rgba(16,185,129,0.12)",color:"#A7F3D0",border:"1px solid rgba(16,185,129,0.25)"}}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Response time badge */}
            <div className="flex items-center gap-3 mt-5 p-4 rounded-xl"
              style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0"}}>
              <Clock className="w-5 h-5 text-brand-600 flex-shrink-0"/>
              <div>
                <p className="font-semibold text-brand-800 text-sm">Typical response time: under 24 hours</p>
                <p className="text-xs text-brand-600">Mon–Sat · 8am–8pm IST</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
