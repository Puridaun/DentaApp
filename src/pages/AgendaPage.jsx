import { Calendar as CalIcon, Plus } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import AgendaGrid from "../components/Agenda/AgendaGrid";
import AgendaModal from "../components/Agenda/AgendaModal";
import { syncToGoogleCalendar } from "../lib/googleCalendar";

export default function AgendaPage({ darkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const dateInputRef = useRef(null);

  const [form, setForm] = useState({
    time: "08:00",
    endTime: "21:00",
    patientId: "",
    customName: "",
    procedure: "",
    doctorId: "",
    notes: "",
    attendance_status: "Programat", // Noua stare
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    const dateStr = currentDate.toISOString().split("T")[0];
    try {
      const [apptsRes, patientsRes, doctorsRes] = await Promise.all([
        supabase
          .from("appointments")
          .select(
            `*, patient:patients(full_name), doctor:profiles!doctor_id(full_name, color_preference, calendar_email)`,
          )
          .eq("appointment_date", dateStr),
        supabase.from("patients").select("id, full_name").order("full_name"),
        supabase
          .from("profiles")
          .select("id, full_name, color_preference, calendar_email"),
      ]);
      if (apptsRes.data) setAppointments(apptsRes.data);
      if (patientsRes.data) setPatients(patientsRes.data);
      if (doctorsRes.data) setDoctors(doctorsRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, [currentDate]);

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel("db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "appointments" },
        () => fetchData(),
      )
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [fetchData]);

  const handleSave = async () => {
    const toMin = (t) => {
      const parts = String(t).split(":");
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    };
    const s = toMin(form.time);
    const e = toMin(form.endTime);

    const conflict = appointments.find((a) => {
      if (editingId && String(a.id) === String(editingId)) return false;
      if (String(a.doctor_id) !== String(form.doctorId)) return false;
      const as = toMin(a.start_time);
      const ae = toMin(a.end_time);
      return s < ae && as < e;
    });

    if (
      conflict &&
      !window.confirm(`Medicul are deja o programare atunci. Continui?`)
    )
      return;

    const payload = {
      patient_id: form.patientId || null,
      temp_patient_name: !form.patientId ? form.customName : null,
      doctor_id: form.doctorId,
      appointment_date: currentDate.toISOString().split("T")[0],
      start_time: form.time.substring(0, 5) + ":00",
      end_time: form.endTime.substring(0, 5) + ":00",
      procedure_name: form.procedure,
      notes: form.notes,
      attendance_status: form.attendance_status, // Noua coloana
    };

    const { data, error } = editingId
      ? await supabase
          .from("appointments")
          .update(payload)
          .eq("id", editingId)
          .select()
          .single()
      : await supabase.from("appointments").insert([payload]).select().single();

    if (!error && data) {
      try {
        const patientObj = patients.find(
          (p) => String(p.id) === String(form.patientId),
        );
        const displayPatientName = patientObj
          ? patientObj.full_name
          : form.customName;
        const doctorObj = doctors.find(
          (d) => String(d.id) === String(form.doctorId),
        );

        await syncToGoogleCalendar(
          {
            date: payload.appointment_date,
            time: payload.start_time,
            procedure_name: payload.procedure_name,
            patient_name: displayPatientName || "Pacient",
            note: payload.notes,
          },
          doctorObj?.calendar_email,
        );
      } catch (calErr) {
        console.error(calErr);
      }
      setShowModal(false);
      fetchData();
    }
  };

  const openAddModal = (ora) => {
    setEditingId(null);
    setForm({
      time: ora || "08:00",
      endTime: "09:00",
      patientId: "",
      customName: "",
      procedure: "",
      doctorId: doctors[0]?.id || "",
      notes: "",
      attendance_status: "Programat",
    });
    setShowModal(true);
  };

  const openEditModal = (appt) => {
    setEditingId(appt.id);
    setForm({
      time: appt.start_time.substring(0, 5),
      endTime: appt.end_time.substring(0, 5),
      patientId: appt.patient_id || "",
      customName: appt.temp_patient_name || "",
      procedure: appt.procedure_name,
      doctorId: appt.doctor_id,
      notes: appt.notes || "",
      attendance_status: appt.attendance_status || "Programat",
    });
    setShowModal(true);
  };

  return (
    <div
      className={`w-full overflow-x-hidden p-3 md:p-8 max-w-7xl mx-auto text-left ${darkMode ? "text-white" : "text-slate-900"}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-3 md:gap-5">
          <div
            onClick={() => dateInputRef.current.showPicker()}
            className="bg-[#556B2F] p-3 md:p-4 rounded-[1.25rem] text-white shadow-xl cursor-pointer relative"
          >
            <CalIcon size={24} className="md:w-7 md:h-7" />
            <input
              ref={dateInputRef}
              type="date"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setCurrentDate(new Date(e.target.value))}
            />
          </div>
          <div>
            <h1 className="text-lg md:text-3xl font-bold uppercase tracking-tight leading-tight">
              {currentDate.toLocaleDateString("ro-RO", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </h1>
            <p className="text-[10px] md:text-[13px] font-bold uppercase tracking-[0.2em] text-[#556B2F]">
              Dental Clinic System
            </p>
          </div>
        </div>
        <button
          onClick={() => openAddModal()}
          className="w-full sm:w-auto bg-[#556B2F] text-white px-6 py-4 rounded-2xl text-[11px] md:text-[12px] font-bold uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Programare
        </button>
      </div>

      <AgendaGrid
        loading={loading}
        appointments={appointments}
        onAddClick={openAddModal}
        onEditClick={openEditModal}
        darkMode={darkMode}
      />

      <AgendaModal
        show={showModal}
        onClose={() => setShowModal(false)}
        form={form}
        setForm={setForm}
        doctors={doctors}
        patients={patients}
        onSave={handleSave}
        onDelete={() => {
          if (window.confirm("Ștergi?")) {
            supabase
              .from("appointments")
              .delete()
              .eq("id", editingId)
              .then(() => {
                setShowModal(false);
                fetchData();
              });
          }
        }}
        editingId={editingId}
        darkMode={darkMode}
      />
    </div>
  );
}
