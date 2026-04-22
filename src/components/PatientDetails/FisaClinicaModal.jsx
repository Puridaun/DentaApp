import React, { useState, useEffect } from "react";
import {
  X,
  Edit3,
  Check,
  User,
  Activity,
  FileText,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

const AnamnezaRow = ({
  label,
  value,
  highlight,
  field,
  isEditing,
  onChange,
  type = "textarea",
  darkMode,
}) => (
  <div
    className={`text-left border-b pb-5 last:border-0 ${darkMode ? "border-slate-800" : "border-slate-50"}`}
  >
    <label className="text-[9px] font-medium uppercase text-slate-400 tracking-[0.2em] block mb-2">
      {label}
    </label>
    {isEditing ? (
      type === "date" ? (
        <input
          type="date"
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className={`w-full p-4 rounded-2xl border outline-none text-[13px] transition-all ${
            darkMode
              ? "bg-slate-800 border-slate-700 focus:border-[#556B2F] text-white"
              : "bg-slate-50 border-slate-100 focus:border-[#556B2F] text-slate-700"
          }`}
        />
      ) : (
        <textarea
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className={`w-full p-4 rounded-2xl border outline-none text-[13px] transition-all min-h-[60px] resize-none ${
            darkMode
              ? "bg-slate-800 border-slate-700 focus:border-[#556B2F] text-white"
              : "bg-slate-50 border-slate-100 focus:border-[#556B2F] text-slate-700"
          }`}
        />
      )
    ) : (
      <p
        className={`text-[13px] leading-relaxed whitespace-pre-wrap font-normal ${highlight ? "text-red-500 font-medium" : darkMode ? "text-slate-300" : "text-slate-600"}`}
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
    // Pasăm datele locale direct funcției handleUpdate din părinte
    handleUpdate(localData);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm print:bg-white print:p-0">
      <div
        className={`w-full max-w-3xl rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border relative overflow-y-auto max-h-[92vh] scrollbar-hide ${
          darkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-50 text-slate-800"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 md:top-10 md:right-10 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-8 text-left">
          <h2 className="text-lg md:text-xl font-light uppercase tracking-[0.2em] text-slate-400">
            Fișă clinică
          </h2>
          <p className="text-md md:text-lg font-medium text-[#556B2F] mt-1 uppercase tracking-tight">
            {patient.last_name} {patient.first_name}
          </p>
        </div>

        <div className="space-y-10">
          <section className="space-y-6">
            <p className="text-[10px] font-medium text-[#556B2F] uppercase tracking-[0.2em] flex items-center gap-2 mb-4">
              <User size={12} /> Date Identitate & Contact
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnamnezaRow
                label="Nume"
                value={isEditing ? localData.last_name : patient.last_name}
                field="last_name"
                isEditing={isEditing}
                onChange={handleLocalChange}
                darkMode={darkMode}
              />
              <AnamnezaRow
                label="Prenume"
                value={isEditing ? localData.first_name : patient.first_name}
                field="first_name"
                isEditing={isEditing}
                onChange={handleLocalChange}
                darkMode={darkMode}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnamnezaRow
                label="Telefon"
                value={isEditing ? localData.phone : patient.phone}
                field="phone"
                isEditing={isEditing}
                onChange={handleLocalChange}
                darkMode={darkMode}
              />
              <AnamnezaRow
                label="Data Nașterii"
                value={isEditing ? localData.birth_date : patient.birth_date}
                field="birth_date"
                type="date"
                isEditing={isEditing}
                onChange={handleLocalChange}
                darkMode={darkMode}
              />
            </div>
            <AnamnezaRow
              label="Email"
              value={isEditing ? localData.email : patient.email}
              field="email"
              isEditing={isEditing}
              onChange={handleLocalChange}
              darkMode={darkMode}
            />
          </section>

          <section className="space-y-6">
            <AnamnezaRow
              label="Motiv Vizită"
              value={isEditing ? localData.reason : patient.reason}
              field="reason"
              isEditing={isEditing}
              onChange={handleLocalChange}
              darkMode={darkMode}
            />
            <AnamnezaRow
              label="Alergii"
              value={isEditing ? localData.allergies : patient.allergies}
              highlight={
                patient.allergies &&
                patient.allergies.toLowerCase() !== "neagă" &&
                patient.allergies.toLowerCase() !== "neaga"
              }
              field="allergies"
              isEditing={isEditing}
              onChange={handleLocalChange}
              darkMode={darkMode}
            />
          </section>

          <section className="space-y-6 pt-4">
            <p className="text-[10px] font-medium text-[#556B2F] uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
              <Activity size={12} /> Anamneza Medicală
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnamnezaRow
                label="Antecedente Personale (APP/APF)"
                value={
                  isEditing
                    ? localData.antecedente_personale
                    : patient.antecedente_personale
                }
                field="antecedente_personale"
                isEditing={isEditing}
                onChange={handleLocalChange}
                darkMode={darkMode}
              />
              <AnamnezaRow
                label="Antecedente Familiale (AHC)"
                value={
                  isEditing
                    ? localData.antecedente_familiale
                    : patient.antecedente_familiale
                }
                field="antecedente_familiale"
                isEditing={isEditing}
                onChange={handleLocalChange}
                darkMode={darkMode}
              />
            </div>
            <AnamnezaRow
              label="Medicație de fond"
              value={
                isEditing ? localData.medicatie_fond : patient.medicatie_fond
              }
              field="medicatie_fond"
              isEditing={isEditing}
              onChange={handleLocalChange}
              darkMode={darkMode}
            />
          </section>

          <section className="space-y-6 pt-4">
            <p className="text-[10px] font-medium text-[#556B2F] uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
              <FileText size={12} /> Examen Clinic & Investigații
            </p>
            <AnamnezaRow
              label="Examen Clinic"
              value={
                isEditing ? localData.examen_clinic : patient.examen_clinic
              }
              field="examen_clinic"
              isEditing={isEditing}
              onChange={handleLocalChange}
              darkMode={darkMode}
            />
            <AnamnezaRow
              label="Investigații Paraclinice (Radiografii etc.)"
              value={isEditing ? localData.investigatii : patient.investigatii}
              field="investigatii"
              isEditing={isEditing}
              onChange={handleLocalChange}
              darkMode={darkMode}
            />
            <AnamnezaRow
              label="Observații Generale"
              value={isEditing ? localData.observations : patient.observations}
              field="observations"
              isEditing={isEditing}
              onChange={handleLocalChange}
              darkMode={darkMode}
            />
          </section>
        </div>

        <div className="mt-12 flex flex-col gap-4 print:hidden">
          {isEditing ? (
            <button
              onClick={onSaveInternal}
              className="w-full bg-[#556B2F] text-white py-5 rounded-3xl font-medium uppercase text-[11px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <Check size={18} /> Salvează Modificările
            </button>
          ) : (
            <button
              onClick={() => handleUpdate(true)}
              className="w-full bg-slate-900 text-white py-5 rounded-3xl font-medium uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
            >
              <Edit3 size={18} /> Editează Fișa
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="w-full py-5 border border-slate-100 dark:border-slate-800 text-slate-400 rounded-3xl font-medium uppercase text-[11px] tracking-[0.2em] hover:bg-slate-50 transition-all"
          >
            Printează Fișa
          </button>
        </div>
      </div>
    </div>
  );
}
