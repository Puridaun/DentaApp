import React from "react";

export const InfoItem = ({
  label,
  value,
  isEditing,
  onChange,
  color,
  type = "text",
}) => (
  <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm text-left w-full">
    <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1.5 tracking-widest">
      {label}
    </label>
    {isEditing ? (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-olive-base outline-none text-sm py-1 text-slate-700"
      />
    ) : (
      <p
        className={`text-sm font-medium break-all ${color || "text-slate-700"}`}
      >
        {value || "-"}
      </p>
    )}
  </div>
);

// TAB-URI UNIFORMIZATE: Font, Size și Tracking identic
export const TabBtn = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={`pb-4 px-2 text-sm md:text-[13px] font-bold uppercase tracking-[0.15em] relative transition-all whitespace-nowrap ${
      active ? "text-olive-base" : "text-slate-400 hover:text-slate-600"
    }`}
  >
    {label}
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-1 bg-olive-base rounded-full" />
    )}
  </button>
);

export const InputBlock = ({ label, value, onChange, type = "text" }) => (
  <div className="space-y-1.5 text-left w-full">
    <label className="text-[9px] font-bold uppercase text-slate-500 tracking-widest">
      {label}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-slate-50 p-4 rounded-xl outline-none text-sm border border-slate-200 focus:border-olive-base transition-all"
    />
  </div>
);
