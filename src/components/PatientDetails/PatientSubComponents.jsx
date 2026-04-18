import React from "react";

export const InfoItem = ({
  label,
  value,
  isEditing,
  onChange,
  color,
  type = "text",
}) => (
  <div className="p-3 md:p-4 rounded-xl border-2 border-slate-100 bg-white shadow-sm text-left">
    <label className="text-[8px] md:text-[9px] font-bold uppercase text-slate-400 block mb-1 tracking-widest">
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[#556B2F] outline-none text-xs py-1 text-slate-700"
      />
    ) : (
      <p
        className={`text-xs md:text-sm font-medium ${color || "text-slate-700"}`}
      >
        {value || "-"}
      </p>
    )}
  </div>
);

export const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-3 text-[10px] font-bold uppercase tracking-widest relative transition-all ${active ? "text-[#556B2F]" : "text-slate-300"}`}
  >
    {label}{" "}
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#556B2F] rounded-full" />
    )}
  </button>
);

export const InputBlock = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1 text-left">
    <label className="text-[8px] font-bold uppercase text-slate-400">
      {label}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 p-3 rounded-lg outline-none text-[10px] md:text-xs border border-slate-200 focus:border-[#556B2F]"
    />
  </div>
);
