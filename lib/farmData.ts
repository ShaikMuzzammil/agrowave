// ─────────────────────────────────────────────────────────────────────────────
// TerraForge AI – AgroWave Smart Farming
// Central data library: plots, forecast, market, inventory, calendar events
// ─────────────────────────────────────────────────────────────────────────────

export type PlotStatus = "OPEN" | "WARNING" | "CLOSED";
export type PestLevel = "low pest" | "medium pest" | "high pest";
export type IrrigationMode = "AUTO" | "MANUAL" | "OFF";

export interface FarmPlot {
  id: string;
  name: string;
  crop: string;
  acreage: number;
  stage: string;
  completionPercent: number;     // precise 15-decimal value
  completionPrecise: string;     // full precision string for hover tooltip
  moisture: number;              // 0–100 %
  health: number;                // 0–100
  temperature: number;           // °C
  soilPH: number;
  npk: { n: number; p: number; k: number };
  pestLevel: PestLevel;
  irrigationMode: IrrigationMode;
  status: PlotStatus;
  growthColor: string;           // Tailwind colour class for the ring
  badgeColor: string;            // colour class for the % badge
  icon: string;                  // emoji
}

export const FARM_PLOTS: FarmPlot[] = [
  {
    id: "north",
    name: "North Field",
    crop: "Wheat",
    acreage: 4.5,
    stage: "Tillering",
    completionPercent: 93.95571812921074,
    completionPrecise: "93.95571812921074%",
    moisture: 91,
    health: 94,
    temperature: 32.14494859727933,
    soilPH: 6.8,
    npk: { n: 142, p: 46, k: 180 },
    pestLevel: "low pest",
    irrigationMode: "AUTO",
    status: "OPEN",
    growthColor: "text-emerald-500",
    badgeColor: "bg-emerald-500",
    icon: "🌾",
  },
  {
    id: "east",
    name: "East Block",
    crop: "Rice",
    acreage: 3.2,
    stage: "Panicle Init.",
    completionPercent: 74.71632610612846,
    completionPrecise: "74.71632610612846%",
    moisture: 49,
    health: 75,
    temperature: 34.02537862205436,
    soilPH: 6.2,
    npk: { n: 118, p: 38, k: 165 },
    pestLevel: "medium pest",
    irrigationMode: "AUTO",
    status: "OPEN",
    growthColor: "text-amber-400",
    badgeColor: "bg-amber-400",
    icon: "🌾",
  },
  {
    id: "west",
    name: "West Block",
    crop: "Soybean",
    acreage: 3.8,
    stage: "Pod Fill",
    completionPercent: 82.18390999790698,
    completionPrecise: "82.18390999790698%",
    moisture: 68,
    health: 80,
    temperature: 30.70496265065706,
    soilPH: 6.5,
    npk: { n: 155, p: 48, k: 195 },
    pestLevel: "low pest",
    irrigationMode: "AUTO",
    status: "OPEN",
    growthColor: "text-emerald-400",
    badgeColor: "bg-emerald-400",
    icon: "🫘",
  },
  {
    id: "south",
    name: "South Field",
    crop: "Cotton",
    acreage: 5.0,
    stage: "Boll Formation",
    completionPercent: 62.98277071487386,
    completionPrecise: "62.98277071487386%",
    moisture: 24,
    health: 58,
    temperature: 32.18191440098626,
    soilPH: 7.1,
    npk: { n: 95, p: 52, k: 140 },
    pestLevel: "high pest",
    irrigationMode: "MANUAL",
    status: "WARNING",
    growthColor: "text-rose-400",
    badgeColor: "bg-rose-400",
    icon: "🌿",
  },
  {
    id: "central",
    name: "Central Plot",
    crop: "Maize",
    acreage: 4.0,
    stage: "Silking",
    completionPercent: 88.52486644323442,
    completionPrecise: "88.52486644323442%",
    moisture: 57,
    health: 82,
    temperature: 31.780284196936054,
    soilPH: 6.9,
    npk: { n: 133, p: 42, k: 175 },
    pestLevel: "low pest",
    irrigationMode: "AUTO",
    status: "OPEN",
    growthColor: "text-yellow-400",
    badgeColor: "bg-yellow-400",
    icon: "🌽",
  },
  {
    id: "border",
    name: "Border Strip",
    crop: "Onion",
    acreage: 2.5,
    stage: "Bulb Dev.",
    completionPercent: 77.83659463739020,
    completionPrecise: "77.83659463739020%",
    moisture: 62,
    health: 91,
    temperature: 29.567390526484544,
    soilPH: 6.4,
    npk: { n: 148, p: 55, k: 188 },
    pestLevel: "low pest",
    irrigationMode: "AUTO",
    status: "OPEN",
    growthColor: "text-purple-400",
    badgeColor: "bg-purple-400",
    icon: "🧅",
  },
];

export const TOTAL_ACREAGE = FARM_PLOTS.reduce((s, p) => s + p.acreage, 0);
export const AVG_HEALTH = Math.round(
  FARM_PLOTS.reduce((s, p) => s + p.health, 0) / FARM_PLOTS.length
);
export const LOW_MOISTURE_PLOTS = FARM_PLOTS.filter((p) => p.moisture < 30).length;
export const ACTIVE_PLOTS = FARM_PLOTS.filter((p) => p.status !== "CLOSED").length;

// ── 7-Day Forecast ──────────────────────────────────────────────────────────
export interface ForecastDay {
  day: string;
  icon: string;
  rainChance: number;
  tempMin: number;
  tempMax: number;
  desc: string;
}

export const FORECAST: ForecastDay[] = [
  { day: "Today", icon: "🌤️", rainChance: 10, tempMin: 24, tempMax: 36, desc: "Mostly sunny" },
  { day: "Tue",   icon: "🌧️", rainChance: 55, tempMin: 23, tempMax: 34, desc: "Moderate rain" },
  { day: "Wed",   icon: "⛈️", rainChance: 80, tempMin: 22, tempMax: 32, desc: "Thunderstorms" },
  { day: "Thu",   icon: "🌦️", rainChance: 35, tempMin: 23, tempMax: 33, desc: "Cloudy spells" },
  { day: "Fri",   icon: "🌤️", rainChance: 5,  tempMin: 24, tempMax: 35, desc: "Clearing up" },
  { day: "Sat",   icon: "☀️", rainChance: 0,  tempMin: 26, tempMax: 37, desc: "Sunny & dry" },
  { day: "Sun",   icon: "☀️", rainChance: 0,  tempMin: 27, tempMax: 38, desc: "Sunny & dry" },
];

// ── Rainfall this week (mm) ─────────────────────────────────────────────────
export const RAINFALL_WEEK = [
  { day: "Mon", mm: 0 },
  { day: "Tue", mm: 5 },
  { day: "Wed", mm: 22 },
  { day: "Thu", mm: 8 },
  { day: "Fri", mm: 0 },
  { day: "Sat", mm: 0 },
  { day: "Sun", mm: 0 },
];

// ── Market prices ────────────────────────────────────────────────────────────
export interface CropPrice {
  id: string;
  name: string;
  icon: string;
  price: number;       // ₹ per quintal
  change: number;      // absolute change today
  changePct: number;   // % change today
  msp: number;         // Minimum Support Price
  trend: number[];     // 7-day price trend
}

export const MARKET_PRICES: CropPrice[] = [
  { id: "wheat",   name: "WHEAT",   icon: "🌾", price: 2250, change: +15,  changePct: +0.67, msp: 2150, trend: [2180,2200,2210,2195,2220,2235,2250] },
  { id: "rice",    name: "RICE",    icon: "🌾", price: 2100, change: -20,  changePct: -0.94, msp: 2060, trend: [2150,2140,2130,2125,2120,2120,2100] },
  { id: "maize",   name: "MAIZE",   icon: "🌽", price: 1890, change: +8,   changePct: +0.42, msp: 1870, trend: [1860,1865,1870,1875,1880,1882,1890] },
  { id: "soybean", name: "SOYBEAN", icon: "🫘", price: 4100, change: +50,  changePct: +1.24, msp: 3950, trend: [4000,4020,4040,4055,4060,4050,4100] },
  { id: "cotton",  name: "COTTON",  icon: "🌿", price: 6800, change: -100, changePct: -1.45, msp: 6620, trend: [6950,6920,6900,6880,6850,6900,6800] },
  { id: "onion",   name: "ONION",   icon: "🧅", price: 1200, change: +30,  changePct: +2.56, msp: 1000, trend: [1100,1120,1140,1150,1160,1170,1200] },
  { id: "tomato",  name: "TOMATO",  icon: "🍅", price: 3500, change: +200, changePct: +6.06, msp: 0,    trend: [2800,2900,3000,3100,3200,3300,3500] },
  { id: "potato",  name: "POTATO",  icon: "🥔", price: 1050, change: -20,  changePct: -1.87, msp: 0,    trend: [1100,1090,1080,1075,1070,1060,1050] },
];

// ── Inventory ────────────────────────────────────────────────────────────────
export type InventoryCategory = "Seeds" | "Fertilizer" | "Pesticides" | "Fuel" | "Tools" | "Other";

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  inStock: number;
  unit: string;
  minThreshold: number;
  costPerUnit: number;
  lastUsed: string;
  isLow: boolean;
}

export const INVENTORY: InventoryItem[] = [
  { id: "i1",  name: "Wheat Seeds (Variety HD-2967)", category: "Seeds",      inStock: 120, unit: "kg",  minThreshold: 50,  costPerUnit: 65,   lastUsed: "3d ago", isLow: false },
  { id: "i2",  name: "Paddy Seeds (PR-126)",          category: "Seeds",      inStock: 80,  unit: "kg",  minThreshold: 40,  costPerUnit: 72,   lastUsed: "1d ago", isLow: false },
  { id: "i3",  name: "Maize Seeds (NK-6240)",         category: "Seeds",      inStock: 35,  unit: "kg",  minThreshold: 30,  costPerUnit: 90,   lastUsed: "7d ago", isLow: false },
  { id: "i4",  name: "DAP Fertilizer",                category: "Fertilizer", inStock: 8,   unit: "bags",minThreshold: 10,  costPerUnit: 1350, lastUsed: "2d ago", isLow: true  },
  { id: "i5",  name: "Urea (46% N)",                  category: "Fertilizer", inStock: 25,  unit: "bags",minThreshold: 15,  costPerUnit: 280,  lastUsed: "5d ago", isLow: false },
  { id: "i6",  name: "Potash (MOP)",                  category: "Fertilizer", inStock: 15,  unit: "bags",minThreshold: 10,  costPerUnit: 780,  lastUsed: "4d ago", isLow: false },
  { id: "i7",  name: "Chlorpyrifos 20% EC",           category: "Pesticides", inStock: 18,  unit: "L",   minThreshold: 20,  costPerUnit: 280,  lastUsed: "5d ago", isLow: true  },
  { id: "i8",  name: "Mancozeb 75% WP",               category: "Pesticides", inStock: 12,  unit: "kg",  minThreshold: 5,   costPerUnit: 320,  lastUsed: "6d ago", isLow: false },
  { id: "i9",  name: "Glyphosate 41% SL",             category: "Pesticides", inStock: 6,   unit: "L",   minThreshold: 4,   costPerUnit: 450,  lastUsed: "10d ago",isLow: false },
  { id: "i10", name: "Diesel Fuel",                   category: "Fuel",       inStock: 180, unit: "L",   minThreshold: 100, costPerUnit: 97,   lastUsed: "1d ago", isLow: false },
  { id: "i11", name: "Tractor Engine Oil",            category: "Fuel",       inStock: 15,  unit: "L",   minThreshold: 10,  costPerUnit: 350,  lastUsed: "8d ago", isLow: false },
  { id: "i12", name: "Irrigation Pipes (1 inch)",     category: "Tools",      inStock: 45,  unit: "pcs", minThreshold: 20,  costPerUnit: 120,  lastUsed: "14d ago",isLow: false },
  { id: "i13", name: "Drip Emitters",                 category: "Tools",      inStock: 200, unit: "pcs", minThreshold: 100, costPerUnit: 12,   lastUsed: "3d ago", isLow: false },
  { id: "i14", name: "Hand Sprayer (16L)",             category: "Tools",      inStock: 4,   unit: "pcs", minThreshold: 2,   costPerUnit: 850,  lastUsed: "2d ago", isLow: false },
];

// ── Calendar Events ──────────────────────────────────────────────────────────
export interface CalendarEvent {
  id: string;
  date: string;          // ISO date string
  title: string;
  category: "irrigation" | "fertilizer" | "pesticide" | "harvest" | "inspection" | "market";
  plot?: string;
  priority: "high" | "medium" | "low";
  notes: string;
}

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "e1",  date: "2026-06-03", title: "Irrigation – North Field",     category: "irrigation",  plot: "north",   priority: "high",   notes: "92% moisture – delay if rain ≥ 10mm" },
  { id: "e2",  date: "2026-06-03", title: "Pest Inspection – South Field",category: "inspection",  plot: "south",   priority: "high",   notes: "High armyworm risk" },
  { id: "e3",  date: "2026-06-04", title: "DAP Application – East Block", category: "fertilizer",  plot: "east",    priority: "medium", notes: "Skip if Wednesday rains continue" },
  { id: "e4",  date: "2026-06-05", title: "Rain Day – No irrigation",     category: "irrigation",  plot: undefined, priority: "low",    notes: "80% rain probability – auto-pause all irrigation" },
  { id: "e5",  date: "2026-06-06", title: "Chlorpyrifos Application",     category: "pesticide",   plot: "south",   priority: "high",   notes: "Post-rain pest control" },
  { id: "e6",  date: "2026-06-07", title: "Soybean Harvest Check",        category: "harvest",     plot: "west",    priority: "medium", notes: "Pod fill 82% – 5-7 days to harvest" },
  { id: "e7",  date: "2026-06-08", title: "Market Visit – Wheat",         category: "market",      plot: "north",   priority: "low",    notes: "Check MSP rates at APMC" },
  { id: "e8",  date: "2026-06-09", title: "Onion Harvest Prep",           category: "harvest",     plot: "border",  priority: "medium", notes: "Stop irrigation 7 days before harvest" },
  { id: "e9",  date: "2026-06-10", title: "Maize Detasseling",            category: "inspection",  plot: "central", priority: "medium", notes: "Silking stage – inspect for smut" },
  { id: "e10", date: "2026-06-12", title: "Cotton Scouting",              category: "inspection",  plot: "south",   priority: "high",   notes: "Boll weevil monitoring" },
];

// ── Advisory messages ───────────────────────────────────────────────────────
export const ADVISORIES = [
  {
    id: "a1",
    icon: "💧",
    type: "Irrigation Advisory",
    message: "Rain expected Wed–Thu. Skip irrigation for North Field and West Block on Tuesday. Save approx ₹800 in water costs.",
    color: "bg-sky-50 border-sky-200",
    titleColor: "text-sky-700",
  },
  {
    id: "a2",
    icon: "🐛",
    type: "Post-Rain Pest Risk",
    message: "High armyworm activity expected after rains. Inspect South Field on Friday morning. Keep chlorpyrifos ready.",
    color: "bg-rose-50 border-rose-200",
    titleColor: "text-rose-700",
  },
  {
    id: "a3",
    icon: "🌱",
    type: "Fertilizer Timing",
    message: "Do NOT apply DAP until after the rain cycle (Thu). Apply Friday–Saturday morning for best soil uptake and absorption.",
    color: "bg-amber-50 border-amber-200",
    titleColor: "text-amber-700",
  },
  {
    id: "a4",
    icon: "🌾",
    type: "Harvest Opportunity",
    message: "Dry window Fri–Sun is ideal for soybean harvest. Schedule combine now – forecast shows 0% rain probability those days.",
    color: "bg-emerald-50 border-emerald-200",
    titleColor: "text-emerald-700",
  },
];

// ── Land threshold defaults ─────────────────────────────────────────────────
export interface LandThresholds {
  minHealth: number;
  minMoisture: number;
  maxPestLevel: number;   // 0=low, 1=medium, 2=high
  minPH: number;
  maxPH: number;
  minRainfall: number;    // mm/week
}

export const DEFAULT_THRESHOLDS: LandThresholds = {
  minHealth: 60,
  minMoisture: 30,
  maxPestLevel: 1,        // allow up to "medium pest"
  minPH: 5.5,
  maxPH: 7.5,
  minRainfall: 0,
};
