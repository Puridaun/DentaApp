import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import StaffTable from "../components/AdminStaff/StaffTable";
import EditStaffModal from "../components/AdminStaff/EditStaffModal";

export default function AdminStaffPage({ darkMode }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("profiles").select("*");
      if (!error) setStaff(data || []);
    } finally {
      setLoading(false);
    }
  }

  const handleEditClick = (member) => {
    setEditingMember({
      ...member,
      color_preference: member.color_preference || "#E6E6FA",
    });
    setIsModalOpen(true);
  };

  async function handleUpdate() {
    setSaving(true);
    const fullName =
      `${editingMember.last_name} ${editingMember.first_name}`.trim();

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: editingMember.first_name,
        last_name: editingMember.last_name,
        full_name: fullName,
        specialization: editingMember.specialization,
        phone: editingMember.phone,
        color_preference: editingMember.color_preference,
      })
      .eq("id", editingMember.id);

    if (!error) {
      setIsModalOpen(false);
      fetchStaff();
    }
    setSaving(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700 text-left font-sans">
      {/* Header-ul paginii rămâne aici fiindcă e scurt și specific paginii */}
      <div className="mb-10">
        <h1
          className={`text-2xl font-medium tracking-tight ${darkMode ? "text-white" : "text-text-main"}`}
        >
          Gestiune Echipă Medicală
        </h1>
        <p className="text-text-muted text-xs mt-1 font-light italic">
          Monitorizare și editare profiluri medici.
        </p>
      </div>

      {/* PIESA 1: Tabelul (Pasul 3) */}
      <StaffTable
        staff={staff}
        loading={loading}
        onEdit={handleEditClick}
        darkMode={darkMode}
      />

      {/* PIESA 2: Modalul (Pasul 2) */}
      {isModalOpen && (
        <EditStaffModal
          member={editingMember}
          setMember={setEditingMember}
          onSave={handleUpdate}
          onClose={() => setIsModalOpen(false)}
          saving={saving}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
