import React from "react";
import { Loader2, Plus } from "lucide-react";
import { ORE_LUCRU, COLOR_MAP } from "./AgendaUtils";

export default function AgendaGrid({
  loading,
  appointments,
  onAddClick,
  onEditClick,
}) {
  if (loading) {
    return (
      <div className="rounded-[2.5rem] border-2 bg-white shadow-xl border-slate-100 p-20 text-center">
        <Loader2 className="animate-spin mx-auto text-olive-base" size={40} />
      </div>
    );
  }

  return (
    <div className="rounded-[2.5rem] border-2 bg-white overflow-hidden shadow-xl border-slate-100 mb-20">
      <div className="divide-y divide-slate-100">
        {ORE_LUCRU.map((ora) => {
          const currentAppts = appointments.filter((a) =>
            a.start_time.startsWith(ora),
          );

          return (
            <div
              key={ora}
              className="flex group min-h-[75px] hover:bg-slate-50/30"
            >
              {/* Coloana cu Ora */}
              <div
                className={`w-16 md:w-24 py-4 px-3 text-right border-r-2 border-slate-50 ${ora.endsWith(":30") ? "opacity-30" : "bg-slate-50/50"}`}
              >
                <span className="text-[11px] font-black text-slate-500">
                  {ora}
                </span>
              </div>

              {/* Coloana cu Programări */}
              <div className="flex-1 p-1 flex flex-wrap gap-2">
                {currentAppts.map((appt) => {
                  const style =
                    COLOR_MAP[appt.doctor?.color_preference] ||
                    COLOR_MAP["#E6E6FA"];
                  return (
                    <div
                      key={appt.id}
                      onClick={() => onEditClick(appt)}
                      className={`flex-1 min-w-[200px] p-3 rounded-xl border-l-4 cursor-pointer hover:brightness-95 transition-all shadow-sm ${style.bg} ${style.border}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span
                          className={`text-[8px] font-black uppercase px-2 py-0.5 rounded bg-white/60 ${style.text}`}
                        >
                          {appt.procedure_name}
                        </span>
                        <span className="text-[8px] font-bold text-slate-500 flex items-center gap-1">
                          Dr. {appt.doctor?.full_name?.split(" ")[0]}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {appt.patient?.full_name}
                      </span>
                      {appt.notes && (
                        <p className="text-[9px] text-slate-500 italic mt-1 truncate">
                          {appt.notes}
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Buton rapid de adăugare (apare la hover pe rândul gol) */}
                {currentAppts.length === 0 && (
                  <button
                    onClick={() => onAddClick(ora)}
                    className="h-full w-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-slate-300 font-black text-[9px] uppercase gap-1"
                  >
                    <Plus size={12} /> Adaugă la {ora}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
