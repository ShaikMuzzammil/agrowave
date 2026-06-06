"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Bell, Calculator, X, Search, Printer, Info, ChevronDown } from "lucide-react";
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
    {id:"prices",     l:"Live Prices",    icon:TrendingUp},
    {id:"calculator", l:"P&L Calculator", icon:Calculator},
    {id:"mandis",     l:"Mandi Rates",    icon:Search},
    {id:"alerts",     l:"Price Alerts",   icon:Bell},
  ] as const;

  const HINT: Record<string,string> = {
    prices:     "Click any crop card to view its 30-day price history chart below.",
    calculator: "Select your crop to auto-fill costs. Adjust area and yield to simulate profit scenarios.",
    mandis:     "Prices shown are mandi estimates for the selected crop. Switch crops via the filter above.",
    alerts:     "Set a target price and you'll receive a notification when the crop reaches that level.",
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F8FAFC 0%,#ECFDF5 50%,#EFF6FF 100%)"}}>
      <PriceTicker/>
      {/* Header strip */}
      <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}} className="py-10">
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
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
        {/* Tabs — strong visible active state */}
        <div className="flex gap-2 flex-wrap mb-5 p-1.5 rounded-2xl w-fit"
          style={{background:"#fff",border:"2px solid #E2E8F0",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn${tab===t.id?" active":""}`}>
              <t.icon className="w-4 h-4"/>{t.l}
            </button>
          ))}
        </div>

        {/* Hint banner */}
        <div className="hint-banner mb-6">
          <Info className="w-4 h-4 flex-shrink-0"/>
          <span>{HINT[tab]}</span>
        </div>

        {/* PRICES */}
        {tab==="prices" && (
          <div>
            <div className="flex gap-2 flex-wrap mb-6">
              {Object.entries(CROPS).map(([k,v]) => (
                <button key={k} onClick={()=>setCrop(k)} className={`filter-pill${crop===k?" active":""}`}>
                  {v.emoji} {k.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {Object.entries(CROPS).map(([k,v],i) => {
                const p = prices[k]; const up = (p?.pct||0)>=0;
                return (
                  <motion.div key={k} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                    onClick={() => setCrop(k)}>
                    <Card className={`cursor-pointer p-5 transition-all ${crop===k?"border-brand-400 ring-2 ring-brand-200 shadow-soft":""}`}>
                      <div className="flex justify-between mb-3">
                        <span className="text-3xl">{v.emoji}</span>
                        <span className={`badge ${up?"badge-green":"badge-red"}`}>{up?"▲":"▼"}{Math.abs(p?.pct||0).toFixed(1)}%</span>
                      </div>
                      <div className="text-sm font-semibold text-slate-500 uppercase mb-1">{k}</div>
                      <div className="text-2xl font-bold text-slate-900">₹{(p?.current||v.base).toLocaleString("en-IN")}</div>
                      <div className="text-xs text-slate-400 mt-0.5">per {v.unit}</div>
                      {v.msp>0 && <div className="text-xs text-brand-600 font-semibold mt-1">MSP ₹{v.msp.toLocaleString("en-IN")}</div>}
                      {sl[k] && (
                        <div className="mt-3 h-9">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sl[k].slice(-12)}>
                              <Line type="monotone" dataKey="v" stroke={up?"#10B981":"#F43F5E"} strokeWidth={1.5} dot={false}/>
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                );
              })}
            </div>
            {crop && sl[crop] && (
              <Card hover={false} style={{boxShadow:"0 4px 24px rgba(0,0,0,0.07)"}}>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{CROPS[crop as keyof typeof CROPS]?.emoji} {crop.toUpperCase()} — 30 Day Price History</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-3xl font-bold text-slate-900">₹{(prices[crop]?.current||CROPS[crop as keyof typeof CROPS]?.base).toLocaleString("en-IN")}</span>
                      <span className={`badge ${(prices[crop]?.pct||0)>=0?"badge-green":"badge-red"} text-sm`}>
                        {(prices[crop]?.pct||0)>=0?"+":""}{prices[crop]?.pct||0}%
                      </span>
                    </div>
                  </div>
                  {CROPS[crop as keyof typeof CROPS]?.msp > 0 && (
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Minimum Support Price</div>
                      <div className="text-lg font-bold text-brand-700">₹{CROPS[crop as keyof typeof CROPS]?.msp.toLocaleString("en-IN")}</div>
                      <div className="text-xs text-brand-600 font-medium">
                        {(((prices[crop]?.current||CROPS[crop as keyof typeof CROPS]?.base)/CROPS[crop as keyof typeof CROPS]?.msp-1)*100).toFixed(1)}% above MSP
                      </div>
                    </div>
                  )}
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={sl[crop]}>
                    <defs>
                      <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#10B981" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                    <XAxis dataKey="i" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}`} width={65}/>
                    <Tooltip {...TT} formatter={(v:any)=>[`₹${Number(v).toLocaleString("en-IN")}`, "Price"]}/>
                    <Area type="monotone" dataKey="v" stroke="#10B981" fill="url(#pg)" strokeWidth={2.5} name="Price ₹"/>
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
        )}

        {/* CALCULATOR */}
        {tab==="calculator" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid md:grid-cols-2 gap-6">
            <Card hover={false}>
              <h3 className="font-bold text-slate-800 mb-5 text-lg">P&L Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">CROP</label>
                  <select value={calc.crop} onChange={e=>setCalc(p=>({...p,crop:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                    {Object.keys(CROPS).map(k=>(
                      <option key={k} value={k}>{CROPS[k as keyof typeof CROPS].emoji} {k.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {l:"Area (acres)",  k:"area",  min:0.5, step:0.5},
                    {l:"Yield (kg/ac)", k:"yield", min:1,   step:1},
                    {l:"Price (₹/qtl)",k:"price", min:100, step:50},
                    {l:"Seed (₹/ac)",  k:"seed",  min:0,   step:100},
                    {l:"Fertilizer (₹/ac)",k:"fert",min:0, step:100},
                    {l:"Labor (₹/ac)", k:"labor", min:0,   step:100},
                    {l:"Irrigation (₹/ac)",k:"irr",min:0,  step:100},
                    {l:"Pesticide (₹/ac)",k:"pest",min:0,  step:100},
                  ].map(f=>(
                    <div key={f.k}>
                      <label className="text-xs font-semibold text-slate-500 block mb-1">{f.l}</label>
                      <input type="number" min={f.min} step={f.step} value={(calc as any)[f.k]}
                        onChange={e=>setCalc(p=>({...p,[f.k]:+e.target.value}))}
                        style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            <Card hover={false} style={{background:"linear-gradient(160deg,#0F172A,#1E293B)"}}>
              <h3 className="font-bold text-white mb-5 text-lg">Results</h3>
              <div className="space-y-4">
                {[
                  {l:"Total Yield",    v:res.totalYield.toFixed(0)+" kg",           c:"#A7F3D0"},
                  {l:"Gross Revenue",  v:fmtINR(res.revenue),                       c:"#86EFAC"},
                  {l:"Total Cost",     v:fmtINR(res.totalCost),                     c:"#FCA5A5"},
                  {l:"Net Profit",     v:fmtINR(res.profit),                        c:res.profit>=0?"#4ADE80":"#F87171"},
                  {l:"Profit Margin",  v:res.margin.toFixed(1)+"%",                 c:res.margin>=0?"#4ADE80":"#F87171"},
                  {l:"Break-even",     v:"₹"+res.breakEven.toFixed(0)+"/qtl",       c:"#93C5FD"},
                  {l:"ROI",            v:res.roi.toFixed(1)+"%",                    c:res.roi>=0?"#4ADE80":"#F87171"},
                ].map(s=>(
                  <div key={s.l} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{s.l}</span>
                    <span className="font-bold text-base" style={{color:s.c}}>{s.v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-xl" style={{background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.3)"}}>
                <p className="text-green-300 text-xs font-semibold">{res.profit>=0?"✅ Profitable":"⚠️ Loss-making"} crop at current rates</p>
                <p className="text-slate-400 text-xs mt-1">
                  {res.profit>=0
                    ? `Net margin of ${res.margin.toFixed(1)}% — consider selling when price exceeds ₹${(res.breakEven*1.25).toFixed(0)}/qtl.`
                    : `Reduce input costs or wait for price to exceed ₹${res.breakEven.toFixed(0)}/qtl break-even.`}
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* MANDIS */}
        {tab==="mandis" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="flex gap-2 flex-wrap mb-6">
              {Object.entries(CROPS).map(([k,v]) => (
                <button key={k} onClick={()=>setCrop(k)} className={`filter-pill${crop===k?" active":""}`}>
                  {v.emoji} {k.toUpperCase()}
                </button>
              ))}
            </div>
            <Card hover={false}>
              <h3 className="font-bold text-slate-800 mb-4 text-lg">{CROPS[crop as keyof typeof CROPS]?.emoji} {crop.toUpperCase()} Mandi Rates</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{background:"#F8FAFC"}} className="border-b border-slate-100">
                      {["Mandi","Location","Today's Price","Arrivals","vs MSP"].map(h=>(
                        <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {mandiRows.length===0
                      ? <tr><td colSpan={5} className="text-center py-8 text-slate-400 text-sm">No mandi data for selected crop.</td></tr>
                      : mandiRows.map((m,i)=>{
                        const msp = CROPS[crop as keyof typeof CROPS]?.msp||0;
                        const diff = msp>0 ? ((m.price-msp)/msp*100) : 0;
                        return (
                          <tr key={i} className="border-b border-slate-50 hover:bg-brand-50/20 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-800 text-sm">{m.name}</td>
                            <td className="px-4 py-3 text-slate-500 text-sm">{m.loc}</td>
                            <td className="px-4 py-3 font-bold text-slate-900">₹{m.price.toLocaleString("en-IN")}/qtl</td>
                            <td className="px-4 py-3 text-slate-500 text-sm">{m.arrival}</td>
                            <td className="px-4 py-3">
                              {msp>0
                                ? <span className={`badge ${diff>=0?"badge-green":"badge-red"}`}>{diff>=0?"+":""}{diff.toFixed(1)}%</span>
                                : <span className="text-slate-300 text-xs">N/A</span>}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ALERTS */}
        {tab==="alerts" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="max-w-lg mx-auto">
            <Card hover={false}>
              <h3 className="font-bold text-slate-800 mb-2 text-lg">Set Price Alert</h3>
              <p className="text-sm text-slate-500 mb-5">Get notified when a crop reaches your target price.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">COMMODITY</label>
                  <select value={alertForm.commodity} onChange={e=>setAlertForm(p=>({...p,commodity:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                    {Object.keys(CROPS).map(k=>(
                      <option key={k} value={k}>{CROPS[k as keyof typeof CROPS].emoji} {k.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">ALERT WHEN PRICE IS</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input placeholder="Enter price (₹/qtl)" value={alertForm.threshold}
                      onChange={e=>setAlertForm(p=>({...p,threshold:e.target.value}))}
                      style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                    <select value={alertForm.type} onChange={e=>setAlertForm(p=>({...p,type:e.target.value as any}))}
                      style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                      <option value="above">▲ Above Threshold</option>
                      <option value="below">▼ Below Threshold</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">TARGET PRICE (₹/qtl)</label>
                  <input placeholder="e.g. 2300" value={alertForm.threshold}
                    onChange={e=>setAlertForm(p=>({...p,threshold:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">EMAIL (OPTIONAL)</label>
                  <input type="email" placeholder="you@example.com for email alerts" value={alertForm.email}
                    onChange={e=>setAlertForm(p=>({...p,email:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <button onClick={saveAlert} className="btn btn-primary w-full py-3"
                  style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                  {alertSaved ? "✅ Alert Saved!" : "🔔 Set Price Alert"}
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
