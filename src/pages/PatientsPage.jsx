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

  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone?.includes(searchTerm);

    const matchesDoctor =
      selectedDoctorFilter === "all" || p.doctor_id === selectedDoctorFilter;

    return matchesSearch && matchesDoctor;
  });

  const handleAddPatient = async () => {
    // Validare doar pentru nume și prenume
    if (!newPatient.last_name.trim() || !newPatient.first_name.trim()) {
      return alert("⚠️ Numele și Prenumele sunt obligatorii!");
    }

    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const assignedDoctorId = newPatient.doctor_id || user?.id;
      const fullName =
        `${newPatient.last_name} ${newPatient.first_name}`.trim();

      // --- LOGICA PENTRU CURĂȚARE DATE GOALE ---
      const cleanData = {
        ...newPatient,
        full_name: fullName,
        doctor_id: assignedDoctorId,
        // Dacă birth_date, phone sau email sunt goale, le trimitem ca null, nu ca ""
        birth_date: newPatient.birth_date === "" ? null : newPatient.birth_date,
        phone: newPatient.phone === "" ? null : newPatient.phone,
        email: newPatient.email === "" ? null : newPatient.email,
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
    <div className="p-4 md:p-10 max-w-7xl mx-auto text-left font-sans animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-10 gap-4">
        <h1
          className={`text-2xl md:text-4xl font-light tracking-tight uppercase ${darkMode ? "text-white" : "text-slate-800"}`}
        >
          Pacienți
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#556B2F] text-white px-5 py-3 md:px-8 md:py-4 rounded-2xl font-medium text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
        >
          <Plus size={16} /> <span>Pacient Nou</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div
          className={`flex-[2] flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all ${darkMode ? "bg-slate-900 border-slate-800 shadow-sm" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Caută după nume sau telefon..."
            className="bg-transparent outline-none w-full text-[13px] font-normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div
          className={`flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all ${darkMode ? "bg-slate-900 border-slate-800 shadow-sm" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <Filter size={18} className="text-slate-400" />
          <select
            className="bg-transparent outline-none w-full text-[11px] font-medium uppercase tracking-widest cursor-pointer appearance-none text-slate-500"
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
        <div className="py-20 flex justify-center">
          <Loader2
            className="animate-spin text-[#556B2F] opacity-30"
            size={40}
          />
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
        darkMode={darkMode}
      />
    </div>
  );
}
