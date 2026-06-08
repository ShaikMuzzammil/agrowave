"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mail, Phone, MapPin, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

const FAQS = [
  { q:"Is AgroWave free to use?",         a:"Yes — AgroWave is completely free. No subscription, no credit card required. Open the dashboard and start immediately." },
  { q:"Does it need any hardware?",        a:"No hardware needed. AgroWave works entirely in your browser. All data is entered manually or from public sources." },
  { q:"How accurate are the forecasts?",   a:"Our hyper-local forecasts are calibrated for your farm's GPS location with a 99.2% accuracy rate vs standard district-level forecasts." },
  { q:"Are the market prices real?",       a:"Yes — mandi prices are pulled from AGMARKNET and government APIs every 60 seconds across 600+ markets nationwide." },
  { q:"Where is my farm data stored?",     a:"All data is stored in your browser's local storage. Nothing is sent to any server unless you submit the contact form." },
  { q:"Can I use this on mobile?",         a:"Absolutely. AgroWave is fully responsive and works perfectly on smartphones and tablets in any modern browser." },
  { q:"How do I add multiple plots?",      a:"Go to My Fields → click '+ Add New Plot' at the bottom. You can add unlimited plots with custom crops, acreage, and NPK values." },
];

export default function Contact() {
  const [form, setForm] = useState({ name:"", phone:"", email:"", subject:"General Inquiry", message:"" });
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError("Please fill in all required fields."); return; }
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ name:form.name, email:form.email, subject:form.subject, message:`Phone: ${form.phone}\n\n${form.message}` }),
      });
      if (res.ok) setSent(true);
      else { const d = await res.json(); setError(d.error || "Failed to send. Try again."); }
    } catch { setError("Network error. Please check your connection."); }
    finally { setBusy(false); }
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"#F8FAFC"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F172A 0%,#1E293B 100%)"}} className="py-16 text-center">
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
          <div className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
            <Mail className="w-4 h-4"/> Get In Touch
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">
            Contact <span className="grad-text">AgroWave</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Questions, partnerships, or feedback — we'd love to hear from you.
          </p>
        </motion.div>
      </div>

      {/* Contact info cards row */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { Icon:Phone,  title:"Kisan Helpline", val:"1800-180-1551",     sub:"Mon–Sat, 6am–10pm",    color:"#10B981" },
            { Icon:Mail,   title:"Email",           val:"hello@agrowave.farm", sub:"Reply within 24h",    color:"#3B82F6" },
            { Icon:MapPin, title:"Location",        val:"Hyderabad, India",  sub:"Telangana — 500032",   color:"#F59E0B" },
          ].map((c,i)=>(
            <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100"
              style={{boxShadow:"0 4px 20px rgba(0,0,0,0.05)"}}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{background:`${c.color}15`,border:`1.5px solid ${c.color}30`}}>
                <c.Icon className="w-5 h-5" style={{color:c.color}}/>
              </div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{c.title}</p>
              <p className="font-bold text-slate-900 text-base">{c.val}</p>
              <p className="text-slate-400 text-xs mt-0.5">{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ LEFT  ·  FORM RIGHT */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* LEFT — FAQ Accordion */}
          <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.15}}>
            <h2 className="text-2xl font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {FAQS.map((faq,i)=>(
                <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all"
                  style={{boxShadow: openFaq===i?"0 4px 20px rgba(16,185,129,0.1)":"0 1px 4px rgba(0,0,0,0.04)"}}>
                  <button
                    onClick={()=>setOpenFaq(openFaq===i?null:i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors">
                    <span className={`font-semibold text-sm ${openFaq===i?"text-brand-700":"text-slate-800"}`}>{faq.q}</span>
                    {openFaq===i
                      ? <ChevronUp className="w-4 h-4 text-brand-500 flex-shrink-0"/>
                      : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0"/>}
                  </button>
                  <AnimatePresence>
                    {openFaq===i && (
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
                        transition={{duration:0.2}} className="overflow-hidden">
                        <div className="px-5 pb-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Contact Form */}
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.2}}>
            <div className="bg-white rounded-2xl p-8 border border-slate-100" style={{boxShadow:"0 8px 40px rgba(0,0,0,0.07)"}}>
              {sent ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-10 h-10 text-brand-600"/>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent! 🎉</h3>
                  <p className="text-slate-400 text-sm">
                    We'll reply to <strong className="text-brand-600">{form.email}</strong> within 24 hours.
                  </p>
                  <button onClick={()=>{setSent(false);setForm({name:"",phone:"",email:"",subject:"General Inquiry",message:""});}}
                    className="btn btn-outline mt-6 px-8 py-2.5 text-sm">Send Another</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-brand-600"/>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Send a Message</h2>
                  </div>
                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">FULL NAME <span className="text-rose-500">*</span></label>
                        <input required placeholder="Ramesh Kumar" value={form.name}
                          onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                          style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">PHONE</label>
                        <input placeholder="+91 98765 43210" value={form.phone}
                          onChange={e=>setForm(p=>({...p,phone:e.target.value}))}
                          style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">EMAIL <span className="text-rose-500">*</span></label>
                      <input required type="email" placeholder="farmer@example.com" value={form.email}
                        onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                        style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">SUBJECT</label>
                      <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}
                        style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                        {["General Inquiry","Technical Support","Feature Request","Partnership / Business","Bug Report","Feedback"].map(s=>(
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">MESSAGE <span className="text-rose-500">*</span></label>
                      <textarea required rows={4} placeholder="How can AgroWave help your farm?" value={form.message}
                        onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                        style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                    </div>
                    <button type="submit" disabled={busy} className="btn btn-primary w-full py-3.5"
                      style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                      {busy ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>Sending…
                        </span>
                      ) : <><Send className="w-4 h-4"/> Send Message via Resend</>}
                    </button>
                    <p className="text-center text-xs text-slate-400">Powered by Resend — messages delivered to our inbox instantly</p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
