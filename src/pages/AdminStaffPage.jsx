import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loader2, User, Edit2, X, Check } from "lucide-react";

// Paleta de culori oficială
const COLOR_OPTIONS = [
  { id: "violet", hex: "#E6E6FA", bg: "bg-[#E6E6FA]" },
  { id: "albastru", hex: "#F0F8FF", bg: "bg-[#F0F8FF]" },
  { id: "verde", hex: "#F5FFFA", bg: "bg-[#F5FFFA]" },
  { id: "piersica", hex: "#FFF5EE", bg: "bg-[#FFF5EE]" },
  { id: "roz", hex: "#FFF0F5", bg: "bg-[#FFF0F5]" },
];

export default function AdminStaffPage({ darkMode }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*");
      if (!error) setStaff(data || []);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (member) => {
    // Ne asigurăm că are o culoare setată implicit în state-ul de editare
    setEditingMember({
      ...member,
      color_preference: member.color_preference || "#E6E6FA",
    });
    setIsModalOpen(true);
  };

  async function handleUpdate() {
    setSaving(true);
    const fullName =
      `${editingMember.last_name} ${editingMember.first_name}`.trim();

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: editingMember.first_name,
        last_name: editingMember.last_name,
        full_name: fullName,
        specialization: editingMember.specialization,
        phone: editingMember.phone,
        color_preference: editingMember.color_preference, // Salvează culoarea aleasă
      })
      .eq("id", editingMember.id);

    if (!error) {
      setIsModalOpen(false);
      fetchStaff();
    }
    setSaving(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700 text-left font-sans">
      <div className="mb-10">
        <h1
          className={`text-2xl font-medium tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          Gestiune Echipă Medicală
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-light italic">
          Monitorizare și editare profiluri medici.
        </p>
      </div>

      <div
        className={`rounded-[2rem] border overflow-hidden ${darkMode ? "border-slate-800 bg-slate-900" : "bg-white border-slate-100 shadow-sm"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className={darkMode ? "bg-slate-800/30" : "bg-slate-50/50"}>
                <th className="px-6 py-4 text-[9px] font-medium uppercase tracking-widest text-slate-400">
                  Medic
                </th>
                <th className="px-6 py-4 text-[9px] font-medium uppercase tracking-widest text-slate-400">
                  Specializare
                </th>
                <th className="px-6 py-4 text-[9px] font-medium uppercase tracking-widest text-slate-400">
                  Telefon
                </th>
                <th className="px-6 py-4 text-[9px] font-medium uppercase tracking-widest text-slate-400 text-right pr-8">
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
                    className="py-20 text-center text-slate-400 text-sm font-light italic"
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
                            backgroundColor:
                              member.color_preference || "#556B2F",
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
                        onClick={() => handleEditClick(member)}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
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

      {/* MODAL EDITARE DOCTOR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-md">
          <div
            className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border transition-all ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100"}`}
          >
            <div className="flex justify-between items-center mb-8">
              <h3
                className={`text-xl font-medium tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
              >
                Editează Medic
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <InputBlock
                  label="Nume"
                  value={editingMember.last_name}
                  onChange={(v) =>
                    setEditingMember({ ...editingMember, last_name: v })
                  }
                  darkMode={darkMode}
                />
                <InputBlock
                  label="Prenume"
                  value={editingMember.first_name}
                  onChange={(v) =>
                    setEditingMember({ ...editingMember, first_name: v })
                  }
                  darkMode={darkMode}
                />
              </div>
              <InputBlock
                label="Specializare"
                value={editingMember.specialization}
                onChange={(v) =>
                  setEditingMember({ ...editingMember, specialization: v })
                }
                darkMode={darkMode}
              />
              <InputBlock
                label="Telefon"
                value={editingMember.phone}
                onChange={(v) =>
                  setEditingMember({ ...editingMember, phone: v })
                }
                darkMode={darkMode}
              />

              {/* SELECTOR CULOARE INTEGRAT IN MODAL */}
              <div className="space-y-3 pt-2">
                <label className="text-[9px] font-medium uppercase tracking-widest text-slate-400">
                  Culoare Identitate Doctor
                </label>
                <div className="flex gap-3">
                  {COLOR_OPTIONS.map((color) => (
                    <button
                      key={color.id}
                      onClick={() =>
                        setEditingMember({
                          ...editingMember,
                          color_preference: color.hex,
                        })
                      }
                      className={`w-8 h-8 rounded-xl border-2 transition-all ${color.bg} ${
                        editingMember.color_preference === color.hex
                          ? "border-slate-800 scale-110 shadow-sm"
                          : "border-transparent opacity-60"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="w-full bg-[#556B2F] text-white py-4 rounded-2xl font-medium text-[11px] uppercase tracking-widest shadow-lg mt-4 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Check size={16} />
                )}
                Actualizează Datele
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputBlock({ label, value, onChange, darkMode }) {
  return (
    <div className="space-y-1 text-left">
      <label className="text-[9px] font-medium uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-b py-2 outline-none transition-all text-[14px] font-normal 
          ${darkMode ? "text-slate-200 border-slate-800" : "text-slate-700 border-slate-100 focus:border-[#556B2F]"}`}
      />
    </div>
  );
}
