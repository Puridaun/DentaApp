import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import Login from "./auth/Login";
import PatientsPage from "./pages/PatientsPage";
import SettingsPage from "./pages/SettingsPage";
import AdminStaffPage from "./pages/AdminStaffPage";
import AgendaPage from "./pages/AgendaPage";
import DashboardPage from "./pages/DashboardPage"; // 1. Importăm noua pagină
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  LogOut,
  ShieldCheck,
} from "lucide-react";

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // 2. Setăm Dashboard ca pagină de pornire
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.email === "hritcuserafim01@gmail.com";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setActiveTab("dashboard");
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (data) setProfile(data);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutConfirm(false);
    setProfile(null);
    setSession(null);
    setActiveTab("dashboard");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const getContrastColor = (hexcolor) => {
    if (!hexcolor) return "white";
    const lightColors = ["#F0F8FF", "#F5FFFA", "#FFF5EE", "#FFF0F5", "#E6E6FA"];
    return lightColors.includes(hexcolor.toUpperCase()) ? "#475569" : "white";
  };

  if (loading) return null;
  if (!session) return <Login />;

  let displayTitle = isAdmin
    ? "ING. HRITCU SERAFIM"
    : profile?.last_name
      ? `DR. ${profile.last_name.toUpperCase()} ${profile.first_name.toUpperCase()}`
      : session.user.email.toUpperCase();

  let displaySubtitle = isAdmin
    ? "ADMINISTRATOR SISTEM"
    : profile?.specialization
      ? profile.specialization.toUpperCase()
      : "CONT NECONFIGURAT";

  const getInitials = () => {
    if (isAdmin) return "HS";
    if (profile?.last_name && profile?.first_name) {
      return (profile.last_name[0] + profile.first_name[0]).toUpperCase();
    }
    return session.user.email[0].toUpperCase();
  };

  const userIdentityColor =
    profile?.color_preference || (isAdmin ? "#556B2F" : "#E6E6FA");

  return (
    <div
      className={`min-h-screen flex overflow-hidden transition-colors duration-500 ${darkMode ? "bg-slate-950 text-slate-200" : "bg-[#FBFBFD] text-slate-900"}`}
    >
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out ${darkMode ? "bg-slate-900 border-r border-slate-800" : "bg-[#556B2F] text-white shadow-2xl"} ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <span className="text-xl font-black tracking-tighter italic uppercase text-white tracking-widest">
            StomaPortal
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-black/20 rounded-full lg:hidden text-white"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="px-4 space-y-1 mt-6 text-left">
          {/* 3. Link către Dashboard */}
          <NavItem
            label="Dashboard"
            icon={<LayoutDashboard size={18} />}
            active={activeTab === "dashboard"}
            onClick={() => handleTabChange("dashboard")}
          />
          <NavItem
            label="Pacienți"
            icon={<Users size={18} />}
            active={activeTab === "patients"}
            onClick={() => handleTabChange("patients")}
          />
          <NavItem
            label="Agenda"
            icon={<Calendar size={18} />}
            active={activeTab === "agenda"}
            onClick={() => handleTabChange("agenda")}
          />
          {isAdmin && (
            <NavItem
              label="Echipă (Admin)"
              icon={<ShieldCheck size={18} />}
              active={activeTab === "admin_staff"}
              onClick={() => handleTabChange("admin_staff")}
            />
          )}
          <NavItem
            label={isAdmin ? "Setări Sistem" : "Profilul Meu"}
            icon={<Settings size={18} />}
            active={activeTab === "settings"}
            onClick={() => handleTabChange("settings")}
          />
        </nav>
        <div className="absolute bottom-8 left-0 w-full px-4 border-t border-white/5 pt-4">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white font-medium text-[10px] uppercase tracking-widest w-full"
          >
            <LogOut size={16} /> Ieșire
          </button>
        </div>
      </aside>

      <main
        className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}
      >
        <header
          className={`h-16 flex items-center px-6 sticky top-0 z-40 shadow-md transition-all duration-500 ${darkMode ? "bg-slate-900 border-b border-slate-800" : isSidebarOpen ? "bg-[#808d6a] opacity-95" : "bg-[#556B2F]"} text-white`}
        >
          {!isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 mr-4 bg-white/20 hover:bg-white/30 rounded-lg"
            >
              <Menu size={22} />
            </button>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-white/10 rounded-full"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-6 w-[1px] bg-white/20 mx-1" />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium tracking-tight text-white">
                {displayTitle}
              </p>
              <p className="text-[9px] font-normal tracking-widest opacity-80 uppercase">
                {displaySubtitle}
              </p>
            </div>
            <div
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[13px] font-black border-2 border-white shadow-lg uppercase transition-all duration-500"
              style={{
                backgroundColor: userIdentityColor,
                color: getContrastColor(userIdentityColor),
              }}
            >
              {getInitials()}
            </div>
          </div>
        </header>

        <div
          className={`flex-1 overflow-y-auto ${isSidebarOpen ? "lg:opacity-100 opacity-40" : "opacity-100"}`}
        >
          {/* 4. Randarea paginii Dashboard */}
          {activeTab === "dashboard" && (
            <DashboardPage darkMode={darkMode} isAdmin={isAdmin} />
          )}
          {activeTab === "patients" && <PatientsPage darkMode={darkMode} />}
          {activeTab === "agenda" && <AgendaPage darkMode={darkMode} />}
          {activeTab === "settings" && (
            <SettingsPage
              session={session}
              darkMode={darkMode}
              isAdmin={isAdmin}
              onProfileUpdate={() => fetchProfile(session.user.id)}
            />
          )}
          {activeTab === "admin_staff" && isAdmin && (
            <AdminStaffPage darkMode={darkMode} />
          )}
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-xs w-full text-center shadow-2xl">
            <h3 className="text-lg font-medium mb-2 text-slate-900">
              Ieșire cont
            </h3>
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest mb-2 shadow-lg"
            >
              Confirmă
            </button>
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest"
            >
              Anulează
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${active ? "bg-white text-[#556B2F] shadow-lg scale-105 font-bold" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
    >
      {icon} {label}
    </button>
  );
}

export default App;
