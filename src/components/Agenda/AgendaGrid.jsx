import React from "react";
import { Loader2, Plus } from "lucide-react";
import { ORE_LUCRU, COLOR_MAP } from "./AgendaUtils";

export default function AgendaGrid({
  loading,
  appointments,
  onAddClick,
  onEditClick,
  darkMode,
}) {
  const ROW_HEIGHT = 120;

  const calculateHeight = (start, end) => {
    if (!start || !end) return ROW_HEIGHT;
    const toMin = (h) =>
      h
        .split(":")
        .slice(0, 2)
        .reduce((acc, v) => acc * 60 + +v, 0);
    const diff = toMin(end) - toMin(start);
    return (diff / 30) * ROW_HEIGHT;
  };

  if (loading)
    return (
      <div
        className={`w-full rounded-[2.5rem] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} p-20 text-center`}
      >
        <Loader2 className="animate-spin mx-auto text-[#556B2F]" size={40} />
      </div>
    );

  return (
    <div
      className={`w-full rounded-[2.5rem] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} shadow-sm mb-12 overflow-hidden`}
    >
      <div className="overflow-x-auto">
        <div
          className={`divide-y relative min-w-[750px] ${darkMode ? "divide-slate-800" : "divide-slate-100"}`}
        >
          {ORE_LUCRU.map((ora) => {
            const startingAppts = appointments.filter(
              (a) => a.start_time.substring(0, 5) === ora,
            );
            const totalAtThisHour = startingAppts.length;

            return (
              <div
                key={ora}
                style={{ minHeight: `${ROW_HEIGHT}px` }}
                className="flex group relative hover:bg-slate-50/30 transition-colors"
              >
                <div
                  className={`w-16 md:w-24 py-6 px-4 text-right border-r ${darkMode ? "border-slate-800" : "border-slate-100"} ${ora.endsWith(":30") ? "opacity-20" : "opacity-40"}`}
                >
                  <span className="text-[12px] uppercase tracking-widest font-medium text-slate-600">
                    {ora}
                  </span>
                </div>

                <div className="flex-1 relative">
                  {startingAppts.map((appt, index) => {
                    const style =
                      COLOR_MAP[appt.doctor?.color_preference] ||
                      COLOR_MAP["#E6E6FA"];
                    const height = calculateHeight(
                      appt.start_time,
                      appt.end_time,
                    );
                    const widthPercent = 100 / totalAtThisHour;
                    const leftOffset = widthPercent * index;

                    return (
                      <div
                        key={appt.id}
                        onClick={() => onEditClick(appt)}
                        style={{
                          height: `${height - 10}px`,
                          width: `calc(${widthPercent}% - 12px)`,
                          left: `calc(${leftOffset}% + 6px)`,
                          zIndex: 20 + index,
                        }}
                        /* Am eliminat flex-col items-center justify-between pentru a forța totul SUS */
                        className={`absolute top-[5px] p-5 rounded-[2rem] border-t-[6px] cursor-pointer shadow-md ${style.bg} ${style.border} overflow-hidden transition-all hover:shadow-lg`}
                      >
                        {/* HEADER: Tratament și Ora (Aliniate sus) */}
                        <div className="flex justify-between items-center mb-3">
                          <span
                            className={`text-[10px] uppercase tracking-[0.2em] font-medium ${style.text}`}
                          >
                            {appt.procedure_name || "TRATAMENT"}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 bg-white/50 px-2 py-0.5 rounded-full">
                            {appt.start_time.substring(0, 5)} -{" "}
                            {appt.end_time?.substring(0, 5)}
                          </span>
                        </div>

                        {/* CONTINUT: Nume și Detalii (Grupate imediat sub header) */}
                        <div className="flex flex-col text-left">
                          <h4 className="text-[15px] font-medium text-slate-800 leading-tight uppercase tracking-wide mb-1">
                            {appt.patient?.full_name}
                          </h4>
                          {appt.notes && (
                            <p className="text-[12px] text-slate-600 font-normal italic leading-snug">
                              {appt.notes}
                            </p>
                          )}
                        </div>

                        {/* DOCTOR: Mutat imediat sub restul textului, nu la fundul paginii */}
                        <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${style.text} bg-current`}
                          />
                          <p className="text-[11px] font-medium text-slate-600 uppercase tracking-widest">
                            Dr. {appt.doctor?.full_name}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {startingAppts.length === 0 &&
                    !appointments.some((a) => {
                      const toMin = (h) =>
                        h
                          .split(":")
                          .slice(0, 2)
                          .reduce((acc, v) => acc * 60 + +v, 0);
                      const curr = toMin(ora);
                      return (
                        curr >= toMin(a.start_time) && curr < toMin(a.end_time)
                      );
                    }) && (
                      <button
                        onClick={() => onAddClick(ora)}
                        className="w-full h-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-slate-300 font-medium text-[11px] uppercase tracking-[0.4em]"
                      >
                        + PROGRAMARE
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
