"use client";
import { useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, AlertTriangle, Search, X, Package, Printer, Info, ChevronDown, TrendingUp, PieChart as PieIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { fmtINR } from "@/lib/utils";

const CATS = ["All","Seeds","Fertilizer","Pesticides","Fuel","Tools","Other"];
const CAT_STYLE: Record<string,string> = {
  Seeds:"badge-green", Fertilizer:"badge-blue", Pesticides:"badge-red",
  Fuel:"badge-amber", Tools:"badge-slate", Other:"badge-slate",
};

export default function Inventory() {
  const { inventory, addItem, adjustStock, deleteItem, pushNotif } = useStore();
  const [cat, setCat]     = useState("All");
  const [q, setQ]         = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]   = useState({ name:"", cat:"Seeds", qty:0, unit:"kg", minQty:0, cost:0 });
  const [expandedId, setExpandedId] = useState<string|null>(null);

  const filtered = inventory.filter(i =>
    (cat==="All" || i.cat===cat) && i.name.toLowerCase().includes(q.toLowerCase())
  );
  const low   = inventory.filter(i=>i.qty<=i.minQty);
  const total = inventory.reduce((s,i)=>s+i.qty*i.cost,0);

  /* Category value breakdown — for the bar chart */
  const catColors: Record<string,string> = {
    Seeds:"#10B981", Fertilizer:"#3B82F6", Pesticides:"#F43F5E",
    Fuel:"#F59E0B", Tools:"#64748B", Other:"#A78BFA",
  };
  const catBreakdown = CATS.filter(c=>c!=="All").map(c=>({
    cat: c,
    value: inventory.filter(i=>i.cat===c).reduce((s,i)=>s+i.qty*i.cost,0),
    count: inventory.filter(i=>i.cat===c).length,
  })).filter(c=>c.count>0);

  const handleAdd = () => {
    if (!form.name) {
      pushNotif({title:"⚠️ Item name required",body:"Please enter an item name before adding.",type:"warning",time:"just now"});
      return;
    }
    addItem({...form, id:Date.now().toString(), lastUsed:"Just added"});
    pushNotif({title:"📦 Item Added",body:`${form.name} added to inventory.`,type:"success",time:"just now"});
    setForm({name:"",cat:"Seeds",qty:0,unit:"kg",minQty:0,cost:0});
    setShowAdd(false);
  };

  const handleAdjust = (id:string, delta:number, name:string) => {
    adjustStock(id, delta);
    if (delta > 0) pushNotif({title:"📦 Stock Updated",body:`${name}: +${delta} units added.`,type:"info",time:"just now"});
  };

  return (
    <div className="pt-[88px] min-h-screen" style={{background:"linear-gradient(160deg,#F0FDF4 0%,#EFF6FF 100%)"}}>
      {/* Hero header */}
      <div className="bg-slate-900 py-10 mb-0">
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Inventory <span className="grad-text">Hub</span></h1>
            <p className="text-slate-400 text-sm">Track seeds, fertilizers, pesticides and tools</p>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>window.print()} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold no-print"
              style={{background:"rgba(255,255,255,0.1)",color:"#A7F3D0",border:"1px solid rgba(167,243,208,0.3)"}}>
              <Printer className="w-4 h-4"/> Print Report
            </button>
            <button onClick={()=>setShowAdd(true)} className="btn btn-primary"
              style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
              <Plus className="w-4 h-4"/> Add Item
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Hint */}
        <div className="hint-banner mb-6">
          <Info className="w-4 h-4 flex-shrink-0"/>
          <span><strong>Tip:</strong> Use the <strong>category pills</strong> below to filter items. Click any <strong>row</strong> to expand stock-health details and quick restock options. Use <strong>+</strong> / <strong>–</strong> for fast adjustments. Items below minimum threshold appear highlighted in red.</span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {l:"Total Items",    v:inventory.length,         c:"text-brand-700 bg-brand-50 border-brand-200"},
            {l:"Total Value",    v:fmtINR(total),            c:"text-amber-700 bg-amber-50 border-amber-200"},
            {l:"Low Stock",      v:`${low.length} items`,    c:low.length>0?"text-rose-700 bg-rose-50 border-rose-200":"text-brand-700 bg-brand-50 border-brand-200"},
            {l:"Categories",     v:CATS.length-1,            c:"text-sky-700 bg-sky-50 border-sky-200"},
          ].map((s,i)=>(
            <motion.div key={s.l} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
              <div className={`card p-5 border-2 text-center ${s.c}`} style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className="text-2xl font-bold mb-0.5">{s.v}</div>
                <div className="text-xs font-semibold opacity-70">{s.l}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Low stock banner */}
        {low.length > 0 && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}
            className="flex items-start gap-3 p-4 bg-rose-50 border-2 border-rose-200 rounded-xl mb-6 text-rose-800"
            style={{boxShadow:"0 4px 16px rgba(244,63,94,0.1)"}}>
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-rose-500"/>
            <div>
              <p className="font-bold text-sm">Low Stock Alert — {low.length} item{low.length>1?"s":""} below minimum threshold</p>
              <p className="text-xs mt-0.5 opacity-80">{low.map(i=>i.name).join(" · ")}</p>
            </div>
          </motion.div>
        )}

        {/* Category breakdown — value by category */}
        {catBreakdown.length > 0 && (
          <div className="card p-5 mb-6" style={{boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-brand-500"/> Stock Value by Category
              </h3>
              <span className="text-xs text-slate-400">Total: <strong className="text-slate-700">{fmtINR(total)}</strong></span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={catBreakdown} margin={{top:4,right:8,left:-16,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false}/>
                <XAxis dataKey="cat" tick={{fill:"#94A3B8",fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#94A3B8",fontSize:10}} axisLine={false} tickLine={false}
                  tickFormatter={(v)=>v>=1000?`₹${(v/1000).toFixed(0)}k`:`₹${v}`}/>
                <Tooltip
                  contentStyle={{borderRadius:"10px",border:"1px solid #E2E8F0",fontSize:"12px"}}
                  formatter={(v:any,_n:any,p:any)=>[fmtINR(v), `${p.payload.count} item${p.payload.count>1?"s":""}`]}/>
                <Bar dataKey="value" radius={[8,8,0,0]} maxBarSize={56}>
                  {catBreakdown.map((entry,i)=>(
                    <Cell key={i} fill={catColors[entry.cat]||"#10B981"}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Filters — visible active state */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input className="pl-9" placeholder="Search inventory…" value={q} onChange={e=>setQ(e.target.value)}
              style={{background:"#fff",border:"2px solid #E2E8F0"}}/>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c=>(
              <button key={c} onClick={()=>setCat(c)}
                className={`filter-pill${cat===c?" active":""}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto p-0" style={{boxShadow:"0 4px 24px rgba(0,0,0,0.06)"}}>
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100" style={{background:"#F8FAFC"}}>
                {["Item Name","Category","In Stock","Min Threshold","Cost/Unit","Total Value","Last Used","Actions"].map(h=>(
                  <th key={h} className="text-left text-xs font-bold text-slate-500 tracking-wider px-5 py-4 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">No items found for this category.</td></tr>
              ) : filtered.map((item,i)=>{
                const isLow = item.qty <= item.minQty;
                const isExpanded = expandedId === item.id;
                const healthPct = Math.min(100, Math.round((item.qty / ((item.minQty||1)*3)) * 100));
                const reorderQty = Math.max(0, item.minQty*2 - item.qty);
                return (
                  <Fragment key={item.id}>
                  <motion.tr initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                    className="hover:bg-brand-50/30 transition-colors cursor-pointer"
                    onClick={()=>setExpandedId(isExpanded?null:item.id)}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform ${isExpanded?"rotate-180":""}`}/>
                        <Package className="w-4 h-4 text-slate-300"/>
                        <span className="font-semibold text-slate-800 text-sm">{item.name}</span>
                        {isLow && <span className="badge badge-red text-[9px]">LOW</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className={`badge ${CAT_STYLE[item.cat]||"badge-slate"}`}>{item.cat}</span></td>
                    <td className="px-5 py-4">
                      <span className={`text-lg font-bold ${isLow?"text-rose-600":"text-slate-800"}`}>{item.qty}</span>
                      <span className="text-xs text-slate-400 ml-1">{item.unit}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">{item.minQty} {item.unit}</td>
                    <td className="px-5 py-4 text-sm text-slate-500">₹{item.cost}</td>
                    <td className="px-5 py-4 font-semibold text-amber-600 text-sm">₹{(item.qty*item.cost).toLocaleString("en-IN")}</td>
                    <td className="px-5 py-4 text-xs text-slate-400">{item.lastUsed}</td>
                    <td className="px-5 py-4" onClick={e=>e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button onClick={()=>handleAdjust(item.id,-10,item.name)} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors border border-slate-100 hover:border-rose-200"><Minus className="w-3.5 h-3.5"/></button>
                        <button onClick={()=>handleAdjust(item.id,50,item.name)}  className="p-1.5 rounded-lg hover:bg-brand-50 text-slate-400 hover:text-brand-600 transition-colors border border-slate-100 hover:border-brand-200"><Plus className="w-3.5 h-3.5"/></button>
                        <button onClick={()=>deleteItem(item.id)}                 className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors border border-slate-100 hover:border-rose-200"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </td>
                  </motion.tr>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.tr initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <td colSpan={8} className="px-5 pb-5 pt-0 bg-slate-50/70">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                            <div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Stock Health</div>
                              <div className="h-2 rounded-full bg-slate-200 overflow-hidden mb-1">
                                <div className="h-full rounded-full" style={{width:`${healthPct}%`,background:healthPct<40?"#F43F5E":healthPct<70?"#F59E0B":"#10B981"}}/>
                              </div>
                              <div className="text-xs text-slate-500">{healthPct}% of healthy buffer (3× min threshold)</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Reorder Suggestion</div>
                              {reorderQty > 0 ? (
                                <div className="text-sm font-semibold text-rose-600">Order {reorderQty} {item.unit} to restore buffer</div>
                              ) : (
                                <div className="text-sm font-semibold text-emerald-600">Stock level is healthy — no reorder needed</div>
                              )}
                              <div className="text-xs text-slate-400 mt-0.5">Estimated cost: {fmtINR(reorderQty*item.cost)}</div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quick Restock</div>
                              <div className="flex gap-2">
                                {[50,100,250].map(amt=>(
                                  <button key={amt} onClick={()=>handleAdjust(item.id,amt,item.name)}
                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-700 text-slate-600 transition-colors">
                                    +{amt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Print table */}
        <div className="hidden print:block mt-8">
          <h2 className="text-xl font-bold mb-2">Inventory Report — {new Date().toLocaleDateString("en-IN")}</h2>
          <p className="text-sm text-slate-500 mb-4">Total Value: {fmtINR(total)} · {inventory.length} items · {low.length} low stock</p>
        </div>
      </div>

      {/* ADD ITEM MODAL — centred overlay */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="modal-overlay"
            onClick={e=>{ if(e.target===e.currentTarget) setShowAdd(false); }}>
            <motion.div
              initial={{scale:0.92,opacity:0,y:24}}
              animate={{scale:1,opacity:1,y:0}}
              exit={{scale:0.92,opacity:0,y:24}}
              transition={{type:"spring",damping:24,stiffness:280}}
              className="modal-card" style={{maxWidth:"520px"}}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Add Inventory Item</h2>
                  <p className="text-sm text-slate-400 mt-1">Track a new seed, fertilizer, tool, or supply</p>
                </div>
                <button onClick={()=>setShowAdd(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="modal-grid mb-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">ITEM NAME</label>
                  <input placeholder="e.g. DAP Fertilizer" value={form.name}
                    onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">CATEGORY</label>
                  <select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                    {["Seeds","Fertilizer","Pesticides","Fuel","Tools","Other"].map(c=>(
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">QUANTITY</label>
                  <input type="number" min="0" value={form.qty}
                    onChange={e=>setForm(p=>({...p,qty:+e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">UNIT</label>
                  <select value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}>
                    {["kg","L","bags","pcs","qtl","g","ml","ton"].map(u=>(
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">MIN THRESHOLD</label>
                  <input type="number" min="0" placeholder="Alert when below this" value={form.minQty}
                    onChange={e=>setForm(p=>({...p,minQty:+e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">COST PER UNIT (₹)</label>
                  <input type="number" min="0" placeholder="e.g. 280" value={form.cost}
                    onChange={e=>setForm(p=>({...p,cost:+e.target.value}))}
                    style={{background:"#F8FAFC",border:"2px solid #E2E8F0"}}/>
                </div>
              </div>

              {form.qty > 0 && form.cost > 0 && (
                <div className="mb-4 p-3 rounded-xl" style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0"}}>
                  <p className="text-sm text-brand-700 font-semibold">
                    Total value: <strong>₹{(form.qty*form.cost).toLocaleString("en-IN")}</strong>
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button onClick={()=>setShowAdd(false)} className="btn btn-ghost px-6 py-2.5">Cancel</button>
                <button onClick={handleAdd} className="btn btn-primary px-8 py-2.5"
                  style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                  <Plus className="w-4 h-4"/> Add Item
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
