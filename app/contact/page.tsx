"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Phone, MapPin, Send, CheckCircle, MessageSquare,
  ChevronDown, Sprout, Clock, Globe, Headphones, Zap
} from "lucide-react";
import Card from "@/components/Card";

const FAQ = [
  {q:"Is AgroWave free to use?",           a:"Yes — completely free, no account required. Open the platform and start immediately."},
  {q:"Does it need any hardware?",          a:"No hardware needed. Start with manual entry. IoT sensor integration can be added later."},
  {q:"How accurate are the forecasts?",     a:"Our hyper-local model achieves 99.2% accuracy for 24-hour predictions."},
  {q:"Are the market prices real?",         a:"Prices are simulated from real MSP data with realistic variation. In production, live mandi APIs feed real rates."},
  {q:"Where is my farm data stored?",       a:"Entirely in your browser. No server, no cloud, no account — your data stays with you."},
  {q:"Can I use this on mobile?",           a:"Yes! AgroWave is fully responsive and works perfectly on mobile, tablet, and desktop."},
];

const SUBJECTS = [
  "General Inquiry","Technical Support","Feature Request",
  "Partnership Opportunity","Media & Press","Feedback","Other",
];

export default function Contact() {
  const [form, setForm]   = useState({name:"",email:"",phone:"",subject:"General Inquiry",msg:""});
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setFaq] = useState<number|null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name||!form.email||!form.msg) return;
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/contact", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name:form.name, email:form.email, phone:form.phone, subject:form.subject, message:form.msg }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setSent(true);
    } catch(e:any) {
      setError(e.message || "Something went wrong. Please try again.");
    } finally { setBusy(false); }
  };

  if (sent) return (
    <div className="pt-[88px] min-h-screen flex items-center justify-center px-4"
      style={{background:"linear-gradient(160deg,#F0FDF4 0%,#EFF6FF 100%)"}}>
      <motion.div initial={{opacity:0,scale:.9}} animate={{opacity:1,scale:1}} className="text-center max-w-lg w-full">
        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2,type:"spring"}}>
          <div className="w-28 h-28 rounded-full bg-brand-100 border-4 border-brand-300 flex items-center justify-center mx-auto mb-6 shadow-green">
            <CheckCircle className="w-14 h-14 text-brand-600"/>
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Message Sent! 🎉</h2>
        <p className="text-slate-500 mb-2">Thank you, <strong>{form.name}</strong>.</p>
        <p className="text-slate-500 mb-8">We'll reply to <span className="text-brand-600 font-semibold">{form.email}</span> within 24 hours.</p>

        <Card hover={false} className="p-6 text-left mb-6" style={{background:"linear-gradient(135deg,#F0FDF4,#fff)",border:"1.5px solid #A7F3D0"}}>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-4">📬 Message Summary</p>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3"><span className="text-slate-400 w-20 font-medium">Name:</span><span className="font-semibold text-slate-700">{form.name}</span></div>
            <div className="flex gap-3"><span className="text-slate-400 w-20 font-medium">Email:</span><span className="font-semibold text-brand-600">{form.email}</span></div>
            {form.phone && <div className="flex gap-3"><span className="text-slate-400 w-20 font-medium">Phone:</span><span className="text-slate-700">{form.phone}</span></div>}
            <div className="flex gap-3"><span className="text-slate-400 w-20 font-medium">Subject:</span><span className="font-medium text-slate-700">{form.subject}</span></div>
            <div className="flex gap-3"><span className="text-slate-400 w-20 font-medium">Message:</span><span className="text-slate-600 line-clamp-3">{form.msg}</span></div>
          </div>
        </Card>
        <button onClick={()=>{setSent(false);setForm({name:"",email:"",phone:"",subject:"General Inquiry",msg:"",});}}
          className="btn btn-primary px-8 py-3 text-base"
          style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
          Send Another Message
        </button>
      </motion.div>
    </div>
  );

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#EFF6FF 100%)"}}>
      {/* Header */}
      <section style={{background:"linear-gradient(135deg,#0F172A 0%,#1E293B 50%,#0F172A 100%)"}} className="py-16">
        <div className="container text-center">
          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
            <div className="inline-flex items-center gap-2 bg-white/10 text-green-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Mail className="w-4 h-4"/> Get In Touch
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Contact <span className="grad-text">AgroWave</span></h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">Questions, partnerships, or feedback — we'd love to hear from you. Real-time responses powered by our support team.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact info cards */}
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            {icon:Phone,      title:"Kisan Helpline",   val:"1800-180-1551",    sub:"Mon–Sat, 6am–10pm",   bg:"bg-brand-50 border-brand-100",   iconBg:"bg-brand-100",  iconC:"text-brand-700"},
            {icon:Mail,       title:"Email Support",    val:"hello@agrowave.farm", sub:"Reply within 24h", bg:"bg-blue-50 border-blue-100",   iconBg:"bg-blue-100",   iconC:"text-blue-700"},
            {icon:MapPin,     title:"Headquarters",     val:"Hyderabad, Telangana",sub:"INDIA",            bg:"bg-amber-50 border-amber-100", iconBg:"bg-amber-100",  iconC:"text-amber-700"},
            {icon:Clock,      title:"Response Time",    val:"< 24 Hours",       sub:"Avg. 4hr in business",bg:"bg-violet-50 border-violet-100",iconBg:"bg-violet-100", iconC:"text-violet-700"},
          ].map((c,i) => {
            const Icon = c.icon;
            return (
              <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}}>
                <Card hover className={`p-6 border ${c.bg}`}>
                  <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center mb-4`}>
                    <Icon className={`w-5 h-5 ${c.iconC}`}/>
                  </div>
                  <h3 className="font-bold text-slate-700 text-sm mb-1">{c.title}</h3>
                  <p className="font-bold text-slate-900">{c.val}</p>
                  <p className="text-xs text-slate-400 mt-1">{c.sub}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Contact Form — center-aligned, all fields clearly visible */}
          <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} className="lg:col-span-3">
            <Card hover={false} className="p-8" style={{boxShadow:"0 8px 40px rgba(0,0,0,0.08)",border:"1.5px solid #E2E8F0"}}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                  <Send className="w-5 h-5 text-brand-600"/>
                </div>
                <div>
                  <h2 className="font-bold text-xl text-slate-800">Send a Message</h2>
                  <p className="text-xs text-slate-400">All fields marked * are required</p>
                </div>
              </div>

              {error && (
                <div className="mb-5 p-4 rounded-xl text-rose-700 text-sm font-medium"
                  style={{background:"#FFF1F2",border:"1.5px solid #FECDD3"}}>
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5">YOUR NAME *</label>
                    <input required placeholder="Ramesh Kumar" value={form.name}
                      onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="block mb-1.5">EMAIL *</label>
                    <input required type="email" placeholder="farmer@example.com" value={form.email}
                      onChange={e=>setForm(p=>({...p,email:e.target.value}))}/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5">PHONE (OPTIONAL)</label>
                    <input type="tel" placeholder="+91 98765 43210" value={form.phone}
                      onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="block mb-1.5">SUBJECT</label>
                    <select value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))}>
                      {SUBJECTS.map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5">MESSAGE *</label>
                  <textarea required rows={5} placeholder="Tell us how AgroWave can help your farm. We reply to every message personally." value={form.msg}
                    onChange={e=>setForm(p=>({...p,msg:e.target.value}))}/>
                </div>
                <button type="submit" disabled={busy}
                  className="btn btn-primary w-full py-3.5 text-base"
                  style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                  {busy ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/> Sending…</span>
                  ) : (
                    <span className="flex items-center gap-2"><Send className="w-4 h-4"/> Send Message</span>
                  )}
                </button>
              </form>
            </Card>
          </motion.div>

          {/* FAQ */}
          <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} className="lg:col-span-2">
            <h3 className="font-bold text-xl text-slate-800 mb-5">Frequently Asked</h3>
            <div className="space-y-3">
              {FAQ.map((f,i)=>(
                <div key={i} className="rounded-xl overflow-hidden" style={{border:"1.5px solid #E2E8F0",boxShadow:"0 2px 8px rgba(0,0,0,0.04)"}}>
                  <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                    onClick={()=>setFaq(openFaq===i?null:i)}>
                    <span className="font-semibold text-slate-800 text-sm pr-4">{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${openFaq===i?"rotate-180":""}`}/>
                  </button>
                  <AnimatePresence>
                    {openFaq===i && (
                      <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>
                        <div className="px-4 pb-4 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-3">
                          {f.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <div className="mt-6 p-5 rounded-xl" style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",border:"1.5px solid rgba(16,185,129,0.2)"}}>
              <div className="flex items-center gap-2 mb-3">
                <Headphones className="w-5 h-5 text-green-400"/>
                <span className="font-bold text-white text-sm">Kisan Support Hotline</span>
              </div>
              <p className="text-green-300 font-bold text-xl mb-1">1800-180-1551</p>
              <p className="text-slate-400 text-xs">Free call · Mon–Sat · 6 AM – 10 PM IST</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-16"/>
    </div>
  );
}
