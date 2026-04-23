import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loader2, Plus } from "lucide-react";

import PatientHeader from "../components/PatientDetails/PatientHeader";
import { TabBtn } from "../components/PatientDetails/PatientSubComponents";
import FisaClinicaModal from "../components/PatientDetails/FisaClinicaModal";
import HistorySection from "../components/PatientDetails/HistorySection";
import TreatmentSection from "../components/PatientDetails/TreatmentSection";
import RadiographySection from "../components/PatientDetails/RadiographySection";

export default function PatientDetailsPage({ patientId, onBack, darkMode }) {
  const [patient, setPatient] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("istoric");
  const [loading, setLoading] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isFisaOpen, setIsFisaOpen] = useState(false);
  const [continueFrom, setContinueFrom] = useState(null);

  useEffect(() => {
    fetchPatientData();
  }, [patientId]);

  async function fetchPatientData() {
    const { data } = await supabase
      .from("patients")
      .select(
        `*, assigned_doctor:profiles!doctor_id(full_name), treatments(*, doctor_info:profiles!doctor_id(full_name))`,
      )
      .eq("id", patientId)
      .single();

    if (data) {
      // Sortarea inteligentă: Punem tratamentele în ordine cronologică generală
      // Logica de "pachet" (grupare după parent_id) este gestionată direct de HistorySection
      // Aici doar ne asigurăm că avem toate datele proaspete
      const sortedTreatments = (data.treatments || []).sort(
        (a, b) => new Date(b.treatment_date) - new Date(a.treatment_date),
      );
      setPatient({ ...data, treatments: sortedTreatments });
    }
    setLoading(false);
  }

  const handleUpdate = async (updatedData = null) => {
    if (updatedData === true) {
      setIsEditingInfo(true);
      return;
    }
    if (updatedData) {
      const fullName =
        `${updatedData.last_name || ""} ${updatedData.first_name || ""}`.trim();
      const { error } = await supabase
        .from("patients")
        .update({
          first_name: updatedData.first_name,
          last_name: updatedData.last_name,
          full_name: fullName,
          phone: updatedData.phone === "" ? null : updatedData.phone,
          email: updatedData.email === "" ? null : updatedData.email,
          birth_date:
            updatedData.birth_date === "" ? null : updatedData.birth_date,
          allergies: updatedData.allergies,
          reason: updatedData.reason,
          observations: updatedData.observations,
          antecedente_familiale: updatedData.antecedente_familiale,
          antecedente_personale: updatedData.antecedente_personale,
          medicatie_fond: updatedData.medicatie_fond,
          examen_clinic: updatedData.examen_clinic,
          investigatii: updatedData.investigatii,
        })
        .eq("id", patientId);

      if (!error) {
        setIsEditingInfo(false);
        fetchPatientData();
      }
    }
  };

  const handleContinueTreatment = (treatment) => {
    setContinueFrom(treatment);
    setActiveSubTab("manopere");
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#556B2F] opacity-30" size={32} />
      </div>
    );

  return (
    <div
      className={`p-3 md:p-10 max-w-7xl mx-auto text-left animate-in fade-in duration-700 ${darkMode ? "text-white" : "text-slate-900"}`}
    >
      <PatientHeader
        patient={patient}
        onBack={onBack}
        setIsFisaOpen={setIsFisaOpen}
        darkMode={darkMode}
      />

      <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        <TabBtn
          active={activeSubTab === "istoric"}
          label="Cronologie"
          onClick={() => setActiveSubTab("istoric")}
        />
        <button
          className={`pb-4 px-3 text-[11px] md:text-[13px] font-medium uppercase tracking-[0.15em] transition-all flex items-center gap-2 whitespace-nowrap ${
            activeSubTab === "manopere"
              ? "text-[#556B2F] border-b-2 border-[#556B2F]"
              : "text-slate-400"
          }`}
          onClick={() => {
            setContinueFrom(null);
            setActiveSubTab("manopere");
          }}
        >
          <Plus size={14} /> {continueFrom ? "Finalizare Vizită" : "Tratament"}
        </button>
        <TabBtn
          active={activeSubTab === "radiografii"}
          label="Radiografii"
          onClick={() => setActiveSubTab("radiografii")}
        />
      </div>

      <div className="min-h-[400px]">
        {activeSubTab === "istoric" && (
          <HistorySection
            treatments={patient?.treatments || []}
            darkMode={darkMode}
            onContinue={handleContinueTreatment}
            onUpdate={(updatedSession) => {
              // Menținem "magia" pachetului de cărți:
              // Reîmprospătăm datele complet din baza de date pentru a recalcula legăturile parent_id
              fetchPatientData();
              setContinueFrom(null);
              setActiveSubTab("istoric");
            }}
          />
        )}

        {activeSubTab === "manopere" && (
          <TreatmentSection
            patientId={patient.id}
            onUpdate={() => {
              // Când salvăm o manoperă nouă/continuare, refacem tot setul de date
              fetchPatientData();
              setContinueFrom(null);
              setActiveSubTab("istoric");
            }}
            continueFrom={continueFrom}
            darkMode={darkMode}
            setIsFisaOpen={setIsFisaOpen}
          />
        )}

        {activeSubTab === "radiografii" && (
          <RadiographySection patientId={patientId} darkMode={darkMode} />
        )}
      </div>

      <FisaClinicaModal
        isOpen={isFisaOpen}
        onClose={() => {
          setIsFisaOpen(false);
          setIsEditingInfo(false);
        }}
        patient={patient}
        isEditing={isEditingInfo}
        setPatient={setPatient}
        darkMode={darkMode}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}
