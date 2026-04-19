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
      <div className="p-40 flex justify-center">
        <Loader2
          className="animate-spin text-olive-base opacity-30"
          size={40}
        />
      </div>
    );

  return (
    <div
      className={`p-4 md:p-10 max-w-7xl mx-auto text-left animate-in fade-in duration-1000 ${darkMode ? "text-white" : "text-slate-900"}`}
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-medium tracking-tight">
            Salut, Serafim! 👋
          </h1>
          <p className="text-slate-400 text-[13px] mt-1 font-normal">
            Iată situația clinicii tale pentru astăzi.
          </p>
        </div>

        <div
          className={`flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}
        >
          <Filter size={14} className="text-slate-400" />
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="text-[11px] font-medium uppercase tracking-widest outline-none bg-transparent cursor-pointer text-slate-500"
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatCard
          icon={<Users className="text-blue-500" />}
          label="Total Pacienți"
          value={stats.totalPatients}
          subLabel="Bază de date activă"
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
            icon={<Wallet className="text-white" />}
            label="Total Încasări"
            value={`${stats.totalRevenue.toLocaleString()} RON`}
            subLabel="Calculat din tratamente"
            darkMode={darkMode}
            highlight
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <DoctorDistribution stats={stats} darkMode={darkMode} />

        {/* CARD OBIECTIV */}
        <div className="p-10 rounded-[3rem] border bg-slate-900 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10 max-w-[80%]">
            <h3 className="text-2xl font-medium mb-4">Obiectiv Clinică</h3>
            <p className="text-slate-400 text-[13px] mb-8 font-normal leading-relaxed">
              Verifică pacienții care nu au mai vizitat clinica de 6 luni. O
              listă plină înseamnă o clinică performantă.
            </p>
            <button className="bg-olive-base text-white px-8 py-4 rounded-2xl text-[11px] font-medium uppercase tracking-[0.2em] shadow-lg hover:scale-[1.03] transition-all">
              Raport Reactivare
            </button>
          </div>
          <TrendingUp
            size={180}
            className="absolute bottom-[-30px] right-[-30px] text-olive-base/10 rotate-12"
          />
        </div>
      </div>
    </div>
  );
}
