import React from "react";
import { XCircle, Trash2 } from "lucide-react";
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
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm text-left">
      <div className="bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl animate-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800">
            {editingId ? "Editare" : "Programare Nouă"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-slate-600"
          >
            <XCircle size={28} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] font-black uppercase text-text-muted ml-2">
                Ora
              </label>
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold bg-slate-50"
              >
                {ORE_LUCRU.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[9px] font-black uppercase text-text-muted ml-2">
                Doctor
              </label>
              <select
                value={form.doctorId}
                onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold bg-slate-50"
              >
                <option value="">Alege Doctor...</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.full_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[9px] font-black uppercase text-text-muted ml-2">
              Pacient
            </label>
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold"
            >
              <option value="">Alege Pacient...</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[9px] font-black uppercase text-text-muted ml-2">
              Manoperă
            </label>
            <input
              type="text"
              value={form.procedure}
              onChange={(e) => setForm({ ...form, procedure: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold"
              placeholder="Ex: Control..."
            />
          </div>

          <div>
            <label className="text-[9px] font-black uppercase text-text-muted ml-2">
              Note / Comentarii
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-medium min-h-[80px]"
              placeholder="Note interne..."
            />
          </div>

          <div className="flex gap-2">
            {editingId && (
              <button
                onClick={onDelete}
                className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={onSave}
              disabled={!form.patientId || !form.doctorId}
              className="flex-1 bg-olive-base text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl disabled:opacity-20 active:scale-95 transition-all"
            >
              {editingId ? "Actualizează" : "Salvează"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
