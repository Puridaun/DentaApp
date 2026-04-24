import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Trash2,
  ArrowRight,
  ClipboardList,
  Plus,
  X,
  Loader2,
} from "lucide-react";

export default function TreatmentPlanSection({ patient, onUpdate, darkMode }) {
  const planItems = (patient?.treatments || []).filter(
    (t) => t.status === "Planificat",
  );

  // Starea pentru mini-formularul de adăugare
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPlan, setNewPlan] = useState({ tooth: "", info: "", cost: "" });

  // Funcția de adăugare DIRECT în plan
  const handleAddPlan = async () => {
    if (!newPlan.info.trim())
      return alert("Te rugăm să adaugi informații despre tratament.");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const payload = {
      patient_id: patient.id,
      doctor_id: user?.id,
      procedure_name: newPlan.info, // Folosim acest câmp pentru titlu/info
      tooth_number: newPlan.tooth,
      total_cost: parseFloat(newPlan.cost || 0),
      status: "Planificat",
      treatment_date: new Date().toISOString().split("T")[0],
    };

    const { error } = await supabase.from("treatments").insert([payload]);

    if (!error) {
      setNewPlan({ tooth: "", info: "", cost: "" });
      setIsAdding(false);
      onUpdate(); // Actualizează lista
    } else {
      alert("Eroare la salvare: " + error.message);
    }
    setLoading(false);
  };

  // Mută direct în cronologie
  const handleExecute = async (id) => {
    if (
      !window.confirm(
        "Marchezi acest tratament ca finalizat? Va fi mutat în cronologie.",
      )
    )
      return;
    const { error } = await supabase
      .from("treatments")
      .update({ status: "Finalizată" })
      .eq("id", id);
    if (!error) onUpdate();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ștergi această manoperă din plan?")) return;
    const { error } = await supabase.from("treatments").delete().eq("id", id);
    if (!error) onUpdate();
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      {/* HEADER */}
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#556B2F] flex items-center gap-2">
            <ClipboardList size={16} /> Plan de tratament
          </h3>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
            Listă To-Do
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-4 bg-[#556B2F] text-white rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all shrink-0"
          >
            <Plus size={24} />
          </button>
        )}
      </div>

      {/* MINI FORMULAR INLINE PENTRU ADAUGARE */}
      {isAdding && (
        <div
          className={`p-6 md:p-8 rounded-[2.5rem] border-2 shadow-lg mb-6 animate-in zoom-in-95 duration-300 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-[#556B2F]/20"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-[13px] font-bold text-[#556B2F] uppercase tracking-widest">
              Adaugă în Plan
            </h4>
            <button
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-red-500 p-2"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Număr Dinte
                </label>
                <input
                  type="text"
                  value={newPlan.tooth}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, tooth: e.target.value })
                  }
                  placeholder="Ex: 14, 15..."
                  className={`w-full p-4 rounded-2xl border-2 outline-none font-bold ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-100"}`}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Cost Estimat (RON)
                </label>
                <input
                  type="number"
                  value={newPlan.cost}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, cost: e.target.value })
                  }
                  placeholder="0"
                  className={`w-full p-4 rounded-2xl border-2 outline-none font-bold ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-100"}`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                Informații / Manoperă
              </label>
              <textarea
                value={newPlan.info}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, info: e.target.value })
                }
                placeholder="Detalii despre intervenția planificată..."
                className={`w-full p-4 rounded-2xl border-2 outline-none min-h-[100px] resize-none ${darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-slate-50 border-slate-100"}`}
              />
            </div>

            <button
              onClick={handleAddPlan}
              disabled={loading}
              className="w-full py-4 mt-2 bg-[#556B2F] text-white rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg flex items-center justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                "Salvează în To-Do"
              )}
            </button>
          </div>
        </div>
      )}

      {/* LISTA DE ITEME PLANIFICATE */}
      {planItems.length === 0 && !isAdding ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] text-slate-400 italic text-[13px]">
          Planul este gol. Apasă pe + pentru a adăuga.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {planItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col md:flex-row md:items-center justify-between p-6 md:p-8 rounded-[2rem] border-2 transition-all ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-50 shadow-sm"}`}
            >
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <h4 className="font-black text-[18px] uppercase tracking-tight text-black dark:text-white leading-tight break-words">
                  {item.procedure_name}
                </h4>
                {item.tooth_number && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-2.5 py-1 rounded-md uppercase tracking-widest">
                      Dinți: {item.tooth_number}
                    </span>
                  </div>
                )}
                {item.total_cost > 0 && (
                  <p className="text-[13px] font-black text-[#556B2F] uppercase tracking-wider mt-1">
                    Cost: {item.total_cost} RON
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 mt-5 md:mt-0 pt-5 md:pt-0 border-t md:border-none border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleExecute(item.id)}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#556B2F] text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-[#455726] transition-all shadow-sm"
                >
                  Efectuează <ArrowRight size={12} />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
