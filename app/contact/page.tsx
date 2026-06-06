"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, CheckCircle2, Info } from "lucide-react";
import Card from "@/components/Card";

export default function Contact() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields."); return;
    }
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setSent(true); }
      else { const d = await res.json(); setError(d.error || "Failed to send. Please try again."); }
    } catch { setError("Network error. Please check your connection."); }
    finally { setBusy(false); }
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#EFF6FF 50%,#FFFBEB 100%)"}}>
      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-14">
        <div className="container text-center max-w-2xl mx-auto">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-5">
              <Mail className="w-4 h-4"/> Contact & Support
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Get in <span className="grad-text">Touch</span>
            </h1>
            <p className="text-slate-400 text-lg">Questions, feedback, or partnership requests — we respond within 24 hours.</p>
          </motion.div>
        </div>
      </div>

      <div className="container py-12">
        {/* Hint banner */}
        <div className="hint-banner mb-8 max-w-3xl mx-auto">
          <Info className="w-4 h-4 flex-shrink-0"/>
          <span><strong>Tip:</strong> Your message is sent directly to our team via email. You'll receive an auto-reply confirming receipt. We respond within 24 hours on working days.</span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-5">
            <h2 className="font-bold text-xl text-slate-800 mb-5">How to reach us</h2>
            {[
              { icon:Phone,  title:"Kisan Helpline", val:"1800-180-1551", sub:"Free · Mon–Sat 8am–8pm", bg:"#ECFDF5", border:"#A7F3D0", ic:"#10B981" },
              { icon:Mail,   title:"Email",           val:"hello@agrowave.farm", sub:"We reply within 24h", bg:"#EFF6FF", border:"#BFDBFE", ic:"#3B82F6" },
              { icon:MapPin, title:"Location",        val:"Hyderabad, Telangana", sub:"INDIA — TS", bg:"#FFFBEB", border:"#FDE68A", ic:"#F59E0B" },
            ].map((c,i) => (
              <motion.div key={i} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.1}}
                className="flex items-start gap-4 p-4 rounded-2xl"
                style={{background:c.bg,border:`1.5px solid ${c.border}`}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{background:`${c.ic}20`}}>
                  <c.icon className="w-5 h-5" style={{color:c.ic}}/>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{c.title}</p>
                  <p className="font-bold text-slate-900 text-base">{c.val}</p>
                  <p className="text-xs text-slate-400">{c.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* FAQ quick answers */}
            <div className="card p-5 border-2 border-brand-100 bg-brand-50">
              <h3 className="font-bold text-brand-800 mb-3 text-sm">Common Questions</h3>
              <div className="space-y-3">
                {[
                  {q:"Is AgroWave free?", a:"Yes — fully free to use."},
                  {q:"Works on mobile?",  a:"Yes — optimized for all screens."},
                  {q:"Need account?",     a:"No login required to start."},
                ].map((faq,i) => (
                  <div key={i} className="border-b border-brand-200 pb-2 last:border-0">
                    <p className="text-xs font-bold text-brand-700">{faq.q}</p>
                    <p className="text-xs text-brand-600 mt-0.5">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <Card hover={false} className="p-8" style={{boxShadow:"0 8px 40px rgba(0,0,0,0.08)"}}>
              {sent ? (
                <motion.div initial={{scale:.9,opacity:0}} animate={{scale:1,opacity:1}} className="text-center py-10">
                  <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-10 h-10 text-brand-600"/>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent! 🎉</h3>
                  <p className="text-slate-500 mb-2">Thank you, {form.name}.</p>
                  <p className="text-slate-400 text-sm">
                    We've sent a confirmation to <span className="text-brand-600 font-semibold">{form.email}</span>.<br/>
                    Our team will respond within 24 hours.
                  </p>
                  <button onClick={()=>{setSent(false);setForm({name:"",email:"",subject:"",message:""});}}
                    className="btn btn-outline mt-6 px-8 py-2.5 text-sm">Send Another</button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">Send a Message</h2>
                  <p className="text-slate-400 text-sm mb-6">Fill in the form — we'll reply to your email address.</p>

                  {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">{error}</div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">YOUR NAME <span className="text-rose-500">*</span></label>
                        <input required placeholder="Ramesh Kumar" value={form.name}
                          onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                          style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">EMAIL <span className="text-rose-500">*</span></label>
                        <input required type="email" placeholder="farmer@example.com" value={form.email}
                          onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                          style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">SUBJECT</label>
                      <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}
                        style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                        <option value="">Select a topic…</option>
                        <option value="Support">Technical Support</option>
                        <option value="Feature Request">Feature Request</option>
                        <option value="Partnership">Partnership / Business</option>
                        <option value="Bug Report">Bug Report</option>
                        <option value="Feedback">General Feedback</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">MESSAGE <span className="text-rose-500">*</span></label>
                      <textarea required rows={5} placeholder="Describe your question or feedback in detail…" value={form.message}
                        onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                        style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                    </div>
                    <button type="submit" disabled={busy} className="btn btn-primary w-full py-3.5 text-base"
                      style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                      {busy ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Sending…
                        </span>
                      ) : (
                        <><Send className="w-4 h-4"/> Send Message</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
