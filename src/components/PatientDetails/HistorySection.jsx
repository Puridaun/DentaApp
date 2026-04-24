import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Clock,
  MessageCircle,
  X,
  Trash2,
  Calendar as CalendarIcon,
  Info,
  Edit2,
  Save,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function HistorySection({
  treatments,
  darkMode,
  onContinue,
  onUpdate,
}) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(null);

  if (!treatments || treatments.length === 0) {
    return (
      <div className="py-20 text-center text-slate-400 italic font-medium uppercase tracking-widest text-[11px]">
        Nu există istoric.
      </div>
    );
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return "00:00";
    return timeStr.split(":").slice(0, 2).join(":");
  };

  const handleQuickFinalize = async (e, sessionId) => {
    e.stopPropagation();
    setIsUpdatingStatus(sessionId);
    try {
      const { error } = await supabase
        .from("treatments")
        .update({ status: "Finalizată" })
        .eq("id", sessionId);

      if (error) throw error;
      if (onUpdate) onUpdate();
    } catch (err) {
      alert("Eroare la finalizare: " + err.message);
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleDelete = async (session) => {
    if (session.procedure_name === "Înregistrare & Fișă Inițială")
      return alert("Nu se poate șterge fișa inițială.");
    if (!window.confirm("Sigur dorești să ștergi această ședință?")) return;

    const { error } = await supabase
      .from("treatments")
      .delete()
      .eq("id", session.id);

    if (error) {
      return alert(
        error.code === "23503"
          ? "Șterge mai întâi continuările."
          : error.message,
      );
    }

    setSelectedSession(null);
    if (onUpdate) onUpdate(session.id);
  };

  const groupTreatments = (items) => {
    const groups = {};
    items.forEach((t) => {
      const key = t.parent_id || t.id;
      if (!groups[key]) groups[key] = [];
      groups[key].push(t);
    });
    return Object.values(groups)
      .map((group) =>
        group.sort(
          (a, b) =>
            new Date(`${b.treatment_date} ${b.treatment_time || "00:00"}`) -
            new Date(`${a.treatment_date} ${a.treatment_time || "00:00"}`),
        ),
      )
      .sort(
        (a, b) =>
          new Date(`${b[0].treatment_date} ${b[0].treatment_time || "00:00"}`) -
          new Date(`${a[0].treatment_date} ${a[0].treatment_time || "00:00"}`),
      );
  };

  // Funcție inteligentă care separă Notele pe Dinte de Observații
  const getParsedNotes = (session) => {
    let obs = session.additional_info || "";
    let notesMap = {};

    if (obs.includes(" --- OBS: ")) {
      const parts = obs.split(" --- OBS: ");
      const tNotes = parts[0];
      obs = parts[1] || "";
      tNotes.split(" | ").forEach((p) => {
        const [t, ...rest] = p.split(": ");
        if (t) notesMap[t.trim()] = rest.join(": ").trim() || "-";
      });
    } else {
      // Verificăm dacă sunt doar note de dinți
      let isToothNotesOnly = false;
      if (session.tooth_number) {
        const teeth = session.tooth_number.split(", ");
        if (teeth.some((t) => obs.startsWith(t.trim() + ":"))) {
          isToothNotesOnly = true;
          obs.split(" | ").forEach((p) => {
            const [t, ...rest] = p.split(": ");
            if (t) notesMap[t.trim()] = rest.join(": ").trim() || "-";
          });
          obs = ""; // Golim observațiile pentru că erau doar note de dinți
        }
      }
    }

    // Ne asigurăm că TOȚI dinții selectați apar în listă (chiar și cu "-")
    if (session.tooth_number) {
      session.tooth_number.split(", ").forEach((t) => {
        const num = t.trim();
        if (num && !notesMap[num]) {
          notesMap[num] = "-";
        }
      });
    }

    return { obs: obs.trim(), notesMap };
  };

  const grouped = groupTreatments(treatments);

  // Datele parșate pentru modalul deschis
  const parsedModalNotes = selectedSession
    ? getParsedNotes(selectedSession)
    : { obs: "", notesMap: {} };

  return (
    <div className="relative pl-6 md:pl-10 space-y-12 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800 text-left font-sans">
      {grouped.map((group, gIdx) => {
        const latest = group[0];
        const isPending = latest.status === "În lucru";
        const isFirstPackage = gIdx === 0;

        return (
          <div key={gIdx} className="relative">
            <div
              className={`absolute -left-[20px] md:-left-[29px] top-2.5 w-[14px] h-[14px] rounded-full border-2 border-white dark:border-slate-900 z-50 ${isPending ? "bg-amber-500 animate-pulse" : "bg-[#556B2F]"}`}
            />

            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 px-2">
              <div>
                <h3 className="text-[14px] md:text-[16px] font-bold uppercase tracking-widest text-[#556B2F]">
                  {latest.procedure_name}{" "}
                  {latest.tooth_number ? `— #${latest.tooth_number}` : ""}
                </h3>
                <div className="flex gap-4 mt-1">
                  <span className="text-[11px] md:text-[13px] font-medium text-slate-400 uppercase tracking-tighter">
                    Cost:{" "}
                    {group.reduce(
                      (sum, t) => sum + (parseFloat(t.total_cost) || 0),
                      0,
                    )}{" "}
                    RON
                  </span>
                  <span className="text-[11px] md:text-[13px] font-bold text-[#556B2F] uppercase tracking-tighter">
                    Plătit:{" "}
                    {group.reduce(
                      (sum, t) => sum + (parseFloat(t.amount_paid) || 0),
                      0,
                    )}{" "}
                    RON
                  </span>
                </div>
              </div>

              {isPending && (
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <button
                    onClick={(e) => handleQuickFinalize(e, latest.id)}
                    disabled={isUpdatingStatus === latest.id}
                    className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-green-100 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={12} />{" "}
                    {isUpdatingStatus === latest.id ? "..." : "Finalizat"}
                  </button>
                  <button
                    onClick={() => onContinue(latest)}
                    className="flex-1 px-4 py-2 bg-[#556B2F]/10 text-[#556B2F] rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-[#556B2F] hover:text-white transition-all flex items-center justify-center gap-1.5"
                  >
                    <ArrowRight size={12} /> Continuă
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col relative">
              {group.map((session, sIdx) => {
                const isTop = sIdx === 0;
                let cardClasses = `group/card relative rounded-[2.5rem] border-2 p-6 transition-all duration-300 cursor-pointer `;

                if (isFirstPackage && isTop) {
                  cardClasses += darkMode
                    ? "bg-blue-900 border-blue-700 text-white z-20 shadow-lg"
                    : "bg-[#DDEBFF] border-blue-300 text-slate-800 z-20 shadow-lg";
                } else {
                  cardClasses += isTop
                    ? darkMode
                      ? "bg-slate-900 border-slate-800 text-white z-20 shadow-md"
                      : "bg-white border-slate-100 text-slate-800 z-20 shadow-md"
                    : darkMode
                      ? "bg-slate-800 border-slate-700 opacity-60 scale-[0.97] z-10"
                      : "bg-slate-50 border-slate-200 opacity-60 scale-[0.97] z-10";
                }

                // Extragem observația curată pentru listă
                const sessionNotes = getParsedNotes(session);

                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      setSelectedSession(session);
                      setIsEditing(false);
                    }}
                    className={cardClasses}
                    style={{
                      marginTop: isTop ? "0" : "-55px",
                      zIndex: group.length - sIdx,
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock size={14} />
                        <span className="text-[12px] font-medium uppercase">
                          {session.treatment_date} •{" "}
                          {formatTime(session.treatment_time)}
                        </span>
                      </div>
                      <span className="text-[14px] font-bold text-[#556B2F]">
                        +{session.total_cost} RON
                      </span>
                    </div>

                    {/* Arătăm doar Observația pe card, fără notele pe dinți */}
                    {sessionNotes.obs && (
                      <div className="flex gap-3 items-start">
                        <MessageCircle
                          size={16}
                          className="text-slate-300 mt-0.5"
                        />
                        <p
                          className={`text-[13px] md:text-[14px] font-medium italic line-clamp-2`}
                        >
                          "{sessionNotes.obs}"
                        </p>
                      </div>
                    )}

                    <div className="mt-5 pt-4 border-t border-dashed border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] md:text-[11px] uppercase font-medium text-slate-400 tracking-widest">
                      <span>Status: {session.status}</span>
                      <span>
                        Dr.{" "}
                        {session.doctor_info?.full_name?.split(" ").pop() ||
                          "Medic"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {selectedSession && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 md:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[95vh] ${darkMode ? "bg-slate-900 text-white border-slate-800" : "bg-white text-slate-800"}`}
          >
            <div className="flex justify-between items-start mb-8 text-left">
              <div>
                <p className="text-[#556B2F] text-[11px] font-bold uppercase tracking-[0.2em] mb-1">
                  Dosar Istoric
                </p>
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight leading-tight">
                  {selectedSession.procedure_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 text-left">
              <div className="flex gap-10">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Data vizitei
                  </label>
                  <div className="flex items-center gap-2 text-[14px] font-medium text-slate-600">
                    <CalendarIcon size={16} className="text-[#556B2F]" />
                    {selectedSession.treatment_date}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Ora
                  </label>
                  <div className="flex items-center gap-2 text-[14px] font-medium text-slate-600">
                    <Clock size={16} className="text-[#556B2F]" />
                    {formatTime(selectedSession.treatment_time)}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Dinți lucrați
                  </label>
                  {/* Butonul apare automat dacă avem dinți salvați */}
                  {!isEditing && selectedSession.tooth_number && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#f2f6f0] border border-[#556B2F]/10 text-[#556B2F] rounded-full text-[10px] font-bold hover:bg-[#556B2F] hover:text-white transition-all !text-transform-none !tracking-normal"
                    >
                      <Edit2 size={12} /> Detalii Dinți
                    </button>
                  )}
                </div>
                <div className="text-[15px] font-bold text-[#556B2F]">
                  {selectedSession.tooth_number
                    ? `#${selectedSession.tooth_number}`
                    : "Nespecificat"}
                </div>
              </div>

              {/* LISTA DETALIATĂ A DINȚILOR */}
              {isEditing && selectedSession.tooth_number && (
                <div className="p-5 bg-[#f2f6f0]/40 rounded-[2rem] border border-[#556B2F]/10 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <h5 className="text-[10px] font-bold text-[#556B2F] uppercase tracking-tighter mb-1">
                    Note per dinte:
                  </h5>
                  {Object.entries(parsedModalNotes.notesMap).map(
                    ([tooth, note], idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-1 border-b border-[#556B2F]/10 pb-3 last:border-0"
                      >
                        <span className="text-[12px] font-black text-slate-700">
                          Dintele {tooth}
                        </span>
                        <p className="text-[13px] font-medium italic text-slate-500">
                          {note}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              )}

              <div className="h-px bg-slate-100" />

              {/* OBSERVAȚII (Apare DOAR dacă s-a completat ceva) */}
              {parsedModalNotes.obs && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2 tracking-widest">
                    Observații ședință
                  </label>
                  <div
                    className={`p-5 rounded-[2.5rem] border text-[14px] leading-relaxed italic font-medium ${darkMode ? "text-slate-300" : "bg-slate-50 border-slate-100 text-slate-600"}`}
                  >
                    {parsedModalNotes.obs}
                  </div>
                </div>
              )}

              {/* INDICAȚII POST-OPERATORII (Apar DOAR dacă s-a completat ceva) */}
              {selectedSession.indicatii_pacient && (
                <div>
                  <label className="text-[10px] font-bold text-[#556B2F] uppercase block mb-2 tracking-widest">
                    Indicații post-operatorii
                  </label>
                  <div
                    className={`p-5 rounded-[2.5rem] border text-[14px] leading-relaxed italic font-medium ${darkMode ? "text-[#556B2F] border-[#556B2F]/20 bg-[#556B2F]/10" : "bg-[#f2f6f0]/50 border-[#556B2F]/10 text-slate-700"}`}
                  >
                    {selectedSession.indicatii_pacient}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-3xl border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                    Cost total
                  </label>
                  <p className="text-[18px] font-bold text-[#556B2F]">
                    {selectedSession.total_cost || 0} RON
                  </p>
                </div>
                <div className="p-4 rounded-3xl border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                    Achitat
                  </label>
                  <p className="text-[18px] font-bold text-[#556B2F]">
                    {selectedSession.amount_paid || 0} RON
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              <button
                onClick={() => setSelectedSession(null)}
                className="w-full py-5 bg-[#556B2F] text-white rounded-[2rem] text-[12px] font-bold uppercase tracking-widest shadow-xl transition-all hover:bg-[#4a5e29]"
              >
                ÎNCHIDE FEREASTRA
              </button>

              {selectedSession.procedure_name !==
                "Înregistrare & Fișă Inițială" && (
                <button
                  onClick={() => handleDelete(selectedSession)}
                  className="w-full py-4 border border-red-100 text-red-500 rounded-[2rem] text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} /> Șterge Ședința
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
