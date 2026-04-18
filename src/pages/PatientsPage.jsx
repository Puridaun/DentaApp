import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import PatientDetailsPage from "./PatientDetailsPage";
import { Plus, Search, Loader2, Filter } from "lucide-react";

import PatientsTable from "../components/Patients/PatientsTable";
import AddPatientModal from "../components/Patients/AddPatientModal";

export default function PatientsPage({ darkMode }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialPatientState = {
    first_name: "",
    last_name: "",
    birth_date: "",
    phone: "",
    email: "",
    doctor_id: "",
    reason: "",
    allergies: "Neagă",
    antecedente_personale: "",
    antecedente_familiale: "",
    medicatie_fond: "",
    examen_clinic: "",
    investigatii: "",
    observations: "",
  };

  const [newPatient, setNewPatient] = useState(initialPatientState);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data: pts } = await supabase
        .from("patients")
        .select(
          `
          *,
          assigned_doctor:profiles!doctor_id(full_name),
          treatments(procedure_name, treatment_date)
        `,
        )
        .order("created_at", { ascending: false });

      const { data: docs } = await supabase
        .from("profiles")
        .select("id, full_name");

      if (pts) {
        const processed = pts.map((p) => {
          const lastTr =
            p.treatments && p.treatments.length > 0
              ? [...p.treatments].sort(
                  (a, b) =>
                    new Date(b.treatment_date) - new Date(a.treatment_date),
                )[0]
              : null;

          let monthsPassed = "—";
          let rawMonths = 0;

          if (lastTr) {
            const lastDate = new Date(lastTr.treatment_date);
            const today = new Date();
            rawMonths =
              (today.getFullYear() - lastDate.getFullYear()) * 12 +
              (today.getMonth() - lastDate.getMonth());

            if (rawMonths === 0) monthsPassed = "Luna aceasta";
            else if (rawMonths === 1) monthsPassed = "1 lună";
            else monthsPassed = `${rawMonths} luni`;
          }

          return {
            ...p,
            last_procedure_display: lastTr ? lastTr.procedure_name : "—",
            months_since_last: monthsPassed,
            raw_months: rawMonths,
          };
        });
        setPatients(processed);
      }
      if (docs) setDoctors(docs);
    } catch (err) {
      console.error("Eroare la preluarea datelor:", err);
    } finally {
      setLoading(false);
    }
  }

  // Filtrare combinată (Search + Doctor)
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm);

    const matchesDoctor =
      selectedDoctorFilter === "all" || p.doctor_id === selectedDoctorFilter;

    return matchesSearch && matchesDoctor;
  });

  const handleAddPatient = async () => {
    if (
      !newPatient.last_name.trim() ||
      !newPatient.first_name.trim() ||
      !newPatient.phone.trim()
    ) {
      return alert("⚠️ Numele, Prenumele și Telefonul sunt obligatorii!");
    }
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const assignedDoctorId = newPatient.doctor_id || user?.id;
      const fullName =
        `${newPatient.last_name} ${newPatient.first_name}`.trim();

      const cleanData = {
        ...newPatient,
        full_name: fullName,
        doctor_id: assignedDoctorId,
      };

      const { data: savedPatient, error: pError } = await supabase
        .from("patients")
        .insert([cleanData])
        .select()
        .single();

      if (pError) throw pError;

      if (savedPatient) {
        await supabase.from("treatments").insert([
          {
            patient_id: savedPatient.id,
            procedure_name: "Înregistrare & Fișă Inițială",
            treatment_date: new Date().toISOString().split("T")[0],
            status: "Finalizată",
            doctor_id: assignedDoctorId,
          },
        ]);
        setIsModalOpen(false);
        setNewPatient(initialPatientState);
        fetchData();
      }
    } catch (error) {
      alert(`❌ Eroare: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (selectedPatientId) {
    return (
      <PatientDetailsPage
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-left font-sans">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Registru Pacienți
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-olive-base hover:bg-olive-light text-white px-6 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Pacient Nou
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div
          className={`flex-[2] flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${darkMode ? "bg-slate-900 border-slate-700 shadow-sm" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Caută după nume sau telefon..."
            className="bg-transparent outline-none w-full text-sm md:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtru Doctor */}
        <div
          className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all ${darkMode ? "bg-slate-900 border-slate-700 shadow-sm" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <Filter size={18} className="text-slate-500" />
          <select
            className="bg-transparent outline-none w-full text-sm md:text-base cursor-pointer appearance-none"
            value={selectedDoctorFilter}
            onChange={(e) => setSelectedDoctorFilter(e.target.value)}
          >
            <option value="all">Toți Doctorii</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center text-olive-base">
          <Loader2 className="animate-spin" size={40} />
        </div>
      ) : (
        <PatientsTable
          patients={filteredPatients}
          onSelectPatient={setSelectedPatientId}
          darkMode={darkMode}
        />
      )}

      <AddPatientModal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newPatient={newPatient}
        setNewPatient={setNewPatient}
        doctors={doctors}
        onSave={handleAddPatient}
        saving={saving}
      />
    </div>
  );
}
