"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [status, setStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus("sent"); setForm({name:"",email:"",subject:"",message:""}); }
      else setStatus("error");
    } catch { setStatus("error"); }
    if (status==="error") setTimeout(()=>setStatus("idle"), 5000);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-black text-slate-900">Contact & Support</h1>
        <p className="text-slate-500 mt-2">Get help from the AgroWave farm management team</p>
      </div>

      {/* Info cards row */}
      <div className="grid sm:grid-cols-3 gap-5">
        {[
          { icon:Mail, color:"bg-emerald-100 text-emerald-700", title:"Email Us", val:"farm@agrowave.in", sub:"Response in 24h" },
          { icon:Phone, color:"bg-sky-100 text-sky-700", title:"Call / WhatsApp", val:"+91 98765 43210", sub:"Mon–Sat, 8am–6pm IST" },
          { icon:MapPin, color:"bg-amber-100 text-amber-700", title:"Location", val:"Hyderabad, Telangana", sub:"KHARIF 2026 Season" },
        ].map(({icon:Icon,color,title,val,sub})=>(
          <div key={title} className="terra-card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon size={22}/>
            </div>
            <div>
              <p className="font-bold text-slate-900">{title}</p>
              <p className="text-slate-700 text-sm font-medium">{val}</p>
              <p className="text-slate-400 text-xs">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form + FAQ */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        {/* Contact form */}
        <div className="terra-card">
          <h2 className="font-black text-slate-900 text-lg mb-6 flex items-center gap-2">
            <MessageSquare size={18} className="text-emerald-600"/> Send a Message
          </h2>
          {status==="sent" ? (
            <div className="py-12 flex flex-col items-center gap-4 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={36} className="text-emerald-600"/>
              </div>
              <div>
                <p className="font-black text-slate-900 text-xl">Message Sent! 🎉</p>
                <p className="text-slate-500 mt-2">We'll reply to your email within 24 hours.</p>
              </div>
              <button onClick={()=>setStatus("idle")}
                className="px-6 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm hover:bg-emerald-700 transition-all">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Your Name *</label>
                  <input className="terra-input" placeholder="Rajesh Kumar"
                    value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address *</label>
                  <input type="email" className="terra-input" placeholder="rajesh@farm.in"
                    value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Subject</label>
                <input className="terra-input" placeholder="e.g. Irrigation query for North Field"
                  value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Message *</label>
                <textarea rows={5} className="terra-input resize-none" placeholder="Describe your question or issue in detail..."
                  value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required/>
              </div>
              {status==="error" && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                  ❌ Failed to send. Please try again or contact us directly.
                </div>
              )}
              <button type="submit" disabled={status==="sending"}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-sm text-sm">
                {status==="sending" ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>Sending...</>
                ) : (
                  <><Send size={16}/> Send Message</>
                )}
              </button>
              <p className="text-center text-xs text-slate-400">
                📧 Delivered via Resend API · Your email is never shared
              </p>
            </form>
          )}
        </div>

        {/* FAQ sidebar */}
        <div className="space-y-4">
          <div className="terra-card">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={16} className="text-emerald-600"/> Common Questions
            </h3>
            <div className="space-y-4">
              {[
                { q:"How do I update my farm plots?", a:"Go to My Fields → click a plot card → use the metric controls. Or go to the Dashboard and click any Live Farm Map plot." },
                { q:"How do I set a price alert?", a:"Navigate to Market → click the '🔔 Price Alerts' tab → select your crop and threshold." },
                { q:"How does auto-irrigation work?", a:"AUTO mode triggers irrigation when moisture drops below your set threshold (default: 30%). You can override manually from the Fields page." },
                { q:"What do the land plot statuses mean?", a:"OPEN = all metrics within thresholds. WARNING = 1 metric borderline. CLOSED = 2+ metrics need intervention." },
                { q:"How do I print a report?", a:"Each page has a Print button in the top-right. Dashboard, Land, and Calendar all have dedicated print layouts." },
              ].map(item=>(
                <div key={item.q} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <p className="font-semibold text-slate-900 text-sm">{item.q}</p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl p-5 text-white">
            <h3 className="font-bold mb-2">Need immediate help?</h3>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              For urgent farm matters (pest outbreak, irrigation failure), call or WhatsApp directly. We respond within 30 minutes during working hours.
            </p>
            <a href="tel:+919876543210"
              className="mt-3 flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all w-full justify-center">
              <Phone size={14}/> +91 98765 43210
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
