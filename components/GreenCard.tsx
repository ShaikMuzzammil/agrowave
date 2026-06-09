"use client";
import { cn } from "@/lib/utils";

export default function GreenCard({ children, className, hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cn("glass-card relative overflow-hidden metric-card", hover && "transition-all hover:-translate-y-0.5", className)}>
      {children}
    </div>
  );
}
