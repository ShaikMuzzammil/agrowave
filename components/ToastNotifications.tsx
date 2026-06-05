"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Notification } from "@/lib/utils";

const icons = { success:CheckCircle2, warning:AlertTriangle, error:XCircle, info:Info };
const colors = { success:"#10B981", warning:"#F59E0B", error:"#F43F5E", info:"#3B82F6" };
const bg     = { success:"#ECFDF5", warning:"#FFFBEB", error:"#FFF1F2", info:"#EFF6FF" };

export default function ToastNotifications() {
  const { notifications, markRead } = useStore();
  const [visible, setVisible] = useState<Notification[]>([]);

  // Show new unread notifs as toasts (max 3 at once)
  useEffect(() => {
    const fresh = notifications.filter(n=>!n.read).slice(0,3);
    if (fresh.length === 0) return;
    setVisible(fresh);
    const t = setTimeout(() => {
      fresh.forEach(n=>markRead(n.id));
      setVisible([]);
    }, 5000);
    return () => clearTimeout(t);
  }, [notifications.length]); // eslint-disable-line

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-[360px] w-full">
      <AnimatePresence>
        {visible.map(n => {
          const Icon = icons[n.type];
          return (
            <motion.div key={n.id}
              initial={{ x:120, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:120, opacity:0 }}
              transition={{ type:"spring", damping:20, stiffness:300 }}
              className="flex items-start gap-3 p-4 rounded-2xl shadow-float border"
              style={{ background:bg[n.type], borderColor:colors[n.type]+"33" }}>
              <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{color:colors[n.type]}}/>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm leading-snug">{n.title}</p>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{n.body}</p>
              </div>
              <button onClick={() => { markRead(n.id); setVisible(p=>p.filter(x=>x.id!==n.id)); }}
                className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4"/>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
