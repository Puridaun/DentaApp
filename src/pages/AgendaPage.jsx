import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  XCircle,
  Loader2,
  Calendar as CalIcon,
  Trash2,
} from "lucide-react";

// Generăm intervalele de 30 de minute: 07:00 - 22:00
const GENERATE_HOURS = () => {
  const hours = [];
  for (let i = 7; i <= 21; i++) {
    const h = i.toString().padStart(2, "0");
    hours.push(`${h}:00`, `${h}:30`);
  }
  return [...hours, "22:00"];
};

const ORE_LUCRU = GENERATE_HOURS();

// Paleta de culori (aceeași ca în SettingsPage)
const COLOR_MAP = {
  "#E6E6FA": {
    bg: "bg-[#E6E6FA]",
    border: "border-[#B19CD9]",
    text: "text-[#5E4B8B]",
  },
  "#F0F8FF": {
    bg: "bg-[#F0F8FF]",
    border: "border-[#B0C4DE]",
    text: "text-[#4682B4]",
  },
  "#F5FFFA": {
    bg: "bg-[#F5FFFA]",
    border: "border-[#98FB98]",
    text: "text-[#2E8B57]",
  },
  "#FFF5EE": {
    bg: "bg-[#FFF5EE]",
    border: "border-[#FFDAB9]",
    text: "text-[#CD853F]",
  },
  "#FFF0F5": {
    bg: "bg-[#FFF0F5]",
    border: "border-[#FFB6C1]",
    text: "text-[#C71585]",
  },
};

export default function AgendaPage({ darkMode }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    time: "",
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

    // Luăm programările + datele despre doctor (inclusiv culoarea sa)
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

  return (
    <div className="p-2 md:p-8 max-w-6xl mx-auto text-left animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="bg-[#556B2F] p-3 rounded-2xl text-white shadow-lg">
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
            <p className="text-[10px] uppercase font-black text-slate-400">
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
              className="px-5 py-2 text-[10px] font-black uppercase text-[#556B2F]"
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
            onClick={() => {
              setEditingId(null);
              setForm({
                time: "08:00",
                patientId: "",
                procedure: "",
                doctorId: "",
                notes: "",
              });
              setShowModal(true);
            }}
            className="bg-[#556B2F] text-white px-6 py-3 rounded-2xl text-[10px] font-bold uppercase shadow-lg flex items-center gap-2"
          >
            <Plus size={16} /> Programare
          </button>
        </div>
      </div>

      {/* GRID AGENDA */}
      <div className="rounded-[2.5rem] border-2 bg-white overflow-hidden shadow-xl border-slate-100 mb-20">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2
              className="animate-spin mx-auto text-[#556B2F]"
              size={40}
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {ORE_LUCRU.map((ora) => {
              const currentAppts = appointments.filter((a) =>
                a.start_time.startsWith(ora),
              );
              return (
                <div
                  key={ora}
                  className="flex group min-h-[75px] hover:bg-slate-50/30"
                >
                  <div
                    className={`w-16 md:w-24 py-4 px-3 text-right border-r-2 border-slate-50 ${ora.endsWith(":30") ? "opacity-30" : "bg-slate-50/50"}`}
                  >
                    <span className="text-[11px] font-black text-slate-500">
                      {ora}
                    </span>
                  </div>
                  <div className="flex-1 p-1 flex flex-wrap gap-2">
                    {currentAppts.map((appt) => {
                      const style =
                        COLOR_MAP[appt.doctor?.color_preference] ||
                        COLOR_MAP["#E6E6FA"];
                      return (
                        <div
                          key={appt.id}
                          onClick={() => {
                            setEditingId(appt.id);
                            setForm({
                              time: appt.start_time.substring(0, 5),
                              patientId: appt.patient_id,
                              procedure: appt.procedure_name,
                              doctorId: appt.doctor_id,
                              notes: appt.notes || "",
                            });
                            setShowModal(true);
                          }}
                          className={`flex-1 min-w-[200px] p-3 rounded-xl border-l-4 cursor-pointer hover:brightness-95 transition-all shadow-sm ${style.bg} ${style.border}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span
                              className={`text-[8px] font-black uppercase px-2 py-0.5 rounded bg-white/60 ${style.text}`}
                            >
                              {appt.procedure_name}
                            </span>
                            <span className="text-[8px] font-bold text-slate-500 flex items-center gap-1">
                              Dr. {appt.doctor?.full_name?.split(" ")[0]}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-slate-800">
                            {appt.patient?.full_name}
                          </span>
                          {appt.notes && (
                            <p className="text-[9px] text-slate-500 italic mt-1 truncate">
                              {appt.notes}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    {currentAppts.length === 0 && (
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setForm({ ...form, time: ora });
                          setShowModal(true);
                        }}
                        className="h-full w-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-slate-300 font-black text-[9px] uppercase"
                      >
                        <Plus size={12} /> Adaugă la {ora}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm text-left">
          <div className="bg-white w-full max-w-md p-8 rounded-[3rem] shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800">
                {editingId ? "Editare" : "Programare Nouă"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-300 hover:text-slate-600"
              >
                <XCircle size={28} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                    Ora
                  </label>
                  <select
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold bg-slate-50"
                  >
                    {ORE_LUCRU.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                    Doctor
                  </label>
                  <select
                    value={form.doctorId}
                    onChange={(e) =>
                      setForm({ ...form, doctorId: e.target.value })
                    }
                    className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold bg-slate-50"
                  >
                    <option value="">Alege Doctor...</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                  Pacient
                </label>
                <select
                  value={form.patientId}
                  onChange={(e) =>
                    setForm({ ...form, patientId: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold"
                >
                  <option value="">Alege Pacient...</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                  Manoperă
                </label>
                <input
                  type="text"
                  value={form.procedure}
                  onChange={(e) =>
                    setForm({ ...form, procedure: e.target.value })
                  }
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-bold"
                  placeholder="Ex: Control..."
                />
              </div>
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">
                  Note / Comentarii
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full p-4 rounded-2xl border-2 border-slate-100 text-sm font-medium min-h-[80px]"
                  placeholder="Note interne..."
                />
              </div>
              <div className="flex gap-2">
                {editingId && (
                  <button
                    onClick={deleteAppt}
                    className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={!form.patientId || !form.doctorId}
                  className="flex-1 bg-[#556B2F] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl disabled:opacity-20 active:scale-95 transition-all"
                >
                  {editingId ? "Actualizează" : "Salvează"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
