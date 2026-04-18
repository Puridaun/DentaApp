import React, { useState } from "react";
import {
  Clock,
  User,
  FileText,
  X,
  AlertCircle,
  Calendar,
  Hash,
} from "lucide-react";

export default function HistorySection({
  treatments = [],
  patient,
  onContinue,
}) {
  const [snapshot, setSnapshot] = useState(null);

  // Sortăm evenimentele: cele mai noi să fie primele
  const sortedEvents = [...(treatments || [])].sort((a, b) => {
    return new Date(b.treatment_date) - new Date(a.treatment_date);
  });

  if (sortedEvents.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 mx-4">
        <AlertCircle className="mx-auto text-slate-300 mb-3" size={40} />
        <p className="text-slate-500 font-medium">Nu există istoric medical.</p>
        <p className="text-slate-400 text-xs mt-1">
          Înregistrarea inițială și manoperele vor apărea aici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 ml-4 border-l-2 border-slate-100 pl-8 text-left pb-20 relative">
      {sortedEvents.map((e, i) => (
        <div key={e.id || i} className="relative group">
          {/* Bulina Timeline */}
          <div className="absolute left-[-41px] top-6 w-4 h-4 rounded-full border-4 border-white bg-[#556B2F] shadow-sm group-hover:scale-125 transition-transform" />

          <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all">
            {/* Header: Titlu și Dată */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <span className="text-[8px] font-black uppercase text-[#556B2F] bg-[#556B2F]/10 px-2 py-1 rounded-md tracking-widest mb-2 inline-block">
                  {e.procedure_name.includes("Înregistrare")
                    ? "Documentație"
                    : "Intervenție"}
                </span>
                <h4 className="text-xl font-bold text-slate-800 tracking-tight">
                  {e.procedure_name}
                </h4>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-end gap-1">
                  <Calendar size={12} />{" "}
                  {new Date(e.treatment_date).toLocaleDateString("ro-RO")}
                </p>
                <p className="text-[10px] font-bold text-slate-300 flex items-center justify-end gap-1 mt-1">
                  <Clock size={12} /> {e.treatment_time || "--:--"}
                </p>
              </div>
            </div>

            {/* Corp: Observații și Detalii Tehnice */}
            <div className="bg-slate-50/50 p-5 rounded-2xl mb-5 border border-slate-50">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                {e.additional_info
                  ? `"${e.additional_info}"`
                  : "Fără observații clinice adăugate."}
              </p>

              {e.indicatii_pacient && (
                <p className="text-[11px] text-[#556B2F] mt-3 font-medium">
                  <strong>Indicații:</strong> {e.indicatii_pacient}
                </p>
              )}

              <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-slate-100/50">
                {e.tooth_number && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg border border-slate-100 text-[#556B2F]">
                      <Hash size={14} />
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Dinți
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {e.tooth_number}
                      </p>
                    </div>
                  </div>
                )}
                {e.total_cost > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400">
                      RON
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase">
                        Financiar
                      </p>
                      <p className="text-xs font-bold text-slate-700">
                        {e.amount_paid} / {e.total_cost} RON
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer: Snapshot și Doctor */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {e.fisa_snapshot ? (
                <button
                  onClick={() => setSnapshot(e.fisa_snapshot)}
                  className="flex items-center gap-2 text-[9px] font-black uppercase text-white bg-[#556B2F] px-5 py-3 rounded-xl hover:bg-[#455a26] transition-all shadow-lg shadow-[#556B2F]/20 w-fit"
                >
                  <FileText size={14} /> Vezi Starea Fișei (Snapshot)
                </button>
              ) : (
                <div className="text-[9px] font-bold text-slate-300 uppercase italic">
                  Niciun snapshot atașat
                </div>
              )}

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                  <User size={12} className="text-slate-400" />
                </div>
                <p className="text-[9px] font-bold text-slate-500 uppercase">
                  {e.doctor_info?.full_name || "Doctor nesemnat"}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* MODAL SNAPSHOT (CUM ARĂTA FIȘA ATUNCI) */}
      {snapshot && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl scrollbar-thin">
            <button
              onClick={() => setSnapshot(null)}
              className="absolute top-8 right-8 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={28} />
            </button>

            <div className="border-b-2 border-slate-50 pb-6 mb-8">
              <h3 className="text-xl font-bold uppercase text-[#556B2F] tracking-tight">
                Snapshot Fișă Medicală
              </h3>
              <p className="text-xs text-slate-400 mt-2">
                Aceasta este starea fișei pacientului în momentul efectuării
                acestei manopere.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SnapshotField label="Motiv Vizită" value={snapshot.reason} />
              <SnapshotField
                label="Alergii"
                value={snapshot.allergies}
                highlight={
                  snapshot.allergies !== "Neagă" && snapshot.allergies !== ""
                }
              />
              <SnapshotField
                label="Antecedente Personale (APF/APP)"
                value={snapshot.antecedente_personale}
              />
              <SnapshotField
                label="Medicație Fond"
                value={snapshot.medicatie_fond}
              />
              <SnapshotField
                label="Examen Clinic"
                value={snapshot.examen_clinic}
              />
              <SnapshotField
                label="Investigații"
                value={snapshot.investigatii}
              />
              <SnapshotField
                label="Observații Generale"
                value={snapshot.observations}
              />
            </div>

            <button
              onClick={() => setSnapshot(null)}
              className="w-full mt-10 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-800 transition-all"
            >
              Închide Vizualizarea
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}

function SnapshotField({ label, value, highlight }) {
  return (
    <div className="text-left bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
      <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-2">
        {label}
      </p>
      <p
        className={`text-[13px] leading-relaxed whitespace-pre-wrap ${highlight ? "text-red-500 font-bold" : "text-slate-700"}`}
      >
        {value || "—"}
      </p>
    </div>
  );
}
