import React, { useState, useEffect } from "react";
import { X, Edit3, Printer, Check, User } from "lucide-react";

const AnamnezaRow = ({
  label,
  value,
  highlight,
  field,
  isEditing,
  onChange,
  type = "textarea",
}) => (
  <div className="text-left border-b border-slate-50 pb-5 last:border-0 print:border-slate-200">
    <label className="text-[9px] font-bold uppercase text-slate-400 tracking-widest block mb-2">
      {label}
    </label>
    {isEditing ? (
      type === "text" || type === "date" ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full p-3 rounded-xl border border-slate-100 text-sm outline-none focus:border-[#556B2F] bg-slate-50/50"
        />
      ) : (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full p-4 rounded-xl border border-slate-100 text-sm outline-none focus:border-[#556B2F] bg-slate-50/50 transition-all min-h-[80px] resize-none"
        />
      )
    ) : (
      <p
        className={`text-[13px] leading-relaxed whitespace-pre-wrap ${highlight ? "text-red-500 font-bold" : "text-slate-600"}`}
      >
        {value || "—"}
      </p>
    )}
  </div>
);

export default function FisaClinicaModal({
  isOpen,
  onClose,
  patient,
  isEditing,
  setPatient,
  darkMode,
  handleUpdate,
}) {
  const [localData, setLocalData] = useState({});

  useEffect(() => {
    if (patient && isOpen) setLocalData({ ...patient });
  }, [isOpen, patient]);

  if (!isOpen) return null;

  const handleLocalChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const onSaveInternal = () => {
    setPatient(localData);
    setTimeout(() => handleUpdate(), 100);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 md:p-4 bg-slate-900/60 backdrop-blur-sm print:bg-white print:p-0">
      <div
        className={`w-full max-w-3xl rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-y-auto max-h-[95vh] 
        ${darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-800"} scrollbar-thin`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 print:hidden transition-colors"
        >
          <X size={24} />
        </button>

        <div className="border-b border-slate-100 pb-5 mb-6 text-left">
          <h2 className="text-lg md:text-xl font-medium text-slate-800 uppercase tracking-tight">
            Fișă de observație clinică
          </h2>
          <p className="text-md font-bold text-[#556B2F] mt-1">
            {patient.full_name}
          </p>
        </div>

        <div className="space-y-6">
          {/* SECȚIUNE NOUĂ: DATE IDENTIFICARE */}
          <div className="bg-slate-50/50 p-4 rounded-2xl space-y-4 border border-slate-100">
            <p className="text-[10px] font-black text-[#556B2F] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              <User size={12} /> Date Identificare
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnamnezaRow
                label="Data Nașterii"
                value={isEditing ? localData.birth_date : patient.birth_date}
                field="birth_date"
                isEditing={isEditing}
                onChange={handleLocalChange}
                type="date"
              />
              <AnamnezaRow
                label="Telefon"
                value={isEditing ? localData.phone : patient.phone}
                field="phone"
                isEditing={isEditing}
                onChange={handleLocalChange}
                type="text"
              />
              <AnamnezaRow
                label="Email"
                value={isEditing ? localData.email : patient.email}
                field="email"
                isEditing={isEditing}
                onChange={handleLocalChange}
                type="text"
              />
            </div>
          </div>

          {/* ANAMNEZA MEDICALĂ */}
          <AnamnezaRow
            label="Motiv Vizită"
            value={isEditing ? localData.reason : patient.reason}
            field="reason"
            isEditing={isEditing}
            onChange={handleLocalChange}
          />
          <AnamnezaRow
            label="Alergii"
            value={isEditing ? localData.allergies : patient.allergies}
            highlight={
              patient.allergies !== "Neagă" && patient.allergies !== ""
            }
            field="allergies"
            isEditing={isEditing}
            onChange={handleLocalChange}
          />
          <AnamnezaRow
            label="Antecedente Personale (APF/APP)"
            value={
              isEditing
                ? localData.antecedente_personale
                : patient.antecedente_personale
            }
            field="antecedente_personale"
            isEditing={isEditing}
            onChange={handleLocalChange}
          />
          <AnamnezaRow
            label="Antecedente Heredo-Colaterale (AHC)"
            value={
              isEditing
                ? localData.antecedente_familiale
                : patient.antecedente_familiale
            }
            field="antecedente_familiale"
            isEditing={isEditing}
            onChange={handleLocalChange}
          />
          <AnamnezaRow
            label="Medicație de fond"
            value={
              isEditing ? localData.medicatie_fond : patient.medicatie_fond
            }
            field="medicatie_fond"
            isEditing={isEditing}
            onChange={handleLocalChange}
          />
          <AnamnezaRow
            label="Examen Clinic"
            value={isEditing ? localData.examen_clinic : patient.examen_clinic}
            field="examen_clinic"
            isEditing={isEditing}
            onChange={handleLocalChange}
          />
          <AnamnezaRow
            label="Investigații Paraclinice"
            value={isEditing ? localData.investigatii : patient.investigatii}
            field="investigatii"
            isEditing={isEditing}
            onChange={handleLocalChange}
          />
          <AnamnezaRow
            label="Observații Generale"
            value={isEditing ? localData.observations : patient.observations}
            field="observations"
            isEditing={isEditing}
            onChange={handleLocalChange}
          />
        </div>

        <div className="mt-10 mb-2 pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-3 print:hidden">
          {isEditing ? (
            <button
              onClick={onSaveInternal}
              className="flex-1 bg-[#556B2F] text-white py-3.5 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2 shadow-lg"
            >
              <Check size={16} /> Salvează modificările
            </button>
          ) : (
            <button
              onClick={() => handleUpdate(true)}
              className="flex-1 bg-slate-800 text-white py-3.5 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2 shadow-lg"
            >
              <Edit3 size={16} /> Editează Fișa
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-6 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center gap-2"
          >
            Print
          </button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
