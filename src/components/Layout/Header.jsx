import React, { useState } from "react";
import {
  Moon,
  Sun,
  LayoutDashboard,
  Users,
  Calendar,
  ShieldCheck,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Header({
  activeTab,
  handleTabChange,
  isAdmin,
  darkMode,
  setDarkMode,
  displayTitle,
  displaySubtitle,
  userIdentityColor,
  getContrastColor,
  getInitials,
  onLogout,
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
    },
    {
      id: "patients",
      label: "Pacienți",
      icon: <Users size={18} strokeWidth={1.5} />,
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: <Calendar size={18} strokeWidth={1.5} />,
    },
  ];

  return (
    <header
      className={`h-20 flex items-center px-6 md:px-12 sticky top-0 z-50 border-b transition-all duration-500 ${
        darkMode
          ? "bg-slate-900/90 border-slate-800"
          : "bg-[#f2f6f0] border-[#e4e9e1]"
      } backdrop-blur-md`}
    >
      <div className="mr-10">
        <span className="text-[13px] font-medium tracking-[0.3em] uppercase text-[#556B2F]">
          StomaPortal
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTabChange(item.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[13px] font-medium transition-all ${
              activeTab === item.id
                ? "bg-[#556B2F] text-white shadow-lg shadow-[#556B2F]/20"
                : "text-slate-500 hover:bg-[#556B2F]/10"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2.5 rounded-xl transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400" : "hover:bg-black/5 text-slate-500"}`}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer p-1.5 pr-4 rounded-2xl hover:bg-black/5 transition-all"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[12px] font-medium shadow-sm uppercase border border-black/5"
              style={{
                backgroundColor: userIdentityColor,
                color: getContrastColor(userIdentityColor),
              }}
            >
              {getInitials()}
            </div>
            <div className="hidden sm:block text-left">
              <p
                className={`text-[13px] font-medium leading-tight ${darkMode ? "text-white" : "text-slate-800"}`}
              >
                {displayTitle}
              </p>
              <div className="flex items-center gap-1 opacity-40">
                <span className="text-[10px] uppercase tracking-widest font-medium">
                  {displaySubtitle}
                </span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${showProfileMenu ? "rotate-180" : ""}`}
                />
              </div>
            </div>
          </div>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              />
              <div
                className={`absolute right-0 mt-3 w-60 rounded-[2rem] border shadow-2xl z-20 py-4 animate-in fade-in zoom-in duration-200 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-50"}`}
              >
                {isAdmin && (
                  <button
                    onClick={() => {
                      handleTabChange("admin_staff");
                      setShowProfileMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-6 py-3.5 text-[13px] font-medium text-slate-500 hover:bg-[#556B2F]/5 transition-colors"
                  >
                    <ShieldCheck size={18} strokeWidth={1.5} /> Echipă Admin
                  </button>
                )}
                <button
                  onClick={() => {
                    handleTabChange("settings");
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3.5 text-[13px] font-medium text-slate-500 hover:bg-[#556B2F]/5 transition-colors"
                >
                  <Settings size={18} strokeWidth={1.5} />{" "}
                  {isAdmin ? "Setări Sistem" : "Profilul Meu"}
                </button>
                <div
                  className={`my-2 h-[1px] ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}
                />
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-6 py-3.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} strokeWidth={1.5} /> Ieșire
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
