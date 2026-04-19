import React from "react";
import { X, Check, Loader2 } from "lucide-react";

const COLOR_OPTIONS = [
  { id: "violet", hex: "#E6E6FA", bg: "bg-[#E6E6FA]" },
  { id: "albastru", hex: "#F0F8FF", bg: "bg-[#F0F8FF]" },
  { id: "verde", hex: "#F5FFFA", bg: "bg-[#F5FFFA]" },
  { id: "piersica", hex: "#FFF5EE", bg: "bg-[#FFF5EE]" },
  { id: "roz", hex: "#FFF0F5", bg: "bg-[#FFF0F5]" },
];

export default function EditStaffModal({
  member,
  setMember,
  onSave,
  onClose,
  saving,
  darkMode,
}) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all">
      <div
        className={`w-full max-w-md p-6 md:p-8 rounded-[2rem] shadow-2xl border animate-in fade-in zoom-in duration-200 ${
          darkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-100 text-slate-900"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold tracking-tight uppercase">
            Editează Medic
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "hover:bg-slate-800 text-slate-400"
                : "hover:bg-slate-50 text-slate-400"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputBlock
              label="Nume"
              value={member.last_name}
              onChange={(v) => setMember({ ...member, last_name: v })}
              darkMode={darkMode}
            />
            <InputBlock
              label="Prenume"
              value={member.first_name}
              onChange={(v) => setMember({ ...member, first_name: v })}
              darkMode={darkMode}
            />
          </div>
          <InputBlock
            label="Specializare"
            value={member.specialization}
            onChange={(v) => setMember({ ...member, specialization: v })}
            darkMode={darkMode}
          />
          <InputBlock
            label="Telefon"
            value={member.phone}
            onChange={(v) => setMember({ ...member, phone: v })}
            darkMode={darkMode}
          />

          <div className="space-y-3 pt-2">
            <label className="text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Culoare Identitate
            </label>
            <div className="flex flex-wrap gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.id}
                  onClick={() =>
                    setMember({ ...member, color_preference: color.hex })
                  }
                  className={`w-9 h-9 rounded-xl border-2 transition-all ${color.bg} ${
                    member.color_preference === color.hex
                      ? darkMode
                        ? "border-white scale-110 shadow-lg"
                        : "border-slate-800 scale-110 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={onSave}
            disabled={saving}
            className="w-full bg-[#556B2F] hover:bg-[#6B8441] text-white py-4 rounded-2xl font-bold text-[13px] uppercase tracking-[0.15em] shadow-lg shadow-[#556B2F]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Check size={18} />
            )}
            Actualizează Datele
          </button>
        </div>
      </div>
    </div>
  );
}

function InputBlock({ label, value, onChange, darkMode }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-b-2 py-2 outline-none transition-all text-sm font-medium ${
          darkMode
            ? "text-white border-slate-800 focus:border-[#556B2F]"
            : "text-slate-900 border-slate-100 focus:border-[#556B2F]"
        }`}
      />
    </div>
  );
}
