import React, { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Plus,
  Maximize2,
  X,
  FileText,
  Info,
  Calendar, // Am adăugat Calendar aici
} from "lucide-react";

export default function RadiographySection({ patientId, darkMode }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Stări pentru formularul de adăugare
  const [isAdding, setIsAdding] = useState(false);
  const [description, setDescription] = useState("");
  const [observations, setObservations] = useState("");
  const [tempFile, setTempFile] = useState(null);

  useEffect(() => {
    fetchImages();
  }, [patientId]);

  async function fetchImages() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("patient_images")
        .select("*")
        .eq("patient_id", patientId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (err) {
      console.error("Eroare la preluarea imaginilor:", err.message);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setIsAdding(false);
    setDescription("");
    setObservations("");
    setTempFile(null);
  };

  async function handleSaveRadiography() {
    if (!tempFile || !description.trim()) {
      alert("⚠️ Te rugăm să selectezi o imagine și să introduci o descriere.");
      return;
    }

    try {
      setUploading(true);

      const fileExt = tempFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${patientId}/${fileName}`;

      // 1. Upload în Storage (Bucket: radiographies)
      const { error: uploadError } = await supabase.storage
        .from("radiographies")
        .upload(filePath, tempFile);

      if (uploadError) throw uploadError;

      // 2. Luăm URL-ul public
      const {
        data: { publicUrl },
      } = supabase.storage.from("radiographies").getPublicUrl(filePath);

      // 3. Salvare în baza de date cu descriere și observații
      const { error: dbError } = await supabase.from("patient_images").insert([
        {
          patient_id: patientId,
          image_url: publicUrl,
          storage_path: filePath,
          description: description,
          observations: observations,
        },
      ]);

      if (dbError) throw dbError;

      resetForm();
      fetchImages();
    } catch (err) {
      alert("❌ Eroare la salvare: " + err.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id, storagePath) {
    if (
      !window.confirm(
        "Sigur dorești să ștergi această înregistrare radiologică?",
      )
    )
      return;
    try {
      if (storagePath) {
        await supabase.storage.from("radiographies").remove([storagePath]);
      }
      await supabase.from("patient_images").delete().eq("id", id);
      fetchImages();
    } catch (err) {
      alert("Eroare la ștergere.");
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. FORMULAR ADĂUGARE (CARD SAU BUTON) */}
      {!isAdding ? (
        <button
          onClick={() => setIsAdding(true)}
          className={`w-full py-12 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center gap-4 transition-all group ${
            darkMode
              ? "border-slate-800 bg-slate-900/50 hover:border-[#556B2F] hover:bg-slate-900"
              : "border-slate-100 bg-slate-50/50 hover:border-[#556B2F] hover:bg-white shadow-sm"
          }`}
        >
          <div className="p-4 rounded-full bg-[#556B2F]/10 text-[#556B2F] group-hover:scale-110 transition-transform">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-[#556B2F]">
              Adaugă Radiografie
            </span>
            <span className="text-[10px] text-slate-400 uppercase mt-1 block">
              Format: JPG, PNG (Max 5MB)
            </span>
          </div>
        </button>
      ) : (
        <div
          className={`p-8 md:p-10 rounded-[3rem] border animate-in zoom-in duration-300 ${
            darkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-100 shadow-xl"
          }`}
        >
          <div className="flex justify-between items-center mb-8">
            <h4 className="text-[#556B2F] text-[12px] font-bold uppercase tracking-[0.25em] flex items-center gap-2">
              <FileText size={16} /> Înregistrare Nouă
            </h4>
            <button
              onClick={resetForm}
              className="text-slate-400 hover:text-red-500"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Partea stângă: Upload fișier */}
            <div className="space-y-4">
              <label
                className={`relative h-full min-h-[200px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all ${
                  tempFile
                    ? "border-[#556B2F] bg-[#556B2F]/5"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {!tempFile ? (
                  <>
                    <Upload size={24} className="text-slate-300 mb-2" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Selectează Imaginea
                    </span>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <ImageIcon
                      size={24}
                      className="text-[#556B2F] mx-auto mb-2"
                    />
                    <span className="text-[10px] font-bold text-[#556B2F] uppercase block truncate max-w-[200px]">
                      {tempFile.name}
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setTempFile(e.target.files[0])}
                />
              </label>
            </div>

            {/* Partea dreaptă: Detalii */}
            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Descriere Radiografie *
                </label>
                <input
                  placeholder="ex: Panoramica, Status Dentar, CT..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`w-full p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm transition-all ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-slate-50 border-slate-100"
                  }`}
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Observații (Opțional)
                </label>
                <textarea
                  placeholder="Detalii suplimentare, patologii observate..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  rows={3}
                  className={`w-full p-4 rounded-2xl border outline-none focus:border-[#556B2F] text-sm resize-none transition-all ${
                    darkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-slate-50 border-slate-100"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSaveRadiography}
              disabled={uploading}
              className="flex-1 bg-[#556B2F] text-white py-5 rounded-2xl font-bold uppercase text-[11px] tracking-[0.2em] shadow-lg active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
            >
              {uploading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Check size={18} />
              )}
              {uploading ? "Se salvează..." : "Adaugă în Dosar"}
            </button>
          </div>
        </div>
      )}

      {/* 2. LISTA DE CARDURI DETALIATE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map((img) => (
          <div
            key={img.id}
            className={`group rounded-[2.5rem] overflow-hidden border transition-all hover:shadow-xl ${
              darkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-100 shadow-sm"
            }`}
          >
            {/* ANTET CARD */}
            <div
              className={`px-6 py-4 border-b flex justify-between items-center ${
                darkMode
                  ? "bg-slate-800/50 border-slate-800"
                  : "bg-slate-50/50 border-slate-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-[#556B2F]" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                  {new Date(img.created_at).toLocaleDateString("ro-RO", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <button
                onClick={() => handleDelete(img.id, img.storage_path)}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* ZONA IMAGINE */}
            <div className="bg-black aspect-[16/10] relative flex items-center justify-center overflow-hidden">
              <img
                src={img.image_url}
                className="w-full h-full object-contain cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
                alt={img.description}
                onClick={() => window.open(img.image_url, "_blank")}
              />
              <div className="absolute bottom-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 backdrop-blur-md p-2 rounded-xl border border-white/10">
                  <Maximize2 size={14} className="text-white" />
                </div>
              </div>
            </div>

            {/* DETALII CARD */}
            <div className="p-7 space-y-4 text-left">
              <div>
                <p className="text-[15px] font-medium leading-tight">
                  {img.description || "Fără descriere"}
                </p>
              </div>

              {img.observations && (
                <div
                  className={`p-4 rounded-2xl border ${darkMode ? "bg-slate-800/40 border-slate-800" : "bg-slate-50/50 border-slate-50"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Info size={12} className="text-slate-400" />
                    <h5 className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">
                      Observații Medicale
                    </h5>
                  </div>
                  <p className="text-[12px] italic text-slate-500 leading-relaxed">
                    {img.observations}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && images.length === 0 && !isAdding && (
        <div className="py-20 text-center">
          <ImageIcon
            className="mx-auto text-slate-200 dark:text-slate-800 mb-4"
            size={64}
          />
          <p className="text-slate-400 text-[11px] uppercase tracking-[0.2em]">
            Dosar radiologic gol
          </p>
        </div>
      )}
    </div>
  );
}

// Iconiță Check pentru buton (adăugată pentru completitudine)
const Check = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
