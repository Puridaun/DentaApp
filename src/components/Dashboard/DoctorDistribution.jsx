import React from "react";
import { Activity } from "lucide-react";

export default function DoctorDistribution({ stats, darkMode }) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] border-2 ${
        darkMode
          ? "bg-text-main border-slate-800 text-white"
          : "bg-white border-slate-50 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="font-bold flex items-center gap-2">
          <Activity size={18} className="text-olive-base" /> Programări per
          Doctor (Azi)
        </h3>
        <span className="text-[10px] font-black uppercase text-text-muted">
          Live
        </span>
      </div>

      <div className="space-y-6">
        {stats.appointmentsPerDoctor.map((d, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span>{d.name}</span>
              <span className="text-olive-base">{d.count} pacienți</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-1000"
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
