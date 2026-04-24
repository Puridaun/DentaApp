import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loader2, Plus, Lock } from "lucide-react";

import PatientHeader from "../components/PatientDetails/PatientHeader";
import { TabBtn } from "../components/PatientDetails/PatientSubComponents";
import FisaClinicaModal from "../components/PatientDetails/FisaClinicaModal";
import HistorySection from "../components/PatientDetails/HistorySection";
import TreatmentSection from "../components/PatientDetails/TreatmentSection";
import RadiographySection from "../components/PatientDetails/RadiographySection";
import TreatmentPlanSection from "../components/PatientDetails/TreatmentPlanSection";

export default function PatientDetailsPage({ patientId, onBack, darkMode }) {
  const [patient, setPatient] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState("istoric");
  const [loading, setLoading] = useState(true);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isFisaOpen, setIsFisaOpen] = useState(false);
  const [continueFrom, setContinueFrom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPlanningMode, setIsPlanningMode] = useState(false);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);
    }
    getUser();
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
      const sortedTreatments = (data.treatments || []).sort(
        (a, b) => new Date(b.treatment_date) - new Date(a.treatment_date),
      );
      setPatient({ ...data, treatments: sortedTreatments });
    }
    setLoading(false);
  }

  const handleTreatmentUpdate = () => {
    fetchPatientData();
    setContinueFrom(null);

    if (isPlanningMode) {
      setActiveSubTab("plan");
    } else {
      setActiveSubTab("istoric");
    }
    setIsPlanningMode(false);
  };

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

  const hasAccess = currentUser?.id === patient?.doctor_id;

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#556B2F] opacity-30" size={32} />
      </div>
    );

  return (
    <div
      className={`p-3 md:p-10 max-w-7xl mx-auto text-left ${darkMode ? "text-white" : "text-slate-900"}`}
    >
      {/* SECURIZARE ACCES FIȘĂ CLINICĂ */}
      <PatientHeader
        patient={patient}
        onBack={onBack}
        setIsFisaOpen={(value) => {
          if (hasAccess) {
            setIsFisaOpen(value);
          } else {
            alert(
              "⛔ Acces restricționat!\nDoar medicul titular are permisiunea de a vizualiza fișa clinică a acestui pacient.",
            );
          }
        }}
        darkMode={darkMode}
      />

      <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        <TabBtn
          active={activeSubTab === "istoric"}
          label="Cronologie"
          onClick={() => {
            setActiveSubTab("istoric");
            setIsPlanningMode(false);
          }}
        />
        <TabBtn
          active={activeSubTab === "plan"}
          label="Plan Tratament"
          onClick={() => {
            setActiveSubTab("plan");
            setIsPlanningMode(false);
          }}
        />
        {hasAccess && (
          <button
            className={`pb-4 px-3 text-[11px] md:text-[13px] font-medium uppercase tracking-[0.15em] transition-all flex items-center gap-2 whitespace-nowrap ${
              activeSubTab === "manopere" && !isPlanningMode
                ? "text-[#556B2F] border-b-2 border-[#556B2F]"
                : "text-slate-400"
            }`}
            onClick={() => {
              setContinueFrom(null);
              setIsPlanningMode(false);
              setActiveSubTab("manopere");
            }}
          >
            <Plus size={14} /> Tratament Nou
          </button>
        )}
        <TabBtn
          active={activeSubTab === "radiografii"}
          label="Radiografii"
          onClick={() => {
            setActiveSubTab("radiografii");
            setIsPlanningMode(false);
          }}
        />
      </div>

      <div className="min-h-[400px] relative">
        {!hasAccess && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700 p-10 text-center">
            <Lock size={28} className="text-[#556B2F] mb-4" />
            <h3 className="text-[16px] font-bold uppercase tracking-widest text-[#556B2F] mb-2">
              Acces Restricționat
            </h3>
          </div>
        )}

        <div
          className={
            !hasAccess
              ? "pointer-events-none select-none opacity-5 blur-sm"
              : ""
          }
        >
          {activeSubTab === "istoric" && (
            <HistorySection
              treatments={
                patient?.treatments?.filter((t) => t.status !== "Planificat") ||
                []
              }
              darkMode={darkMode}
              onContinue={(item) => {
                setContinueFrom(item);
                setIsPlanningMode(false);
                setActiveSubTab("manopere");
              }}
              onUpdate={fetchPatientData}
            />
          )}

          {activeSubTab === "plan" && (
            <TreatmentPlanSection
              patient={patient}
              onUpdate={fetchPatientData}
              darkMode={darkMode}
            />
          )}

          {activeSubTab === "manopere" && hasAccess && (
            <TreatmentSection
              patientId={patient.id}
              onUpdate={handleTreatmentUpdate}
              continueFrom={continueFrom}
              darkMode={darkMode}
            />
          )}

          {activeSubTab === "radiografii" && (
            <RadiographySection patientId={patientId} darkMode={darkMode} />
          )}
        </div>
      </div>

      {/* Randează modalul cu fișa doar dacă medicul are permisiune */}
      {hasAccess && (
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
      )}
    </div>
  );
}
