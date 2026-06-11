"use client";
import Link from "next/link";
import { Sprout, Phone, Mail, MapPin } from "lucide-react";

const COLUMNS = [
  {
    h: "Platform",
    links: [
      { l:"Dashboard",    u:"/dashboard" },
      { l:"Field Monitor",u:"/field-monitor" },
      { l:"Weather",      u:"/weather" },
      { l:"Market Prices",u:"/market" },
    ],
  },
  {
    h: "Tools",
    links: [
      { l:"Inventory",     u:"/inventory" },
      { l:"Farm Calendar", u:"/calendar" },
      { l:"P&L Calculator",u:"/market" },
      { l:"Crop Guide",    u:"/about" },
    ],
  },
  {
    h: "Company",
    links: [
      { l:"About Project", u:"/about" },
      { l:"Contact Us",    u:"/contact" },
      { l:"Documentation", u:"/about" },
      { l:"API Access",    u:"/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{background:"linear-gradient(160deg,#0F172A 0%,#1E293B 100%)"}}>
      {/* Main content */}
      <div className="container pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand + contact info */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                <Sprout className="w-5 h-5 text-white"/>
              </div>
              <span className="font-bold text-white text-lg leading-tight">AgroWave</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              India's most advanced smart farming platform. Empowering farmers with real-time data, AI insights, and live market intelligence.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0"/>
                <span>1800-180-1551 (Kisan Helpline)</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0"/>
                <span>hello@agrowave.farm</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0"/>
                <span>Hyderabad, Telangana</span>
              </div>
            </div>
          </div>

          {/* Link columns — evenly spaced */}
          {COLUMNS.map(col => (
            <div key={col.h}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{col.h}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.l}>
                    <Link href={l.u}
                      className="text-slate-400 text-sm hover:text-brand-400 transition-colors footer-link">
                      {l.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800"/>

      {/* Copyright bar — with bottom padding */}
      <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-500 text-sm">© 2026 AgroWave. Built for Indian Farmers. 🌾</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"/>
          <span className="text-brand-400 text-sm font-medium">All systems operational</span>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="h-1" style={{background:"linear-gradient(90deg,#059669,#10B981,#059669)"}}/>
    </footer>
  );
}
