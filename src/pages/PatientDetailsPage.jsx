import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loader2 } from "lucide-react";

// Importuri corectate și păstrate exact cum le-ai avut
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
    if (data) setPatient(data);
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
    } else {
      console.error("Eroare la salvare:", error);
      alert("Eroare la salvarea datelor!");
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#556B2F]" size={40} />
        <p className="mt-4 text-slate-400 font-medium">
          Se încarcă profilul pacientului...
        </p>
      </div>
    );

  return (
    <div className="p-2 md:p-8 max-w-7xl mx-auto text-left animate-in fade-in duration-500">
      <PatientHeader
        patient={patient}
        onBack={onBack}
        isEditing={isEditingInfo}
        setIsEditing={setIsEditingInfo}
        handleUpdate={handleUpdate}
        setIsFisaOpen={setIsFisaOpen}
        darkMode={darkMode}
        setPatient={setPatient}
      />

      <div className="flex gap-6 border-b border-slate-200 mb-8 px-2 overflow-x-auto no-scrollbar">
        <TabBtn
          active={activeSubTab === "istoric"}
          label="Istoric Tratament"
          onClick={() => setActiveSubTab("istoric")}
        />
        <button
          className={`pb-4 px-2 text-sm md:text-base font-bold uppercase tracking-widest transition-all ${
            activeSubTab === "manopere"
              ? "text-[#556B2F] border-b-2 border-[#556B2F]"
              : "text-slate-400 hover:text-slate-600"
          }`}
          onClick={() => {
            setContinueFrom(null);
            setActiveSubTab("manopere");
          }}
        >
          + Manoperă Nouă
        </button>
      </div>

      <div className="px-2">
        {/* REPARAȚIE: Trimitem un array gol [] dacă treatments nu există încă */}
        {activeSubTab === "istoric" && (
          <HistorySection
            treatments={patient?.treatments || []}
            patient={patient}
            onContinue={(t) => {
              setContinueFrom(t);
              setActiveSubTab("manopere");
            }}
            darkMode={darkMode}
          />
        )}

        {activeSubTab === "manopere" && (
          <TreatmentSection
            patientId={patient.id}
            onUpdate={fetchPatientData}
            continueFrom={continueFrom}
            currentDoctorName={currentDoctorName}
            darkMode={darkMode}
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
