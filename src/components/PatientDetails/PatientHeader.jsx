import React from "react";
import { ChevronLeft, FileText } from "lucide-react";

export default function PatientHeader({
  patient,
  onBack,
  setIsFisaOpen,
  darkMode,
}) {
  const getDoctorColor = (name) => {
    if (!name || name === "Nespecificat") return "#94a3b8";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 50%, 60%)`;
  };

  const doctorName = patient.assigned_doctor?.full_name || "Nespecificat";
  const doctorColor = getDoctorColor(doctorName);

  const restanta =
    patient.treatments?.reduce(
      (acc, curr) =>
        acc + (Number(curr.total_cost || 0) - Number(curr.amount_paid || 0)),
      0,
    ) || 0;

  return (
    <div className="mb-10 px-2 md:px-1">
      {/* 1. Link Înapoi */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-slate-500 hover:text-olive-base transition-colors text-[10px] uppercase font-black mb-6 tracking-widest"
      >
        <ChevronLeft size={14} /> Înapoi la listă
      </button>

      {/* 2. Rând Principal */}
      <div className="flex flex-col gap-8 mb-10 text-left">
        <h1
          className={`text-3xl md:text-5xl font-light tracking-tighter break-words ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          {patient.full_name}
        </h1>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full">
          {/* BOX "DE ACHITAT" - Apare DOAR dacă restanta > 0 */}
          {restanta > 0 && (
            <div className="bg-olive-base px-6 py-4 flex flex-col justify-center rounded-2xl shadow-lg min-w-[140px] flex-1 animate-in zoom-in duration-300">
              <span className="text-[9px] font-black text-white/70 uppercase tracking-widest mb-1">
                De achitat
              </span>
              <span className="text-xl font-black text-white italic">
                {restanta} RON
              </span>
            </div>
          )}

          {/* Buton Fișă Clinică - Se extinde dacă restanta e 0 */}
          <button
            onClick={() => setIsFisaOpen(true)}
            className={`bg-olive-base text-white px-6 py-4 rounded-2xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-olive-base/10 ${
              restanta > 0 ? "flex-1" : "w-full sm:w-auto sm:px-12"
            }`}
          >
            <FileText size={20} /> Fișă Clinică
          </button>
        </div>
      </div>

      {/* 3. Carduri Informații */}
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 md:gap-4">
        <InfoCard
          label="Născut la"
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
          className="col-span-2 lg:col-auto"
        />

        <div
          className="col-span-2 lg:flex-1 px-5 py-4 rounded-2xl border flex items-center gap-4 min-w-[190px]"
          style={{
            backgroundColor: darkMode ? `${doctorColor}15` : `${doctorColor}10`,
            borderColor: `${doctorColor}40`,
          }}
        >
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: doctorColor }}
          />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">
              Dr Alocat
            </span>
            <span
              className="text-[14px] font-bold"
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

function InfoCard({ label, value, darkMode, className = "" }) {
  return (
    <div
      className={`px-5 py-4 rounded-2xl border flex flex-col justify-center min-w-[140px] text-left transition-all ${className} ${
        darkMode
          ? "bg-[#1E293B] border-slate-800 text-white"
          : "bg-white border-slate-100 text-slate-800 shadow-sm"
      }`}
    >
      <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">
        {label}
      </span>
      <span className="text-[13px] font-bold truncate">{value}</span>
    </div>
  );
}
