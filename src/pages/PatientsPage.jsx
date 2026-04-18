import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import PatientDetails from "../components/PatientDetails/PatientDetails";
import {
  Plus,
  Search,
  Loader2,
  X,
  Check,
  Filter,
  AlertCircle,
} from "lucide-react";

export default function PatientsPage({ darkMode }) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Starea inițială cu toate câmpurile necesare
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
    const { data: pts } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: docs } = await supabase
      .from("profiles")
      .select("id, full_name");
    if (pts) setPatients(pts);
    if (docs) setDoctors(docs);
    setLoading(false);
  }

  const handleAddPatient = async () => {
    // 1. VALIDĂRI OBLIGATORII
    if (!newPatient.last_name.trim() || !newPatient.first_name.trim()) {
      return alert("⚠️ Numele și Prenumele sunt obligatorii!");
    }
    if (!newPatient.phone.trim()) {
      return alert(
        "⚠️ Numărul de telefon este obligatoriu pentru înregistrare!",
      );
    }

    setSaving(true);
    const fullName = `${newPatient.last_name} ${newPatient.first_name}`.trim();

    // 2. PREGĂTIRE DATE (Evităm Bad Request prin setarea null la câmpuri opționale goale)
    const cleanData = {
      ...newPatient,
      full_name: fullName,
      birth_date: newPatient.birth_date || null,
      doctor_id: newPatient.doctor_id || null,
      email: newPatient.email || null,
      // String-urile goale sunt permise pentru text, dar ne asigurăm că nu sunt undefined
      reason: newPatient.reason || "",
      allergies: newPatient.allergies || "Neagă",
      examen_clinic: newPatient.examen_clinic || "",
      investigatii: newPatient.investigatii || "",
      observations: newPatient.observations || "",
    };

    // 3. INSERARE PACIENT
    const { data: savedPatient, error: pError } = await supabase
      .from("patients")
      .insert([cleanData])
      .select()
      .single();

    if (pError) {
      setSaving(false);
      console.error("Eroare Supabase:", pError);
      return alert(
        `❌ Eroare: ${pError.message}. Asigură-te că ai rulat codul SQL pentru coloanele noi!`,
      );
    }

    // 4. CREARE SNAPSHOT INITIAL ÎN ISTORIC
    if (savedPatient) {
      const { error: tError } = await supabase.from("treatments").insert([
        {
          patient_id: savedPatient.id,
          procedure_name: "Înregistrare & Fișă Inițială",
          treatment_date: new Date().toISOString().split("T")[0],
          status: "Finalizată",
          fisa_snapshot: cleanData, // Salvăm starea fișei de la înregistrare
        },
      ]);

      if (tError) console.error("Eroare snapshot:", tError);

      setIsModalOpen(false);
      setNewPatient(initialPatientState);
      fetchData();
    }
    setSaving(false);
  };

  if (selectedPatientId) {
    return (
      <PatientDetails
        patientId={selectedPatientId}
        onBack={() => setSelectedPatientId(null)}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-left font-sans">
      <div className="flex justify-between items-center mb-10">
        <h1
          className={`text-2xl font-medium ${darkMode ? "text-white" : "text-slate-900"}`}
        >
          Registru Pacienți
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#556B2F] text-white px-6 py-3.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={16} /> Pacient Nou
        </button>
      </div>

      {/* CĂUTARE */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div
          className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Caută după nume sau telefon..."
            className="bg-transparent outline-none w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABEL */}
      <div
        className={`rounded-[2rem] border overflow-hidden ${darkMode ? "border-slate-800 bg-slate-900" : "bg-white border-slate-100 shadow-sm"}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead
              className={`${darkMode ? "bg-slate-800/50" : "bg-slate-50/50"} border-b`}
            >
              <tr>
                <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                  Pacient
                </th>
                <th className="px-6 py-5 text-[9px] font-black uppercase text-slate-400 tracking-widest text-right">
                  Înregistrat la
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {patients
                .filter(
                  (p) =>
                    p.full_name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase()) ||
                    p.phone?.includes(searchTerm),
                )
                .map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPatientId(p.id)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {p.full_name}
                        </span>
                        {p.allergies && p.allergies !== "Neagă" && (
                          <AlertCircle
                            size={14}
                            className="text-red-400 animate-pulse"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right text-xs text-slate-400">
                      {new Date(p.created_at).toLocaleDateString("ro-RO")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL ADAUGARE PACIENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative max-h-[90vh] overflow-y-auto scrollbar-thin">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={28} />
            </button>

            <h3 className="text-2xl font-bold text-[#556B2F] mb-10 uppercase tracking-tighter italic">
              Fișă Pacient Nou
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* STÂNGA: IDENTITATE */}
              <div className="space-y-5">
                <p className="text-[10px] font-black uppercase text-slate-300 border-b pb-2 tracking-[0.2em]">
                  Identitate și Contact
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <InputBlock
                    label="Nume *"
                    value={newPatient.last_name}
                    onChange={(v) =>
                      setNewPatient({ ...newPatient, last_name: v })
                    }
                  />
                  <InputBlock
                    label="Prenume *"
                    value={newPatient.first_name}
                    onChange={(v) =>
                      setNewPatient({ ...newPatient, first_name: v })
                    }
                  />
                </div>
                <InputBlock
                  label="Data Nașterii"
                  type="date"
                  value={newPatient.birth_date}
                  onChange={(v) =>
                    setNewPatient({ ...newPatient, birth_date: v })
                  }
                />
                <InputBlock
                  label="Telefon *"
                  value={newPatient.phone}
                  onChange={(v) => setNewPatient({ ...newPatient, phone: v })}
                />
                <InputBlock
                  label="Email"
                  value={newPatient.email}
                  onChange={(v) => setNewPatient({ ...newPatient, email: v })}
                />

                <div className="pt-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 block mb-1">
                    Doctor Alocat
                  </label>
                  <select
                    className="w-full border-b border-slate-100 py-2 outline-none text-sm bg-transparent"
                    value={newPatient.doctor_id}
                    onChange={(e) =>
                      setNewPatient({
                        ...newPatient,
                        doctor_id: e.target.value,
                      })
                    }
                  >
                    <option value="">Alege doctorul...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* DREAPTA: ANAMNEZĂ */}
              <div className="space-y-5">
                <p className="text-[10px] font-black uppercase text-slate-300 border-b pb-2 tracking-[0.2em]">
                  Anamneză Inițială
                </p>
                <InputBlock
                  label="Motiv Vizită"
                  value={newPatient.reason}
                  onChange={(v) => setNewPatient({ ...newPatient, reason: v })}
                />
                <InputBlock
                  label="Alergii"
                  value={newPatient.allergies}
                  onChange={(v) =>
                    setNewPatient({ ...newPatient, allergies: v })
                  }
                />
                <InputBlock
                  label="Antecedente Personale"
                  value={newPatient.antecedente_personale}
                  onChange={(v) =>
                    setNewPatient({ ...newPatient, antecedente_personale: v })
                  }
                />
                <InputBlock
                  label="Antecedente AHC"
                  value={newPatient.antecedente_familiale}
                  onChange={(v) =>
                    setNewPatient({ ...newPatient, antecedente_familiale: v })
                  }
                />
                <InputBlock
                  label="Medicație Fond"
                  value={newPatient.medicatie_fond}
                  onChange={(v) =>
                    setNewPatient({ ...newPatient, medicatie_fond: v })
                  }
                />
                <InputBlock
                  label="Examen Clinic"
                  value={newPatient.examen_clinic}
                  onChange={(v) =>
                    setNewPatient({ ...newPatient, examen_clinic: v })
                  }
                />
                <InputBlock
                  label="Investigații"
                  value={newPatient.investigatii}
                  onChange={(v) =>
                    setNewPatient({ ...newPatient, investigatii: v })
                  }
                />
              </div>
            </div>

            <button
              onClick={handleAddPatient}
              disabled={saving}
              className="w-full bg-[#556B2F] text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl mt-12 hover:bg-[#455a26] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Check size={20} />
              )}
              Înregistrează Pacientul
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

function InputBlock({ label, value, onChange, type = "text" }) {
  return (
    <div className="text-left">
      <label className="text-[9px] font-black uppercase text-slate-400 block mb-1 tracking-widest">
        {label}
      </label>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-slate-100 py-2 outline-none text-sm focus:border-[#556B2F] transition-colors bg-transparent"
      />
    </div>
  );
}
