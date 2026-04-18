import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Users,
  Calendar,
  Wallet,
  TrendingUp,
  Filter,
  Loader2,
  ArrowUpRight,
  Activity,
} from "lucide-react";

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

    // 1. Luăm toți doctorii pentru filtru
    const { data: doctorsList } = await supabase
      .from("profiles")
      .select("id, full_name, color_preference");
    setDoctors(doctorsList || []);

    // 2. Query pentru Pacienți
    let patientQuery = supabase
      .from("patients")
      .select("id", { count: "exact" });
    if (selectedDoctor !== "all")
      patientQuery = patientQuery.eq("doctor_id", selectedDoctor);
    const { count: patientCount } = await patientQuery;

    // 3. Query pentru Programări Azi
    let apptQuery = supabase
      .from("appointments")
      .select("id", { count: "exact" })
      .eq("appointment_date", today);
    if (selectedDoctor !== "all")
      apptQuery = apptQuery.eq("doctor_id", selectedDoctor);
    const { count: apptCount } = await apptQuery;

    // 4. Query pentru Încasări (Doar Adminul vede totalul real)
    let revenue = 0;
    if (isAdmin) {
      const { data: treatments } = await supabase
        .from("treatments")
        .select("amount_paid");
      revenue =
        treatments?.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0) ||
        0;
    }

    // 5. Statistici per doctor (distribuție programări azi)
    const { data: allTodayAppts } = await supabase
      .from("appointments")
      .select("doctor_id, profiles(full_name, color_preference)")
      .eq("appointment_date", today);

    const distribution = doctorsList.map((d) => ({
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
        <Loader2 className="animate-spin text-[#556B2F]" size={40} />
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto text-left animate-in fade-in duration-700">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 px-2">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}
          >
            Salut, Serafim! 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Iată ce se întâmplă astăzi în clinica ta.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
          <Filter size={16} className="ml-2 text-slate-400" />
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

      {/* CARDURI STATISTICI PRINCIPALE */}
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
            icon={<Wallet className="text-[#556B2F]" />}
            label="Total Încasări"
            value={`${stats.totalRevenue.toLocaleString()} RON`}
            subLabel="Bani adunați (Sistem)"
            darkMode={darkMode}
            highlight
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DISTRIBUTIE PROGRAMARI */}
        <div
          className={`p-8 rounded-[2.5rem] border-2 ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-50 shadow-sm"}`}
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold flex items-center gap-2">
              <Activity size={18} className="text-[#556B2F]" /> Programări per
              Doctor (Azi)
            </h3>
            <span className="text-[10px] font-black uppercase text-slate-400">
              Live
            </span>
          </div>
          <div className="space-y-6">
            {stats.appointmentsPerDoctor.map((d, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>{d.name}</span>
                  <span className="text-[#556B2F]">{d.count} pacienți</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${(d.count / (stats.todayAppointments || 1)) * 100}%`,
                      backgroundColor: d.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IDEE NOUĂ: ACCES RAPID / NOTITE */}
        <div
          className={`p-8 rounded-[2.5rem] border-2 bg-[#556B2F] text-white shadow-xl shadow-[#556B2F]/20 relative overflow-hidden`}
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Obiectiv Clinică</h3>
            <p className="text-white/70 text-sm mb-6 font-light">
              Eficiența crește atunci când agenda este plină. Verifică pacienții
              care nu au mai venit de 6 luni!
            </p>
            <button className="bg-white text-[#556B2F] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all">
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

function StatCard({ icon, label, value, subLabel, darkMode, highlight }) {
  return (
    <div
      className={`p-8 rounded-[2.5rem] border-2 transition-all hover:scale-[1.02] ${
        highlight
          ? "bg-[#556B2F]/5 border-[#556B2F]/20"
          : darkMode
            ? "bg-slate-900 border-slate-800 text-white"
            : "bg-white border-slate-50 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
          {icon}
        </div>
        <ArrowUpRight size={16} className="text-slate-300" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
          {label}
        </p>
        <h2 className="text-3xl font-bold tracking-tight mb-1">{value}</h2>
        <p className="text-[10px] font-medium text-slate-400 italic">
          {subLabel}
        </p>
      </div>
    </div>
  );
}
