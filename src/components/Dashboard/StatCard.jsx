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
      className={`p-8 rounded-[2.5rem] border transition-all hover:scale-[1.01] ${
        highlight
          ? "bg-olive-base text-white border-transparent shadow-lg shadow-olive-base/20"
          : darkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-100 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div
          className={`p-3 rounded-2xl ${highlight ? "bg-white/20" : "bg-slate-50 dark:bg-slate-800"}`}
        >
          {React.cloneElement(icon, {
            size: 20,
            className: highlight ? "text-white" : icon.props.className,
          })}
        </div>
        <ArrowUpRight
          size={16}
          className={highlight ? "text-white/50" : "text-slate-300"}
        />
      </div>
      <div>
        <p
          className={`text-[11px] font-medium uppercase tracking-[0.2em] mb-1 ${highlight ? "text-white/70" : "text-slate-400"}`}
        >
          {label}
        </p>
        <h2 className="text-3xl font-medium tracking-tight mb-1">{value}</h2>
        <p
          className={`text-[11px] font-normal italic ${highlight ? "text-white/50" : "text-slate-400"}`}
        >
          {subLabel}
        </p>
      </div>
    </div>
  );
}
