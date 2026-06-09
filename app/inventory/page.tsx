"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Trash2, AlertTriangle, Search, X, Package, Printer, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { useStore } from "@/lib/store";
import Card from "@/components/Card";
import { fmtINR } from "@/lib/utils";

const CATS = ["All","Seeds","Fertilizer","Pesticides","Fuel","Tools","Other"];
const CAT_STYLE: Record<string,string> = {
  Seeds:"badge-green", Fertilizer:"badge-blue", Pesticides:"badge-red",
  Fuel:"badge-amber", Tools:"badge-slate", Other:"badge-slate",
};
const CAT_BG: Record<string,string> = {
  Seeds:"#ECFDF5", Fertilizer:"#DBEAFE", Pesticides:"#FEE2E2",
  Fuel:"#FEF3C7", Tools:"#F1F5F9", Other:"#F1F5F9",
};

export default function Inventory() {
  const { inventory, addItem, adjustStock, deleteItem, pushNotif } = useStore();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:"", cat:"Seeds", qty:0, unit:"kg", minQty:0, cost:0 });

  const filtered = inventory.filter(i =>
    (cat==="All" || i.cat===cat) && i.name.toLowerCase().includes(q.toLowerCase())
  );
  const low = inventory.filter(i=>i.qty<=i.minQty);
  const total = inventory.reduce((s,i)=>s+i.qty*i.cost,0);

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
      <div className="py-12 mb-0" style={{background:"linear-gradient(135deg,#0F172A,#1E293B)"}}>
        <div className="container flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="dot-live" style={{background:"#A7F3D0"}}/>
              <span className="text-green-300 text-xs font-bold tracking-widest">INVENTORY HUB</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-1">Farm <span className="grad-text">Inventory</span></h1>
            <p className="text-slate-400 text-sm">Track seeds, fertilizers, pesticides and tools · Real-time stock alerts</p>
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
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {l:"Total Items",    v:inventory.length,         icon:Package,     c:"text-brand-700 bg-brand-50 border-brand-200"},
            {l:"Total Value",    v:fmtINR(total),            icon:TrendingUp,  c:"text-amber-700 bg-amber-50 border-amber-200"},
            {l:"Low Stock",      v:`${low.length} items`,    icon:AlertTriangle, c:low.length>0?"text-rose-700 bg-rose-50 border-rose-200":"text-brand-700 bg-brand-50 border-brand-200"},
            {l:"Categories",     v:CATS.length-1,            icon:BarChart3,   c:"text-sky-700 bg-sky-50 border-sky-200"},
          ].map((s,i)=>{
            const Icon = s.icon;
            return (
            <motion.div key={s.l} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
              <div className={`card p-5 border flex items-center gap-4 ${s.c}`} style={{boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.c}`}>
                  <Icon className="w-5 h-5"/>
                </div>
                <div>
                  <div className="text-2xl font-bold">{s.v}</div>
                  <div className="text-xs font-semibold opacity-70">{s.l}</div>
                </div>
              </div>
            </motion.div>
          )})}
        </div>

        {/* Low stock banner */}
        {low.length > 0 && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            className="flex items-start gap-3 p-5 rounded-2xl mb-6"
            style={{background:"#FFF1F2",border:"2px solid #FECDD3",boxShadow:"0 4px 16px rgba(244,63,94,0.1)"}}>
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-rose-500"/>
            <div>
              <p className="font-bold text-sm text-rose-800">Low Stock Alert — {low.length} item{low.length>1?"s":""} below minimum threshold</p>
              <p className="text-xs mt-1 text-rose-700">{low.map(i=>i.name).join(" · ")}</p>
            </div>
          </motion.div>
        )}

        {/* Filters — fully visible selected state */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input className="pl-9" placeholder="Search inventory…" value={q} onChange={e=>setQ(e.target.value)}
              style={{background:"#fff",border:"2px solid #E2E8F0"}}/>
          </div>
          <div className="flex flex-wrap gap-2">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`filter-pill${cat===c?" filter-pill-active":""}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card hover={false} className="overflow-hidden p-0" style={{boxShadow:"0 4px 24px rgba(0,0,0,0.07)",border:"1.5px solid #E2E8F0"}}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{background:"linear-gradient(135deg,#F0FDF4,#F8FAFC)",borderBottom:"2px solid #E2E8F0"}}>
                  {["Item Name","Category","In Stock","Min Threshold","Cost/Unit","Total Value","Last Used","Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length===0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-400">
                    {q ? `No items matching "${q}"` : "No items yet — add your first item above"}
                  </td></tr>
                ) : filtered.map((item, i) => {
                  const isLow = item.qty <= item.minQty;
                  return (
                    <motion.tr key={item.id} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.04}}
                      className="hover:bg-slate-50/80 transition-colors"
                      style={{background: isLow ? "#FFF8F8" : "white"}}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                            style={{background: CAT_BG[item.cat]||"#F1F5F9"}}>
                            {item.cat==="Seeds"?"🌱":item.cat==="Fertilizer"?"🧪":item.cat==="Pesticides"?"🪲":item.cat==="Fuel"?"⛽":item.cat==="Tools"?"🔧":"📦"}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                            {isLow && <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">LOW</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${CAT_STYLE[item.cat]||"badge-slate"}`}>{item.cat}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-bold text-sm ${isLow?"text-rose-600":"text-slate-800"}`}>{item.qty} {item.unit}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500">{item.minQty} {item.unit}</td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">₹{item.cost.toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4 text-sm font-bold text-slate-800">₹{(item.qty*item.cost).toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4 text-xs text-slate-400">{item.lastUsed}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={()=>handleAdjust(item.id,-1,item.name)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200">
                            <Minus className="w-3 h-3"/>
                          </button>
                          <button onClick={()=>handleAdjust(item.id,1,item.name)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50 transition-colors border border-slate-200">
                            <Plus className="w-3 h-3"/>
                          </button>
                          <button onClick={()=>{deleteItem(item.id);pushNotif({title:"🗑️ Item Removed",body:`${item.name} removed from inventory.`,type:"warning",time:"just now"});}}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200">
                            <Trash2 className="w-3 h-3"/>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Total footer */}
        <div className="flex justify-end mt-4">
          <div className="rounded-xl px-6 py-3 flex items-center gap-4" style={{background:"linear-gradient(135deg,#ECFDF5,#D1FAE5)",border:"1.5px solid #A7F3D0"}}>
            <span className="text-sm font-semibold text-slate-600">Total Inventory Value:</span>
            <span className="text-xl font-bold text-brand-700">{fmtINR(total)}</span>
          </div>
        </div>
      </div>

      {/* Add Item Modal — centered, fully visible */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setShowAdd(false);}}>
            <motion.div initial={{opacity:0,scale:.92,y:24}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:.92,y:24}}
              className="modal-card p-0 overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100"
                style={{background:"linear-gradient(135deg,#F0FDF4,#fff)"}}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-brand-600"/>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">Add New Item</h3>
                    <p className="text-xs text-slate-400">Fill in item details to add to inventory</p>
                  </div>
                </div>
                <button onClick={()=>setShowAdd(false)}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                  <X className="w-5 h-5"/>
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5">Item Name</label>
                    <input placeholder="e.g. NPK Fertilizer 19-19-19" value={form.name}
                      onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="block mb-1.5">Category</label>
                    <select value={form.cat} onChange={e=>setForm(p=>({...p,cat:e.target.value}))}>
                      {CATS.filter(c=>c!=="All").map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1.5">Quantity</label>
                    <input type="number" min={0} value={form.qty}
                      onChange={e=>setForm(p=>({...p,qty:+e.target.value}))}/>
                  </div>
                  <div>
                    <label className="block mb-1.5">Unit</label>
                    <select value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))}>
                      {["kg","L","bags","units","qtl","boxes"].map(u=><option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1.5">Min Threshold</label>
                    <input type="number" min={0} value={form.minQty}
                      onChange={e=>setForm(p=>({...p,minQty:+e.target.value}))}/>
                  </div>
                </div>
                <div>
                  <label className="block mb-1.5">Cost per Unit (₹)</label>
                  <input type="number" min={0} placeholder="0" value={form.cost}
                    onChange={e=>setForm(p=>({...p,cost:+e.target.value}))}/>
                </div>

                {form.name && form.qty > 0 && form.cost > 0 && (
                  <div className="rounded-xl p-4 flex items-center gap-3"
                    style={{background:"#F0FDF4",border:"1.5px solid #A7F3D0"}}>
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase">Preview Total Value</p>
                      <p className="font-bold text-brand-700 text-lg">₹{(form.qty*form.cost).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={()=>setShowAdd(false)} className="btn btn-outline flex-1">Cancel</button>
                  <button onClick={handleAdd} className="btn btn-primary flex-1"
                    style={{background:"linear-gradient(135deg,#059669,#10B981)"}}>
                    <Plus className="w-4 h-4"/> Add Item
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
