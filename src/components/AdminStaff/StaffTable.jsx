import React from "react";
import { Loader2, User, Edit2 } from "lucide-react";

export default function StaffTable({ staff, loading, onEdit, darkMode }) {
  return (
    <div
      className={`rounded-[2rem] border overflow-hidden ${darkMode ? "border-slate-800 bg-text-main" : "bg-white border-slate-100 shadow-sm"}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className={darkMode ? "bg-slate-800/30" : "bg-slate-50/50"}>
              <th className="px-6 py-4 text-[9px] font-medium uppercase tracking-widest text-text-muted">
                Medic
              </th>
              <th className="px-6 py-4 text-[9px] font-medium uppercase tracking-widest text-text-muted">
                Specializare
              </th>
              <th className="px-6 py-4 text-[9px] font-medium uppercase tracking-widest text-text-muted">
                Telefon
              </th>
              <th className="px-6 py-4 text-[9px] font-medium uppercase tracking-widest text-text-muted text-right pr-8">
                Acțiuni
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-slate-200" />
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-20 text-center text-text-muted text-sm font-light italic"
                >
                  Niciun profil găsit.
                </td>
              </tr>
            ) : (
              staff.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                        style={{
                          backgroundColor: member.color_preference || "#556B2F",
                        }}
                      >
                        <User size={14} />
                      </div>
                      <p
                        className={`text-[14px] font-normal ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                      >
                        {member.full_name || "Incomplet"}
                      </p>
                    </div>
                  </td>
                  <td
                    className={`px-6 py-5 text-[14px] font-normal ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {member.specialization || "-"}
                  </td>
                  <td
                    className={`px-6 py-5 text-[14px] font-normal ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {member.phone || "-"}
                  </td>
                  <td className="px-6 py-5 text-right pr-6">
                    <button
                      onClick={() => onEdit(member)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-text-muted transition-colors"
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
