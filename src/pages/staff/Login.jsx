import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { Loader, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await login(email, password);
    if (error)
      setError(
        error.message === "Invalid login credentials"
          ? "Email atau password salah"
          : error.message,
      );
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="text-slate-400 hover:text-cyan-400 text-xs flex items-center gap-1 mb-4 transition"
        >
          <ArrowLeft size={14} /> Kembali ke Home
        </Link>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg shadow-blue-500/30">
              🧺
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Staff Panel</h1>
            <p className="text-slate-400 text-sm">Masuk untuk kelola laundry</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@laundryku.com"
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500/50 text-white placeholder-slate-500 transition text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-cyan-500/50 text-white placeholder-slate-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 p-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/30"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-[10px] text-slate-500 text-center mb-2 uppercase tracking-wider">
              Demo Akun
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px] bg-white/5 rounded-lg px-3 py-2">
                <span className="text-slate-400">👑 Owner</span>
                <span className="text-cyan-400 font-mono">
                  owner@laundryku.com
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] bg-white/5 rounded-lg px-3 py-2">
                <span className="text-slate-400">👤 Staff</span>
                <span className="text-cyan-400 font-mono">
                  staff@laundryku.com
                </span>
              </div>
              <p className="text-[10px] text-slate-600 text-center mt-2">
                Password: <span className="text-cyan-400">password123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
