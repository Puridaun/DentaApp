import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loader2 } from "lucide-react";

// Importăm noile componente
import AdminSettings from "../components/Settings/AdminSettings";
import DoctorProfileForm from "../components/Settings/DoctorProfileForm";

export default function SettingsPage({
  session,
  darkMode,
  isAdmin,
  onProfileUpdate,
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    last_name: "",
    first_name: "",
    specialization: "",
    phone: "",
    birth_date: "",
    color_preference: "#E6E6FA",
  });

  const formatValue = (str) => str.replace(/\b\w/g, (l) => l.toUpperCase());

  useEffect(() => {
    if (session && !isAdmin) fetchProfile();
    else setLoading(false);
  }, [session, isAdmin]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (data) {
        setProfile({
          last_name: data.last_name || "",
          first_name: data.first_name || "",
          specialization: data.specialization || "",
          phone: data.phone || "",
          birth_date: data.birth_date || "",
          color_preference: data.color_preference || "#E6E6FA",
        });
        if (data.full_name) setIsLocked(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    const fullName = `${profile.last_name} ${profile.first_name}`.trim();
    const { error } = await supabase.from("profiles").upsert({
      id: session.user.id,
      ...profile,
      full_name: fullName,
      updated_at: new Date().toISOString(),
    });

    if (!error) {
      setIsLocked(true);
      setShowConfirm(false);
      onProfileUpdate();
    }
    setSaving(false);
  }

  if (loading)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-slate-300" />
      </div>
    );

  // VIZUALIZARE ADMIN
  if (isAdmin) {
    return <AdminSettings session={session} darkMode={darkMode} />;
  }

  // VIZUALIZARE MEDIC
  return (
    <>
      <DoctorProfileForm
        profile={profile}
        setProfile={setProfile}
        isLocked={isLocked}
        darkMode={darkMode}
        formatValue={formatValue}
        onSaveClick={() => setShowConfirm(true)}
      />

      {/* MODAL CONFIRMARE (Specific paginii de setări) */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-text-main/10 backdrop-blur-sm text-left">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-sm text-center shadow-2xl border border-slate-100">
            <h3 className="text-lg font-medium mb-2">Confirmi datele?</h3>
            <p className="text-sm text-text-muted mb-8 font-light">
              După salvare, datele nu mai pot fi modificate personal.
            </p>
            <div className="flex flex-col gap-2">
              <button
                disabled={saving}
                onClick={handleSave}
                className="w-full py-4 bg-olive-base text-white rounded-2xl font-medium text-[11px] uppercase tracking-widest flex justify-center items-center"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Confirm"
                )}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-4 text-text-muted font-medium text-[11px] uppercase tracking-widest"
              >
                Anulează
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
