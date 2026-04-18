import React from "react";
import {
  FileText,
  User,
  Calendar,
  Hash,
  Banknote,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function HistorySection({
  treatments,
  patient,
  onContinue,
  darkMode,
}) {
  if (!treatments || treatments.length === 0) {
    return (
      <div className="text-slate-500 italic py-10 text-center border border-dashed border-slate-300 rounded-2xl">
        Nu există istoric de tratament.
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-slate-200 ml-4 md:ml-6 pl-6 md:pl-10 space-y-6 pb-10">
      {treatments.map((tr) => {
        const isFinalizat = tr.status === "Finalizată";

        // CONTRAST ÎMBUNĂTĂȚIT: Culori mai solide pentru fundal
        const cardStyle = isFinalizat
          ? darkMode
            ? "bg-olive-base/10 border-l-olive-base border-y-slate-800 border-r-slate-800"
            : "bg-olive-base/[0.07] border-l-olive-base border-y-slate-200 border-r-slate-200"
          : darkMode
            ? "bg-amber-500/10 border-l-amber-500 border-y-slate-800 border-r-slate-800"
            : "bg-amber-500/[0.05] border-l-amber-500 border-y-slate-200 border-r-slate-200";

        const accentColor = isFinalizat ? "text-olive-base" : "text-amber-600";

        return (
          <div key={tr.id} className="relative">
            {/* Bulina Timeline */}
            <div
              className={`absolute -left-[33px] md:-left-[47px] top-6 w-4 h-4 rounded-full border-2 ${
                darkMode ? "border-[#0F172A]" : "border-white"
              } ${isFinalizat ? "bg-olive-base" : "bg-amber-500 animate-pulse"}`}
            />

            {/* CARD CU BORDURĂ LATERALĂ ACCENTUATĂ */}
            <div
              className={`rounded-r-2xl rounded-l-md p-5 md:p-6 transition-all border-l-[6px] border shadow-sm ${cardStyle}`}
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  {isFinalizat ? (
                    <CheckCircle2 size={14} className="text-olive-base" />
                  ) : (
                    <Clock size={14} className="text-amber-500" />
                  )}
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${accentColor}`}
                  >
                    {isFinalizat ? "Finalizat" : "În lucru"}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}
                >
                  <Calendar size={12} />
                  <span className="font-bold text-[11px]">
                    {tr.treatment_date}
                  </span>
                </div>
              </div>

              {/* Titlu - Contrast maxim */}
              <h3
                className={`text-lg md:text-xl font-bold mb-3 ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                {tr.procedure_name}
              </h3>

              {/* Observații - Fundal mai opac pentru contrast */}
              <div
                className={`p-4 rounded-xl mb-4 border ${
                  darkMode
                    ? "bg-slate-900/60 border-slate-700/50"
                    : "bg-white/80 border-slate-200 shadow-inner"
                }`}
              >
                <p
                  className={`text-sm italic font-medium leading-snug ${darkMode ? "text-slate-300" : "text-slate-800"}`}
                >
                  {tr.observations || "Fără observații clinice adăugate."}
                </p>
              </div>

              {/* Detalii Tehnice & Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-slate-400/20 gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className={accentColor} />
                    <span
                      className={`text-xs font-bold ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                    >
                      #{tr.teeth_numbers || "—"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote size={14} className={accentColor} />
                    <span
                      className={`text-xs font-bold ${darkMode ? "text-slate-200" : "text-slate-700"}`}
                    >
                      {tr.price || "0"} RON
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-olive-base hover:text-olive-dark transition-colors">
                    <FileText size={14} /> Snapshot
                  </button>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase ${darkMode ? "text-slate-500" : "text-slate-400"}`}
                    >
                      Dr.{" "}
                      {tr.doctor_info?.full_name?.split(" ").pop() || "Andrada"}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                        darkMode
                          ? "bg-slate-800 border-slate-700"
                          : "bg-slate-100 border-slate-200"
                      }`}
                    >
                      <User size={12} className="text-slate-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
