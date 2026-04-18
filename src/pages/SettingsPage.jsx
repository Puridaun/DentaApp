import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loader2, Lock, ShieldCheck, Database } from "lucide-react";

// Paleta de culori calde
const COLOR_OPTIONS = [
  { id: "violet", hex: "#E6E6FA", bg: "bg-[#E6E6FA]" },
  { id: "albastru", hex: "#F0F8FF", bg: "bg-[#F0F8FF]" },
  { id: "verde", hex: "#F5FFFA", bg: "bg-[#F5FFFA]" },
  { id: "piersica", hex: "#FFF5EE", bg: "bg-[#FFF5EE]" },
  { id: "roz", hex: "#FFF0F5", bg: "bg-[#FFF0F5]" },
];

export default function SettingsPage({
  session,
  darkMode,
  isAdmin,
  onProfileUpdate,
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    last_name: "",
    first_name: "",
    specialization: "",
    phone: "",
    birth_date: "",
    color_preference: "#E6E6FA", // Culoare default
  });

  const formatValue = (str) => str.replace(/\b\w/g, (l) => l.toUpperCase());

  useEffect(() => {
    if (session && !isAdmin) fetchProfile();
    else setLoading(false);
  }, [session, isAdmin]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();
      if (data) {
        setProfile({
          last_name: data.last_name || "",
          first_name: data.first_name || "",
          specialization: data.specialization || "",
          phone: data.phone || "",
          birth_date: data.birth_date || "",
          color_preference: data.color_preference || "#E6E6FA",
        });
        if (data.full_name) setIsLocked(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    const fullName = `${profile.last_name} ${profile.first_name}`.trim();
    const { error } = await supabase.from("profiles").upsert({
      id: session.user.id,
      ...profile,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });
    if (!error) {
      setIsLocked(true);
      setShowConfirm(false);
      onProfileUpdate();
    }
    setSaving(false);
  }

  if (loading)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-slate-300" />
      </div>
    );

  if (isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-left animate-in fade-in duration-500">
        <h1
          className={`text-2xl font-medium tracking-tight mb-8 ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          Sistem Centralizat
        </h1>
        <div className="space-y-12">
          <div className="space-y-8">
            <div className="group">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#556B2F] mb-2">
                Identitate Administrator
              </p>
              <p
                className={`text-lg font-normal tracking-tight ${darkMode ? "text-slate-200" : "text-slate-700"}`}
              >
                Ing. Hritcu Serafim
              </p>
            </div>
            <div className="group">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#556B2F] mb-2">
                Email de Control
              </p>
              <p
                className={`text-lg font-normal tracking-tight ${darkMode ? "text-slate-200" : "text-slate-700"}`}
              >
                {session.user.email}
              </p>
            </div>
          </div>
          <div
            className={`p-8 rounded-[2rem] border ${darkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}
          >
            <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#556B2F] mb-6">
              Parametrii Sistem
            </h4>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-[#556B2F]" size={18} />
                <span className="text-xs font-normal opacity-70">
                  Securitate SSL Activă
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Database className="text-[#556B2F]" size={18} />
                <span className="text-xs font-normal opacity-70">
                  Sincronizare Cloud
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-left animate-in fade-in duration-500">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Profil Medic</h1>
          <p className="text-slate-400 text-sm mt-1 font-light italic">
            {isLocked
              ? "Informații securizate"
              : "Completează datele de identificare"}
          </p>
        </div>
        {isLocked && (
          <div className="flex items-center gap-2 text-[#556B2F] bg-[#556B2F]/10 px-4 py-2 rounded-full text-[9px] font-medium uppercase tracking-widest">
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
          <label className="text-[9px] font-medium uppercase tracking-widest text-slate-400">
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
                  ${
                    profile.color_preference === color.hex
                      ? "border-slate-800 scale-110 shadow-md"
                      : "border-transparent opacity-70 hover:opacity-100"
                  } 
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
            onClick={() => setShowConfirm(true)}
            className="w-full py-4 bg-[#556B2F] text-white rounded-2xl font-medium text-[11px] uppercase tracking-[0.2em] shadow-lg hover:brightness-110 transition-all mt-6"
          >
            Salvează Profil
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/10 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-sm text-center shadow-2xl border border-slate-100">
            <h3 className="text-lg font-medium mb-2">Confirmi datele?</h3>
            <p className="text-sm text-slate-400 mb-8 font-light">
              După salvare, datele nu mai pot fi modificate personal.
            </p>
            <div className="flex flex-col gap-2">
              <button
                disabled={saving}
                onClick={handleSave}
                className="w-full py-4 bg-[#556B2F] text-white rounded-2xl font-medium text-[11px] uppercase tracking-widest flex justify-center items-center"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Confirm"
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-4 text-slate-400 font-medium text-[11px] uppercase tracking-widest"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
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
      <label className="text-[9px] font-medium uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-b py-2 outline-none transition-all text-[14px] font-normal 
          ${disabled ? "opacity-50 border-transparent text-[#556B2F]" : darkMode ? "text-slate-200 border-slate-800" : "text-slate-700 border-slate-100 focus:border-[#556B2F]"}`}
      />
    </div>
  );
}
