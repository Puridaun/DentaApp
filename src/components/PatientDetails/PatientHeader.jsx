import React from "react";
import { ChevronLeft, FileText } from "lucide-react";

export default function PatientHeader({
  patient,
  onBack,
  setIsFisaOpen,
  darkMode,
}) {
  const restanta =
    patient.treatments?.reduce(
      (acc, curr) =>
        acc + (Number(curr.total_cost || 0) - Number(curr.amount_paid || 0)),
      0,
    ) || 0;

  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-slate-400 hover:text-[#556B2F] transition-colors text-[10px] uppercase font-medium mb-6 tracking-widest"
      >
        <ChevronLeft size={14} /> Înapoi
      </button>

      <div className="flex flex-col gap-6 mb-8 text-left">
        <h1 className="text-2xl md:text-5xl font-light tracking-tight uppercase leading-tight max-w-[90%]">
          {patient.full_name}
        </h1>

        <div className="flex flex-row items-stretch gap-3 w-full">
          {restanta > 0 && (
            <div className="bg-red-50 dark:bg-red-500/10 px-4 py-3 md:px-8 md:py-5 flex flex-col justify-center rounded-2xl border border-red-100 dark:border-red-500/20 flex-1">
              <span className="text-[8px] md:text-[10px] font-medium text-red-400 uppercase tracking-widest mb-0.5">
                Restanță
              </span>
              <span className="text-[13px] md:text-xl font-medium text-red-500 whitespace-nowrap">
                {restanta} RON
              </span>
            </div>
          )}

          <button
            onClick={() => setIsFisaOpen(true)}
            className="flex-[1.5] bg-[#556B2F] text-white px-4 py-3 md:py-5 rounded-2xl font-medium uppercase text-[10px] md:text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-[#556B2F]/10"
          >
            <FileText size={16} className="shrink-0" />{" "}
            <span className="whitespace-nowrap">Fișă Clinică</span>
          </button>
        </div>
      </div>
    </div>
  );
}
