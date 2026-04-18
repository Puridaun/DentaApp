import React from "react";
import {
  X,
  Save,
  User,
  FileText,
  Phone,
  Calendar,
  HeartPulse,
  Stethoscope,
  ClipboardList,
  Users,
  Mail,
} from "lucide-react";

export default function AddPatientModal({
  show,
  onClose,
  newPatient,
  setNewPatient,
  doctors,
  onSave,
  saving,
  darkMode,
}) {
  if (!show) return null;

  const fieldClass = `w-full px-5 py-4 rounded-2xl text-base outline-none transition-all font-normal border ${
    darkMode
      ? "bg-slate-800 text-white border-slate-700 focus:border-olive-base"
      : "bg-slate-50 text-text-main border-slate-100 focus:border-olive-light focus:bg-white shadow-sm"
  }`;

  const labelClass = `flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] mb-2.5 ml-1 font-medium ${
    darkMode ? "text-slate-400" : "text-text-muted"
  }`;

  const sectionHeaderStyle = {
    color: "#6B8441",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.25em",
    textTransform: "uppercase",
    borderBottom: darkMode ? "1px solid #334155" : "1px solid #f1f5f9",
    marginBottom: "24px",
    paddingBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const handleChange = (field, value) => {
    setNewPatient((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center md:p-6">
      <div
        className={`fixed inset-0 backdrop-blur-md ${darkMode ? "bg-black/80" : "bg-slate-900/40"}`}
        onClick={onClose}
      />

      <div
        className={`relative w-full max-w-2xl h-full md:h-auto md:max-h-[92vh] overflow-y-auto transition-all shadow-2xl md:rounded-[2.5rem] scrollbar-thin ${
          darkMode ? "bg-[#0F172A] border-slate-800" : "bg-white border-white"
        } border`}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 rounded-full hover:bg-slate-800/50 transition-colors"
        >
          <X size={22} className="text-slate-500" />
        </button>

        <div className="p-8 md:p-14">
          <div className="mb-12">
            <h2
              style={{ color: "#6B8441" }}
              className="text-3xl font-bold tracking-tight mb-2"
            >
              Fișă Pacient Nou
            </h2>
            <p
              className={`text-sm ${darkMode ? "text-slate-500" : "text-text-muted"}`}
            >
              Înregistrare completă în baza de date medicală.
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <h3 style={sectionHeaderStyle}>Identitate și Contact</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      <User size={14} /> Nume *
                    </label>
                    <input
                      type="text"
                      placeholder="Nume"
                      className={fieldClass}
                      value={newPatient.last_name}
                      onChange={(e) =>
                        handleChange("last_name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <User size={14} /> Prenume *
                    </label>
                    <input
                      type="text"
                      placeholder="Prenume"
                      className={fieldClass}
                      value={newPatient.first_name}
                      onChange={(e) =>
                        handleChange("first_name", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      <Calendar size={14} /> Data Nașterii
                    </label>
                    <input
                      type="date"
                      className={fieldClass}
                      value={newPatient.birth_date}
                      onChange={(e) =>
                        handleChange("birth_date", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <Phone size={14} /> Telefon *
                    </label>
                    <input
                      type="tel"
                      placeholder="07xx xxx xxx"
                      className={fieldClass}
                      value={newPatient.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                {/* Email adăugat sub Data Nașterii și Telefon */}
                <div>
                  <label className={labelClass}>
                    <Mail size={14} /> Email
                  </label>
                  <input
                    type="email"
                    placeholder="pacient@exemplu.com"
                    className={fieldClass}
                    value={newPatient.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>Doctor Responsabil</label>
                  <select
                    className={fieldClass}
                    value={newPatient.doctor_id}
                    onChange={(e) => handleChange("doctor_id", e.target.value)}
                  >
                    <option
                      value=""
                      style={{ background: darkMode ? "#1e293b" : "#fff" }}
                    >
                      Selectează medicul...
                    </option>
                    {doctors.map((doc) => (
                      <option
                        key={doc.id}
                        value={doc.id}
                        style={{
                          background: darkMode ? "#1e293b" : "#fff",
                          color: darkMode ? "#fff" : "#000",
                        }}
                      >
                        {doc.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            <section>
              <h3 style={sectionHeaderStyle}>Anamneză și Examen Clinic</h3>
              <div className="space-y-8">
                <div>
                  <label className={labelClass}>
                    <FileText size={14} /> Motivul Vizitei
                  </label>
                  <textarea
                    rows={2}
                    className={`${fieldClass} resize-none`}
                    placeholder="De ce a venit pacientul?"
                    value={newPatient.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <HeartPulse size={14} /> Alergii
                  </label>
                  <textarea
                    rows={2}
                    className={`${fieldClass} resize-none`}
                    value={newPatient.allergies}
                    onChange={(e) => handleChange("allergies", e.target.value)}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <User size={14} /> Antecedente Personale
                  </label>
                  <textarea
                    rows={3}
                    className={`${fieldClass} resize-none`}
                    placeholder="Boli cronice, operații..."
                    value={newPatient.antecedente_personale}
                    onChange={(e) =>
                      handleChange("antecedente_personale", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <Users size={14} /> Antecedente Familiale
                  </label>
                  <textarea
                    rows={3}
                    className={`${fieldClass} resize-none`}
                    placeholder="Istoric medical familie..."
                    value={newPatient.antecedente_familiale}
                    onChange={(e) =>
                      handleChange("antecedente_familiale", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Medicație de fond</label>
                  <textarea
                    rows={2}
                    className={`${fieldClass} resize-none`}
                    value={newPatient.medicatie_fond}
                    onChange={(e) =>
                      handleChange("medicatie_fond", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <Stethoscope size={14} /> Examen Clinic
                  </label>
                  <textarea
                    rows={3}
                    className={`${fieldClass} resize-none`}
                    placeholder="Starea actuală a pacientului..."
                    value={newPatient.examen_clinic}
                    onChange={(e) =>
                      handleChange("examen_clinic", e.target.value)
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    <ClipboardList size={14} /> Investigații & Observații
                  </label>
                  <textarea
                    rows={3}
                    className={`${fieldClass} resize-none`}
                    placeholder="Radiografii, analize, note..."
                    value={newPatient.investigatii}
                    onChange={(e) =>
                      handleChange("investigatii", e.target.value)
                    }
                  />
                </div>
              </div>
            </section>
          </div>

          <div className="mt-16 flex flex-col md:flex-row gap-4">
            <button
              onClick={onSave}
              disabled={saving}
              className="flex-1 bg-olive-base hover:bg-olive-light text-white py-5 rounded-2xl font-semibold text-xs uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? (
                "Salvare..."
              ) : (
                <>
                  <Save size={18} /> Salvează Fișa Pacientului
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className={`py-5 px-8 rounded-2xl font-medium text-xs uppercase tracking-widest transition-all ${darkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-400 hover:bg-slate-100"}`}
            >
              Anulează
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
