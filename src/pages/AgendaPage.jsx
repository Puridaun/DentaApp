import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Importăm piesele noastre noi
import AgendaGrid from "../components/Agenda/AgendaGrid";
import AgendaModal from "../components/Agenda/AgendaModal";

export default function AgendaPage({ darkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    time: "08:00",
    patientId: "",
    procedure: "",
    doctorId: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  async function fetchData() {
    setLoading(true);
    const dateStr = currentDate.toISOString().split("T")[0];

    const [apptsRes, patientsRes, doctorsRes] = await Promise.all([
      supabase
        .from("appointments")
        .select(
          `*, patient:patients(full_name), doctor:profiles!doctor_id(full_name, color_preference)`,
        )
        .eq("appointment_date", dateStr),
      supabase.from("patients").select("id, full_name").order("full_name"),
      supabase.from("profiles").select("id, full_name, color_preference"),
    ]);

    if (apptsRes.data) setAppointments(apptsRes.data);
    if (patientsRes.data) setPatients(patientsRes.data);
    if (doctorsRes.data) setDoctors(doctorsRes.data);
    setLoading(false);
  }

  const handleSave = async () => {
    const dateStr = currentDate.toISOString().split("T")[0];
    const [h, m] = form.time.split(":");
    let endM = parseInt(m) + 30;
    let endH = parseInt(h);
    if (endM === 60) {
      endM = 0;
      endH++;
    }
    const endTime = `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}:00`;

    const payload = {
      patient_id: form.patientId,
      doctor_id: form.doctorId,
      appointment_date: dateStr,
      start_time: form.time + ":00",
      end_time: endTime,
      procedure_name: form.procedure,
      notes: form.notes,
    };

    const { error } = editingId
      ? await supabase.from("appointments").update(payload).eq("id", editingId)
      : await supabase.from("appointments").insert([payload]);

    if (!error) {
      setShowModal(false);
      fetchData();
    }
  };

  const deleteAppt = async () => {
    if (window.confirm("Anulezi programarea?")) {
      await supabase.from("appointments").delete().eq("id", editingId);
      setShowModal(false);
      fetchData();
    }
  };

  const openAddModal = (ora) => {
    setEditingId(null);
    setForm({
      time: ora || "08:00",
      patientId: "",
      procedure: "",
      doctorId: "",
      notes: "",
    });
    setShowModal(true);
  };

  const openEditModal = (appt) => {
    setEditingId(appt.id);
    setForm({
      time: appt.start_time.substring(0, 5),
      patientId: appt.patient_id,
      procedure: appt.procedure_name,
      doctorId: appt.doctor_id,
      notes: appt.notes || "",
    });
    setShowModal(true);
  };

  return (
    <div className="p-2 md:p-8 max-w-6xl mx-auto text-left animate-in fade-in duration-500">
      {/* HEADER - Îl lăsăm aici pentru că e scurt */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="bg-olive-base p-3 rounded-2xl text-white shadow-lg">
            <CalIcon size={24} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              {currentDate.toLocaleDateString("ro-RO", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </h1>
            <p className="text-[10px] uppercase font-black text-text-muted">
              Management Clinică
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() - 1);
                setCurrentDate(d);
              }}
              className="p-3 hover:bg-slate-50 border-r transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-5 py-2 text-[10px] font-black uppercase text-olive-base"
            >
              Azi
            </button>
            <button
              onClick={() => {
                const d = new Date(currentDate);
                d.setDate(d.getDate() + 1);
                setCurrentDate(d);
              }}
              className="p-3 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button
            onClick={() => openAddModal()}
            className="bg-olive-base text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase shadow-lg flex items-center gap-2"
          >
            <Plus size={16} /> Programare
          </button>
        </div>
      </div>

      {/* PIESA 1: Grid-ul de programări */}
      <AgendaGrid
        loading={loading}
        appointments={appointments}
        onAddClick={openAddModal}
        onEditClick={openEditModal}
      />

      {/* PIESA 2: Modalul de adăugare/editare */}
      <AgendaModal
        show={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        setForm={setForm}
        doctors={doctors}
        patients={patients}
        onSave={handleSave}
        onDelete={deleteAppt}
        editingId={editingId}
      />
    </div>
  );
}
