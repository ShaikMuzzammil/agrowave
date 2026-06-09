import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

export const CROPS = {
  wheat:   { emoji:"🌾", base:2150, msp:2015, unit:"qtl", color:"#F59E0B", season:"Rabi",   days:120 },
  rice:    { emoji:"🍚", base:2180, msp:2183, unit:"qtl", color:"#10B981", season:"Kharif", days:150 },
  maize:   { emoji:"🌽", base:1890, msp:1962, unit:"qtl", color:"#F97316", season:"Kharif", days:90  },
  soybean: { emoji:"🫘", base:4200, msp:4300, unit:"qtl", color:"#84CC16", season:"Kharif", days:100 },
  cotton:  { emoji:"🧶", base:6620, msp:6620, unit:"qtl", color:"#A78BFA", season:"Kharif", days:180 },
  onion:   { emoji:"🧅", base:1400, msp:0,    unit:"qtl", color:"#F43F5E", season:"Rabi",   days:120 },
  tomato:  { emoji:"🍅", base:2200, msp:0,    unit:"qtl", color:"#EF4444", season:"All",    days:90  },
  potato:  { emoji:"🥔", base:1100, msp:0,    unit:"qtl", color:"#D97706", season:"Rabi",   days:90  },
} as const;
export type CropKey = keyof typeof CROPS;

export function getLivePrices(): Record<string, { current:number; change:number; pct:number; base:number }> {
  return Object.entries(CROPS).reduce((acc,[k,v]) => {
    const drift = (Math.random()-0.5)*0.03;
    const current = Math.round(v.base*(1+drift));
    const change = current - v.base;
    return { ...acc, [k]:{ current, change, pct:parseFloat(((change/v.base)*100).toFixed(2)), base:v.base } };
  },{} as any);
}

export function sparkline(base:number, len=14) {
  return Array.from({length:len},(_,i)=>({ i:i+1, v:Math.round(base*(1+(Math.random()-.5)*.05)) }));
}

export function fmtINR(n:number) {
  return new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(n);
}

export const FORECAST = [
  { day:"Today", hi:36, lo:24, rain:10, icon:"⛅", desc:"Partly Cloudy",   wind:12, hum:65 },
  { day:"Tue",   hi:34, lo:23, rain:55, icon:"🌧️", desc:"Rain Likely",     wind:18, hum:80 },
  { day:"Wed",   hi:32, lo:22, rain:80, icon:"⛈️", desc:"Thunderstorm",    wind:26, hum:88 },
  { day:"Thu",   hi:33, lo:23, rain:35, icon:"🌦️", desc:"Scattered Showers",wind:14, hum:74 },
  { day:"Fri",   hi:35, lo:24, rain:5,  icon:"☀️", desc:"Sunny",           wind:9,  hum:58 },
  { day:"Sat",   hi:37, lo:26, rain:0,  icon:"☀️", desc:"Clear",           wind:8,  hum:52 },
  { day:"Sun",   hi:38, lo:27, rain:0,  icon:"🌤️", desc:"Mostly Clear",    wind:10, hum:50 },
];

export const HOURLY = Array.from({length:24},(_,i)=>({
  h:`${String(i).padStart(2,"0")}:00`,
  t: Math.round(25 + Math.sin((i-6)*Math.PI/12)*9 + (Math.random()-.5)*2),
  r: (i>=12&&i<=16) ? Math.round(Math.random()*4) : 0,
}));

export interface Plot {
  id:string; name:string; crop:string; size:number; moisture:number;
  health:number; temp:number; npk:{n:number;p:number;k:number};
  lastWatered:string; autoIrr:boolean; phase:string; ph:number;
  pestRisk:"low"|"medium"|"high"; area:string;
}

export const DEFAULT_PLOTS: Plot[] = [
  { id:"A", name:"North Field",   crop:"Wheat",   size:4.5, moisture:72, health:94, temp:32, npk:{n:142,p:46,k:180}, lastWatered:"2h ago",  autoIrr:true,  phase:"Tillering",      ph:6.8, pestRisk:"low",    area:"Rabi Block" },
  { id:"B", name:"East Block",    crop:"Rice",    size:3.2, moisture:48, health:78, temp:34, npk:{n:118,p:38,k:165}, lastWatered:"6h ago",  autoIrr:false, phase:"Panicle Init.",  ph:6.2, pestRisk:"medium", area:"Kharif Block" },
  { id:"C", name:"South Field",   crop:"Cotton",  size:5.0, moisture:24, health:45, temp:37, npk:{n:95, p:52,k:140}, lastWatered:"1d ago",  autoIrr:true,  phase:"Boll Formation", ph:7.1, pestRisk:"high",   area:"Kharif Block" },
  { id:"D", name:"West Block",    crop:"Soybean", size:3.8, moisture:68, health:88, temp:31, npk:{n:155,p:48,k:195}, lastWatered:"3h ago",  autoIrr:true,  phase:"Pod Fill",       ph:6.5, pestRisk:"low",    area:"Kharif Block" },
  { id:"E", name:"Central Plot",  crop:"Maize",   size:4.0, moisture:56, health:82, temp:33, npk:{n:133,p:42,k:175}, lastWatered:"5h ago",  autoIrr:false, phase:"Silking",        ph:6.9, pestRisk:"low",    area:"Rabi Block" },
  { id:"F", name:"Border Strip",  crop:"Onion",   size:2.5, moisture:62, health:91, temp:30, npk:{n:148,p:55,k:188}, lastWatered:"4h ago",  autoIrr:true,  phase:"Bulb Dev.",      ph:6.4, pestRisk:"low",    area:"Rabi Block" },
];

export interface InventoryItem {
  id:string; name:string; cat:string; qty:number; unit:string;
  minQty:number; cost:number; lastUsed:string;
}
export const DEFAULT_INV: InventoryItem[] = [
  { id:"i1", name:"Wheat Seeds HD-2967", cat:"Seeds",      qty:850, unit:"kg",   minQty:200, cost:45,   lastUsed:"3d ago" },
  { id:"i2", name:"Urea (46% N)",        cat:"Fertilizer", qty:1200,unit:"kg",   minQty:500, cost:12,   lastUsed:"1w ago" },
  { id:"i3", name:"DAP Fertilizer",      cat:"Fertilizer", qty:45,  unit:"kg",   minQty:100, cost:35,   lastUsed:"2d ago" },
  { id:"i4", name:"Chlorpyrifos 20% EC", cat:"Pesticides", qty:18,  unit:"L",    minQty:20,  cost:280,  lastUsed:"5d ago" },
  { id:"i5", name:"Tractor Diesel",      cat:"Fuel",       qty:150, unit:"L",    minQty:50,  cost:95,   lastUsed:"1d ago" },
  { id:"i6", name:"Drip Tape (100m)",    cat:"Tools",      qty:12,  unit:"roll", minQty:5,   cost:1200, lastUsed:"2w ago" },
  { id:"i7", name:"Potash (MOP)",        cat:"Fertilizer", qty:320, unit:"kg",   minQty:150, cost:22,   lastUsed:"4d ago" },
  { id:"i8", name:"Neem Oil Biopest.",   cat:"Pesticides", qty:8,   unit:"L",    minQty:5,   cost:180,  lastUsed:"1w ago" },
];

export interface FarmEvent {
  id:string; title:string; date:string;
  type:"irrigation"|"fertilizer"|"pesticide"|"harvest"|"planting"|"other";
  plot:string; notes:string; done:boolean;
}
const T = new Date(); const fmt=(d:Date)=>d.toISOString().split("T")[0];
const add=(d:Date,n:number)=>{ const x=new Date(d); x.setDate(x.getDate()+n); return x; };
export const DEFAULT_EVENTS: FarmEvent[] = [
  { id:"e1", title:"Irrigate North Field & West Block", date:fmt(T),         type:"irrigation", plot:"A,D", notes:"Morning 6am cycle — 45 min", done:false },
  { id:"e2", title:"Apply Urea Top-Dress — East Block",  date:fmt(add(T,2)), type:"fertilizer", plot:"B",   notes:"25 kg/acre dosage",           done:false },
  { id:"e3", title:"Chlorpyrifos Spray — South Field",  date:fmt(add(T,1)), type:"pesticide",  plot:"C",   notes:"Armyworm treatment",           done:false },
  { id:"e4", title:"Wheat Harvest Window Opens",         date:fmt(add(T,45)),type:"harvest",    plot:"A",   notes:"Est. 45 qtl/acre",             done:false },
  { id:"e5", title:"Soil Testing — All Plots",           date:fmt(add(T,7)), type:"other",      plot:"All", notes:"Send to ICAR lab",             done:false },
  { id:"e6", title:"Soybean Second Sowing",              date:fmt(add(T,10)),type:"planting",   plot:"D",   notes:"Variety JS-335",               done:false },
];

export interface Notification { id:string; title:string; body:string; type:"success"|"warning"|"error"|"info"; time:string; read:boolean; }
export const DEFAULT_NOTIFS: Notification[] = [
  { id:"n1", title:"🐛 Pest Alert — South Field",     body:"Fall Armyworm detected. Treat within 48 hours to prevent spread.",          type:"error",   time:"2m ago",  read:false },
  { id:"n2", title:"💧 Critical Moisture — Plot C",   body:"Soil moisture at 24%. Immediate irrigation required.",                       type:"error",   time:"8m ago",  read:false },
  { id:"n3", title:"⛈️ Rain Alert",                   body:"Heavy rain forecast Wed–Thu. Postpone fertilizer application by 48 hours.",  type:"warning", time:"1h ago",  read:false },
  { id:"n4", title:"📈 Soybean Price Up 3.1%",        body:"Current rate ₹4,331/qtl. Above MSP — good time to sell.",                   type:"success", time:"2h ago",  read:false },
  { id:"n5", title:"✅ Auto-Irrigation Complete",     body:"North Field: 45 min cycle completed. Soil moisture now 72%.",               type:"success", time:"3h ago",  read:true  },
  { id:"n6", title:"📦 Low Stock: DAP Fertilizer",    body:"Only 45 kg left. Minimum threshold is 100 kg. Reorder soon.",               type:"warning", time:"5h ago",  read:true  },
];

export function getHealthColor(v:number) { return v>=80?"#10B981":v>=60?"#F59E0B":v>=40?"#F97316":"#F43F5E"; }
export function getMoistureLabel(v:number) { return v>=70?"Optimal":v>=50?"Good":v>=30?"Low":"Critical"; }
export function getMoistureColor(v:number) { return v>=70?"#10B981":v>=50?"#34D399":v>=30?"#F59E0B":"#F43F5E"; }

export const COST_PRESETS: Record<string,{seed:number;fert:number;labor:number;irr:number;pest:number;other:number}> = {
  wheat:   {seed:1200,fert:3500,labor:4500,irr:2000,pest:1200,other:800},
  rice:    {seed:1500,fert:4200,labor:5500,irr:3000,pest:1500,other:1000},
  maize:   {seed:900, fert:3000,labor:3500,irr:1500,pest:1000,other:600},
  soybean: {seed:2000,fert:2800,labor:4000,irr:1800,pest:1800,other:900},
  cotton:  {seed:3000,fert:5000,labor:6000,irr:2500,pest:2500,other:1200},
  onion:   {seed:2500,fert:3500,labor:5000,irr:2000,pest:1500,other:1000},
  tomato:  {seed:3500,fert:4000,labor:6000,irr:2500,pest:2000,other:1500},
  potato:  {seed:8000,fert:4500,labor:5000,irr:2200,pest:1800,other:1100},
};
export const YIELD_DEFAULTS: Record<string,number> = {
  wheat:42,rice:55,maize:48,soybean:18,cotton:15,onion:180,tomato:220,potato:200
};
