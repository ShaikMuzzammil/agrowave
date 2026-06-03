"use client";
import { useState } from "react";
import { Search, AlertTriangle, Plus, Minus, Trash2, Package } from "lucide-react";
import { INVENTORY, InventoryItem, InventoryCategory } from "@/lib/farmData";

const CATEGORIES: Array<InventoryCategory|"All"> = ["All","Seeds","Fertilizer","Pesticides","Fuel","Tools","Other"];

export default function InventoryPage() {
  const [category, setCategory] = useState<InventoryCategory|"All">("All");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY);

  const lowItems = items.filter(i=>i.isLow);
  const filtered = items.filter(i=>
    (category==="All" || i.category===category) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
  );

  function adjust(id: string, delta: number) {
    setItems(prev=>prev.map(i=>i.id===id
      ? { ...i, inStock: Math.max(0, i.inStock+delta), isLow: (i.inStock+delta)<i.minThreshold }
      : i
    ));
  }

  function getCatColor(cat: InventoryCategory) {
    return cat==="Seeds"?"bg-emerald-100 text-emerald-700 border-emerald-200":
      cat==="Fertilizer"?"bg-sky-100 text-sky-700 border-sky-200":
      cat==="Pesticides"?"bg-amber-100 text-amber-700 border-amber-200":
      cat==="Fuel"?"bg-orange-100 text-orange-700 border-orange-200":
      cat==="Tools"?"bg-violet-100 text-violet-700 border-violet-200":"bg-slate-100 text-slate-600 border-slate-200";
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Inventory Manager</h1>
        <p className="text-sm text-slate-500 mt-0.5">{items.length} items tracked · {lowItems.length} low stock</p>
      </div>

      {/* Low stock alert banner */}
      {lowItems.length>0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-rose-800 text-sm">
              Low Stock Alert — {lowItems.length} {lowItems.length===1?"item":"items"} below minimum threshold
            </p>
            <p className="text-rose-600 text-xs mt-0.5">{lowItems.map(i=>i.name).join(" · ")}</p>
          </div>
        </div>
      )}

      {/* Search + Category filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="terra-input pl-9 text-sm" placeholder="Search inventory..."
            value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCategory(c)}
              className={`filter-pill ${category===c?"active":""}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory table */}
      <div className="terra-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-5 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">Item Name</th>
                <th className="text-left px-4 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">Category</th>
                <th className="text-right px-4 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">In Stock</th>
                <th className="text-right px-4 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">Min Threshold</th>
                <th className="text-right px-4 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">Cost/Unit</th>
                <th className="text-right px-4 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">Total Value</th>
                <th className="text-right px-4 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">Last Used</th>
                <th className="text-center px-4 py-3.5 font-bold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={item.id}
                  className={`border-b border-slate-50 transition-colors hover:bg-slate-50 ${item.isLow?"bg-rose-50/40":""} ${idx%2===1&&!item.isLow?"bg-slate-50/30":""}`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      {item.isLow && (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full badge-low border">LOW</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getCatColor(item.category)}`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`font-bold ${item.isLow?"text-rose-600":"text-slate-900"}`}>
                      {item.inStock} {item.unit}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-slate-600">{item.minThreshold} {item.unit}</td>
                  <td className="px-4 py-4 text-right text-slate-700">₹{item.costPerUnit}</td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-900">
                    ₹{(item.inStock*item.costPerUnit).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-slate-400 text-xs">{item.lastUsed}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={()=>adjust(item.id,-1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-all">
                        <Minus size={12} />
                      </button>
                      <button onClick={()=>adjust(item.id,1)}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-emerald-100 hover:text-emerald-600 flex items-center justify-center transition-all">
                        <Plus size={12} />
                      </button>
                      <button onClick={()=>setItems(prev=>prev.filter(i=>i.id!==item.id))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-all">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                  No items found for "{search || category}"
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total value footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">{filtered.length} items shown</span>
          <span className="font-bold text-slate-900 text-sm">
            Total Value: ₹{filtered.reduce((s,i)=>s+(i.inStock*i.costPerUnit),0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:"Total Items", value:items.length.toString(), color:"bg-slate-100 text-slate-700" },
          { label:"Low Stock", value:lowItems.length.toString(), color:"bg-rose-100 text-rose-700" },
          { label:"Total Value", value:`₹${items.reduce((s,i)=>s+(i.inStock*i.costPerUnit),0).toLocaleString()}`, color:"bg-emerald-100 text-emerald-700" },
          { label:"Categories", value:"6", color:"bg-sky-100 text-sky-700" },
        ].map(c=>(
          <div key={c.label} className={`${c.color} rounded-xl p-4 text-center`}>
            <div className="text-xl font-black">{c.value}</div>
            <div className="text-xs font-semibold mt-0.5 uppercase tracking-wider opacity-80">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
