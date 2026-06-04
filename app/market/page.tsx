"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Bell, Calculator, X, Search, Printer } from "lucide-react";
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
    {id:"prices",l:"Live Prices",icon:TrendingUp},
    {id:"calculator",l:"P&L Calculator",icon:Calculator},
    {id:"mandis",l:"Mandi Rates",icon:Search},
    {id:"alerts",l:"Price Alerts",icon:Bell}
  ] as const;

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
        {/* Tabs — always visible active state */}
        <div className="flex gap-2 flex-wrap mb-8 p-1.5 rounded-2xl w-fit" style={{background:"#fff",border:"2px solid #E2E8F0",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`tab-btn ${tab===t.id?"active":""}`}>
              <t.icon className="w-4 h-4"/>{t.l}
            </button>
          ))}
        </div>

        {/* PRICES */}
        {tab==="prices" && (
          <div>
            {/* Crop selector row */}
            <div className="flex gap-2 flex-wrap mb-6">
              {Object.entries(CROPS).map(([k,v]) => (
                <button key={k} onClick={()=>setCrop(k)} className={`filter-pill ${crop===k?"active":""}`}>
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
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
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
              <h3 className="font-bold text-xl text-slate-800 mb-5 flex items-center gap-2"><Calculator className="w-5 h-5 text-brand-600"/>Profit & Loss Calculator</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">CROP</label>
                    <select value={calc.crop} onChange={e=>setCalc(p=>({...p,crop:e.target.value}))}>
                      {Object.keys(CROPS).map(k=><option key={k} value={k}>{k.charAt(0).toUpperCase()+k.slice(1)}</option>)}
                    </select>
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">AREA (acres)</label>
                    <input type="number" value={calc.area} onChange={e=>setCalc(p=>({...p,area:+e.target.value}))} min="0.5" step="0.5"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">YIELD (qtl/acre)</label>
                    <input type="number" value={calc.yield} onChange={e=>setCalc(p=>({...p,yield:+e.target.value}))}/>
                  </div>
                  <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">SELLING PRICE (₹/qtl)</label>
                    <input type="number" value={calc.price} onChange={e=>setCalc(p=>({...p,price:+e.target.value}))}/>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs font-semibold text-slate-400 mb-3 tracking-wider">COST PER ACRE (₹)</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[{k:"seed",l:"Seeds"},{k:"fert",l:"Fertilizer"},{k:"labor",l:"Labor"},{k:"irr",l:"Irrigation"},{k:"pest",l:"Pesticides"},{k:"other",l:"Others"}].map(({k,l}) => (
                      <div key={k}><label className="block text-xs font-semibold text-slate-500 mb-1">{l.toUpperCase()}</label>
                        <input type="number" value={(calc as any)[k]} onChange={e=>setCalc(p=>({...p,[k]:+e.target.value}))}/>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <div className="space-y-4">
              <Card hover={false} style={{boxShadow:"0 4px 24px rgba(0,0,0,0.07)"}}>
                <h3 className="font-bold text-lg text-slate-800 mb-5">Results</h3>
                <div className="space-y-3">
                  {[
                    {l:"Total Yield",   v:`${res.totalYield.toFixed(0)} qtl`,c:"text-slate-800"},
                    {l:"Gross Revenue", v:fmtINR(res.revenue),               c:"text-brand-700"},
                    {l:"Total Cost",    v:fmtINR(res.totalCost),             c:"text-rose-600"},
                    {l:"Net Profit",    v:fmtINR(res.profit),                c:res.profit>=0?"text-brand-700":"text-rose-600"},
                    {l:"Profit Margin", v:`${res.margin.toFixed(1)}%`,       c:res.margin>=20?"text-brand-600":res.margin>=0?"text-amber-600":"text-rose-600"},
                    {l:"Break-Even",    v:`₹${res.breakEven.toFixed(0)}/qtl`,c:"text-slate-600"},
                    {l:"ROI",           v:`${res.roi.toFixed(1)}%`,          c:res.roi>=20?"text-brand-600":res.roi>=0?"text-amber-600":"text-rose-600"},
                  ].map(row => (
                    <div key={row.l} className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
                      <span className="text-slate-500 text-sm">{row.l}</span>
                      <span className={`font-bold text-lg ${row.c}`}>{row.v}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card hover={false}>
                <p className="text-xs font-semibold text-slate-400 mb-3">COST DISTRIBUTION</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart layout="vertical" data={[{n:"Seeds",v:calc.seed},{n:"Fert",v:calc.fert},{n:"Labor",v:calc.labor},{n:"Irr",v:calc.irr},{n:"Pest",v:calc.pest},{n:"Other",v:calc.other}]} margin={{left:10}}>
                    <XAxis type="number" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}`}/>
                    <YAxis type="category" dataKey="n" tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false} width={35}/>
                    <Tooltip {...TT} formatter={(v:any)=>[`₹${Number(v).toLocaleString("en-IN")}`,"Cost/Acre"]}/>
                    <Bar dataKey="v" fill="#10B981" radius={[0,6,6,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          </motion.div>
        )}

        {/* MANDIS */}
        {tab==="mandis" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="flex gap-2 flex-wrap mb-6">
              {Object.entries(CROPS).map(([k,v]) => (
                <button key={k} onClick={()=>setCrop(k)} className={`filter-pill ${crop===k?"active":""}`}>
                  {v.emoji} {k.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="grid gap-3">
              {(mandiRows.length>0?mandiRows:MANDIS.slice(0,4).map(m=>({...m,price:prices[crop]?.current||2000,arrival:"N/A"}))).map((m,i) => {
                const diff = m.price - (prices[crop]?.current||CROPS[crop as keyof typeof CROPS]?.base||2000);
                return (
                  <motion.div key={m.name} initial={{opacity:0,x:-16}} animate={{opacity:1,x:0}} transition={{delay:i*0.08}}>
                    <Card className="flex items-center justify-between p-5" style={{boxShadow:"0 2px 12px rgba(0,0,0,0.05)"}}>
                      <div>
                        <h4 className="font-bold text-slate-800">{m.name}</h4>
                        <p className="text-sm text-slate-400">{m.loc} · Arrival: {m.arrival}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">₹{m.price.toLocaleString("en-IN")}</div>
                        <div className={`text-sm font-semibold ${diff>=0?"text-brand-600":"text-rose-500"}`}>{diff>=0?"+":""}{diff} vs avg</div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ALERTS */}
        {tab==="alerts" && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="grid md:grid-cols-2 gap-6 max-w-3xl">
            <Card hover={false} style={{boxShadow:"0 4px 24px rgba(0,0,0,0.07)"}}>
              <h3 className="font-bold text-xl text-slate-800 mb-5 flex items-center gap-2"><Bell className="w-5 h-5 text-brand-600"/>Set Price Alert</h3>
              <div className="space-y-4">
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">COMMODITY</label>
                  <select value={alertForm.commodity} onChange={e=>setAlertForm(p=>({...p,commodity:e.target.value}))}>
                    {Object.entries(CROPS).map(([k,v]) => <option key={k} value={k}>{v.emoji} {k.toUpperCase()}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">ALERT WHEN PRICE IS</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["above","below"] as const).map(t => (
                      <button key={t} onClick={()=>setAlertForm(p=>({...p,type:t}))}
                        className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${alertForm.type===t?"bg-brand-600 border-brand-600 text-white shadow-green":"border-slate-200 text-slate-600 bg-white hover:border-brand-300 hover:text-brand-700"}`}>
                        {t==="above"?"▲ Above Threshold":"▼ Below Threshold"}
                      </button>
                    ))}
                  </div>
                </div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">TARGET PRICE (₹/qtl)</label>
                  <input type="number" placeholder="e.g. 2300" value={alertForm.threshold} onChange={e=>setAlertForm(p=>({...p,threshold:e.target.value}))}/>
                </div>
                <div><label className="block text-xs font-semibold text-slate-500 mb-1.5">EMAIL (optional)</label>
                  <input type="email" placeholder="farmer@example.com" value={alertForm.email} onChange={e=>setAlertForm(p=>({...p,email:e.target.value}))}/>
                </div>
                <button onClick={saveAlert}
                  className={`btn w-full py-3 text-sm transition-all ${alertSaved?"btn-outline text-brand-700 border-brand-400":"btn-primary"}`}
                  style={!alertSaved?{background:"linear-gradient(135deg,#059669,#10B981)"}:{}}>
                  {alertSaved ? "✅ Alert saved! Watch your notifications" : "Set Price Alert"}
                </button>
              </div>
            </Card>
            <Card hover={false} className="bg-brand-50 border-brand-100">
              <h3 className="font-bold text-lg text-slate-800 mb-4">How Price Alerts Work</h3>
              <div className="space-y-4">
                {[
                  {n:"01",t:"Set Your Target",d:"Choose a crop and set the price threshold you want to be notified about."},
                  {n:"02",t:"We Monitor Live",d:"Our system checks prices every 60 seconds from 600+ mandis across India."},
                  {n:"03",t:"Instant Notification",d:"When your target is reached, you get an instant in-app notification."},
                  {n:"04",t:"Sell at the Right Time",d:"Make informed selling decisions based on real market data, not guesswork."},
                ].map(s => (
                  <div key={s.n} className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-brand-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{s.n}</div>
                    <div><p className="font-semibold text-slate-800 text-sm">{s.t}</p><p className="text-slate-500 text-xs mt-0.5">{s.d}</p></div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
