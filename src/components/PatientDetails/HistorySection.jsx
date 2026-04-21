import React from "react";
import { Clock, MessageCircle, ArrowRight, User } from "lucide-react";

export default function HistorySection({ treatments, darkMode, onContinue }) {
  if (!treatments || treatments.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 italic">
        Nu există istoric.
      </div>
    );
  }

  // LOGICA DE GRUPARE ȘI SORTARE CRONOLOGICĂ
  const groupTreatments = (items) => {
    const groups = {};

    // 1. Grupăm după ID-ul părinte (sau ID propriu dacă e începutul tratamentului)
    items.forEach((t) => {
      const key = t.parent_id || t.id;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });

    return Object.values(groups)
      .map((group) => {
        // 2. SORTĂM ȘEDINȚELE DIN INTERIORUL PACHETULUI
        // Cea mai nouă ședință să fie prima (index 0) - cea care stă deasupra
        return group.sort((a, b) => {
          const dateTimeA = new Date(
            `${a.treatment_date} ${a.treatment_time || "00:00"}`,
          );
          const dateTimeB = new Date(
            `${b.treatment_date} ${b.treatment_time || "00:00"}`,
          );
          return dateTimeB - dateTimeA;
        });
      })
      .sort((a, b) => {
        // 3. SORTĂM PACHETELE ÎNTRE ELE PE PAGINĂ
        // Tratamentele care au avut activitate recentă apar primele sus
        const dateA = new Date(
          `${a[0].treatment_date} ${a[0].treatment_time || "00:00"}`,
        );
        const dateB = new Date(
          `${b[0].treatment_date} ${b[0].treatment_time || "00:00"}`,
        );
        return dateB - dateA;
      });
  };

  return (
    <div className="relative pl-6 md:pl-8 space-y-10 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800">
      {groupTreatments(treatments).map((group, gIdx) => {
        const latest = group[0]; // Ședința cea mai recentă din acest grup
        const isPending = latest.status === "În lucru";

        // CALCUL SUME PE GRUP (Asigurăm conversia numerică)
        const totalCostGrup = group.reduce(
          (sum, t) => sum + (parseFloat(t.total_cost) || 0),
          0,
        );
        const totalPlatitGrup = group.reduce(
          (sum, t) => sum + (parseFloat(t.amount_paid) || 0),
          0,
        );

        return (
          <div key={gIdx} className="relative text-left">
            {/* Indicatorul de pe timeline */}
            <div
              className={`absolute -left-[20px] md:-left-[27px] top-2 w-[11px] h-[11px] rounded-full border-2 border-white dark:border-slate-900 z-50 ${isPending ? "bg-amber-500 animate-pulse" : "bg-[#556B2F]"}`}
            />

            {/* HEADER MINIMALIST */}
            <div className="mb-2 flex items-center justify-between px-2">
              <div>
                <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#556B2F]">
                  {latest.procedure_name} — {latest.tooth_number}
                </h3>
                <div className="flex gap-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Total: {totalCostGrup} RON
                  </span>
                  <span className="text-[10px] font-bold text-[#556B2F] uppercase">
                    Achitat: {totalPlatitGrup} RON
                  </span>
                </div>
              </div>

              {isPending && (
                <button
                  onClick={() => onContinue(latest)}
                  className="px-3 py-1 bg-amber-500 text-white rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-amber-600 transition-colors"
                >
                  Finalizează <ArrowRight size={10} className="inline ml-1" />
                </button>
              )}
            </div>

            {/* PACHETUL DE ȘEDINȚE (Cărți de joc) */}
            <div className="flex flex-col">
              {group.map((session, sIdx) => {
                const isTop = sIdx === 0;
                return (
                  <div
                    key={session.id}
                    className={`rounded-[2rem] border p-5 transition-all duration-300 ${
                      isTop
                        ? "z-20 bg-white shadow-sm border-slate-100"
                        : "z-10 bg-slate-50/70 opacity-60 scale-[0.97]"
                    } ${darkMode ? "bg-slate-900 border-slate-800" : ""}`}
                    style={{
                      marginTop: isTop ? "0" : "-45px",
                      zIndex: group.length - sIdx,
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Clock size={10} className="text-slate-400" />
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">
                          {session.treatment_date} •{" "}
                          {session.treatment_time || "00:00"}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-[#556B2F]">
                        +{session.total_cost} RON
                      </span>
                    </div>

                    <div className="space-y-3">
                      {session.additional_info && (
                        <div className="flex gap-2 items-start">
                          <MessageCircle
                            size={12}
                            className="text-slate-300 mt-0.5"
                          />
                          <p className="text-[12px] text-slate-600 italic">
                            "{session.additional_info}"
                          </p>
                        </div>
                      )}

                      {session.indicatii_pacient && (
                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-[11px] text-amber-700">
                          <strong className="text-[9px] uppercase tracking-wider">
                            Indicații:
                          </strong>{" "}
                          {session.indicatii_pacient}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-slate-100 flex justify-between items-center text-[9px] uppercase font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        Status: {session.status}
                      </span>
                      <span>
                        Dr.{" "}
                        {session.doctor_info?.full_name?.split(" ").pop() ||
                          "Veronica"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
