import React from "react";
import {
  User,
  Clock,
  Phone,
  ChevronRight,
  AlertCircle,
  Search,
} from "lucide-react";

export default function PatientsTable({ patients, onSelectPatient, darkMode }) {
  if (!patients || patients.length === 0) {
    return (
      <div className="py-32 text-center">
        <p
          className={`text-lg italic font-light ${darkMode ? "text-slate-600" : "text-slate-400"}`}
        >
          Nu am găsit pacienți pentru aceste filtre.
        </p>
      </div>
    );
  }

  const truncateText = (text, limit = 35) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="flex flex-col gap-4">
      {patients.map((patient) => {
        const isLongTime = patient.raw_months >= 6;
        const hasAllergies =
          patient.allergies &&
          patient.allergies.toLowerCase() !== "neagă" &&
          patient.allergies.toLowerCase() !== "neaga" &&
          patient.allergies.trim() !== "";

        const previewText = truncateText(
          patient.investigatii || patient.observations,
        );

        return (
          <div
            key={patient.id}
            onClick={() => onSelectPatient(patient.id)}
            className={`group p-6 md:p-8 rounded-[2.5rem] border transition-all cursor-pointer hover:scale-[1.01] ${
              darkMode
                ? "bg-slate-900 border-slate-800 hover:border-[#556B2F]/50 shadow-xl"
                : "bg-white border-slate-100 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-center text-left">
              <div className="space-y-4 w-full">
                {/* HEADER: NUME + ALERTE */}
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-lg md:text-xl font-medium tracking-tight uppercase ${darkMode ? "text-slate-100" : "text-slate-800"}`}
                  >
                    {patient.full_name}
                  </h3>

                  {hasAllergies && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-500/10 rounded-full">
                      <AlertCircle size={14} className="text-red-500" />
                      <span className="text-[10px] font-medium uppercase text-red-500 tracking-widest">
                        Alergii
                      </span>
                    </div>
                  )}
                </div>

                {/* INFO GRID: REPARAȚIE ALINIERE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
                  {/* DOCTOR */}
                  <div className="flex items-center gap-3">
                    <User size={14} className="text-[#556B2F] opacity-60" />
                    <span
                      className={`text-[13px] font-normal italic ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      Dr. {patient.assigned_doctor?.full_name || "Nespecificat"}
                    </span>
                  </div>

                  {/* TELEFON */}
                  <div className="flex items-center gap-3">
                    <Phone size={14} className="text-[#556B2F] opacity-60" />
                    <span
                      className={`text-[13px] font-normal ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {patient.phone || "—"}
                    </span>
                  </div>

                  {/* ULTIMA VIZITĂ - FIX ALINIERE PRIN UNIFORMIZARE SIZE */}
                  <div className="flex items-center gap-3">
                    <Clock
                      size={14}
                      className="text-[#556B2F] opacity-60 shrink-0"
                    />
                    <div className="flex items-baseline gap-2">
                      {" "}
                      {/* items-baseline forțează alinierea pe rândul de text */}
                      <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400 whitespace-nowrap">
                        Ultima vizită:
                      </span>
                      <span
                        className={`text-[11px] font-medium uppercase ${isLongTime ? "text-orange-500" : "text-[#556B2F]"}`}
                      >
                        {patient.months_since_last}
                      </span>
                    </div>
                  </div>
                </div>

                {/* PREVIZUALIZARE INVESTIGAȚII */}
                {previewText && (
                  <div
                    className={`p-3 px-4 rounded-xl border-l-2 border-[#556B2F]/30 ${darkMode ? "bg-white/5" : "bg-slate-50"}`}
                  >
                    <p className="text-[12px] font-normal italic text-slate-500">
                      <Search size={10} className="inline mr-2 opacity-50" />
                      {previewText}
                    </p>
                  </div>
                )}

                {/* FOOTER: LINIE + DATA */}
                <div
                  className={`pt-4 border-t flex justify-between items-center ${darkMode ? "border-slate-800" : "border-slate-50"}`}
                >
                  <span className="text-[9px] font-medium uppercase text-slate-400 tracking-[0.2em]">
                    Înregistrat la:
                  </span>
                  <span
                    className={`text-[11px] font-medium ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                  >
                    {new Date(patient.created_at).toLocaleDateString("ro-RO")}
                  </span>
                </div>
              </div>

              <div className="hidden md:block ml-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} className="text-slate-300" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
