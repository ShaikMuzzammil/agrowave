"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X, Lightbulb } from "lucide-react";
import { useStore } from "@/lib/store";
import { usePathname } from "next/navigation";
import type { Notification } from "@/lib/utils";

const icons  = { success:CheckCircle2, warning:AlertTriangle, error:XCircle, info:Info, tip:Lightbulb };
const colors = { success:"#10B981", warning:"#F59E0B", error:"#F43F5E", info:"#3B82F6", tip:"#8B5CF6" };
const bgs    = { success:"#ECFDF5", warning:"#FFFBEB", error:"#FFF1F2", info:"#EFF6FF", tip:"#F5F3FF" };

const PAGE_HINTS: Record<string, { title: string; body: string; type: string }[]> = {
  "/dashboard": [
    { title: "📊 Dashboard Overview", body: "Click any field card on the left to see detailed soil health. Use 'Irrigate All' to water all plots at once.", type: "tip" },
  ],
  "/field-monitor": [
    { title: "🌾 Field Monitor Tips", body: "Select a plot from the list to view detailed analytics. Click '+ Add New Plot' to add a custom field.", type: "tip" },
  ],
  "/inventory": [
    { title: "📦 Inventory Hub", body: "Use the category filter pills to sort by Seeds, Fertilizer, Tools etc. Click +/– to adjust stock levels.", type: "tip" },
  ],
  "/market": [
    { title: "📈 Market Intelligence", body: "Switch tabs to access Live Prices, P&L Calculator, Mandi Rates, and Price Alerts all in one place.", type: "tip" },
  ],
  "/weather": [
    { title: "🌦️ Weather Station", body: "7-day forecast is specific to your farm location. Check before scheduling irrigation or pesticide sprays.", type: "tip" },
  ],
  "/calendar": [
    { title: "📅 Farm Calendar", body: "Schedule tasks like irrigation, spraying, and harvests. Completed tasks are marked in green.", type: "tip" },
  ],
  "/land": [
    { title: "🗺️ Land View", body: "Click any plot tile to see detailed sensor data. Toggle the Terrain overlay to view elevation layers.", type: "tip" },
  ],
  "/contact": [
    { title: "✉️ Contact Support", body: "Messages are sent directly to the AgroWave team via email. Expect a reply within 24 hours.", type: "tip" },
  ],
};

export default function ToastNotifications() {
  const { notifications, markRead } = useStore();
  const [visible, setVisible] = useState<(Notification & { _tipId?: string })[]>([]);
  const [shownPages, setShownPages] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const dismiss = useCallback((id: string) => {
    setVisible(p => p.filter(x => x.id !== id && x._tipId !== id));
    markRead(id);
  }, [markRead]);

  // Show page-specific hint once per route visit
  useEffect(() => {
    if (!pathname || shownPages.has(pathname)) return;
    const hints = PAGE_HINTS[pathname];
    if (!hints?.length) return;
    const tipId = `tip-${pathname}-${Date.now()}`;
    const fake: Notification & { _tipId?: string } = {
      id: tipId, _tipId: tipId,
      title: hints[0].title, body: hints[0].body,
      type: hints[0].type as any, time: "just now", ts: Date.now(), read: false,
    };
    setShownPages(p => new Set(Array.from(p).concat([pathname])));
    const delay = setTimeout(() => {
      setVisible(p => [...p.slice(-2), fake]);
      setTimeout(() => setVisible(p => p.filter(x => x._tipId !== tipId)), 6000);
    }, 800);
    return () => clearTimeout(delay);
  }, [pathname, shownPages]);

  // Show store notifications as toasts
  useEffect(() => {
    const fresh = notifications.filter(n => !n.read).slice(0, 2);
    if (!fresh.length) return;
    setVisible(prev => {
      const existing = new Set(prev.map(x => x.id));
      const newOnes = fresh.filter(n => !existing.has(n.id));
      if (!newOnes.length) return prev;
      return [...prev.slice(-2), ...newOnes];
    });
    const t = setTimeout(() => {
      fresh.forEach(n => markRead(n.id));
      setVisible(p => p.filter(x => !fresh.find(f => f.id === x.id)));
    }, 5000);
    return () => clearTimeout(t);
  }, [notifications.length]); // eslint-disable-line

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-[360px] w-full pointer-events-none">
      <AnimatePresence>
        {visible.map(n => {
          const type = (n.type as keyof typeof icons) in icons ? n.type as keyof typeof icons : "info";
          const Icon = icons[type];
          return (
            <motion.div key={n.id}
              initial={{ x: 120, opacity: 0, scale: 0.92 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 120, opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="flex items-start gap-3 p-4 rounded-2xl pointer-events-auto"
              style={{
                background: bgs[type] || "#EFF6FF",
                borderLeft: `4px solid ${colors[type]}`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
                border: `1px solid ${colors[type]}30`,
                borderLeftWidth: "4px",
                borderLeftStyle: "solid",
                borderLeftColor: colors[type],
              }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${colors[type]}20` }}>
                <Icon className="w-4 h-4 flex-shrink-0" style={{ color: colors[type] }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm leading-snug">{n.title}</p>
                <p className="text-slate-500 text-xs mt-1 leading-relaxed">{n.body}</p>
              </div>
              <button
                onClick={() => dismiss(n.id)}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/8 text-slate-400 hover:text-slate-600 transition-colors mt-0.5">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
