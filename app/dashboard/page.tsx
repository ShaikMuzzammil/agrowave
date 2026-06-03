"use client";
// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Page – AgroWave
// Shows: stat cards, field overview, live farm map, health radar, 7-day forecast
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  DropletIcon, Activity, AlertCircle, Sprout, Map,
  Printer, RefreshCw, ChevronRight, Droplets
} from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid
} from "recharts";
import { FARM_PLOTS, FORECAST, RAINFALL_WEEK, ADVISORIES, TOTAL_ACREAGE, AVG_HEALTH, LOW_MOISTURE_PLOTS, ACTIVE_PLOTS } from "@/lib/farmData";

// ── Types ─────────────────────────────────────────────────────────────────
interface LivePlot {
  id: string;
  moisture: number;
  temperature: number;
  health: number;
}

// ── Animated progress ring ───────────────────────────────────────────────
function ProgressRing({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="4"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      <text x={size / 2} y={size / 2 + 1} textAnchor="middle" dominantBaseline="middle"
        className="rotate-90" fill={color} fontSize={size < 50 ? "10" : "12"} fontWeight="700"
        style={{ transform: `rotate(90deg) translate(0, 0)`, transformOrigin: "50% 50%" }}>
      </text>
    </svg>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────
function StatCard({ icon, value, label, sub, color }: {
  icon: React.ReactNode; value: string; label: string; sub?: string; color: string;
}) {
  return (
    <div className="terra-card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900 leading-none">{value}</div>
        <div className="text-sm font-semibold text-slate-700 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

// ── Moisture bar ─────────────────────────────────────────────────────────
function MoistureBar({ value }: { value: number }) {
  const color = value < 30 ? "#ef4444" : value < 60 ? "#f59e0b" : "#22c55e";
  return (
    <div className="moisture-bar-track w-full">
      <div className="moisture-bar-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

// ── Metric mini-bar (health, soil pH, temp) ──────────────────────────────
function MetricBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="moisture-bar-track w-full">
      <div className="moisture-bar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const [liveData, setLiveData] = useState<LivePlot[]>(
    FARM_PLOTS.map((p) => ({ id: p.id, moisture: p.moisture, temperature: p.temperature, health: p.health }))
  );
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [irrigateAll, setIrrigateAll] = useState(false);

  // Simulate real-time updates every 5 seconds
  const refreshData = useCallback(() => {
    setLiveData((prev) =>
      prev.map((d) => ({
        ...d,
        moisture: Math.max(0, Math.min(100, d.moisture + (Math.random() - 0.5) * 4)),
        temperature: Math.max(25, Math.min(42, d.temperature + (Math.random() - 0.5) * 0.8)),
        health: Math.max(30, Math.min(100, d.health + (Math.random() - 0.5) * 2)),
      }))
    );
    setLastUpdate(new Date());
  }, []);

  useEffect(() => {
    const t = setInterval(refreshData, 5000);
    return () => clearInterval(t);
  }, [refreshData]);

  const getLive = (id: string) => liveData.find((d) => d.id === id)!;

  // Radar data
  const radarData = [
    { metric: "Moisture", value: Math.round(liveData.reduce((s, d) => s + d.moisture, 0) / 6) },
    { metric: "Health", value: Math.round(liveData.reduce((s, d) => s + d.health, 0) / 6) },
    { metric: "Growth", value: Math.round(FARM_PLOTS.reduce((s, p) => s + p.completionPercent, 0) / 6) },
    { metric: "Nutrition", value: 76 },
    { metric: "Sunlight", value: 88 },
    { metric: "pH Score", value: 82 },
  ];

  const selectedPlotData = selectedPlot ? FARM_PLOTS.find((p) => p.id === selectedPlot) : null;
  const selectedLive = selectedPlot ? getLive(selectedPlot) : null;

  return (
    <div className="max-w-screen-2xl mx-auto px-4 py-6 space-y-6">
      {/* ── Header row ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Farm Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Updated {lastUpdate.toLocaleTimeString()} · KHARIF 2026 Season
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={refreshData}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 rounded-lg transition-all">
            <RefreshCw size={14} /> Refresh
          </button>
          <Link href="/land"
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all">
            <Map size={14} /> Land View
          </Link>
          <button onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-all">
            <Printer size={14} /> Print Report
          </button>
        </div>
      </div>

      {/* ── Stat cards row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Sprout size={22} className="text-emerald-700" />}
          value={`${TOTAL_ACREAGE} ac`} label="Total Acreage" sub="23.0 acres managed"
          color="bg-emerald-100" />
        <StatCard icon={<Activity size={22} className="text-sky-700" />}
          value={`${AVG_HEALTH}%`} label="Avg Health"
          sub={`${liveData.reduce((s, d) => s + d.health, 0) / 6 > 70 ? "All plots healthy" : "Some plots need attention"}`}
          color="bg-sky-100" />
        <StatCard icon={<DropletIcon size={22} className="text-rose-600" />}
          value={`${LOW_MOISTURE_PLOTS} plots`} label="Low Moisture" sub="Below 30% threshold"
          color="bg-rose-100" />
        <StatCard icon={<AlertCircle size={22} className="text-amber-600" />}
          value="2" label="Active Alerts" sub="Check notifications"
          color="bg-amber-100" />
      </div>

      {/* ── Main grid: Field Overview | Live Farm Map | Radar + Forecast ── */}
      <div className="grid xl:grid-cols-[280px_1fr_300px] gap-5">

        {/* ── Left: Field overview cards ─────────────────────────────── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Field Overview</h2>
            <button
              onClick={() => setIrrigateAll(!irrigateAll)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                irrigateAll
                  ? "bg-sky-600 text-white border-sky-600"
                  : "bg-white text-sky-600 border-sky-200 hover:bg-sky-50"
              }`}>
              <Droplets size={13} /> {irrigateAll ? "Irrigating All" : "Irrigate All"}
            </button>
          </div>

          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {FARM_PLOTS.map((plot) => {
              const live = getLive(plot.id);
              const isSelected = selectedPlot === plot.id;
              return (
                <button
                  key={plot.id}
                  onClick={() => setSelectedPlot(isSelected ? null : plot.id)}
                  className={`w-full text-left terra-card p-4 transition-all cursor-pointer ${
                    isSelected ? "border-emerald-400 shadow-md shadow-emerald-100" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{plot.name}</p>
                      <p className="text-xs text-slate-500">{plot.crop} · {plot.acreage}ac · {plot.stage}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {plot.status === "WARNING" && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full badge-warning">⚠</span>
                      )}
                      <span className={`text-sm font-black px-2.5 py-1 rounded-full text-white`}
                        style={{ background: plot.status === "OPEN" ? "#22c55e" : plot.status === "WARNING" ? "#f59e0b" : "#94a3b8" }}>
                        {Math.round(plot.completionPercent)}%
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 w-12">Soil pH</span>
                      <MetricBar value={plot.soilPH} max={9} color="#22c55e" />
                      <span className="text-slate-600 font-medium w-7 text-right">{plot.soilPH}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 w-12">Health</span>
                      <MetricBar value={live.health} max={100} color="#3b82f6" />
                      <span className="text-slate-600 font-medium w-7 text-right">{Math.round(live.health)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 w-12">Temp</span>
                      <MetricBar value={live.temperature - 20} max={25} color="#f59e0b" />
                      <span className="text-slate-600 font-medium w-7 text-right">{Math.round(live.temperature)}°</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      plot.pestLevel === "low pest" ? "bg-emerald-100 text-emerald-700" :
                      plot.pestLevel === "medium pest" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    }`}>{plot.pestLevel}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      live.health >= 80 ? "bg-emerald-100 text-emerald-700" :
                      live.health >= 60 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"
                    }`}>{live.health >= 80 ? "Optimal" : live.health >= 60 ? "Low" : "Critical"}</span>
                    <span className="text-xs text-slate-400 ml-auto">{plot.irrigationMode}</span>
                  </div>
                </button>
              );
            })}

            {/* Add New Plot button */}
            <Link href="/fields#add-plot"
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all text-sm font-medium">
              + Add New Plot
            </Link>
          </div>
        </div>

        {/* ── Center: Live Farm Map ───────────────────────────────────── */}
        <div className="space-y-5">
          <div className="terra-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="section-title">Live Farm Map</h2>
                <p className="text-xs text-slate-400 mt-0.5">Click any plot for details · Auto-updates every 5s</p>
              </div>
              <Link href="/land" className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-800">
                <Map size={13} /> Full Map
              </Link>
            </div>

            {/* 3×2 plot grid */}
            <div className="grid grid-cols-3 gap-3">
              {FARM_PLOTS.map((plot) => {
                const live = getLive(plot.id);
                const isSelected = selectedPlot === plot.id;
                const moistureColor = live.moisture < 30 ? "#ef4444" : live.moisture < 60 ? "#f59e0b" : "#22c55e";
                return (
                  <button
                    key={plot.id}
                    onClick={() => setSelectedPlot(isSelected ? null : plot.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all hover:-translate-y-0.5 ${
                      plot.status === "OPEN" ? "border-emerald-200 bg-emerald-50/40" :
                      plot.status === "WARNING" ? "border-amber-200 bg-amber-50/40" : "border-slate-200 bg-slate-50"
                    } ${isSelected ? "ring-2 ring-emerald-400 ring-offset-1" : ""}`}
                  >
                    <p className="font-bold text-slate-900 text-sm">{plot.name}</p>
                    <p className="text-xs text-slate-500 mb-3">{plot.crop} · {plot.stage}</p>
                    <div className="moisture-bar-track mb-1">
                      <div className="moisture-bar-fill" style={{ width: `${live.moisture}%`, background: moistureColor }} />
                    </div>
                    <p className="font-bold text-sm" style={{ color: moistureColor }}>
                      {Math.round(live.moisture)}% moisture
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      pH {plot.soilPH} · NPK {plot.npk.n}/{plot.npk.p}/{plot.npk.k}
                    </p>
                    <div className="flex items-center gap-1 mt-2">
                      <span className={`text-[10px] font-bold ${
                        plot.status === "OPEN" ? "text-emerald-600" : plot.status === "WARNING" ? "text-amber-600" : "text-slate-400"
                      }`}>✓ {plot.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected plot detail */}
            {selectedPlotData && selectedLive && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-emerald-800 text-sm">{selectedPlotData.name} – Details</h3>
                  <button onClick={() => setSelectedPlot(null)} className="text-emerald-500 hover:text-emerald-700 text-xs">✕ Close</button>
                </div>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: "Moisture", value: `${Math.round(selectedLive.moisture)}%` },
                    { label: "Temperature", value: `${selectedLive.temperature.toFixed(1)}°C` },
                    { label: "Health", value: `${Math.round(selectedLive.health)}` },
                    { label: "Completion", value: `${selectedPlotData.completionPercent.toFixed(2)}%` },
                  ].map((m) => (
                    <div key={m.label} className="bg-white rounded-lg p-2 border border-emerald-100">
                      <p className="text-xs text-slate-500">{m.label}</p>
                      <p className="font-bold text-slate-900 text-sm">{m.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-emerald-600 mt-2 font-medium">
                  {selectedPlotData.crop} · {selectedPlotData.stage} · {selectedPlotData.acreage}ac
                </p>
              </div>
            )}
          </div>

          {/* Charts row: Rainfall + Temperature */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="terra-card">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Rainfall This Week (mm)</h3>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={RAINFALL_WEEK} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Bar dataKey="mm" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="terra-card">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Temperature (°C)</h3>
              <ResponsiveContainer width="100%" height={130}>
                <LineChart data={FORECAST} margin={{ top: 0, right: 5, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e2e8f0" }} />
                  <Line type="monotone" dataKey="tempMax" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: "#f59e0b" }} name="Max °C" />
                  <Line type="monotone" dataKey="tempMin" stroke="#22c55e" strokeWidth={2} strokeDasharray="4 2" dot={{ r: 3, fill: "#22c55e" }} name="Min °C" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── Right: Radar + Forecast ──────────────────────────────────── */}
        <div className="space-y-4">
          {/* Farm Health Radar */}
          <div className="terra-card">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Farm Health Radar</h3>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "#64748b" }} />
                <Radar name="Farm" dataKey="value" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* 7-day forecast */}
          <div className="terra-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">7-Day Forecast</h3>
              <Link href="/weather" className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center gap-0.5">
                Details <ChevronRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {FORECAST.map((f) => (
                <div key={f.day} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2 w-14">
                    <span className="text-base">{f.icon}</span>
                    <span className="text-xs font-semibold text-slate-700">{f.day}</span>
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="moisture-bar-track">
                      <div className="moisture-bar-fill" style={{ width: `${f.rainChance}%`, background: "#3b82f6" }} />
                    </div>
                  </div>
                  <span className="text-xs text-blue-600 w-12 text-right">{f.rainChance}% rain</span>
                  <span className="text-xs text-slate-600 font-medium w-24 text-right">{f.tempMin}°–{f.tempMax}°C</span>
                </div>
              ))}
            </div>
          </div>

          {/* Land View quick-access */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-500 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Map size={18} />
              <span className="font-bold text-sm">Land View</span>
            </div>
            <p className="text-emerald-100/80 text-xs mb-3 leading-relaxed">
              Visualize all 6 plots on a real satellite-style map with status overlays.
            </p>
            <Link href="/land"
              className="w-full flex items-center justify-center gap-2 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-all">
              Open Land Map <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Advisory section ─────────────────────────────────────────── */}
      <div className="terra-card">
        <h2 className="section-title mb-4 flex items-center gap-2">
          📋 Farm Advisory This Week
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {ADVISORIES.map((a) => (
            <div key={a.id} className={`flex items-start gap-3 p-4 rounded-xl border ${a.color}`}>
              <span className="text-2xl">{a.icon}</span>
              <div>
                <h4 className={`font-bold text-sm ${a.titleColor}`}>{a.type}</h4>
                <p className="text-slate-600 text-sm mt-1 leading-relaxed">{a.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Print-only table ─────────────────────────────────────────── */}
      <div className="hidden print:block">
        <div className="print-header">
          <h1>AgroWave Farm Report – Dashboard</h1>
          <p>KHARIF 2026 · Generated {new Date().toLocaleString()}</p>
        </div>
        <table className="print-table w-full">
          <thead>
            <tr>
              <th>Plot</th><th>Crop</th><th>Stage</th><th>Completion</th>
              <th>Moisture</th><th>Health</th><th>Temp (°C)</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {FARM_PLOTS.map((p) => {
              const live = getLive(p.id);
              return (
                <tr key={p.id}>
                  <td>{p.name}</td><td>{p.crop}</td><td>{p.stage}</td>
                  <td>{p.completionPercent.toFixed(4)}%</td>
                  <td>{Math.round(live.moisture)}%</td>
                  <td>{Math.round(live.health)}</td>
                  <td>{live.temperature.toFixed(2)}</td>
                  <td>{p.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
