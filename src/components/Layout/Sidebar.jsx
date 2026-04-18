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
      className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out ${
        darkMode
          ? "bg-text-main border-r border-slate-800"
          : "bg-olive-base text-white shadow-2xl"
      } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
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
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white font-medium text-[10px] uppercase tracking-widest w-full"
        >
          <LogOut size={16} /> Ieșire
        </button>
      </div>
    </aside>
  );
}

function NavItem({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
        active
          ? "bg-white text-olive-base shadow-lg scale-105 font-bold"
          : "text-white/60 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon} {label}
    </button>
  );
}
