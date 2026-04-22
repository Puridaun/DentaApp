import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Clock,
  MessageCircle,
  ArrowRight,
  X,
  Trash2,
  Calendar as CalendarIcon,
  Info,
  Edit2,
  Save,
} from "lucide-react";

export default function HistorySection({
  treatments,
  darkMode,
  onContinue,
  onUpdate,
}) {
  const [selectedSession, setSelectedSession] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

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

  const handleStartEdit = (session) => {
    setEditData({
      treatment_date: session.treatment_date,
      treatment_time: session.treatment_time
        ? session.treatment_time.split(".")[0]
        : "12:00",
      additional_info: session.additional_info || session.notes || "",
      indicatii_pacient:
        session.indicatii_pacient === "EMPTY"
          ? ""
          : session.indicatii_pacient || "",
      total_cost: session.total_cost || 0,
      amount_paid: session.amount_paid || 0,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const updatedValues = {
        treatment_date: editData.treatment_date,
        treatment_time: editData.treatment_time,
        additional_info: editData.additional_info,
        indicatii_pacient: editData.indicatii_pacient || "EMPTY",
        total_cost: parseFloat(editData.total_cost) || 0,
        amount_paid: parseFloat(editData.amount_paid) || 0,
      };
      const { error } = await supabase
        .from("treatments")
        .update(updatedValues)
        .eq("id", selectedSession.id);
      if (error) throw error;
      if (onUpdate) onUpdate({ id: selectedSession.id, ...updatedValues });
      setIsEditing(false);
      setSelectedSession(null);
    } catch (err) {
      alert("Eroare la salvare: " + err.message);
    }
  };

  const handleDelete = async (e, session) => {
    e.stopPropagation();
    if (session.procedure_name === "Înregistrare & Fișă Inițială")
      return alert("Nu se poate șterge fișa inițială.");
    if (!window.confirm("Sigur dorești să ștergi această ședință?")) return;
    const { error } = await supabase
      .from("treatments")
      .delete()
      .eq("id", session.id);
    if (error)
      return alert(
        error.code === "23503"
          ? "Șterge mai întâi continuările."
          : error.message,
      );
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

  return (
    <div className="relative pl-6 md:pl-10 space-y-12 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800 text-left">
      {groupTreatments(treatments).map((group, gIdx) => {
        const latest = group[0];
        const isPending = latest.status === "În lucru";
        const totalCostGrup = group.reduce(
          (sum, t) => sum + (parseFloat(t.total_cost) || 0),
          0,
        );
        const totalPlatitGrup = group.reduce(
          (sum, t) => sum + (parseFloat(t.amount_paid) || 0),
          0,
        );

        return (
          <div key={gIdx} className="relative">
            <div
              className={`absolute -left-[20px] md:-left-[29px] top-2.5 w-[14px] h-[14px] rounded-full border-2 border-white dark:border-slate-900 z-50 ${isPending ? "bg-amber-500 animate-pulse" : "bg-[#556B2F]"}`}
            />

            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <h3 className="text-[14px] md:text-[16px] font-bold uppercase tracking-widest text-[#556B2F]">
                  {latest.procedure_name}{" "}
                  {latest.tooth_number ? `— #${latest.tooth_number}` : ""}
                </h3>
                <div className="flex gap-4 mt-1">
                  <span className="text-[11px] md:text-[13px] font-medium text-slate-400 uppercase tracking-tighter">
                    Cost: {totalCostGrup} RON
                  </span>
                  <span className="text-[11px] md:text-[13px] font-bold text-[#556B2F] uppercase tracking-tighter">
                    Plătit: {totalPlatitGrup} RON
                  </span>
                </div>
              </div>
              {isPending && (
                <button
                  onClick={() => onContinue(latest)}
                  className="px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] md:text-[11px] font-medium uppercase tracking-widest shadow-sm"
                >
                  FINALIZARE
                </button>
              )}
            </div>

            <div className="flex flex-col">
              {group.map((session, sIdx) => {
                const isTop = sIdx === 0;
                const isInitialCard =
                  session.procedure_name === "Înregistrare & Fișă Inițială";
                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      setSelectedSession(session);
                      setIsEditing(false);
                    }}
                    className={`group/card relative rounded-[2.5rem] border p-6 transition-all duration-300 cursor-pointer ${
                      isTop
                        ? "z-20 bg-white shadow-md border-slate-100"
                        : "z-10 bg-slate-50 opacity-60 scale-[0.97]"
                    } ${darkMode ? "bg-slate-900 border-slate-800 text-white" : "text-slate-800"}`}
                    style={{
                      marginTop: isTop ? "0" : "-55px",
                      zIndex: group.length - sIdx,
                    }}
                  >
                    {isTop && !isInitialCard && (
                      <button
                        onClick={(e) => handleDelete(e, session)}
                        className="absolute top-5 right-5 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
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
                    {(session.additional_info || session.notes) && (
                      <div className="flex gap-3 items-start">
                        <MessageCircle
                          size={16}
                          className="text-slate-300 mt-0.5"
                        />
                        <p
                          className={`text-[13px] md:text-[14px] font-medium italic line-clamp-2 ${darkMode ? "text-slate-300" : "text-slate-600"}`}
                        >
                          "{session.additional_info || session.notes}"
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
            className={`w-full max-w-lg rounded-[3rem] p-6 md:p-10 shadow-2xl overflow-y-auto max-h-[95vh] ${darkMode ? "bg-slate-900 border border-slate-800 text-white" : "bg-white text-slate-800"}`}
          >
            <div className="flex justify-between items-start mb-8 text-left text-slate-800">
              <div>
                <p className="text-[#556B2F] text-[11px] font-bold uppercase tracking-[0.2em] mb-1">
                  Dosar Istoric
                </p>
                <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight leading-tight">
                  {selectedSession.procedure_name}
                </h3>
              </div>
              <div className="flex gap-2">
                {!isEditing && (
                  <button
                    onClick={() => handleStartEdit(selectedSession)}
                    className="p-2 hover:bg-slate-100 rounded-full text-[#556B2F]"
                  >
                    <Edit2 size={22} />
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedSession(null);
                    setIsEditing(false);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <div className="flex gap-10">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Data vizitei
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      className="w-full bg-slate-50 border p-1 rounded font-medium text-[14px] text-slate-700 outline-[#556B2F]"
                      value={editData.treatment_date}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          treatment_date: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-[14px] font-medium text-slate-600">
                      <CalendarIcon size={16} className="text-[#556B2F]" />
                      {selectedSession.treatment_date}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Ora
                  </label>
                  {isEditing ? (
                    <input
                      type="time"
                      className="w-full bg-slate-50 border p-1 rounded font-medium text-[14px] text-slate-700 outline-[#556B2F]"
                      value={editData.treatment_time}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          treatment_time: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-[14px] font-medium text-slate-600">
                      <Clock size={16} className="text-[#556B2F]" />
                      {formatTime(selectedSession.treatment_time)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Dinte lucrat
                </label>
                <div className="flex items-center gap-2 text-[15px] font-bold text-[#556B2F]">
                  {selectedSession.tooth_number
                    ? `#${selectedSession.tooth_number}`
                    : "Nespecificat"}
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">
                  Observații ședință
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full p-4 rounded-[2rem] border text-[14px] bg-slate-50 min-h-[100px] text-slate-700 font-medium outline-[#556B2F]"
                    value={editData.additional_info}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        additional_info: e.target.value,
                      })
                    }
                  />
                ) : (
                  <div
                    className={`p-5 rounded-[2rem] border text-[14px] leading-relaxed italic font-medium ${darkMode ? "text-slate-300" : "bg-slate-50 border-slate-100 text-slate-600"}`}
                  >
                    {selectedSession.additional_info || "Nu există observații."}
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#556B2F] uppercase block mb-2 tracking-widest text-left">
                  Indicații post-operatorii
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full p-4 rounded-[2rem] border-2 text-[14px] bg-[#556B2F]/5 border-[#556B2F]/10 min-h-[100px] text-slate-700 font-medium outline-[#556B2F]"
                    value={editData.indicatii_pacient}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        indicatii_pacient: e.target.value,
                      })
                    }
                  />
                ) : selectedSession.indicatii_pacient &&
                  selectedSession.indicatii_pacient !== "EMPTY" ? (
                  <div className="p-6 rounded-[2rem] border-2 flex gap-4 bg-[#556B2F]/5 border-[#556B2F]/20 text-left">
                    <Info size={24} className="shrink-0 text-[#556B2F]" />
                    <p className="text-[14px] leading-relaxed font-medium italic text-slate-700">
                      {selectedSession.indicatii_pacient}
                    </p>
                  </div>
                ) : (
                  <p className="text-[12px] text-slate-400 font-medium italic ml-2 text-left">
                    Nicio indicație salvată.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5 text-left">
                    Cost total
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-full bg-transparent border-b border-[#556B2F] text-[18px] font-bold text-[#556B2F] outline-none"
                      value={editData.total_cost}
                      onChange={(e) =>
                        setEditData({ ...editData, total_cost: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-[18px] font-bold text-[#556B2F] text-left">
                      {selectedSession.total_cost || 0} RON
                    </p>
                  )}
                </div>
                <div className="p-4 rounded-2xl border border-slate-100">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5 text-left">
                    Achitat
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-full bg-transparent border-b border-[#556B2F] text-[18px] font-bold text-[#556B2F] outline-none"
                      value={editData.amount_paid}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          amount_paid: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-[18px] font-bold text-[#556B2F] text-left">
                      {selectedSession.amount_paid || 0} RON
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-3">
              {isEditing ? (
                <button
                  onClick={handleSaveEdit}
                  className="w-full py-5 bg-[#556B2F] text-white rounded-[2rem] text-[12px] font-bold uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Salvează Modificările
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedSession(null);
                    setIsEditing(false);
                  }}
                  className="w-full py-5 bg-[#556B2F] text-white rounded-[2rem] text-[12px] font-bold uppercase tracking-widest shadow-xl font-bold"
                >
                  ÎNCHIDE FEREASTRA
                </button>
              )}
              {!isEditing &&
                selectedSession.procedure_name !==
                  "Înregistrare & Fișă Inițială" && (
                  <button
                    onClick={(e) => handleDelete(e, selectedSession)}
                    className="w-full py-4 border border-red-100 text-red-500 rounded-[2rem] text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-red-50 font-bold"
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
