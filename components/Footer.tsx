"use client";
import Link from "next/link";
import { Sprout, Phone, Mail, MapPin } from "lucide-react";

const COLS = [
  { h:"Platform", links:[
    {l:"Dashboard",     u:"/dashboard"},
    {l:"Field Monitor", u:"/field-monitor"},
    {l:"Weather",       u:"/weather"},
    {l:"Market Prices", u:"/market"},
    {l:"Land View",     u:"/land"},
  ]},
  { h:"Tools", links:[
    {l:"Inventory",      u:"/inventory"},
    {l:"Farm Calendar",  u:"/calendar"},
    {l:"P&L Calculator", u:"/market"},
    {l:"Crop Guide",     u:"/about"},
    {l:"Land Intelligence", u:"/land-view"},
  ]},
  { h:"Company", links:[
    {l:"About Project",  u:"/about"},
    {l:"Contact Us",     u:"/contact"},
    {l:"Documentation",  u:"/about"},
    {l:"API Access",     u:"/contact"},
  ]},
];

const CONTACTS = [
  {Icon:Phone,  v:"1800-180-1551 (Kisan Helpline)"},
  {Icon:Mail,   v:"Contact via website form"},
  {Icon:MapPin, v:"Built for India 🇮🇳"},
];

export default function Footer() {
  return (
    <footer style={{background:"linear-gradient(160deg,#0F172A 0%,#1E293B 100%)"}}>
      {/* Green accent top line */}
      <div className="h-0.5 w-full" style={{background:"linear-gradient(90deg,#059669,#10B981,#34D399,#10B981,#059669)"}}/>

      <div className="container pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ─── Brand column ─── */}
          <div className="footer-col">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{background:"linear-gradient(135deg,#059669,#10B981)",boxShadow:"0 4px 14px rgba(16,185,129,0.4)"}}>
                <Sprout className="w-5 h-5 text-white"/>
              </div>
              <div>
                <span className="font-bold text-white text-lg leading-tight block">AgroWave</span>
                <span className="text-[10px] text-green-400 font-semibold tracking-widest">SMART FARMING</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              India's most advanced smart farming platform. Empowering farmers with real-time data, AI insights, and live market intelligence.
            </p>
            <div className="space-y-3">
              {CONTACTS.map((c,i)=>(
                <div key={i} className="flex items-center gap-2.5">
                  <c.Icon className="w-4 h-4 flex-shrink-0 text-green-400"/>
                  <span className="text-slate-400 text-sm leading-snug">{c.v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Link columns ─── */}
          {COLS.map(col=>(
            <div key={col.h} className="footer-col">
              <h4 className="text-white font-bold text-sm mb-5 tracking-wide">{col.h}</h4>
              <ul className="space-y-2.5">
                {col.links.map(lk=>(
                  <li key={lk.l}>
                    <Link href={lk.u}
                      className="text-slate-400 text-sm footer-link transition-colors leading-snug hover:text-green-400">
                      {lk.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Divider */}
        <div className="mt-12 mb-6 border-t border-slate-800"/>

        {/* Copyright bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
          <span>© 2026 AgroWave — Built for Indian Farmers 🌾</span>
          <div className="flex items-center gap-5">
            <Link href="/about"   className="hover:text-green-400 transition-colors">About</Link>
            <Link href="/contact" className="hover:text-green-400 transition-colors">Contact</Link>
            <span>MIT License</span>
          </div>
        </div>
      </div>

      {/* Green accent bottom line */}
      <div className="h-1" style={{background:"linear-gradient(90deg,#059669,#10B981,#34D399,#10B981,#059669)"}}/>
    </footer>
  );
}
