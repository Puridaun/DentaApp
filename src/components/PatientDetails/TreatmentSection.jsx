import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  ChevronLeft,
  Stethoscope,
  Plus,
  CheckCircle2,
  Clock,
} from "lucide-react";
import ToothChart from "./ToothChart";
import ToothNotes from "./ToothNotes";

const proceduresList = [
  "Consultație",
  "Detartraj",
  "Albire profesională",
  "Obturație",
  "Extracție",
  "Tratament canal",
  "Punte Dentară",
  "Coroană",
  "Implant",
];

export default function TreatmentSection({
  patientId,
  onUpdate,
  darkMode,
  continueFrom,
}) {
  const [step, setStep] = useState(1);
  const [selectedTeeth, setSelectedTeeth] = useState([]);
  const [activeTooth, setActiveTooth] = useState(null);
  const [toothNotes, setToothNotes] = useState({});
  const [customProcedure, setCustomProcedure] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const [newT, setNewT] = useState({
    name: "",
    cost: "",
    paid: "",
    status: "Finalizată",
    note_doctor: "",
    indicatii_post: "",
    date: new Date().toISOString().split("T")[0],
  });

  const getFillColor = (fdiCode) =>
    selectedTeeth.includes(fdiCode) ? "#556B2F" : "#ffffff";

  const handleToothClick = (fdiCode) => {
    setSelectedTeeth((prev) => {
      if (prev.includes(fdiCode)) {
        if (activeTooth === fdiCode) setActiveTooth(null);
        return prev.filter((t) => t !== fdiCode);
      } else {
        setActiveTooth(fdiCode);
        return [...prev, fdiCode];
      }
    });
  };

  const realTeethCount = selectedTeeth.filter((t) => !isNaN(t)).length;
  const hasZonesSelected = selectedTeeth.some((t) => isNaN(t));
  const canFinalize = realTeethCount > 0 || hasZonesSelected;

  const handleSelectProcedure = (name) => {
    setNewT({ ...newT, name: name });
    setStep(2);
  };

  const save = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const detailedToothNotes = Object.entries(toothNotes)
      .filter(([_, n]) => n.trim() !== "")
      .map(([t, n]) => `${t}: ${n}`)
      .join(" | ");

    const finalNotes = detailedToothNotes
      ? `${detailedToothNotes}${newT.note_doctor ? " --- OBS: " + newT.note_doctor : ""}`
      : newT.note_doctor;

    const payload = {
      patient_id: patientId,
      doctor_id: user.id,
      procedure_name: newT.name,
      total_cost: parseFloat(newT.cost || 0),
      amount_paid: parseFloat(newT.paid || 0),
      additional_info: finalNotes,
      indicatii_pacient: newT.indicatii_post || null,
      status: newT.status,
      tooth_number: selectedTeeth.sort().join(", "),
      treatment_date: newT.date,
      treatment_time: new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      // LOGICA DE STACKING:
      parent_id: continueFrom
        ? continueFrom.parent_id || continueFrom.id
        : null,
    };

    const { error } = await supabase.from("treatments").insert([payload]);
    if (!error) onUpdate();
  };

  return (
    <div
      className={`p-4 md:p-8 rounded-[2.5rem] border transition-all duration-300 ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-100 shadow-sm"}`}
    >
      {step === 1 && (
        <div className="flex flex-col gap-2">
          {proceduresList.map((p) => (
            <button
              key={p}
              onClick={() => handleSelectProcedure(p)}
              className="flex items-center gap-4 px-6 py-3.5 rounded-xl border border-slate-50 bg-[#f2f6f0]/30 hover:border-[#556B2F] transition-all text-left text-slate-700 font-bold uppercase text-[11px] tracking-widest"
            >
              <Stethoscope size={14} className="text-[#556B2F] opacity-50" />{" "}
              {p}
            </button>
          ))}
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className="flex items-center gap-4 px-6 py-3.5 rounded-xl border border-dashed border-slate-200 bg-white hover:border-[#556B2F] transition-all text-left text-slate-400 font-bold mt-2 uppercase text-[11px] tracking-widest"
            >
              <Plus size={14} /> Alt tratament...
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <input
                autoFocus
                type="text"
                placeholder="Scrie procedura..."
                className="w-full p-4 rounded-xl border border-[#556B2F]/30 bg-white text-slate-700 outline-none"
                value={customProcedure}
                onChange={(e) => setCustomProcedure(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomInput(false)}
                  className="flex-1 p-3 text-[10px] uppercase font-bold text-slate-400"
                >
                  Anulează
                </button>
                <button
                  disabled={!customProcedure.trim()}
                  onClick={() => handleSelectProcedure(customProcedure)}
                  className="flex-[2] p-3 bg-[#556B2F] text-white rounded-lg text-[10px] uppercase font-bold disabled:opacity-30"
                >
                  Continuă
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <span className="text-[13px] font-bold text-[#556B2F] uppercase tracking-widest">
              {newT.name}
            </span>
            <button
              onClick={() => setStep(1)}
              className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1"
            >
              {" "}
              <ChevronLeft size={12} /> Înapoi
            </button>
          </div>
          {!activeTooth ? (
            <div className="flex flex-col items-center">
              <ToothChart
                selectedTeeth={selectedTeeth}
                onToothClick={handleToothClick}
                getFillColor={getFillColor}
                activeTooth={activeTooth}
              />
              {canFinalize && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full mt-6 py-4 bg-[#556B2F] text-white rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-lg"
                >
                  Pasul final {realTeethCount > 0 ? `(${realTeethCount})` : ""}
                </button>
              )}
            </div>
          ) : (
            <ToothNotes
              activeTooth={activeTooth}
              toothNotes={toothNotes}
              setToothNotes={setToothNotes}
              onBack={() => setActiveTooth(null)}
              onNext={() => setActiveTooth(null)}
              isLast={true}
            />
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in text-left">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4 text-slate-800">
            <h4 className="text-[11px] font-medium uppercase text-[#556B2F] tracking-widest font-bold">
              Detalii Finalizare
            </h4>
            <button
              onClick={() => setStep(2)}
              className="text-[10px] text-slate-400 uppercase tracking-widest font-bold"
            >
              <ChevronLeft size={12} /> Înapoi
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setNewT({ ...newT, status: "Finalizată" })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-[10px] uppercase transition-all ${newT.status === "Finalizată" ? "bg-[#556B2F] border-[#556B2F] text-white shadow-md" : "bg-white border-slate-100 text-slate-400"}`}
            >
              <CheckCircle2 size={14} /> Finalizat
            </button>
            <button
              onClick={() => setNewT({ ...newT, status: "În lucru" })}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-[10px] uppercase transition-all ${newT.status === "În lucru" ? "bg-amber-500 border-amber-500 text-white shadow-md" : "bg-white border-slate-100 text-slate-400"}`}
            >
              <Clock size={14} /> În lucru
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-slate-800">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                Cost Total
              </label>
              <input
                type="number"
                value={newT.cost}
                onChange={(e) => setNewT({ ...newT, cost: e.target.value })}
                className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-[14px] outline-none font-bold"
                placeholder="RON"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
                Achitat
              </label>
              <input
                type="number"
                value={newT.paid}
                onChange={(e) => setNewT({ ...newT, paid: e.target.value })}
                className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-[14px] outline-none font-bold"
                placeholder="RON"
              />
            </div>
          </div>

          <div className="space-y-1 text-slate-800">
            <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">
              Observații Doctor
            </label>
            <textarea
              value={newT.note_doctor}
              onChange={(e) =>
                setNewT({ ...newT, note_doctor: e.target.value })
              }
              className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 text-[13px] min-h-[80px] outline-none resize-none"
              placeholder="Note interne..."
            />
          </div>
          <div className="space-y-1 text-slate-800">
            <label className="text-[9px] font-bold text-[#556B2F] uppercase ml-1">
              Indicații post-operatorii
            </label>
            <textarea
              value={newT.indicatii_post}
              onChange={(e) =>
                setNewT({ ...newT, indicatii_post: e.target.value })
              }
              className="w-full p-4 rounded-xl border border-[#556B2F]/10 bg-[#f2f6f0]/30 text-[13px] min-h-[80px] outline-none resize-none italic"
              placeholder="Instrucțiuni pentru pacient..."
            />
          </div>

          <button
            onClick={save}
            className="w-full py-4 bg-[#556B2F] text-white rounded-xl font-bold uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Salvează în fișă
          </button>
        </div>
      )}
    </div>
  );
}
