"use client";
import { useState } from "react";
import { TrendingUp, TrendingDown, Bell, Calculator, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MARKET_PRICES, CropPrice } from "@/lib/farmData";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Today"];

export default function MarketPage() {
  const [activeCrop, setActiveCrop] = useState("wheat");
  const [subTab, setSubTab] = useState<"live"|"pl"|"alerts">("live");
  const [alertForm, setAlertForm] = useState({ price:"", type:"below", target:"" });
  const [alertSaved, setAlertSaved] = useState(false);
  const [plForm, setPlForm] = useState({ qty:10, buyPrice:0, sellPrice:0 });

  const crop = MARKET_PRICES.find(c=>c.id===activeCrop)!;
  const chartData = crop.trend.map((p,i)=>({ day: DAYS[i], price: p }));
  const plProfit = (plForm.sellPrice - plForm.buyPrice) * plForm.qty * 100;

  function handleAlertSave(e: React.FormEvent) {
    e.preventDefault();
    setAlertSaved(true);
    setTimeout(()=>setAlertSaved(false), 3000);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Market Prices</h1>
        <p className="text-sm text-slate-500 mt-0.5">Live crop prices · Hyderabad APMC · Updated {new Date().toLocaleTimeString()}</p>
      </div>

      {/* Sub-tab toolbar */}
      <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-slate-100">
        {(["live","pl","alerts"] as const).map(t=>(
          <button key={t} onClick={()=>setSubTab(t)}
            className={`market-subtab ${subTab===t?"active":""}`}>
            {t==="live" ? "📈 Live Prices" : t==="pl" ? "📊 P&L Calculator" : "🔔 Price Alerts"}
          </button>
        ))}
      </div>

      {/* Crop tabs — FIXED selected state */}
      <div className="flex gap-2 flex-wrap">
        {MARKET_PRICES.map(c=>(
          <button key={c.id} onClick={()=>setActiveCrop(c.id)}
            className={`crop-tab ${activeCrop===c.id?"active":""}`}>
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
      </div>

      {subTab==="live" && (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Selected crop detail */}
          <div className="lg:col-span-1 space-y-4">
            <div className="terra-card border-2 border-emerald-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl">{crop.icon}</span>
                <div>
                  <h2 className="font-black text-slate-900 text-lg">{crop.name}</h2>
                  <span className="text-xs text-slate-400">Today's Rate</span>
                </div>
              </div>
              <div className="text-4xl font-black text-slate-900 mt-2">₹{crop.price.toLocaleString()}</div>
              <p className="text-sm text-slate-500">per quintal (100 kg)</p>
              <div className={`flex items-center gap-1.5 mt-3 text-sm font-bold ${crop.change>=0?"text-emerald-600":"text-rose-600"}`}>
                {crop.change>=0 ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                {crop.change>=0?"+":""}{crop.change} ({crop.changePct>=0?"+":""}{crop.changePct.toFixed(2)}%) today
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">MSP (Govt.)</span>
                  <span className="font-semibold text-slate-700">₹{crop.msp>0?crop.msp.toLocaleString():"–"}</span>
                </div>
                {crop.msp>0 && (
                  <div className={`mt-1 text-xs font-semibold ${crop.price>crop.msp?"text-emerald-600":"text-rose-600"}`}>
                    {crop.price>crop.msp?`₹${(crop.price-crop.msp).toLocaleString()} above MSP`:`₹${(crop.msp-crop.price).toLocaleString()} below MSP`}
                  </div>
                )}
              </div>
            </div>

            {/* Price table for all crops */}
            <div className="terra-card">
              <h3 className="font-bold text-slate-900 text-sm mb-3">All Crops</h3>
              <div className="space-y-2">
                {MARKET_PRICES.map(c=>(
                  <button key={c.id} onClick={()=>setActiveCrop(c.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-sm transition-all ${
                      activeCrop===c.id?"bg-emerald-50 border border-emerald-200":"hover:bg-slate-50"
                    }`}>
                    <div className="flex items-center gap-2">
                      <span>{c.icon}</span>
                      <span className="font-medium text-slate-700">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">₹{c.price.toLocaleString()}</div>
                      <div className={`text-xs ${c.change>=0?"text-emerald-600":"text-rose-600"}`}>
                        {c.change>=0?"+":""}{c.changePct.toFixed(2)}%
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 space-y-4">
            <div className="terra-card">
              <h3 className="font-bold text-slate-900 mb-1">{crop.name} – 7-Day Price Trend</h3>
              <p className="text-xs text-slate-400 mb-4">₹ per quintal</p>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{fontSize:12,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
                  <YAxis domain={['auto','auto']} tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}
                    tickFormatter={v=>`₹${v.toLocaleString()}`} />
                  <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #e2e8f0"}}
                    formatter={(v:unknown)=>[`₹${(v as number).toLocaleString()}`,crop.name]} />
                  <Line type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={2.5}
                    dot={{r:4,fill:"#22c55e"}} activeDot={{r:6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Market insight cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label:"7-Day High", value:`₹${Math.max(...crop.trend).toLocaleString()}`, icon:<TrendingUp size={16}/>, color:"text-emerald-600 bg-emerald-50" },
                { label:"7-Day Low", value:`₹${Math.min(...crop.trend).toLocaleString()}`, icon:<TrendingDown size={16}/>, color:"text-rose-600 bg-rose-50" },
                { label:"MSP Premium", value:crop.msp>0?`₹${(crop.price-crop.msp).toLocaleString()}`:"N/A",
                  icon:<Minus size={16}/>, color:crop.price>=crop.msp?"text-emerald-600 bg-emerald-50":"text-rose-600 bg-rose-50" },
              ].map(s=>(
                <div key={s.label} className="terra-card text-center">
                  <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-2`}>{s.icon}</div>
                  <div className="font-black text-slate-900">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab==="pl" && (
        <div className="max-w-xl mx-auto terra-card">
          <h2 className="font-black text-slate-900 text-lg mb-5 flex items-center gap-2">
            <Calculator size={18} className="text-emerald-600" /> P&L Calculator
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Crop</label>
              <select className="terra-select w-full" value={activeCrop} onChange={e=>setActiveCrop(e.target.value)}>
                {MARKET_PRICES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Qty (quintals)</label>
                <input type="number" min="1" className="terra-input"
                  value={plForm.qty} onChange={e=>setPlForm({...plForm,qty:Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Buy Price (₹/qtl)</label>
                <input type="number" min="0" className="terra-input" placeholder={`${crop.msp}`}
                  value={plForm.buyPrice||""} onChange={e=>setPlForm({...plForm,buyPrice:Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Sell Price (₹/qtl)</label>
                <input type="number" min="0" className="terra-input" placeholder={`${crop.price}`}
                  value={plForm.sellPrice||""} onChange={e=>setPlForm({...plForm,sellPrice:Number(e.target.value)})} />
              </div>
            </div>
            {plForm.buyPrice>0 && plForm.sellPrice>0 && (
              <div className={`p-4 rounded-xl border-2 text-center ${plProfit>=0?"bg-emerald-50 border-emerald-200":"bg-rose-50 border-rose-200"}`}>
                <p className="text-sm font-medium text-slate-600">Estimated {plProfit>=0?"Profit":"Loss"}</p>
                <p className={`text-3xl font-black mt-1 ${plProfit>=0?"text-emerald-700":"text-rose-700"}`}>
                  {plProfit>=0?"+ ":"– "}₹{Math.abs(plProfit).toLocaleString()}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {plForm.qty} qtl × ₹{Math.abs(plForm.sellPrice-plForm.buyPrice)} margin = {plForm.qty*100} kg
                </p>
              </div>
            )}
            <button onClick={()=>setPlForm({qty:plForm.qty,buyPrice:crop.msp,sellPrice:crop.price})}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all">
              Auto-fill with Today's Prices
            </button>
          </div>
        </div>
      )}

      {subTab==="alerts" && (
        <div className="max-w-xl mx-auto terra-card">
          <h2 className="font-black text-slate-900 text-lg mb-5 flex items-center gap-2">
            <Bell size={18} className="text-emerald-600" /> Set Price Alert
          </h2>
          {alertSaved ? (
            <div className="py-8 text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-bold text-slate-900">Alert Set!</p>
              <p className="text-slate-500 text-sm mt-1">You'll be notified when {crop.name} crosses your threshold.</p>
            </div>
          ) : (
            <form onSubmit={handleAlertSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Crop</label>
                <select className="terra-select w-full" value={activeCrop} onChange={e=>setActiveCrop(e.target.value)}>
                  {MARKET_PRICES.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name} – ₹{c.price}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Alert When Price Is</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="number" min="0" className="terra-input" placeholder="e.g. 2100"
                    value={alertForm.price} onChange={e=>setAlertForm({...alertForm,price:e.target.value})} required />
                  <select className="terra-select w-full" value={alertForm.type}
                    onChange={e=>setAlertForm({...alertForm,type:e.target.value})}>
                    <option value="below">▼ Below Threshold</option>
                    <option value="above">▲ Above Threshold</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Target Price (₹/qtl)</label>
                <input type="number" min="0" className="terra-input" placeholder="e.g. 2300"
                  value={alertForm.target} onChange={e=>setAlertForm({...alertForm,target:e.target.value})} />
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500">
                Current {crop.name} price: <strong className="text-slate-900">₹{crop.price.toLocaleString()}</strong> per quintal
              </div>
              <button type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2">
                <Bell size={15} /> Save Alert
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
