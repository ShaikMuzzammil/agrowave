"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info, XCircle, Bell } from "lucide-react";
import { useStore } from "@/lib/store";
import { usePathname } from "next/navigation";

const SECTION_INTROS: Record<string, {title:string; body:string; icon:string; color:string}> = {
  "/dashboard":      {title:"📊 Welcome to Dashboard",     body:"Your farm's live data is active. All 6 plots are being monitored.",        icon:"📊", color:"#059669"},
  "/field-monitor":  {title:"🌱 Field Monitor Active",      body:"Click any plot card to see detailed soil data, NPK levels, and 7-day trends.",icon:"🌱", color:"#059669"},
  "/weather":        {title:"🌦️ Weather Intelligence",      body:"Live hyper-local forecasts for all 6 farm plots loaded successfully.",      icon:"🌦️", color:"#3B82F6"},
  "/market":         {title:"📈 Market Data Live",          body:"MSP + mandi rates from 600+ markets. Use the P&L calculator for profitability.",icon:"📈", color:"#F59E0B"},
  "/inventory":      {title:"📦 Inventory Hub",             body:"Track seeds, fertilizers, and tools. Low-stock alerts are active.",          icon:"📦", color:"#8B5CF6"},
  "/calendar":       {title:"📅 Farm Calendar",             body:"Schedule irrigation, spraying and harvests. Reminders are ready.",           icon:"📅", color:"#EC4899"},
  "/contact":        {title:"📬 Contact Support",           body:"Send a message — our team replies within 24 hours.",                        icon:"📬", color:"#059669"},
  "/land":           {title:"🗺️ land Dashboard",            body:"Smart section management with real-time satellite view and threshold controls.",icon:"🗺️", color:"#059669"},
  "/about":          {title:"ℹ️ About AgroWave",            body:"Learn how AgroWave empowers Indian farmers with data-driven decisions.",      icon:"ℹ️", color:"#64748B"},
};

export default function ToastNotifications() {
  const { notifications, markRead } = useStore();
  const [visible, setVisible] = useState<string[]>([]);
  const [introShown, setIntroShown] = useState<string|null>(null);
  const pathname = usePathname();

  // Show section intro toast on navigation
  useEffect(() => {
    if (introShown === pathname) return;
    const intro = SECTION_INTROS[pathname];
    if (!intro) return;
    const id = `intro-${pathname}-${Date.now()}`;
    setIntroShown(pathname);
    const t = setTimeout(() => {
      setVisible(v => [...v.slice(-3), id]);
      setTimeout(() => setVisible(v => v.filter(x=>x!==id)), 5000);
    }, 800);
    return () => clearTimeout(t);
  }, [pathname, introShown]);

  // Show new unread notifications
  useEffect(() => {
    const unread = notifications.filter(n => !n.read && !visible.includes(n.id));
    unread.slice(0,3).forEach(n => {
      setVisible(v => [...v.slice(-3), n.id]);
      setTimeout(() => {
        setVisible(v => v.filter(x=>x!==n.id));
        markRead(n.id);
      }, 5000);
    });
  }, [notifications]);

  const toasts = notifications.filter(n => visible.includes(n.id)).slice(-4);
  const introToast = visible.filter(v => v.startsWith("intro-")).map(id => ({
    id,
    type: "info" as const,
    ...SECTION_INTROS[pathname],
  }));

  const allToasts = [
    ...introToast,
    ...toasts.map(n => ({
      id: n.id,
      title: n.title,
      body: n.body,
      type: n.type,
      color: n.type==="success"?"#059669":n.type==="warning"?"#D97706":n.type==="error"?"#DC2626":"#3B82F6",
      icon: n.type==="success"?"✅":n.type==="warning"?"⚠️":n.type==="error"?"🚨":"ℹ️",
    })),
  ].slice(-4);

  return (
    <div className="fixed bottom-6 right-6 z-[200] space-y-3 max-w-sm w-full pointer-events-none no-print">
      <AnimatePresence>
        {allToasts.map((t, i) => (
          <motion.div key={t.id}
            initial={{opacity:0,x:60,scale:.92}}
            animate={{opacity:1,x:0,scale:1}}
            exit={{opacity:0,x:60,scale:.88}}
            transition={{type:"spring",damping:22,stiffness:260}}
            className="pointer-events-auto"
            style={{
              background:"#fff",
              border:`1.5px solid ${t.color}40`,
              borderRadius:16,
              boxShadow:`0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px ${t.color}20`,
              overflow:"hidden",
            }}>
            <div className="flex gap-3 p-4">
              <span className="text-xl flex-shrink-0 mt-0.5">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm leading-tight">{t.title}</p>
                {t.body && <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-2">{t.body}</p>}
              </div>
              <button
                onClick={()=>setVisible(v=>v.filter(x=>x!==t.id))}
                className="text-slate-300 hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5">
                <X className="w-4 h-4"/>
              </button>
            </div>
            {/* Progress bar */}
            <div className="h-0.5 w-full" style={{background:`${t.color}20`}}>
              <motion.div initial={{width:"100%"}} animate={{width:"0%"}} transition={{duration:5,ease:"linear"}}
                className="h-full" style={{background:t.color}}/>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
