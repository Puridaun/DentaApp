import React from "react";
import { ChevronLeft, FileText } from "lucide-react";

export default function PatientHeader({
  patient,
  onBack,
  setIsFisaOpen,
  darkMode,
}) {
  // Funcție pentru culoarea specifică a doctorului
  const getDoctorColor = (name) => {
    if (!name || name === "Nespecificat") return "#94a3b8";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 50%, 40%)`;
  };

  const doctorName = patient.assigned_doctor?.full_name || "Nespecificat";
  const doctorColor = getDoctorColor(doctorName);

  // Calculăm restanța din tratamente (Cost - Achitat)
  const restanta =
    patient.treatments?.reduce(
      (acc, curr) => acc + (curr.total_cost - curr.amount_paid),
      0,
    ) || 0;

  return (
    <div className="mb-8 animate-in fade-in duration-500 px-1">
      {/* 1. Link Înapoi */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-slate-400 hover:text-[#556B2F] transition-colors text-[10px] uppercase font-black mb-4 tracking-widest"
      >
        <ChevronLeft size={14} /> Înapoi la listă
      </button>

      {/* 2. Rând Principal: Nume --- [Datorie] [Fișă] */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-left">
        <h1
          className={`text-3xl md:text-5xl font-light tracking-tighter ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          {patient.full_name}
        </h1>

        <div className="flex items-stretch gap-3 h-12 md:h-14">
          {/* Box Datorie */}
          <div className="bg-[#556B2F] px-5 flex flex-col justify-center rounded-2xl shadow-sm border border-[#556B2F] min-w-[130px]">
            <span className="text-[8px] md:text-[9px] font-black text-white/70 uppercase tracking-widest leading-none mb-1.5">
              Datorie / Restanță
            </span>
            <span className="text-sm md:text-lg font-black text-white leading-none">
              {restanta} RON
            </span>
          </div>

          {/* Buton Fișă Clinică */}
          <button
            onClick={() => setIsFisaOpen(true)}
            className="bg-[#556B2F] text-white px-6 rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest flex items-center gap-2 hover:bg-[#455a26] transition-all shadow-lg shadow-[#556B2F]/20 active:scale-95"
          >
            <FileText size={20} /> Fișă Clinică
          </button>
        </div>
      </div>

      {/* 3. Carduri Informații (Mărime normală, aliniate) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3">
        <InfoCard
          label="Data Nașterii"
          value={patient.birth_date || "-"}
          darkMode={darkMode}
        />
        <InfoCard
          label="Telefon"
          value={patient.phone || "-"}
          darkMode={darkMode}
        />
        <InfoCard
          label="Email"
          value={patient.email || "-"}
          darkMode={darkMode}
        />

        {/* Card Doctor Alocat - Rezolvată alinierea verticală pentru Nespecificat */}
        <div
          className="px-4 py-3 rounded-2xl border flex items-center gap-3 transition-all shadow-sm min-w-[180px]"
          style={{
            backgroundColor: `${doctorColor}10`,
            borderColor: `${doctorColor}30`,
          }}
        >
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: doctorColor }}
          />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1.5">
              Dr Alocat
            </span>
            <span
              className="text-[13px] font-bold leading-none"
              style={{ color: doctorColor }}
            >
              {doctorName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, darkMode }) {
  return (
    <div
      className={`px-4 py-3 rounded-2xl border flex flex-col justify-center min-w-[150px] text-left transition-all ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-100 text-slate-600 shadow-sm"
      }`}
    >
      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1.5">
        {label}
      </span>
      <span className="text-[13px] font-bold leading-none tracking-tight">
        {value}
      </span>
    </div>
  );
}
