import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";
import Login from "./auth/Login";

// Importăm Pagini
import PatientsPage from "./pages/PatientsPage";
import SettingsPage from "./pages/SettingsPage";
import AdminStaffPage from "./pages/AdminStaffPage";
import AgendaPage from "./pages/AgendaPage";
import DashboardPage from "./pages/DashboardPage";

// Importăm Componente de Layout
import Sidebar from "./components/Layout/Sidebar";
import Header from "./components/Layout/Header";

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
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

  const getContrastColor = (hexcolor) => {
    if (!hexcolor) return "white";
    const lightColors = ["#F0F8FF", "#F5FFFA", "#FFF5EE", "#FFF0F5", "#E6E6FA"];
    return lightColors.includes(hexcolor.toUpperCase()) ? "#475569" : "white";
  };

  const getInitials = () => {
    if (isAdmin) return "HS";
    if (profile?.last_name && profile?.first_name) {
      return (profile.last_name[0] + profile.first_name[0]).toUpperCase();
    }
    return session?.user?.email[0].toUpperCase() || "U";
  };

  if (loading) return null;
  if (!session) return <Login />;

  const displayTitle = isAdmin
    ? "ING. HRITCU SERAFIM"
    : profile?.last_name
      ? `DR. ${profile.last_name.toUpperCase()} ${profile.first_name.toUpperCase()}`
      : session.user.email.toUpperCase();

  const displaySubtitle = isAdmin
    ? "ADMINISTRATOR SISTEM"
    : profile?.specialization
      ? profile.specialization.toUpperCase()
      : "CONT NECONFIGURAT";

  const userIdentityColor =
    profile?.color_preference || (isAdmin ? "#556B2F" : "#E6E6FA");

  return (
    <div
      className={`min-h-screen flex overflow-hidden transition-colors duration-500 ${darkMode ? "bg-slate-950 text-slate-200" : "bg-[#FBFBFD] text-text-main"}`}
    >
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        handleTabChange={(tab) => {
          setActiveTab(tab);
          if (window.innerWidth < 1024) setSidebarOpen(false);
        }}
        isAdmin={isAdmin}
        darkMode={darkMode}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <main
        className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "lg:ml-0"}`}
      >
        <Header
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          displayTitle={displayTitle}
          displaySubtitle={displaySubtitle}
          userIdentityColor={userIdentityColor}
          getContrastColor={getContrastColor}
          getInitials={getInitials}
        />

        <div
          className={`flex-1 overflow-y-auto transition-opacity duration-300 ${isSidebarOpen ? "lg:opacity-100 opacity-40" : "opacity-100"}`}
        >
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

      {/* MODAL LOGOUT (Specific App.jsx) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm text-left">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-xs w-full text-center shadow-2xl">
            <h3 className="text-lg font-medium mb-2 text-text-main">
              Ieșire cont
            </h3>
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-text-main text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest mb-2 shadow-lg"
            >
              Confirmă
            </button>
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="w-full py-4 text-text-muted font-bold text-[10px] uppercase tracking-widest"
            >
              Anulează
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
