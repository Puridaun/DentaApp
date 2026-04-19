import React from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ShieldCheck,
  Settings,
  LogOut,
  X,
} from "lucide-react";

export default function Sidebar({
  isSidebarOpen,
  setSidebarOpen,
  activeTab,
  handleTabChange,
  isAdmin,
  darkMode,
  onLogout,
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-in-out ${
        darkMode
          ? "bg-slate-900 border-r border-slate-800"
          : "bg-[#556B2F] text-white"
      } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* LOGO SECTION */}
      <div className="p-8 flex items-center justify-between">
        <span className="text-lg font-medium tracking-[0.3em] uppercase">
          StomaPortal
        </span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 hover:bg-black/10 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="px-6 space-y-2 mt-8">
        <NavItem
          label="Dashboard"
          icon={<LayoutDashboard size={18} strokeWidth={1.5} />}
          active={activeTab === "dashboard"}
          onClick={() => handleTabChange("dashboard")}
        />
        <NavItem
          label="Pacienți"
          icon={<Users size={18} strokeWidth={1.5} />}
          active={activeTab === "patients"}
          onClick={() => handleTabChange("patients")}
        />
        <NavItem
          label="Agenda"
          icon={<Calendar size={18} strokeWidth={1.5} />}
          active={activeTab === "agenda"}
          onClick={() => handleTabChange("agenda")}
        />
        {isAdmin && (
          <NavItem
            label="Echipă Admin"
            icon={<ShieldCheck size={18} strokeWidth={1.5} />}
            active={activeTab === "admin_staff"}
            onClick={() => handleTabChange("admin_staff")}
          />
        )}
        <NavItem
          label={isAdmin ? "Setări Sistem" : "Profilul Meu"}
          icon={<Settings size={18} strokeWidth={1.5} />}
          active={activeTab === "settings"}
          onClick={() => handleTabChange("settings")}
        />
      </nav>

      {/* LOGOUT */}
      <div className="absolute bottom-10 left-0 w-full px-6">
        <button
          onClick={onLogout}
          className="flex items-center gap-4 px-6 py-4 text-white/50 hover:text-white transition-all text-[11px] font-medium uppercase tracking-[0.2em] w-full group"
        >
          <LogOut
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Ieșire
        </button>
      </div>
    </aside>
  );
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[13px] transition-all duration-300 ${
        active
          ? "bg-white text-[#556B2F] shadow-xl shadow-black/10 font-medium translate-x-2"
          : "text-white/60 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="tracking-wide">{label}</span>
    </button>
  );
}
