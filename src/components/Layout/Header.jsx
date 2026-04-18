import React from "react";
import { Menu, Moon, Sun } from "lucide-react";

export default function Header({
  isSidebarOpen,
  setSidebarOpen,
  darkMode,
  setDarkMode,
  displayTitle,
  displaySubtitle,
  userIdentityColor,
  getContrastColor,
  getInitials,
}) {
  return (
    <header
      className={`h-16 flex items-center px-6 sticky top-0 z-40 shadow-md transition-all duration-500 ${
        darkMode
          ? "bg-text-main border-b border-slate-800"
          : isSidebarOpen
            ? "bg-[#808d6a] opacity-95"
            : "bg-olive-base"
      } text-white`}
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
        <div className="text-right hidden sm:block text-left">
          <p className="text-sm font-medium tracking-tight text-white leading-tight">
            {displayTitle}
          </p>
          <p className="text-[9px] font-normal tracking-widest opacity-80 uppercase">
            {displaySubtitle}
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-black border-2 border-white shadow-lg uppercase transition-all duration-500"
          style={{
            backgroundColor: userIdentityColor,
            color: getContrastColor(userIdentityColor),
          }}
        >
          {getInitials()}
        </div>
      </div>
    </header>
  );
}
