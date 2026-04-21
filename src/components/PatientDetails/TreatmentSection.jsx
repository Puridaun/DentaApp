import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Check,
  ChevronLeft,
  ArrowRight,
  Edit3,
  Stethoscope,
} from "lucide-react";

import arcadaSupImg from "../../assets/Arcada superioara.png";
import arcadaInfImg from "../../assets/Arcada inferioara.png";

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

const getToothColor = (number, isSelected, darkMode) => {
  const n = parseInt(number);
  if (isSelected)
    return "bg-[#556B2F] text-white border-transparent shadow-md scale-[1.02]";
  if ([11, 12, 13, 21, 22, 23, 31, 32, 33, 41, 42, 43].includes(n)) {
    return darkMode
      ? "bg-blue-900/10 border-blue-900/30 text-blue-400"
      : "bg-blue-50/50 border-blue-100/50 text-blue-500 hover:border-blue-200";
  }
  if ([14, 15, 24, 25, 34, 35, 44, 45].includes(n)) {
    return darkMode
      ? "bg-rose-900/10 border-rose-900/30 text-rose-400"
      : "bg-rose-50/50 border-rose-100/50 text-rose-500 hover:border-rose-200";
  }
  return darkMode
    ? "bg-emerald-900/10 border-emerald-900/30 text-emerald-400"
    : "bg-emerald-50/50 border-emerald-100/50 text-emerald-500 hover:border-emerald-200";
};

const odontogramaData = {
  superioara: {
    stanga: {
      label: "Cadran 1 (11-18)",
      teeth: [11, 12, 13, 14, 15, 16, 17, 18],
    },
    dreapta: {
      label: "Cadran 2 (21-28)",
      teeth: [21, 22, 23, 24, 25, 26, 27, 28],
    },
  },
  inferioara: {
    stanga: {
      label: "Cadran 4 (48-41)",
      teeth: [48, 47, 46, 45, 44, 43, 42, 41],
    },
    dreapta: {
      label: "Cadran 3 (38-31)",
      teeth: [38, 37, 36, 35, 34, 33, 32, 31],
    },
  },
};

export default function TreatmentSection({
  patientId,
  onUpdate,
  darkMode,
  continueFrom,
}) {
  const [step, setStep] = useState(continueFrom ? 3 : 1);
  const [arcadaSel, setArcadaSel] = useState(null);
  const [selectedTeeth, setSelectedTeeth] = useState(
    continueFrom?.tooth_number ? continueFrom.tooth_number.split(", ") : [],
  );

  const [newT, setNewT] = useState({
    name: continueFrom ? continueFrom.procedure_name : "",
    cost: "", // Câmp gol
    paid: "", // Câmp gol
    note: "",
    indicatii: "",
    status: "Finalizată",
    date: new Date().toISOString().split("T")[0],
  });

  const save = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const currentTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const payload = {
      patient_id: patientId,
      doctor_id: user.id,
      procedure_name: newT.name,
      total_cost: parseFloat(newT.cost || 0),
      amount_paid: parseFloat(newT.paid || 0),
      additional_info: newT.note,
      indicatii_pacient: newT.indicatii,
      status: newT.status,
      tooth_number: selectedTeeth.sort().join(", "),
      treatment_date: newT.date,
      treatment_time: currentTime,
      parent_id: continueFrom
        ? continueFrom.parent_id || continueFrom.id
        : null,
    };

    const { error } = await supabase.from("treatments").insert([payload]);

    if (error) {
      alert("Eroare la salvare: " + error.message);
    } else {
      if (continueFrom) {
        await supabase
          .from("treatments")
          .update({ status: "Continuat" })
          .eq("id", continueFrom.id);
      }
      onUpdate();
    }
  };

  return (
    <div
      className={`p-4 md:p-8 rounded-[2.5rem] border transition-all duration-300 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}
    >
      {step === 1 && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase text-[#556B2F] tracking-widest mb-4 text-left px-1">
            Alege Procedura
          </span>
          {proceduresList.map((p) => (
            <button
              key={p}
              onClick={() => {
                setNewT({ ...newT, name: p });
                setStep(2);
              }}
              className="flex items-center gap-4 px-6 py-3.5 rounded-xl border border-slate-50 bg-[#f2f6f0]/30 hover:border-[#556B2F] transition-all"
            >
              <Stethoscope size={14} className="text-[#556B2F] opacity-50" />
              <span className="text-[13px] font-medium">{p}</span>
            </button>
          ))}
          <button
            onClick={() => {
              setNewT({ ...newT, name: "" });
              setStep(1.5);
            }}
            className="flex items-center gap-4 px-6 py-3.5 mt-2 rounded-xl border border-dashed border-amber-200 bg-amber-50 text-amber-700"
          >
            <Edit3 size={14} />{" "}
            <span className="text-[13px] font-medium">Altceva...</span>
          </button>
        </div>
      )}

      {step === 1.5 && (
        <div className="max-w-md mx-auto space-y-5 text-left">
          <button
            onClick={() => setStep(1)}
            className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1"
          >
            <ChevronLeft size={12} /> Înapoi
          </button>
          <input
            autoFocus
            type="text"
            value={newT.name}
            onChange={(e) => setNewT({ ...newT, name: e.target.value })}
            className="w-full p-4 rounded-xl border outline-none text-[13px] bg-slate-50 focus:border-[#556B2F]"
            placeholder="Nume tratament..."
          />
          <button
            onClick={() => setStep(2)}
            className="w-full bg-[#556B2F] text-white py-4 rounded-xl font-medium uppercase text-[11px] tracking-widest"
          >
            Continuă
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <span className="text-[11px] font-medium uppercase text-[#556B2F] tracking-widest">
              Dinți
            </span>
            <button
              onClick={() => setStep(1)}
              className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1"
            >
              <ChevronLeft size={12} /> Înapoi
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {!arcadaSel || arcadaSel === "superioara" ? (
              <button
                onClick={() => setArcadaSel("superioara")}
                className={`w-full rounded-2xl border p-3 ${arcadaSel === "superioara" ? "border-[#556B2F] bg-[#f2f6f0]/30" : "border-slate-50 bg-white"}`}
              >
                <img
                  src={arcadaSupImg}
                  alt="S"
                  className="max-h-[100px] mx-auto"
                />
              </button>
            ) : null}
            {!arcadaSel || arcadaSel === "inferioara" ? (
              <button
                onClick={() => setArcadaSel("inferioara")}
                className={`w-full rounded-2xl border p-3 ${arcadaSel === "inferioara" ? "border-[#556B2F] bg-[#f2f6f0]/30" : "border-slate-50 bg-white"}`}
              >
                <img
                  src={arcadaInfImg}
                  alt="I"
                  className="max-h-[100px] mx-auto"
                />
              </button>
            ) : null}
          </div>

          {arcadaSel && (
            <div className="space-y-6 pt-2">
              <button
                onClick={() => setArcadaSel(null)}
                className="text-[10px] font-bold text-[#556B2F] uppercase tracking-widest flex items-center gap-1 mb-4"
              >
                <ChevronLeft size={12} /> Schimbă arcada
              </button>
              <div className="flex gap-4">
                {["stanga", "dreapta"].map((side) => (
                  <div key={side} className="flex-1 flex flex-col gap-1.5">
                    {odontogramaData[arcadaSel][side].teeth.map((t) => {
                      const id = t.toString();
                      const sel = selectedTeeth.includes(id);
                      return (
                        <button
                          key={id}
                          onClick={() =>
                            setSelectedTeeth((s) =>
                              sel ? s.filter((x) => x !== id) : [...s, id],
                            )
                          }
                          className={`w-full py-2.5 rounded-lg border transition-all text-[12px] font-bold flex items-center justify-center ${getToothColor(id, sel, darkMode)}`}
                        >
                          {id}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setStep(3)}
                className="w-full py-4 bg-[#556B2F] text-white rounded-xl font-medium uppercase text-[11px] tracking-widest shadow-lg"
              >
                Continuă ({selectedTeeth.length} dinți)
              </button>
            </div>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5 animate-in fade-in text-left">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h4 className="text-[11px] font-medium uppercase text-[#556B2F] tracking-widest">
              Finalizare {continueFrom ? "(Sedinta Noua)" : ""}
            </h4>
            <button
              onClick={() => setStep(2)}
              className="text-[10px] text-slate-400 uppercase tracking-widest"
            >
              <ChevronLeft size={12} className="inline" /> Înapoi
            </button>
          </div>
          <div className="flex gap-2">
            {["Finalizată", "În lucru"].map((st) => (
              <button
                key={st}
                onClick={() => setNewT({ ...newT, status: st })}
                className={`flex-1 py-3 rounded-xl border text-[10px] font-medium uppercase tracking-widest transition-all ${newT.status === st ? "bg-[#556B2F] text-white" : "bg-white text-slate-400 border-slate-100"}`}
              >
                {st}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                Cost Azi (RON)
              </label>
              <input
                type="number"
                value={newT.cost}
                onChange={(e) => setNewT({ ...newT, cost: e.target.value })}
                className="w-full p-4 rounded-xl border text-[13px] outline-none focus:border-[#556B2F] bg-slate-50"
                placeholder="..."
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                Achitat Azi (RON)
              </label>
              <input
                type="number"
                value={newT.paid}
                onChange={(e) => setNewT({ ...newT, paid: e.target.value })}
                className="w-full p-4 rounded-xl border text-[13px] outline-none focus:border-[#556B2F] bg-slate-50"
                placeholder="..."
              />
            </div>
          </div>
          <div className="space-y-1 text-left">
            <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">
              Observații Ședință (Doctor)
            </label>
            <textarea
              placeholder="Note clinice..."
              value={newT.note}
              onChange={(e) => setNewT({ ...newT, note: e.target.value })}
              className="w-full p-4 rounded-2xl border min-h-[80px] outline-none text-[13px] resize-none focus:border-[#556B2F] bg-slate-50"
            />
          </div>
          <div className="space-y-1 text-left">
            <label className="text-[9px] font-medium text-slate-400 uppercase tracking-widest ml-1">
              Indicații Post-Op (Pacient)
            </label>
            <textarea
              placeholder="Indicații pentru acasă..."
              value={newT.indicatii}
              onChange={(e) => setNewT({ ...newT, indicatii: e.target.value })}
              className="w-full p-4 rounded-2xl border min-h-[80px] outline-none text-[13px] resize-none focus:border-[#556B2F] bg-slate-50"
            />
          </div>
          <button
            onClick={save}
            className="w-full py-4 bg-[#556B2F] text-white rounded-xl font-medium uppercase text-[11px] tracking-widest shadow-xl shadow-[#556B2F]/20"
          >
            Salvează în Fișă
          </button>
        </div>
      )}
    </div>
  );
}
