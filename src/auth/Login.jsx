import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100 text-text-main">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-olive rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-lg shadow-brand-olive/20">
            S
          </div>
          <h1 className="text-2xl font-black">StomaPortal</h1>
          <p className="text-slate-500 font-medium italic">
            Acces securizat în clinică
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 ml-1">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-3.5 text-text-muted"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-olive transition-all"
                placeholder="doctor@clinica.ro"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-1 ml-1">
              Parolă
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-3.5 text-text-muted"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-brand-olive transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-brand-olive text-white py-4 rounded-xl font-black shadow-lg shadow-brand-olive/30 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "AUTENTIFICARE"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
