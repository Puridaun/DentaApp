import React from "react";
import { Activity } from "lucide-react";

export default function DoctorDistribution({ stats, darkMode }) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] border ${
        darkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-white border-slate-100 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-[13px] font-medium uppercase tracking-widest flex items-center gap-3">
          <Activity size={18} className="text-olive-base" /> Programări per
          Doctor
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-medium uppercase tracking-tighter text-slate-400">
            Live
          </span>
        </div>
      </div>

      <div className="space-y-7">
        {stats.appointmentsPerDoctor.map((d, i) => (
          <div key={i} className="space-y-3">
            <div className="flex justify-between text-[12px] font-medium">
              <span className="uppercase tracking-wide opacity-70">
                {d.name}
              </span>
              <span className="text-olive-base font-semibold">
                {d.count} pacienți
              </span>
            </div>
            <div
              className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}
            >
              <div
                className="h-full transition-all duration-1000 ease-out"
                style={{
                  width: `${(d.count / (stats.todayAppointments || 1)) * 100}%`,
                  backgroundColor: d.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
