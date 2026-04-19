import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error) {
      setErrorMsg(
        error.message === "Invalid login credentials"
          ? "Date de acces incorecte."
          : error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] flex items-center justify-center p-6 transition-colors duration-500">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl p-10 border border-slate-100 text-slate-900 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-[#556B2F] rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-6 shadow-xl shadow-[#556B2F]/20 transition-transform hover:scale-105">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2 uppercase">
            StomaPortal
          </h1>
          <p className="text-slate-400 font-medium text-sm tracking-wide">
            ACCES SECURIZAT CLINCĂ
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
            <AlertCircle size={16} />
            {errorMsg.toUpperCase()}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1">
              Email
            </label>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#556B2F] transition-colors"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#556B2F] focus:bg-white transition-all text-sm font-medium"
                placeholder="doctor@clinica.ro"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[13px] font-bold uppercase tracking-[0.15em] text-slate-400 ml-1">
              Parolă
            </label>
            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#556B2F] transition-colors"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#556B2F] focus:bg-white transition-all text-sm font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#556B2F] hover:bg-[#6B8441] text-white py-4 rounded-2xl font-bold text-[13px] uppercase tracking-[0.15em] shadow-lg shadow-[#556B2F]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Autentificare"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
            Sistem Management Dental Premium
            <br />
            v2.0.26
          </p>
        </div>
      </div>
    </div>
  );
}
