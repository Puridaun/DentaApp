import React from "react";
import { LayoutDashboard, Users, Calendar } from "lucide-react";

export default function MobileNav({ activeTab, handleTabChange, darkMode }) {
  const tabs = [
    {
      id: "dashboard",
      label: "Home",
      icon: <LayoutDashboard size={22} strokeWidth={1.5} />,
    },
    {
      id: "patients",
      label: "Pacienți",
      icon: <Users size={22} strokeWidth={1.5} />,
    },
    {
      id: "agenda",
      label: "Agenda",
      icon: <Calendar size={22} strokeWidth={1.5} />,
    },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 h-20 border-t px-8 flex items-center justify-around z-50 backdrop-blur-lg ${
        darkMode
          ? "bg-slate-900/90 border-slate-800 text-white"
          : "bg-[#f2f6f0]/95 border-[#e4e9e1] text-slate-900"
      }`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`flex flex-col items-center gap-1 transition-all duration-300 ${
            activeTab === tab.id ? "text-[#556B2F]" : "text-slate-400"
          }`}
        >
          <div
            className={`p-2 rounded-2xl transition-all ${activeTab === tab.id ? "bg-[#556B2F]/10 scale-110" : "scale-100"}`}
          >
            {tab.icon}
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.1em]">
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
