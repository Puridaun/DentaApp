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
  darkMode, // Asigură-te că primești acest prop din PatientDetailsPage
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
        fisa_snapshot: currentPatient,
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
    <div
      className={`p-5 md:p-10 rounded-[2.5rem] border-2 transition-all duration-300 text-left animate-in fade-in ${
        darkMode
          ? "bg-[#1E293B] border-slate-800 text-white"
          : "bg-white border-slate-50 shadow-sm text-slate-800"
      }`}
    >
      {/* INDICATOR PASI */}
      <div className="flex gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? "bg-olive-base" : darkMode ? "bg-slate-800" : "bg-slate-100"}`}
          />
        ))}
      </div>

      {/* PAS 1: SELECTIE MANOPERA */}
      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-bottom-2">
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
              className={`p-6 rounded-2xl border-2 text-[13px] font-bold uppercase tracking-widest transition-all text-left ${
                darkMode
                  ? "border-slate-800 bg-slate-900/50 text-slate-300 hover:border-olive-base hover:text-white"
                  : "border-slate-50 text-slate-600 hover:border-olive-base hover:bg-olive-base/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* PAS 1.5: CUSTOM NAME */}
      {step === 1.5 && (
        <div className="animate-in fade-in space-y-6">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
            Introdu numele manoperei
          </label>
          <input
            autoFocus
            type="text"
            value={newT.customName}
            onChange={(e) => setNewT({ ...newT, customName: e.target.value })}
            className={`w-full p-5 rounded-2xl border-2 outline-none transition-all ${
              darkMode
                ? "bg-slate-900 border-slate-800 focus:border-olive-base text-white"
                : "bg-slate-50 border-slate-100 focus:border-olive-base"
            }`}
            placeholder="Ex: Reconstrucție pivot..."
          />
          <button
            onClick={() => setStep(2)}
            className="w-full bg-olive-base text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg shadow-olive-base/20"
          >
            Continuă la dinți
          </button>
        </div>
      )}

      {/* PAS 2: SELECTIE DINTI */}
      {step === 2 && (
        <div className="animate-in fade-in space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-olive-base">
              Pas 2: Selectează Dinții
            </h3>
            <button
              onClick={() => setStep(1)}
              className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:text-olive-base"
            >
              <ChevronLeft size={14} /> Schimbă manopera
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cadrane.map((c) => (
              <div
                key={c.id}
                className={`p-6 rounded-[2rem] border ${darkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50/50 border-slate-100"}`}
              >
                <p className="text-[10px] font-black text-slate-500 uppercase mb-5 tracking-widest">
                  {c.label}
                </p>
                <div className="flex flex-wrap gap-2.5">
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
                        className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xs font-black transition-all ${
                          sel
                            ? "bg-olive-base text-white border-olive-base shadow-lg shadow-olive-base/20"
                            : darkMode
                              ? "bg-slate-800 text-slate-600 border-slate-700"
                              : "bg-white text-slate-300 border-slate-100"
                        }`}
                      >
                        {id}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div
            className={`p-6 rounded-[2rem] border flex items-center justify-between gap-4 ${darkMode ? "bg-amber-500/5 border-amber-500/20" : "bg-amber-50 border-amber-100"}`}
          >
            <div className="flex items-center gap-4">
              <AlertCircle size={24} className="text-amber-500" />
              <div>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${darkMode ? "text-amber-400" : "text-amber-800"}`}
                >
                  Actualizare Fișă Clinică
                </p>
                <p
                  className={`text-[11px] font-medium ${darkMode ? "text-amber-500/70" : "text-amber-600"}`}
                >
                  S-a schimbat ceva în starea de sănătate?
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsFisaOpen(true)}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${darkMode ? "bg-amber-500/20 text-amber-400" : "bg-white border-2 border-amber-200 text-amber-700 hover:bg-amber-100"}`}
            >
              <FileText size={14} className="inline mr-2" /> Modifică Fișa
            </button>
          </div>

          <button
            onClick={() => setStep(3)}
            disabled={selectedTeeth.length === 0}
            className={`w-full py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all ${selectedTeeth.length > 0 ? "bg-olive-base text-white shadow-xl shadow-olive-base/20" : darkMode ? "bg-slate-800 text-slate-600" : "bg-slate-100 text-slate-300"}`}
          >
            Continuă la Detalii Financiare
          </button>
        </div>
      )}

      {/* PAS 3: FINALIZARE */}
      {step === 3 && (
        <div className="animate-in fade-in space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-olive-base">
              Pas 3: Finalizare Vizită
            </h3>
            <button
              onClick={() => setStep(2)}
              className="text-[10px] font-bold text-slate-500 flex items-center gap-1 hover:text-olive-base"
            >
              <ChevronLeft size={14} /> Înapoi la dinți
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Cost Total (RON)", k: "cost" },
              { l: "Achitat (RON)", k: "paid" },
              { l: "Data", k: "date", t: "date" },
              { l: "Ora", k: "time", t: "time" },
            ].map((f) => (
              <div key={f.k} className="space-y-2 relative">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  {f.l}
                </label>
                <input
                  type={f.t || "number"}
                  value={newT[f.k]}
                  onChange={(e) => setNewT({ ...newT, [f.k]: e.target.value })}
                  className={`w-full p-4 rounded-xl border transition-all text-sm outline-none focus:border-olive-base ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-100 text-slate-800"}`}
                />
                {f.k === "paid" && (
                  <div className="absolute -top-1 right-0 text-[8px] font-black text-red-500 uppercase italic">
                    Rest:{" "}
                    {(
                      parseFloat(newT.cost || 0) - parseFloat(newT.paid || 0)
                    ).toFixed(0)}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <textarea
              placeholder="Observații clinice..."
              value={newT.note}
              onChange={(e) => setNewT({ ...newT, note: e.target.value })}
              className={`w-full p-5 rounded-[2rem] text-sm min-h-[120px] outline-none border transition-all focus:border-olive-base ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-100 text-slate-800"}`}
            />
            <textarea
              placeholder="Indicații post-operatorii..."
              value={newT.meds}
              onChange={(e) => setNewT({ ...newT, meds: e.target.value })}
              className={`w-full p-5 rounded-[2rem] text-sm min-h-[120px] outline-none border transition-all focus:border-olive-base ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-100 text-slate-800"}`}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-500/10">
            <div className="flex gap-8">
              {["Finalizată", "În lucru"].map((s) => (
                <label
                  key={s}
                  className={`flex items-center gap-3 text-[11px] font-black uppercase cursor-pointer tracking-widest ${s === "În lucru" ? "text-amber-500" : ""}`}
                >
                  <input
                    type="radio"
                    checked={newT.status === s}
                    onChange={() => setNewT({ ...newT, status: s })}
                    className={`w-5 h-5 ${s === "În lucru" ? "accent-amber-500" : "accent-olive-base"}`}
                  />{" "}
                  {s}
                </label>
              ))}
            </div>

            <button
              onClick={save}
              className="w-full md:w-auto bg-olive-base text-white px-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-olive-base/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <Check size={20} /> Salvează Vizita
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
