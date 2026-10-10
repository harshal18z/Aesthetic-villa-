import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, ArrowLeft, KeyRound, Mail, Lock } from "lucide-react";
import { toast } from "sonner";

export const AdminLogin: React.FC = () => {
  const [mode, setMode] = useState<"supabase" | "pin">("supabase");

  // Supabase login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [supabaseLoading, setSupabaseLoading] = useState(false);

  // PIN fields
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState(false);

  const { login, loginWithPin } = useAdminAuth();
  const navigate = useNavigate();

  // Supabase email/password login
  const handleSupabaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in both email and password");
      return;
    }
    setSupabaseLoading(true);
    const result = await login(email.trim(), password.trim());
    setSupabaseLoading(false);

    if (result.success) {
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } else {
      toast.error(result.error || "Login failed. Check your credentials.");
    }
  };

  // PIN fallback login
  const handlePinLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      toast.error("Please enter a PIN");
      return;
    }
    const success = loginWithPin(pin);
    if (success) {
      toast.success("Welcome back, Admin!");
      navigate("/admin");
    } else {
      setPinError(true);
      toast.error("Incorrect PIN. Default PIN is 1822.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8955A]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs text-slate-400 hover:text-white transition bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-800"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Clinic Site
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#B8955A]/15 border border-[#B8955A]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#D9B878]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 font-serif">Admin Portal</h1>
          <p className="text-slate-400 text-sm">The Aesthetic Villa — Media & Gallery Management</p>
        </div>

        {/* Mode switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setMode("supabase")}
            className={`py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition ${
              mode === "supabase" ? "bg-[#B8955A] text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email & Password
          </button>
          <button
            type="button"
            onClick={() => setMode("pin")}
            className={`py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition ${
              mode === "pin" ? "bg-[#B8955A] text-white shadow-md" : "text-slate-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            Quick PIN
          </button>
        </div>

        {/* Supabase Auth Form */}
        {mode === "supabase" && (
          <form onSubmit={handleSupabaseLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Supabase Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B8955A] transition"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Supabase password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B8955A] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={supabaseLoading}
              className="w-full bg-[#B8955A] hover:bg-[#a3824c] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[#B8955A]/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {supabaseLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Sign In with Supabase
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-500">
              Use the email and password registered in your Supabase project.
            </p>
          </form>
        )}

        {/* PIN Form */}
        {mode === "pin" && (
          <form onSubmit={handlePinLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin PIN
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setPinError(false); }}
                  placeholder="Enter PIN (default: 1822)"
                  className={`w-full bg-slate-950 border ${
                    pinError ? "border-red-500" : "border-slate-800"
                  } rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B8955A] font-mono transition`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pinError && (
                <p className="text-red-400 text-xs mt-1.5">
                  Incorrect PIN. Default PIN is <code className="bg-red-950/50 px-1 rounded">1822</code>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#B8955A] hover:bg-[#a3824c] text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-[#B8955A]/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              Unlock Dashboard
            </button>

            <p className="text-center text-[11px] text-slate-500">
              Default PIN: <code className="text-[#D9B878] font-mono">1822</code> · Also accepts <code className="text-[#D9B878] font-mono">Harshal@1822</code>
            </p>
          </form>
        )}
      </motion.div>
    </div>
  );
};
