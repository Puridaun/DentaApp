import React from "react";

export const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-4 px-1 text-[11px] md:text-[13px] font-medium uppercase tracking-[0.15em] relative transition-all whitespace-nowrap ${
      active ? "text-[#556B2F]" : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#556B2F] rounded-full animate-in fade-in duration-300" />
    )}
  </button>
);

export const InfoItem = ({ label, value, color, darkMode }) => (
  <div
    className={`p-4 rounded-2xl border transition-all ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"} text-left w-full`}
  >
    <label className="text-[9px] font-medium uppercase text-slate-400 block mb-1 tracking-widest">
      {label}
    </label>
    <p
      className={`text-[13px] font-normal truncate ${color || "text-slate-600"}`}
    >
      {value || "-"}
    </p>
  </div>
);

export const InputBlock = ({
  label,
  value,
  onChange,
  type = "text",
  darkMode,
}) => (
  <div className="space-y-2 text-left w-full">
    <label className="text-[9px] font-medium uppercase text-slate-400 tracking-[0.2em] ml-1">
      {label}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-4 rounded-2xl outline-none text-[13px] border transition-all ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white focus:border-[#556B2F]"
          : "bg-slate-50 border-slate-100 text-slate-700 focus:border-[#556B2F]"
      }`}
    />
  </div>
);
