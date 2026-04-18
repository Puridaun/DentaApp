import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Users,
  Calendar,
  Wallet,
  TrendingUp,
  Filter,
  Loader2,
} from "lucide-react";

// Importăm piesele noi
import StatCard from "../components/Dashboard/StatCard";
import DoctorDistribution from "../components/Dashboard/DoctorDistribution";

export default function DashboardPage({ darkMode, isAdmin }) {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    appointmentsPerDoctor: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState("all");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDoctor]);

  async function fetchDashboardData() {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0];

    const { data: doctorsList } = await supabase
      .from("profiles")
      .select("id, full_name, color_preference");
    setDoctors(doctorsList || []);

    let patientQuery = supabase
      .from("patients")
      .select("id", { count: "exact" });
    if (selectedDoctor !== "all")
      patientQuery = patientQuery.eq("doctor_id", selectedDoctor);
    const { count: patientCount } = await patientQuery;

    let apptQuery = supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("appointment_date", today);
    if (selectedDoctor !== "all")
      apptQuery = apptQuery.eq("doctor_id", selectedDoctor);
    const { count: apptCount } = await apptQuery;

    let revenue = 0;
    if (isAdmin) {
      const { data: treatments } = await supabase
        .from("treatments")
        .select("amount_paid");
      revenue =
        treatments?.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0) ||
        0;
    }

    const { data: allTodayAppts } = await supabase
      .from("appointments")
      .select("doctor_id")
      .eq("appointment_date", today);

    const distribution = (doctorsList || []).map((d) => ({
      name: d.full_name,
      count: allTodayAppts?.filter((a) => a.doctor_id === d.id).length || 0,
      color: d.color_preference || "#556B2F",
    }));

    setStats({
      totalPatients: patientCount || 0,
      todayAppointments: apptCount || 0,
      totalRevenue: revenue,
      appointmentsPerDoctor: distribution,
    });
    setLoading(false);
  }

  if (loading)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-olive-base" size={40} />
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-left animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 px-2">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-text-main"}`}
          >
            Salut, Serafim! 👋
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Iată ce se întâmplă astăzi în clinica ta.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <Filter size={16} className="ml-2 text-text-muted" />
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="text-xs font-bold uppercase tracking-widest outline-none bg-transparent pr-4 cursor-pointer text-slate-600"
          >
            <option value="all">Toți Doctorii</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CARDURI STATISTICI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard
          icon={<Users className="text-blue-500" />}
          label="Total Pacienți"
          value={stats.totalPatients}
          subLabel="Înscriși în sistem"
          darkMode={darkMode}
        />
        <StatCard
          icon={<Calendar className="text-amber-500" />}
          label="Programări Azi"
          value={stats.todayAppointments}
          subLabel={new Date().toLocaleDateString("ro-RO")}
          darkMode={darkMode}
        />
        {isAdmin && (
          <StatCard
            icon={<Wallet className="text-olive-base" />}
            label="Total Încasări"
            value={`${stats.totalRevenue.toLocaleString()} RON`}
            subLabel="Bani adunați (Sistem)"
            darkMode={darkMode}
            highlight
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DISTRIBUTIE DOCTORI */}
        <DoctorDistribution stats={stats} darkMode={darkMode} />

        {/* CARD OBIECTIV (rămâne aici fiindcă e unic) */}
        <div className="p-8 rounded-[2.5rem] border-2 bg-olive-base text-white shadow-xl shadow-olive-base/20 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Obiectiv Clinică</h3>
            <p className="text-white/70 text-sm mb-6 font-light">
              Eficiența crește atunci când agenda este plină. Verifică pacienții
              care nu au mai venit de 6 luni!
            </p>
            <button className="bg-white text-olive-base px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
              Vezi Raport Reactivare
            </button>
          </div>
          <TrendingUp
            size={150}
            className="absolute bottom-[-20px] right-[-20px] text-white/10 rotate-12"
          />
        </div>
      </div>
    </div>
  );
}
