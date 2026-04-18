import React from "react";
import { Lock } from "lucide-react";

const COLOR_OPTIONS = [
  { id: "violet", hex: "#E6E6FA", bg: "bg-[#E6E6FA]" },
  { id: "albastru", hex: "#F0F8FF", bg: "bg-[#F0F8FF]" },
  { id: "verde", hex: "#F5FFFA", bg: "bg-[#F5FFFA]" },
  { id: "piersica", hex: "#FFF5EE", bg: "bg-[#FFF5EE]" },
  { id: "roz", hex: "#FFF0F5", bg: "bg-[#FFF0F5]" },
];

export default function DoctorProfileForm({
  profile,
  setProfile,
  isLocked,
  darkMode,
  onSaveClick,
  formatValue,
}) {
  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-left animate-in fade-in duration-500">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Profil Medic</h1>
          <p className="text-text-muted text-sm mt-1 font-light italic">
            {isLocked
              ? "Informații securizate"
              : "Completează datele de identificare"}
          </p>
        </div>
        {isLocked && (
          <div className="flex items-center gap-2 text-olive-base bg-olive-base/10 px-4 py-2 rounded-full text-[9px] font-medium uppercase tracking-widest">
            <Lock size={12} /> Securizat
          </div>
        )}
      </div>

      <div className="space-y-10">
        <div className="grid grid-cols-2 gap-6">
          <InputBlock
            label="Nume"
            value={profile.last_name}
            disabled={isLocked}
            onChange={(v) =>
              setProfile({ ...profile, last_name: formatValue(v) })
            }
            darkMode={darkMode}
          />
          <InputBlock
            label="Prenume"
            value={profile.first_name}
            disabled={isLocked}
            onChange={(v) =>
              setProfile({ ...profile, first_name: formatValue(v) })
            }
            darkMode={darkMode}
          />
        </div>

        <InputBlock
          label="Specializare"
          value={profile.specialization}
          disabled={isLocked}
          onChange={(v) =>
            setProfile({ ...profile, specialization: formatValue(v) })
          }
          darkMode={darkMode}
        />

        {/* SELECTOR CULOARE */}
        <div className="space-y-4">
          <label className="text-[9px] font-medium uppercase tracking-widest text-text-muted">
            Culoare Identitate Agendă
          </label>
          <div className="flex gap-4">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color.id}
                disabled={isLocked}
                onClick={() =>
                  setProfile({ ...profile, color_preference: color.hex })
                }
                className={`w-10 h-10 rounded-xl border-2 transition-all duration-300 shadow-sm ${color.bg} 
                  ${profile.color_preference === color.hex ? "border-slate-800 scale-110 shadow-md" : "border-transparent opacity-70 hover:opacity-100"} 
                  ${isLocked ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InputBlock
            label="Telefon"
            value={profile.phone}
            disabled={isLocked}
            onChange={(v) => setProfile({ ...profile, phone: v })}
            darkMode={darkMode}
          />
          <InputBlock
            label="Data Nașterii"
            value={profile.birth_date}
            type="date"
            disabled={isLocked}
            onChange={(v) => setProfile({ ...profile, birth_date: v })}
            darkMode={darkMode}
          />
        </div>

        {!isLocked && (
          <button
            onClick={onSaveClick}
            className="w-full py-4 bg-olive-base text-white rounded-2xl font-medium text-[11px] uppercase tracking-[0.2em] shadow-lg hover:brightness-110 transition-all mt-6"
          >
            Salvează Profil
          </button>
        )}
      </div>
    </div>
  );
}

function InputBlock({
  label,
  value,
  onChange,
  disabled,
  type = "text",
  darkMode,
}) {
  return (
    <div className="space-y-1">
      <label className="text-[9px] font-medium uppercase tracking-widest text-text-muted">
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-b py-2 outline-none transition-all text-[14px] font-normal 
          ${disabled ? "opacity-50 border-transparent text-olive-base" : darkMode ? "text-slate-200 border-slate-800" : "text-slate-700 border-slate-100 focus:border-olive-base"}`}
      />
    </div>
  );
}
