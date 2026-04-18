import React from "react";
import { ShieldCheck, Database } from "lucide-react";

export default function AdminSettings({ session, darkMode }) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-left animate-in fade-in duration-500">
      <h1
        className={`text-2xl font-medium tracking-tight mb-8 ${darkMode ? "text-white" : "text-text-main"}`}
      >
        Sistem Centralizat
      </h1>
      <div className="space-y-12">
        <div className="space-y-8">
          <div className="group">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-olive-base mb-2">
              Identitate Administrator
            </p>
            <p
              className={`text-lg font-normal tracking-tight ${darkMode ? "text-slate-200" : "text-slate-700"}`}
            >
              Ing. Hritcu Serafim
            </p>
          </div>
          <div className="group">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-olive-base mb-2">
              Email de Control
            </p>
            <p
              className={`text-lg font-normal tracking-tight ${darkMode ? "text-slate-200" : "text-slate-700"}`}
            >
              {session.user.email}
            </p>
          </div>
        </div>
        <div
          className={`p-8 rounded-[2rem] border ${darkMode ? "bg-text-main/50 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <h4 className="text-[10px] font-medium uppercase tracking-[0.2em] text-olive-base mb-6">
            Parametrii Sistem
          </h4>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-olive-base" size={18} />
              <span className="text-xs font-normal opacity-70">
                Securitate SSL Activă
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Database className="text-olive-base" size={18} />
              <span className="text-xs font-normal opacity-70">
                Sincronizare Cloud
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
