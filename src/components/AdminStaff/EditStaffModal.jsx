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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-text-main/20 backdrop-blur-md">
      <div
        className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border transition-all ${darkMode ? "bg-text-main border-slate-800 text-white" : "bg-white border-slate-100"}`}
      >
        <div className="flex justify-between items-center mb-8">
          <h3
            className={`text-xl font-medium tracking-tight ${darkMode ? "text-white" : "text-text-main"}`}
          >
            Editează Medic
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors"
          >
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
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
            <label className="text-[9px] font-medium uppercase tracking-widest text-text-muted">
              Culoare Identitate
            </label>
            <div className="flex gap-3">
              {COLOR_OPTIONS.map((color) => (
                <button
                  key={color.id}
                  onClick={() =>
                    setMember({ ...member, color_preference: color.hex })
                  }
                  className={`w-8 h-8 rounded-xl border-2 transition-all ${color.bg} ${member.color_preference === color.hex ? "border-slate-800 scale-110 shadow-sm" : "border-transparent opacity-60"}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={onSave}
            disabled={saving}
            className="w-full bg-olive-base text-white py-4 rounded-2xl font-medium text-[11px] uppercase tracking-widest shadow-lg mt-4 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Check size={16} />
            )}
            Actualizează Datele
          </button>
        </div>
      </div>
    </div>
  );
}

// Sub-componentă internă pentru input-uri, ca să nu repetăm codul
function InputBlock({ label, value, onChange, darkMode }) {
  return (
    <div className="space-y-1 text-left">
      <label className="text-[9px] font-medium uppercase tracking-widest text-text-muted">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-b py-2 outline-none transition-all text-[14px] font-normal ${darkMode ? "text-slate-200 border-slate-800" : "text-slate-700 border-slate-100 focus:border-olive-base"}`}
      />
    </div>
  );
}
