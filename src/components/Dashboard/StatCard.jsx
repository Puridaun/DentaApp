import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  icon,
  label,
  value,
  subLabel,
  darkMode,
  highlight,
}) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] ${
        highlight
          ? "bg-olive-base/5 border-olive-base/20"
          : darkMode
            ? "bg-text-main border-slate-800 text-white"
            : "bg-white border-slate-50 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
          {icon}
        </div>
        <ArrowUpRight size={16} className="text-slate-300" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">
          {label}
        </p>
        <h2 className="text-3xl font-bold tracking-tight mb-1">{value}</h2>
        <p className="text-[10px] font-medium text-text-muted italic">
          {subLabel}
        </p>
      </div>
    </div>
  );
}
