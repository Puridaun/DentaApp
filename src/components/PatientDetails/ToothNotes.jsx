import React from "react";
import { ArrowRight } from "lucide-react";

export default function ToothNotes({
  activeTooth,
  toothNotes,
  setToothNotes,
  onBack,
  onNext,
  isLast,
}) {
  // Verificăm dacă e un dinte (cifre) sau o arcadă (text) pentru a ajusta designul cercului
  const isNumeric = !isNaN(activeTooth);

  return (
    <div className="p-4 md:p-6 bg-[#f2f6f0]/50 rounded-[2.5rem] border border-[#556B2F]/10 animate-in zoom-in duration-200 text-left">
      <div className="flex justify-between items-center mb-4 text-slate-800">
        <div className="flex items-center gap-3 w-full">
          {/* Badge dinamic: cerc pentru cifre, pastilă pentru text lung */}
          <div
            className={`
            flex items-center justify-center bg-[#556B2F] text-white font-black shadow-lg border-4 border-white
            ${isNumeric ? "w-12 h-12 md:w-14 md:h-14 rounded-full text-[18px] md:text-[20px]" : "px-4 py-2 rounded-2xl text-[14px] md:text-[16px]"}
          `}
          >
            {activeTooth}
          </div>
          <div className="flex-1">
            <h4 className="text-[14px] md:text-[16px] font-bold text-[#556B2F] tracking-tight leading-none">
              Detalii lucrare
            </h4>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">
              {isNumeric ? "Dinte selectat" : "Zonă selectată"}
            </p>
          </div>
        </div>
      </div>

      <textarea
        autoFocus
        className="w-full p-4 md:p-5 rounded-2xl md:rounded-3xl border-none shadow-sm text-[14px] md:text-[15px] min-h-[140px] md:min-h-[160px] outline-none focus:ring-2 focus:ring-[#556B2F]/20 resize-none bg-white text-slate-700 font-medium"
        placeholder="Ce ai lucrat aici?..."
        value={toothNotes[activeTooth] || ""}
        onChange={(e) =>
          setToothNotes({ ...toothNotes, [activeTooth]: e.target.value })
        }
      />

      <div className="flex gap-2 md:gap-3 mt-5 md:mt-6">
        <button
          onClick={onBack}
          className="flex-1 py-3 md:py-4 border border-slate-100 bg-white text-slate-400 rounded-xl md:rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all"
        >
          Anulează
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-3 md:py-4 bg-[#556B2F] text-white rounded-xl md:rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-md flex items-center justify-center gap-2 hover:bg-[#465826] active:scale-95 transition-all"
        >
          {isLast ? "Finalizează" : "Următorul"} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
