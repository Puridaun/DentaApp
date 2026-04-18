import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Check, AlertCircle, FileText, ChevronLeft } from "lucide-react";

const proceduresList = [
  "Consultație",
  "Detartraj",
  "Albire profesională",
  "Obturație (Plombă)",
  "Extracție",
  "Tratament canal (Endo)",
  "Punte Dentară",
  "Coroană",
  "Implant",
  "Altă procedură...",
];

const cadrane = [
  { id: 1, range: "18-11", label: "Maxilar Dreapta" },
  { id: 2, range: "21-28", label: "Maxilar Stânga" },
  { id: 3, range: "31-38", label: "Mandibulă Stânga" },
  { id: 4, range: "41-48", label: "Mandibulă Dreapta" },
];

export default function TreatmentSection({
  patientId,
  onUpdate,
  continueFrom,
  currentDoctorName,
  setIsFisaOpen,
}) {
  const [step, setStep] = useState(continueFrom ? 2 : 1);
  const [selectedTeeth, setSelectedTeeth] = useState(
    continueFrom ? continueFrom.tooth_number?.split(", ") || [] : [],
  );
  const [isCustom, setIsCustom] = useState(false);

  const [newT, setNewT] = useState({
    name: continueFrom ? continueFrom.procedure_name : "",
    customName: "",
    cost: "",
    paid: "",
    note: "",
    meds: "",
    status: "Finalizată",
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });

  const save = async () => {
    const { data: currentPatient } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const finalName = isCustom ? newT.customName : newT.name;

    const { error } = await supabase.from("treatments").insert([
      {
        patient_id: patientId,
        procedure_name: finalName,
        tooth_number: selectedTeeth.sort().join(", "),
        total_cost: parseFloat(newT.cost || 0),
        amount_paid: parseFloat(newT.paid || 0),
        additional_info: newT.note,
        indicatii_pacient: newT.meds,
        status: newT.status,
        treatment_date: newT.date,
        treatment_time: newT.time,
        parent_id: continueFrom ? continueFrom.id : null,
        doctor_id: user.id,
        fisa_snapshot: currentPatient, // Aici salvăm starea fișei din acest moment
      },
    ]);

    if (!error) {
      setStep(1);
      setSelectedTeeth([]);
      setIsCustom(false);
      onUpdate();
    } else {
      alert("Eroare la salvare: " + error.message);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-white rounded-[2rem] border-2 border-slate-100 shadow-sm text-left animate-in fade-in duration-500">
      {/* INDICATOR PASI */}
      <div className="flex gap-1 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${step >= s ? "bg-[#556B2F]" : "bg-slate-100"}`}
          />
        ))}
      </div>

      {/* PAS 1: SELECTIE MANOPERA */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in slide-in-from-bottom-2">
          {proceduresList.map((p) => (
            <button
              key={p}
              onClick={() => {
                if (p === "Altă procedură...") {
                  setIsCustom(true);
                  setStep(1.5);
                } else {
                  setNewT({ ...newT, name: p });
                  setStep(2);
                }
              }}
              className="p-5 rounded-2xl border-2 border-slate-50 text-sm font-bold text-slate-600 hover:border-[#556B2F] hover:bg-[#556B2F]/5 transition-all text-left"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* PAS 1.5: NUME CUSTOM (DOAR DACA A ALES ALTA PROCEDURA) */}
      {step === 1.5 && (
        <div className="animate-in fade-in space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400">
            Introdu numele manoperei
          </label>
          <input
            autoFocus
            type="text"
            value={newT.customName}
            onChange={(e) => setNewT({ ...newT, customName: e.target.value })}
            className="w-full p-4 rounded-xl border-2 border-slate-100 outline-none focus:border-[#556B2F]"
            placeholder="Ex: Reconstrucție pivot..."
          />
          <button
            onClick={() => setStep(2)}
            className="w-full bg-[#556B2F] text-white py-4 rounded-xl font-bold uppercase text-[10px]"
          >
            Continuă la dinți
          </button>
        </div>
      )}

      {/* PAS 2: SELECTIE DINTI SI UPDATE FISA */}
      {step === 2 && (
        <div className="animate-in fade-in space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#556B2F]">
              Pas 2: Selectează Dinții
            </h3>
            <button
              onClick={() => setStep(1)}
              className="text-[10px] font-bold text-slate-400 flex items-center gap-1 hover:text-slate-600"
            >
              <ChevronLeft size={14} /> Schimbă manopera
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cadrane.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border-2 border-slate-50 bg-slate-50/30"
              >
                <p className="text-[9px] font-black text-slate-400 uppercase mb-3 tracking-widest">
                  {c.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((d) => {
                    const id = `${c.id}${d}`;
                    const sel = selectedTeeth.includes(id);
                    return (
                      <button
                        key={id}
                        onClick={() =>
                          setSelectedTeeth((s) =>
                            sel ? s.filter((x) => x !== id) : [...s, id],
                          )
                        }
                        className={`w-9 h-9 rounded-xl border-2 flex items-center justify-center text-[11px] font-black transition-all ${sel ? "bg-[#556B2F] text-white border-[#556B2F] shadow-lg shadow-[#556B2F]/20" : "bg-white text-slate-300 border-slate-100"}`}
                      >
                        {id}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* BOX ALERT PENTRU FISA */}
          <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                  Actualizare Fișă Clinică
                </p>
                <p className="text-[11px] text-amber-600 font-medium">
                  S-a schimbat ceva în starea de sănătate a pacientului?
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFisaOpen(true)}
              className="bg-white border-2 border-amber-200 text-amber-700 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-amber-100 transition-all flex items-center gap-2"
            >
              <FileText size={14} /> Modifică Fișa acum
            </button>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={selectedTeeth.length === 0}
            className={`w-full py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${selectedTeeth.length > 0 ? "bg-[#556B2F] text-white shadow-lg" : "bg-slate-100 text-slate-300"}`}
          >
            Continuă la Detalii Financiare
          </button>
        </div>
      )}

      {/* PAS 3: COSTURI SI SALVARE FINALA */}
      {step === 3 && (
        <div className="animate-in fade-in space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#556B2F]">
              Pas 3: Finalizare Vizită
            </h3>
            <button
              onClick={() => setStep(2)}
              className="text-[10px] font-bold text-slate-400 flex items-center gap-1 hover:text-slate-600"
            >
              <ChevronLeft size={14} /> Înapoi la dinți
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">
                Cost Total (RON)
              </label>
              <input
                type="number"
                value={newT.cost}
                onChange={(e) => setNewT({ ...newT, cost: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 outline-none text-sm focus:border-[#556B2F]"
                placeholder="0"
              />
            </div>
            <div className="space-y-1 relative">
              <label className="text-[9px] font-bold text-slate-400 uppercase">
                Achitat (RON)
              </label>
              <input
                type="number"
                value={newT.paid}
                onChange={(e) => setNewT({ ...newT, paid: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 outline-none text-sm focus:border-[#556B2F]"
                placeholder="0"
              />
              <div className="absolute -top-1 right-0 text-[7px] font-black text-red-500 uppercase">
                Rest:{" "}
                {(
                  parseFloat(newT.cost || 0) - parseFloat(newT.paid || 0)
                ).toFixed(0)}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">
                Data
              </label>
              <input
                type="date"
                value={newT.date}
                onChange={(e) => setNewT({ ...newT, date: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 outline-none text-sm focus:border-[#556B2F]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">
                Ora
              </label>
              <input
                type="time"
                value={newT.time}
                onChange={(e) => setNewT({ ...newT, time: e.target.value })}
                className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 outline-none text-sm focus:border-[#556B2F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea
              placeholder="Observații clinice (ce s-a lucrat)..."
              value={newT.note}
              onChange={(e) => setNewT({ ...newT, note: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs min-h-[100px] outline-none focus:border-[#556B2F]"
            />
            <textarea
              placeholder="Indicații post-operatorii pentru pacient..."
              value={newT.meds}
              onChange={(e) => setNewT({ ...newT, meds: e.target.value })}
              className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs min-h-[100px] outline-none focus:border-[#556B2F]"
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-50">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase cursor-pointer">
                <input
                  type="radio"
                  checked={newT.status === "Finalizată"}
                  onChange={() => setNewT({ ...newT, status: "Finalizată" })}
                  className="accent-[#556B2F] w-4 h-4"
                />{" "}
                Finalizată
              </label>
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase cursor-pointer text-amber-600">
                <input
                  type="radio"
                  checked={newT.status === "În lucru"}
                  onChange={() => setNewT({ ...newT, status: "În lucru" })}
                  className="accent-amber-500 w-4 h-4"
                />{" "}
                În Lucru
              </label>
            </div>

            <button
              onClick={save}
              className="w-full md:w-auto bg-[#556B2F] text-white px-12 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#556B2F]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} /> Salvează Manopera și Snapshot Fișă
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
