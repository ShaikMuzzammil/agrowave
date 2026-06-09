import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Plot, DEFAULT_PLOTS, InventoryItem, DEFAULT_INV,
  FarmEvent, DEFAULT_EVENTS, Notification, DEFAULT_NOTIFS
} from "./utils";

interface Store {
  plots: Plot[];
  inventory: InventoryItem[];
  events: FarmEvent[];
  notifications: Notification[];
  farmName: string;
  unreadCount: number;

  // Plots
  updateMoisture: (id:string, v:number) => void;
  setField: (id:string, f:string, v:any) => void;
  irrigate: (id:string) => void;
  irrigateAll: () => void;
  toggleAutoIrr: (id:string) => void;
  addPlot: (p:Plot) => void;
  deletePlot: (id:string) => void;

  // Inventory
  addItem: (i:InventoryItem) => void;
  adjustStock: (id:string, delta:number) => void;
  deleteItem: (id:string) => void;

  // Events
  addEvent: (e:FarmEvent) => void;
  toggleEvent: (id:string) => void;
  deleteEvent: (id:string) => void;

  // Notifications
  pushNotif: (n:Omit<Notification,"id"|"read">) => void;
  markRead: (id:string) => void;
  markAllRead: () => void;
  clearNotifs: () => void;

  setFarmName: (s:string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      plots: DEFAULT_PLOTS,
      inventory: DEFAULT_INV,
      events: DEFAULT_EVENTS,
      notifications: DEFAULT_NOTIFS,
      farmName: "AgroWave Farm",
      get unreadCount() { return get().notifications.filter(n=>!n.read).length; },

      updateMoisture: (id, v) => set(s=>({ plots: s.plots.map(p=>
        p.id===id ? {...p, moisture:Math.max(5,Math.min(95,v)), health: v<30?Math.min(p.health,55):v<50?Math.min(p.health,75):p.health } : p
      )})),

      setField: (id, f, v) => set(s=>({ plots: s.plots.map(p=>p.id===id?{...p,[f]:v}:p) })),

      irrigate: (id) => {
        const plot = get().plots.find(p=>p.id===id);
        if(!plot) return;
        set(s=>({ plots: s.plots.map(p=>p.id===id ? {...p, moisture:Math.min(92,p.moisture+18), lastWatered:"just now", health:Math.min(98,p.health+4)} : p) }));
        get().pushNotif({ title:`💧 Irrigation Complete — ${plot.name}`, body:`Soil moisture now ${Math.min(92,plot.moisture+18)}%. Health improved.`, type:"success", time:"just now" });
      },

      irrigateAll: () => {
        set(s=>({ plots: s.plots.map(p=>({...p, moisture:Math.min(92,p.moisture+14), lastWatered:"just now"})) }));
        get().pushNotif({ title:"💧 Mass Irrigation Complete", body:"All 6 plots irrigated successfully. Average moisture +14%.", type:"success", time:"just now" });
      },

      toggleAutoIrr: (id) => set(s=>({ plots: s.plots.map(p=>p.id===id?{...p,autoIrr:!p.autoIrr}:p) })),

      addPlot: (p) => set(s=>({ plots:[...s.plots,p] })),
      deletePlot: (id) => set(s=>({ plots:s.plots.filter(p=>p.id!==id) })),

      addItem: (i) => set(s=>({ inventory:[...s.inventory,i] })),
      adjustStock: (id, delta) => set(s=>({ inventory:s.inventory.map(i=>i.id===id?{...i,qty:Math.max(0,i.qty+delta)}:i) })),
      deleteItem: (id) => set(s=>({ inventory:s.inventory.filter(i=>i.id!==id) })),

      addEvent: (e) => set(s=>({ events:[...s.events,e] })),
      toggleEvent: (id) => set(s=>({ events:s.events.map(e=>e.id===id?{...e,done:!e.done}:e) })),
      deleteEvent: (id) => set(s=>({ events:s.events.filter(e=>e.id!==id) })),

      pushNotif: (n) => {
        const notif:Notification = { ...n, id:Date.now().toString(), read:false };
        set(s=>({ notifications:[notif,...s.notifications].slice(0,30) }));
      },
      markRead: (id) => set(s=>({ notifications:s.notifications.map(n=>n.id===id?{...n,read:true}:n) })),
      markAllRead: () => set(s=>({ notifications:s.notifications.map(n=>({...n,read:true})) })),
      clearNotifs: () => set({ notifications:[] }),

      setFarmName: (s) => set({ farmName:s }),
    }),
    { name:"agrowave-v2" }
  )
);
