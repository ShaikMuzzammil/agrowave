"use client";
import Link from "next/link";
import { Sprout, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{background:"linear-gradient(160deg,#0F172A 0%,#1E293B 100%)"}} className="text-slate-400">
      <div className="container py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-brand-grad flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white"/>
              </div>
              <span className="font-bold text-white text-lg">AgroWave</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              India's most advanced smart farming platform. Empowering farmers with real-time data, AI insights, and live market intelligence.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-brand-400"/> <span>1800-180-1551 (Kisan Helpline)</span></div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-brand-400"/> <span>hello@agrowave.farm</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-400"/> <span>Hyderabad, Telangana</span></div>
            </div>
          </div>
          {[
            { h:"Platform", links:[{l:"Dashboard",u:"/dashboard"},{l:"Field Monitor",u:"/field-monitor"},{l:"Weather",u:"/weather"},{l:"Market Prices",u:"/market"}] },
            { h:"Tools",    links:[{l:"Inventory",u:"/inventory"},{l:"Farm Calendar",u:"/calendar"},{l:"P&L Calculator",u:"/market"},{l:"Crop Guide",u:"/about"}] },
            { h:"Company",  links:[{l:"About Project",u:"/about"},{l:"Contact Us",u:"/contact"},{l:"Documentation",u:"/about"},{l:"API Access",u:"/contact"}] },
          ].map(col => (
            <div key={col.h}>
              <h4 className="text-white font-semibold mb-4">{col.h}</h4>
              <ul className="space-y-2">
                {col.links.map(l => <li key={l.l}><Link href={l.u} className="text-sm hover:text-brand-400 transition-colors">{l.l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 AgroWave. Built for Indian Farmers. 🌾</p>
          <div className="flex items-center gap-2">
            <span className="dot-live"/>
            <span className="text-brand-400 text-sm font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
