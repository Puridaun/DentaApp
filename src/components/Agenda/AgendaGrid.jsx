import React from "react";
import { Loader2 } from "lucide-react";
import { ORE_LUCRU, COLOR_MAP } from "./AgendaUtils";

export default function AgendaGrid({
  loading,
  appointments,
  onAddClick,
  onEditClick,
  darkMode,
}) {
  const ROW_HEIGHT = 120;

  const isPast = (dateStr, timeStr) => {
    const now = new Date();
    const [h, m] = timeStr.split(":").map(Number);
    const apptDate = new Date(dateStr);
    apptDate.setHours(h, m, 0, 0);
    return apptDate < now;
  };

  const calculateHeight = (start, end) => {
    if (!start || !end) return ROW_HEIGHT;
    const toMin = (h) =>
      h
        .split(":")
        .slice(0, 2)
        .reduce((acc, v) => acc * 60 + +v, 0);
    return ((toMin(end) - toMin(start)) / 30) * ROW_HEIGHT;
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
      className={`w-full rounded-[2.5rem] border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} shadow-sm mb-12 overflow-hidden font-sans`}
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
                    const doctorStyle =
                      COLOR_MAP[appt.doctor?.color_preference] ||
                      COLOR_MAP["#E6E6FA"];
                    const past = isPast(appt.appointment_date, appt.start_time);
                    const attStatus = appt.attendance_status || "Programat";

                    const isCancelled = attStatus === "Anulat";
                    const isAbsent = attStatus === "Absent";
                    const isPresent = attStatus === "Prezent";

                    const height = calculateHeight(
                      appt.start_time,
                      appt.end_time,
                    );
                    const widthPercent = 100 / totalAtThisHour;
                    const leftOffset = widthPercent * index;

                    // Stabilim culoarea bordurii de sus în funcție de status, altfel rămâne culoarea doctorului
                    let borderTopColor = doctorStyle.border;
                    if (isCancelled) borderTopColor = "border-red-500";
                    if (isAbsent) borderTopColor = "border-amber-500";
                    if (isPresent) borderTopColor = "border-green-500";

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
                        className={`absolute top-[5px] p-5 rounded-[2rem] border-t-[6px] cursor-pointer shadow-md overflow-hidden transition-all hover:shadow-lg 
                          ${past ? "bg-slate-100 border-slate-300 opacity-75" : `${doctorStyle.bg} ${borderTopColor}`}`}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <span
                            className={`text-[10px] uppercase tracking-[0.2em] font-bold ${past ? "text-slate-400" : doctorStyle.text}`}
                          >
                            {appt.procedure_name || "TRATAMENT"} {past && "✓"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 bg-white/70 px-2 py-0.5 rounded-full">
                            {appt.start_time.substring(0, 5)}
                          </span>
                        </div>

                        <div className="flex flex-col text-left">
                          <div className="flex items-center flex-wrap gap-2 mb-1">
                            <h4
                              className={`text-[15px] font-bold leading-tight uppercase tracking-wide ${past || isCancelled ? "text-slate-400 line-through" : "text-slate-800"}`}
                            >
                              {appt.patient?.full_name ||
                                appt.temp_patient_name}
                            </h4>

                            {/* BADGE-URI STATUS (Aici e schimbarea principală) */}
                            {isCancelled && (
                              <span className="text-[9px] bg-red-500 text-white font-black px-2 py-0.5 rounded-lg shadow-sm">
                                ANULAT
                              </span>
                            )}
                            {isAbsent && (
                              <span className="text-[9px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-lg shadow-sm">
                                ABSENT
                              </span>
                            )}
                            {isPresent && (
                              <span className="text-[9px] bg-green-500 text-white font-black px-2 py-0.5 rounded-lg shadow-sm">
                                PREZENT
                              </span>
                            )}
                          </div>

                          {appt.notes && (
                            <p
                              className={`text-[12px] font-semibold italic leading-snug ${past ? "text-slate-300" : "text-slate-600"}`}
                            >
                              {appt.notes}
                            </p>
                          )}
                        </div>

                        <div
                          className={`mt-4 pt-3 border-t border-black/[0.05] flex items-center gap-2`}
                        >
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${past ? "bg-slate-300" : `${doctorStyle.text} bg-current`}`}
                          />
                          <p
                            className={`text-[11px] font-bold uppercase tracking-widest ${past ? "text-slate-400" : "text-slate-600"}`}
                          >
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
                        className="w-full h-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-slate-400 font-bold text-[11px] uppercase tracking-[0.4em]"
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
