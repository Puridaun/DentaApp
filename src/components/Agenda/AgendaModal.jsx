import React from "react";
import { X, Trash2 } from "lucide-react";
import { ORE_LUCRU } from "./AgendaUtils";

export default function AgendaModal({
  show,
  onClose,
  form,
  setForm,
  doctors,
  patients,
  onSave,
  onDelete,
  editingId,
  darkMode,
}) {
  const toMin = (t) => {
    if (!t) return 0;
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isTimeValid = toMin(form.endTime) > toMin(form.time);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm text-left">
      <div
        className={`w-full max-w-lg p-10 rounded-[3rem] shadow-2xl border animate-in zoom-in duration-300 ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-50 text-slate-900"}`}
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-light uppercase tracking-[0.2em]">
            {editingId ? "Editare" : "Nou"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-300" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
                De la
              </label>
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={`w-full p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              >
                {ORE_LUCRU.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
                Până la
              </label>
              <select
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className={`w-full p-4 rounded-2xl border outline-none text-sm font-light ${!isTimeValid ? "border-red-200" : "focus:border-[#556B2F]"} ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              >
                {ORE_LUCRU.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
                <option value="21:00">21:00</option>
                <option value="22:00">22:00</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
                Medic
              </label>
              <select
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                className={`w-full p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              >
                <option value="">Selectează...</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
                Pacient
              </label>
              <select
                value={form.patientId}
                onChange={(e) =>
                  setForm({ ...form, patientId: e.target.value })
                }
                className={`w-full p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              >
                <option value="">Selectează...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
              Tratament
            </label>
            <input
              type="text"
              value={form.procedure}
              onChange={(e) => setForm({ ...form, procedure: e.target.value })}
              className={`w-full p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              placeholder="Ex: Implant, Consult..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
              Detalii Tratament
            </label>
            <textarea
              rows="2"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`w-full p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light resize-none ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              placeholder="Note suplimentare..."
            />
          </div>

          <div className="flex gap-4 pt-6">
            {editingId && (
              <button
                type="button"
                onClick={onDelete}
                className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={onSave}
              disabled={!isTimeValid || !form.doctorId || !form.patientId}
              className="flex-1 bg-[#556B2F] text-white py-5 rounded-[2rem] font-medium uppercase text-[12px] tracking-[0.3em] shadow-lg shadow-[#556B2F]/10 disabled:opacity-20 active:scale-[0.98] transition-all"
            >
              Confirmă
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
