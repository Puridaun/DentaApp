import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Loader2 } from "lucide-react";

// Importuri componente din același folder
import PatientHeader from "./PatientHeader";
import { TabBtn } from "./PatientSubComponents";
import FisaClinicaModal from "./FisaClinicaModal";
import HistorySection from "./HistorySection";
import TreatmentSection from "./TreatmentSection";

export default function PatientDetails({ patientId, onBack, darkMode }) {
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

  // Funcție de salvare extinsă cu noile rubrici
  const handleUpdate = async (forceEdit = false) => {
    // Dacă am apăsat "Edit" în modal, doar activăm modul editare
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
        examen_clinic: patient.examen_clinic, // NOU
        investigatii: patient.investigatii, // NOU
      })
      .eq("id", patientId);

    if (!error) {
      setIsEditingInfo(false);
      fetchPatientData(); // Refresh date
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
      {/* HEADER: Identitate, Sold, Butoane Edit/Fisă */}
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

      {/* NAVIGARE: Tab-uri */}
      <div className="flex gap-6 border-b border-slate-200 mb-8 px-2 overflow-x-auto no-scrollbar">
        <TabBtn
          active={activeSubTab === "istoric"}
          label="Istoric Tratament"
          onClick={() => setActiveSubTab("istoric")}
        />
        <TabBtn
          active={activeSubTab === "manopere"}
          label="+ Manoperă Nouă"
          onClick={() => {
            setContinueFrom(null);
            setActiveSubTab("manopere");
          }}
        />
      </div>

      {/* CONȚINUT: Istoric sau Formular */}
      <div className="px-2">
        {activeSubTab === "istoric" && (
          <HistorySection
            treatments={patient.treatments}
            patient={patient}
            onContinue={(t) => {
              setContinueFrom(t);
              setActiveSubTab("manopere");
            }}
          />
        )}

        {activeSubTab === "manopere" && (
          <TreatmentSection
            patientId={patient.id}
            onUpdate={fetchPatientData}
            continueFrom={continueFrom}
            currentDoctorName={currentDoctorName}
          />
        )}
      </div>

      {/* MODAL: Fișa Clinică (Editabilă & Printabilă) */}
      <FisaClinicaModal
        isOpen={isFisaOpen}
        onClose={() => setIsFisaOpen(false)}
        patient={patient}
        isEditing={isEditingInfo}
        setPatient={setPatient}
        darkMode={darkMode}
        handleUpdate={handleUpdate} // Pasăm funcția de salvare
      />
    </div>
  );
}
