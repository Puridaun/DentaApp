import React from "react";
import { User, Clock, Phone } from "lucide-react";

export default function PatientsTable({ patients, onSelectPatient, darkMode }) {
  return (
    <div
      className={`rounded-[2.5rem] border overflow-hidden transition-all ${darkMode ? "bg-[#0B1120] border-slate-800 shadow-2xl" : "bg-white border-slate-100 shadow-xl"}`}
    >
      {/* HEADER DESKTOP */}
      <div className="hidden md:grid grid-cols-5 px-10 py-6 text-[11px] font-black uppercase tracking-[0.2em] bg-olive-base text-white">
        <span>Pacient</span>
        <span>Doctor</span>
        <span>Ultima Intervenție</span>
        <span>Recurență</span>
        <span className="text-right">Înregistrat la</span>
      </div>

      {/* LISTA */}
      <div
        className={`divide-y ${darkMode ? "divide-slate-800/50" : "divide-slate-50"}`}
      >
        {patients.length > 0 ? (
          patients.map((patient) => {
            const isLongTime = patient.raw_months >= 6;

            return (
              <div
                key={patient.id}
                onClick={() => onSelectPatient(patient.id)}
                className={`flex flex-col md:grid md:grid-cols-5 px-8 py-6 md:px-10 md:py-7 items-start md:items-center cursor-pointer transition-all ${
                  darkMode ? "hover:bg-slate-800/30" : "hover:bg-slate-50/80"
                }`}
              >
                {/* 1. PACIENT */}
                <div className="flex flex-col mb-3 md:mb-0">
                  <span
                    className={`text-base md:text-lg font-bold ${darkMode ? "text-slate-100" : "text-text-main"}`}
                  >
                    {patient.full_name}
                  </span>
                  <div className="flex items-center gap-1.5 md:hidden mt-1">
                    <Phone size={12} className="text-olive-base" />
                    <span className="text-xs text-slate-500">
                      {patient.phone}
                    </span>
                  </div>
                </div>

                {/* 2. DOCTOR */}
                <div className="flex items-center gap-3 mb-2 md:mb-0 md:block">
                  <User size={16} className="md:hidden text-slate-500" />
                  <span
                    className={`text-sm md:text-base ${darkMode ? "text-slate-400" : "text-text-sub"}`}
                  >
                    {patient.assigned_doctor?.full_name || "—"}
                  </span>
                </div>

                {/* 3. ULTIMA INTERVENTIE */}
                <div className="flex items-center gap-3 mb-2 md:mb-0 md:block">
                  <Clock size={16} className="md:hidden text-slate-500" />
                  <span
                    className={`text-sm md:text-base ${darkMode ? "text-slate-400" : "text-text-sub"} truncate max-w-[220px]`}
                  >
                    {patient.last_procedure_display}
                  </span>
                </div>

                {/* 4. RECURENTA */}
                <div className="flex items-center gap-3 mb-4 md:mb-0 md:block">
                  <span className="text-[10px] font-bold uppercase text-slate-500 md:hidden">
                    Recurență:
                  </span>
                  <span
                    className={`text-sm font-bold md:font-semibold ${
                      isLongTime
                        ? "text-status-warning"
                        : darkMode
                          ? "text-slate-400"
                          : "text-text-sub"
                    }`}
                  >
                    {patient.months_since_last}
                  </span>
                </div>

                {/* 5. DATA (Mobile Bottom Bar / Desktop Right) */}
                <div className="w-full md:w-auto pt-4 md:pt-0 border-t border-slate-800/50 md:border-0 flex justify-between items-center md:justify-end">
                  <span className="text-[10px] font-bold uppercase text-slate-500 md:hidden">
                    Înregistrat la:
                  </span>
                  <span
                    className={`text-sm font-mono ${darkMode ? "text-slate-500" : "text-text-muted"}`}
                  >
                    {new Date(patient.created_at).toLocaleDateString("ro-RO")}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-32 text-center">
            <p
              className={`text-lg italic ${darkMode ? "text-slate-600" : "text-text-muted"}`}
            >
              Nu am găsit pacienți pentru aceste filtre.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
