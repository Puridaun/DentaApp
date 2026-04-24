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
  const toMin = (t) =>
    t
      ? t
          .split(":")
          .map(Number)
          .reduce((h, m) => h * 60 + m)
      : 0;
  const isTimeValid = toMin(form.endTime) > toMin(form.time);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-slate-900/20 backdrop-blur-sm text-left font-sans">
      <div
        className={`w-full max-w-lg p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl border animate-in zoom-in duration-300 
        overflow-y-auto max-h-[95vh] scrollbar-hide
        ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-50 text-slate-900"}`}
      >
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <h2 className="text-lg md:text-xl font-light uppercase tracking-[0.2em]">
            {editingId ? "Editare" : "Nou"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} className="text-slate-300" />
          </button>
        </div>

        <div className="space-y-5 md:space-y-6">
          {/* SELECTOR STATUS PREZENȚĂ */}
          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-[#556B2F] ml-1">
              Prezență Pacient
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Programat", "Prezent", "Anulat", "Absent"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setForm({ ...form, attendance_status: st })}
                  className={`py-2.5 md:py-3 px-2 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    form.attendance_status === st
                      ? "bg-[#556B2F] border-[#556B2F] text-white shadow-md"
                      : "bg-slate-50 border-slate-100 text-slate-400"
                  }`}
                >
                  {st === "Programat" && "📅 "}
                  {st === "Prezent" && "✅ "}
                  {st === "Anulat" && "❌ "}
                  {st === "Absent" && "🚫 "}
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
                De la
              </label>
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={`w-full p-3 md:p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              >
                {ORE_LUCRU.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
                Până la
              </label>
              <select
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                className={`w-full p-3 md:p-4 rounded-2xl border outline-none text-sm font-light ${!isTimeValid ? "border-red-200" : "focus:border-[#556B2F]"} ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
                Medic
              </label>
              <select
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                className={`w-full p-3 md:p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
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
              <label className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
                Pacient
              </label>
              <select
                value={form.patientId}
                onChange={(e) => {
                  const pId = e.target.value;
                  const pObj = patients.find((p) => p.id === pId);
                  setForm({
                    ...form,
                    patientId: pId,
                    customName: pObj ? pObj.full_name : form.customName,
                  });
                }}
                className={`w-full p-3 md:p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              >
                <option value="">Pacient Neînregistrat...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
              Nume Pacient (Manual)
            </label>
            <input
              type="text"
              value={form.customName}
              onChange={(e) => setForm({ ...form, customName: e.target.value })}
              className={`w-full p-3 md:p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              placeholder="Scrie numele complet..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
              Tratament
            </label>
            <input
              type="text"
              value={form.procedure}
              onChange={(e) => setForm({ ...form, procedure: e.target.value })}
              className={`w-full p-3 md:p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              placeholder="Ex: Implant, Consult..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1">
              Detalii Tratament
            </label>
            <textarea
              rows="2"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`w-full p-3 md:p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm font-light resize-none ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-100"}`}
              placeholder="Note suplimentare..."
            />
          </div>

          <div className="flex gap-3 md:gap-4 pt-4 md:pt-6">
            {editingId && (
              <button
                type="button"
                onClick={onDelete}
                className="p-3 md:p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={onSave}
              disabled={
                !isTimeValid ||
                !form.doctorId ||
                (!form.patientId && !form.customName)
              }
              className="flex-1 bg-[#556B2F] text-white py-4 md:py-5 rounded-[2rem] font-bold uppercase text-[11px] md:text-[12px] tracking-[0.3em] shadow-lg disabled:opacity-20 transition-all"
            >
              Confirmă
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
