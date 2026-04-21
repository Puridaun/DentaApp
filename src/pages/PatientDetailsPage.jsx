import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loader2, Plus } from "lucide-react";

import PatientHeader from "../components/PatientDetails/PatientHeader";
import { TabBtn } from "../components/PatientDetails/PatientSubComponents";
import FisaClinicaModal from "../components/PatientDetails/FisaClinicaModal";
import HistorySection from "../components/PatientDetails/HistorySection";
import TreatmentSection from "../components/PatientDetails/TreatmentSection";

export default function PatientDetailsPage({ patientId, onBack, darkMode }) {
  const [patient, setPatient] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("istoric");
  const [loading, setLoading] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isFisaOpen, setIsFisaOpen] = useState(false);
  const [continueFrom, setContinueFrom] = useState(null);
  const [currentDoctorName, setCurrentDoctorName] = useState("");

  useEffect(() => {
    fetchPatientData();
    fetchCurrentDoctor();
  }, [patientId]);

  async function fetchCurrentDoctor() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();
      setCurrentDoctorName(profile?.full_name || session.user.email);
    }
  }

  async function fetchPatientData() {
    setLoading(true);
    const { data } = await supabase
      .from("patients")
      .select(
        `*, assigned_doctor:profiles!doctor_id(full_name), treatments(*, doctor_info:profiles!doctor_id(full_name))`,
      )
      .eq("id", patientId)
      .single();

    if (data) {
      const sortedTreatments = (data.treatments || []).sort(
        (a, b) => new Date(b.treatment_date) - new Date(a.treatment_date),
      );
      setPatient({ ...data, treatments: sortedTreatments });
    }
    setLoading(false);
  }

  const handleUpdate = async (forceEdit = false) => {
    if (forceEdit === true) {
      setIsEditingInfo(true);
      return;
    }
    const { error } = await supabase
      .from("patients")
      .update({
        phone: patient.phone,
        email: patient.email,
        allergies: patient.allergies,
        birth_date: patient.birth_date,
        reason: patient.reason,
        observations: patient.observations,
        antecedente_familiale: patient.antecedente_familiale,
        antecedente_personale: patient.antecedente_personale,
        medicatie_fond: patient.medicatie_fond,
        examen_clinic: patient.examen_clinic,
        investigatii: patient.investigatii,
      })
      .eq("id", patientId);

    if (!error) {
      setIsEditingInfo(false);
      fetchPatientData();
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

      {/* Navigare - Modificat: Doar TRATAMENT */}
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
      </div>

      <div className="min-h-[400px]">
        {activeSubTab === "istoric" && (
          <HistorySection
            treatments={patient?.treatments || []}
            darkMode={darkMode}
            onContinue={handleContinueTreatment}
          />
        )}

        {activeSubTab === "manopere" && (
          <TreatmentSection
            patientId={patient.id}
            onUpdate={() => {
              fetchPatientData();
              setContinueFrom(null);
              setActiveSubTab("istoric");
            }}
            continueFrom={continueFrom}
            darkMode={darkMode}
            setIsFisaOpen={setIsFisaOpen}
          />
        )}
      </div>

      <FisaClinicaModal
        isOpen={isFisaOpen}
        onClose={() => setIsFisaOpen(false)}
        patient={patient}
        isEditing={isEditingInfo}
        setPatient={setPatient}
        darkMode={darkMode}
        handleUpdate={handleUpdate}
      />
    </div>
  );
}
