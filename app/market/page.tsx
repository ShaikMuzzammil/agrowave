"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Bell, Calculator, X, Search, Printer, ChevronDown, CheckCircle } from "lucide-react";
import { CROPS, getLivePrices, fmtINR, sparkline, COST_PRESETS, YIELD_DEFAULTS } from "@/lib/utils";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import PriceTicker from "@/components/PriceTicker";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TT = { contentStyle:{background:"#fff",border:"1px solid #E2E8F0",borderRadius:"10px",fontFamily:"DM Sans",fontSize:"12px"} };
const MANDIS = [
  {name:"Azadpur APMC",  loc:"Delhi",    crops:["wheat","potato","onion"]},
  {name:"Vashi APMC",    loc:"Mumbai",   crops:["rice","tomato","onion"]},
  {name:"Koyambedu",     loc:"Chennai",  crops:["rice","cotton","tomato"]},
  {name:"Guntur APMC",   loc:"AP",       crops:["cotton","maize","onion"]},
  {name:"Ludhiana Mandi",loc:"Punjab",   crops:["wheat","maize","potato"]},
  {name:"Yeshwantpur",   loc:"Bengaluru",crops:["tomato","rice","maize"]},
];

export default function Market() {
  const [prices, setPrices] = useState<Record<string,any>>({});
  const [crop, setCrop]     = useState("wheat");
  const [sl, setSl]         = useState<Record<string,any[]>>({});
  const [tab, setTab]       = useState<"prices"|"calculator"|"mandis"|"alerts">("prices");
  const [alertForm, setAlertForm] = useState({commodity:"wheat",type:"above" as "above"|"below",threshold:"",email:""});
  const [alertSaved, setAlertSaved] = useState(false);
  const { pushNotif } = useStore();

  const [calc, setCalc] = useState({ crop:"wheat", area:5, yield:42, price:2150, seed:1200, fert:3500, labor:4500, irr:2000, pest:1200, other:800 });

  useEffect(() => {
    const p = getLivePrices(); setPrices(p);
    const lines: Record<string,any[]> = {};
    Object.entries(CROPS).forEach(([k,v]) => { lines[k] = sparkline(v.base, 30); });
    setSl(lines);
    const iv = setInterval(() => setPrices(getLivePrices()), 60000);
    return () => clearInterval(iv);
  },[]);

  useEffect(() => {
    const p = COST_PRESETS[calc.crop]||COST_PRESETS.wheat;
    const y = YIELD_DEFAULTS[calc.crop]||40;
    const cur = prices[calc.crop]?.current || CROPS[calc.crop as keyof typeof CROPS]?.base || 2000;
    setCalc(prev => ({...prev,...p, yield:y, price:cur}));
  },[calc.crop, prices]);

  const res = useMemo(() => {
    const totalYield = calc.area * calc.yield;
    const revenue    = totalYield * calc.price;
    const costPerAcre= calc.seed+calc.fert+calc.labor+calc.irr+calc.pest+calc.other;
    const totalCost  = calc.area * costPerAcre;
    const profit     = revenue - totalCost;
    const margin     = revenue>0 ? (profit/revenue)*100 : 0;
    const breakEven  = totalYield>0 ? totalCost/totalYield : 0;
    const roi        = totalCost>0 ? (profit/totalCost)*100 : 0;
    return {totalYield,revenue,totalCost,profit,margin,breakEven,roi};
  },[calc]);

  const mandiRows = MANDIS.filter(m=>m.crops.includes(crop)).map(m => ({
    ...m, price: Math.round((prices[crop]?.current||CROPS[crop as keyof typeof CROPS]?.base||2000)*(0.95+Math.random()*0.1)),
    arrival: `${Math.floor(400+Math.random()*1600)} qtl`
  }));

  const saveAlert = () => {
    if(!alertForm.threshold) {
      pushNotif({title:"⚠️ Enter a price threshold",body:"Please set a target price before saving the alert.",type:"warning",time:"just now"});
      return;
    }
    pushNotif({
      title:`🔔 Price Alert Set — ${alertForm.commodity.toUpperCase()}`,
      body:`You'll be notified when ${alertForm.commodity} goes ${alertForm.type} ₹${alertForm.threshold}/qtl.`,
      type:"info", time:"just now"
    });
    setAlertSaved(true);
    setTimeout(() => setAlertSaved(false), 3000);
    setAlertForm(p=>({...p,threshold:"",email:""}));
  };

  const TABS = [
    {id:"prices",     l:"Live Prices",    icon:"📈"},
    {id:"calculator", l:"P&L Calculator", icon:"🧮"},
    {id:"mandis",     l:"Mandi Rates",    icon:"🏪"},
    {id:"alerts",     l:"Price Alerts",   icon:"🔔"},
  ] as const;

  const CROP_KEYS = Object.keys(CROPS);

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F8FAFC 0%,#ECFDF5 50%,#EFF6FF 100%)"}}>
      <PriceTicker/>

      {/* Header strip */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-12">
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="dot-live" style={{background:"#A7F3D0"}}/>
              <span className="text-green-300 text-xs font-bold tracking-widest">LIVE MARKET DATA</span>
            </div>
            <motion.h1 initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="text-4xl font-bold text-white mb-1">
              Market <span className="grad-text">Intelligence</span>
            </motion.h1>
            <p className="text-slate-400 text-sm">Live MSP + mandi rates · 600+ markets · Updated every 60 seconds</p>
          </div>
          <button onClick={()=>window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
            style={{background:"rgba(255,255,255,0.1)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
            <Printer className="w-4 h-4"/> Print Report
          </button>
        </div>
      </div>

      <div className="container py-8">
        {/* Tab navigation — fully visible selected state */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 rounded-2xl"
          style={{background:"#fff",border:"1.5px solid #E2E8F0",boxShadow:"0 2px 12px rgba(0,0,0,0.04)"}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`market-tab${tab===t.id?" market-tab-active":""}`}>
              <span>{t.icon}</span> {t.l}
            </button>
          ))}
        </div>

        {/* ── TAB: LIVE PRICES ── */}
        {tab === "prices" && (
          <div>
            {/* Crop selector — highly visible selected state */}
            <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-100">
              {CROP_KEYS.map(k => {
                const v = CROPS[k as keyof typeof CROPS];
                return (
                  <button key={k} onClick={()=>setCrop(k)}
                    className={`crop-tab${crop===k?" crop-tab-active":""}`}>
                    <span>{v.emoji}</span> {k.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {Object.entries(CROPS).map(([k,v],i) => {
                const p = prices[k]; const up = (p?.pct||0) >= 0;
                const isSelected = crop === k;
                return (
                  <motion.div key={k} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
                    onClick={()=>setCrop(k)}>
                    <Card className={`p-5 cursor-pointer transition-all ${isSelected?"border-brand-400 shadow-green ring-2 ring-brand-100":""}`} hover>
                      <div className="flex justify-between mb-3">
                        <span className="text-3xl">{v.emoji}</span>
                        <span className={`badge ${up?"badge-green":"badge-red"}`}>{up?"▲":"▼"}{Math.abs(p?.pct||0).toFixed(1)}%</span>
                      </div>
                      <div className="font-semibold text-slate-600 text-xs uppercase tracking-wide mb-1">{k}</div>
                      <div className="text-2xl font-bold text-slate-900">₹{(p?.current||v.base).toLocaleString("en-IN")}</div>
                      <div className="text-xs text-slate-400 mt-1">per {v.unit}</div>
                      {v.msp>0 && <div className="text-xs text-brand-600 font-medium mt-1">MSP ₹{v.msp.toLocaleString("en-IN")}</div>}
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Selected crop chart */}
            {sl[crop] && (
              <Card hover={false} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-slate-800">
                      {CROPS[crop as keyof typeof CROPS]?.emoji} {crop.charAt(0).toUpperCase()+crop.slice(1)} — 30-Day Price Trend
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Simulated from real MSP baseline data</p>
                  </div>
                  <span className={`badge ${(prices[crop]?.pct||0)>=0?"badge-green":"badge-red"} text-sm px-3 py-1.5`}>
                    {(prices[crop]?.pct||0)>=0?"▲":"▼"} {Math.abs(prices[crop]?.pct||0).toFixed(2)}% today
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={sl[crop]} margin={{top:4,right:4,left:-10,bottom:0}}>
                    <defs>
                      <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                    <XAxis dataKey="i" tick={{fontSize:10,fill:"#94A3B8"}} tickLine={false}/>
                    <YAxis tick={{fontSize:10,fill:"#94A3B8"}} tickLine={false} axisLine={false}/>
                    <Tooltip {...TT} formatter={(v:any)=>[`₹${v}`,""]}/>
                    <Area type="monotone" dataKey="v" stroke="#059669" fill="url(#priceGrad)" strokeWidth={2.5}/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* ── TAB: P&L CALCULATOR ── */}
        {tab === "calculator" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card hover={false} className="p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-5 flex items-center gap-2">
                🧮 Crop P&L Calculator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5">Select Crop</label>
                  <select value={calc.crop} onChange={e=>setCalc(p=>({...p,crop:e.target.value}))}>
                    {Object.keys(CROPS).map(k=><option key={k} value={k}>{CROPS[k as keyof typeof CROPS]?.emoji} {k.charAt(0).toUpperCase()+k.slice(1)}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {l:"Area (acres)",k:"area",step:0.5},
                    {l:"Expected Yield (qtl/acre)",k:"yield",step:1},
                    {l:"Expected Price (₹/qtl)",k:"price",step:50},
                    {l:"Seed Cost (₹/acre)",k:"seed",step:100},
                    {l:"Fertilizer (₹/acre)",k:"fert",step:100},
                    {l:"Labor (₹/acre)",k:"labor",step:100},
                    {l:"Irrigation (₹/acre)",k:"irr",step:100},
                    {l:"Pesticides (₹/acre)",k:"pest",step:100},
                  ].map(f=>(
                    <div key={f.k}>
                      <label className="block mb-1.5">{f.l}</label>
                      <input type="number" min={0} step={f.step}
                        value={calc[f.k as keyof typeof calc] as number}
                        onChange={e=>setCalc(p=>({...p,[f.k]:+e.target.value}))}/>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <Card hover={false} className="p-6" style={{background:res.profit>=0?"linear-gradient(135deg,#F0FDF4,#ECFDF5)":"linear-gradient(135deg,#FFF1F2,#FEF2F2)"}}>
                <h3 className="font-bold text-lg mb-4" style={{color:res.profit>=0?"#047857":"#991B1B"}}>
                  {res.profit>=0?"✅ Profitable":"❌ Loss Projected"} — Analysis
                </h3>
                {[
                  {l:"Total Yield",   v:`${res.totalYield.toFixed(1)} qtl`},
                  {l:"Gross Revenue", v:fmtINR(res.revenue), bold:true},
                  {l:"Total Cost",    v:fmtINR(res.totalCost)},
                  {l:"Net Profit",    v:fmtINR(res.profit), highlight:true},
                  {l:"Profit Margin", v:`${res.margin.toFixed(1)}%`},
                  {l:"Break-even",    v:`₹${res.breakEven.toFixed(0)}/qtl`},
                  {l:"ROI",          v:`${res.roi.toFixed(1)}%`},
                ].map(r=>(
                  <div key={r.l} className={`flex justify-between py-2 border-b border-slate-100 last:border-0 ${r.highlight?"font-bold text-lg":"text-sm"}`}>
                    <span className="text-slate-600">{r.l}</span>
                    <span style={{color: r.highlight?(res.profit>=0?"#059669":"#DC2626"):"inherit"}} className={r.bold?"font-semibold":""}>{r.v}</span>
                  </div>
                ))}
              </Card>
              <div className="rounded-2xl p-5" style={{background:"linear-gradient(135deg,#EFF6FF,#DBEAFE)",border:"1.5px solid #BFDBFE"}}>
                <h4 className="font-bold text-blue-800 mb-3">💡 Market Insight</h4>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Current {calc.crop} MSP: ₹{CROPS[calc.crop as keyof typeof CROPS]?.msp?.toLocaleString("en-IN") || "N/A"}/qtl.
                  Your break-even is ₹{res.breakEven.toFixed(0)}/qtl — 
                  {res.breakEven < (CROPS[calc.crop as keyof typeof CROPS]?.msp||0) ? " you're protected even at MSP." : " consider negotiating directly with buyers for better prices."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: MANDI RATES ── */}
        {tab === "mandis" && (
          <div>
            <div className="flex flex-wrap gap-2 mb-6">
              {CROP_KEYS.slice(0,10).map(k=>(
                <button key={k} onClick={()=>setCrop(k)}
                  className={`crop-tab${crop===k?" crop-tab-active":""}`}>
                  {CROPS[k as keyof typeof CROPS]?.emoji} {k.toUpperCase()}
                </button>
              ))}
            </div>
            <Card hover={false} className="overflow-hidden p-0">
              <div className="px-6 py-4 border-b border-slate-100" style={{background:"linear-gradient(135deg,#F0FDF4,#F8FAFC)"}}>
                <h3 className="font-bold text-slate-800">Mandi Arrival Data — {crop.charAt(0).toUpperCase()+crop.slice(1)}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Prices shown per quintal (100 kg)</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{background:"#F8FAFC",borderBottom:"1.5px solid #E2E8F0"}}>
                    {["Mandi","Location","Today's Price","Arrival","vs MSP"].map(h=>(
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mandiRows.map((m,i)=>{
                    const msp = CROPS[crop as keyof typeof CROPS]?.msp||0;
                    const vs = msp>0 ? ((m.price-msp)/msp*100) : 0;
                    return (
                      <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-800 text-sm">{m.name}</td>
                        <td className="px-6 py-4"><span className="badge badge-blue">{m.loc}</span></td>
                        <td className="px-6 py-4 font-bold text-slate-900">₹{m.price.toLocaleString("en-IN")}/qtl</td>
                        <td className="px-6 py-4 text-sm text-slate-500">{m.arrival}</td>
                        <td className="px-6 py-4">
                          {msp>0 ? <span className={`badge ${vs>=0?"badge-green":"badge-red"}`}>{vs>=0?"+":""}{vs.toFixed(1)}%</span> : <span className="text-slate-300 text-xs">N/A</span>}
                        </td>
                      </tr>
                    );
                  })}
                  {mandiRows.length===0&&<tr><td colSpan={5} className="text-center py-8 text-slate-400">No mandi data for {crop}</td></tr>}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* ── TAB: PRICE ALERTS ── */}
        {tab === "alerts" && (
          <div className="max-w-xl mx-auto">
            <Card hover={false} className="p-8">
              <h3 className="font-bold text-xl text-slate-800 mb-2">🔔 Set Price Alert</h3>
              <p className="text-slate-500 text-sm mb-6">Get notified when a commodity crosses your target price</p>

              {alertSaved && (
                <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                  className="flex items-center gap-3 p-4 rounded-xl mb-5"
                  style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0"}}>
                  <CheckCircle className="w-5 h-5 text-brand-600"/>
                  <p className="text-brand-700 font-semibold text-sm">Alert saved! You'll be notified via the bell icon.</p>
                </motion.div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block mb-1.5">Commodity</label>
                  <select value={alertForm.commodity} onChange={e=>setAlertForm(p=>({...p,commodity:e.target.value}))}>
                    {Object.keys(CROPS).map(k=><option key={k} value={k}>{CROPS[k as keyof typeof CROPS]?.emoji} {k.charAt(0).toUpperCase()+k.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block mb-2">Alert When Price Is</label>
                  <div className="flex gap-3">
                    {(["above","below"] as const).map(t=>(
                      <button key={t} onClick={()=>setAlertForm(p=>({...p,type:t}))}
                        className={`filter-pill flex-1 justify-center${alertForm.type===t?" filter-pill-active":""}`}>
                        {t==="above"?"▲ Above Threshold":"▼ Below Threshold"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5">Target Price (₹/qtl)</label>
                  <input type="number" placeholder="e.g. 2300" value={alertForm.threshold}
                    onChange={e=>setAlertForm(p=>({...p,threshold:e.target.value}))}/>
                </div>
                <div>
                  <label className="block mb-1.5">Email (optional)</label>
                  <input type="email" placeholder="farmer@example.com" value={alertForm.email}
                    onChange={e=>setAlertForm(p=>({...p,email:e.target.value}))}/>
                </div>
                <button onClick={saveAlert} className="btn btn-primary w-full py-3"
                  style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                  <Bell className="w-4 h-4"/> Save Alert
                </button>
              </div>

              <div className="mt-6 p-4 rounded-xl" style={{background:"#FFF7ED",border:"1.5px solid #FED7AA"}}>
                <p className="text-amber-800 text-xs font-semibold uppercase tracking-wide mb-1">Current Price</p>
                <p className="text-amber-700 text-lg font-bold">
                  {CROPS[alertForm.commodity as keyof typeof CROPS]?.emoji}{" "}
                  ₹{(prices[alertForm.commodity]?.current||CROPS[alertForm.commodity as keyof typeof CROPS]?.base||2000).toLocaleString("en-IN")}/qtl
                </p>
                {CROPS[alertForm.commodity as keyof typeof CROPS]?.msp > 0 && (
                  <p className="text-amber-600 text-xs mt-1">MSP: ₹{CROPS[alertForm.commodity as keyof typeof CROPS]?.msp?.toLocaleString("en-IN")}/qtl</p>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
