import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabaseClient";
import Login from "./auth/Login";

// Pagini
import PatientsPage from "./pages/PatientsPage";
import SettingsPage from "./pages/SettingsPage";
import AdminStaffPage from "./pages/AdminStaffPage";
import AgendaPage from "./pages/AgendaPage";
import DashboardPage from "./pages/DashboardPage";

// Layout
import Header from "./components/Layout/Header";
import MobileNav from "./components/Layout/MobileNav";

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);

  const isAdmin = session?.user?.email === "hritcuserafim01@gmail.com";

  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      if (data) setProfile(data);
    } catch (err) {
      console.error("Profile Error:", err.message);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      if (session) await fetchProfile(session.user.id);
      setLoading(false);
    };
    initAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession) fetchProfile(currentSession.user.id);
      else {
        setProfile(null);
        setActiveTab("dashboard");
      }
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutConfirm(false);
    setProfile(null);
    setSession(null);
    setActiveTab("dashboard");
  };

  const getInitials = () => {
    if (isAdmin) return "HS";
    if (profile?.last_name && profile?.first_name) {
      return (profile.last_name[0] + profile.first_name[0]).toUpperCase();
    }
    return session?.user?.email?.[0]?.toUpperCase() || "U";
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

  return (
    /* Fundalul general este din nou cel curat (#FBFBFD) */
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${darkMode ? "dark bg-slate-950 text-white" : "bg-[#FBFBFD] text-slate-900"}`}
    >
      <Header
        activeTab={activeTab}
        handleTabChange={setActiveTab}
        isAdmin={isAdmin}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        displayTitle={displayTitle}
        displaySubtitle={displaySubtitle}
        userIdentityColor={
          profile?.color_preference || (isAdmin ? "#556B2F" : "#E6E6FA")
        }
        getContrastColor={(hex) =>
          ["#F0F8FF", "#F5FFFA", "#FFF5EE", "#FFF0F5", "#E6E6FA"].includes(
            hex?.toUpperCase(),
          )
            ? "#475569"
            : "white"
        }
        getInitials={getInitials}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-12">
        <div className="max-w-[1600px] mx-auto p-4 md:p-8">
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

      <MobileNav
        activeTab={activeTab}
        handleTabChange={setActiveTab}
        darkMode={darkMode}
      />

      {/* MODAL LOGOUT */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className={`${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"} p-8 rounded-[3rem] max-w-sm w-full text-center shadow-2xl border transition-all animate-in fade-in zoom-in duration-200`}
          >
            <h2
              className={`mb-2 font-medium ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Ieșire Cont
            </h2>
            <p className="text-[13px] mb-8 font-normal text-slate-500">
              Sigur dorești să părăsești platforma?
            </p>
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full py-4 bg-[#556B2F] text-white rounded-2xl font-medium uppercase text-[12px] tracking-widest active:scale-95 transition-all"
              >
                Confirmă Ieșirea
              </button>
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-2 text-slate-400 font-medium text-[12px] uppercase"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
