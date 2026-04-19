import React from "react";
import { Loader2, User, Edit2 } from "lucide-react";

export default function StaffTable({ staff, loading, onEdit, darkMode }) {
  return (
    <div
      className={`rounded-[2rem] border overflow-hidden transition-all ${
        darkMode
          ? "border-slate-800 bg-slate-900"
          : "bg-white border-slate-100 shadow-sm"
      }`}
    >
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className={darkMode ? "bg-slate-800/40" : "bg-slate-50/60"}>
              <th className="px-8 py-5 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Medic
              </th>
              <th className="px-8 py-5 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Specializare
              </th>
              <th className="px-8 py-5 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400">
                Telefon
              </th>
              <th className="px-8 py-5 text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400 text-right">
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody
            className={`divide-y ${darkMode ? "divide-slate-800" : "divide-slate-50"}`}
          >
            {loading ? (
              <tr>
                <td colSpan="4" className="py-24 text-center">
                  <Loader2
                    className="animate-spin mx-auto text-[#556B2F]"
                    size={32}
                  />
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-24 text-center">
                  <p className="text-slate-400 text-sm font-medium italic tracking-wide">
                    Niciun profil de medic găsit în baza de date.
                  </p>
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr
                  key={member.id}
                  className={`group transition-colors ${
                    darkMode ? "hover:bg-slate-800/40" : "hover:bg-slate-50/40"
                  }`}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
                        style={{
                          backgroundColor: member.color_preference || "#556B2F",
                        }}
                      >
                        <User size={18} />
                      </div>
                      <span
                        className={`text-sm font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
                      >
                        {member.full_name || "Incomplet"}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`px-8 py-6 text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {member.specialization?.toUpperCase() || "-"}
                  </td>
                  <td
                    className={`px-8 py-6 text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-600"}`}
                  >
                    {member.phone || "-"}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => onEdit(member)}
                      className={`p-3 rounded-xl transition-all active:scale-90 ${
                        darkMode
                          ? "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                          : "bg-slate-50 text-slate-400 hover:text-[#556B2F] hover:bg-slate-100"
                      }`}
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
