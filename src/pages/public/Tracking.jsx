import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import {
  Search,
  Package,
  CheckCircle2,
  Loader,
  Truck,
  Copy,
  Home,
} from "lucide-react";
import PublicNavbar from "../../components/public/PublicNavbar";
import toast from "react-hot-toast";

const STEPS = [
  { key: "antri", label: "Diterima", icon: Package },
  { key: "proses", label: "Diproses", icon: Loader },
  { key: "siap", label: "Siap", icon: CheckCircle2 },
  { key: "dikirim", label: "Dikirim", icon: Truck },
  { key: "selesai", label: "Selesai", icon: Home },
];

export default function Tracking() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(code || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (code) search(code);
  }, [code]);

  const search = async (q) => {
    setLoading(true);
    setError("");
    setOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("*, services(name, price, unit), customers(name, phone)")
      .eq("code", q.toUpperCase())
      .single();

    if (error || !data)
      setError("Order tidak ditemukan. Cek kembali kode Anda.");
    else setOrder(data);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    navigate(`/track/${input.toUpperCase()}`);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(order.code);
    toast.success("Kode dicopy!");
  };

  const currentStep = order
    ? STEPS.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Animated gradient blobs — sama kayak HeroSection */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative">
        <PublicNavbar />

        <div className="pt-28 pb-16 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8 text-white">
              <div className="text-5xl mb-2">🧺</div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Lacak Cucian Anda
              </h1>
              <p className="text-slate-400 mt-2">
                Masukkan kode order untuk melihat status
              </p>
            </div>

            {/* Search form */}
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl flex gap-2 mb-6"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder="Contoh: LDY-0001"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-blue-500/50 focus:bg-white/10 transition uppercase font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 transition"
              >
                <Search size={18} />
                <span className="hidden sm:inline">
                  {loading ? "Cari..." : "Lacak"}
                </span>
              </button>
            </form>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-red-300 p-4 rounded-2xl text-center">
                {error}
              </div>
            )}

            {/* Order card */}
            {order && (
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
                  <div>
                    <p className="text-xs text-slate-400">Kode Order</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-white font-mono">
                        {order.code}
                      </p>
                      <button
                        onClick={copyCode}
                        className="p-1 text-slate-400 hover:text-cyan-400 transition"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      {order.customer_name || order.customers?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Total</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Rp {order.total.toLocaleString("id-ID")}
                    </p>
                    <p className="text-xs mt-1 text-slate-400">
                      {order.services?.name}
                    </p>
                  </div>
                </div>

                {/* Progress steps */}
                <div className="mb-8">
                  <p className="text-sm text-slate-400 mb-4">Progress</p>
                  <div className="relative">
                    <div className="absolute top-5 left-5 right-5 h-1 bg-white/5 rounded-full">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(0, (currentStep / (STEPS.length - 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="relative flex justify-between">
                      {STEPS.map((step, i) => {
                        const Icon = step.icon;
                        const done = i <= currentStep;
                        return (
                          <div
                            key={step.key}
                            className="flex flex-col items-center gap-2"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition ${
                                done
                                  ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                                  : "bg-white/5 backdrop-blur-xl border-2 border-white/10 text-slate-500"
                              }`}
                            >
                              <Icon size={18} />
                            </div>
                            <span
                              className={`text-xs font-medium text-center ${
                                done ? "text-white" : "text-slate-500"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-sm">
                  <Info
                    label="Berat"
                    value={`${order.weight} ${order.services?.unit}`}
                  />
                  <Info
                    label="Status Bayar"
                    value={
                      order.payment_status === "paid"
                        ? "✅ Lunas"
                        : "⏳ Belum Bayar"
                    }
                  />
                  <Info
                    label="Tgl Order"
                    value={new Date(order.created_at).toLocaleDateString(
                      "id-ID",
                    )}
                  />
                  <Info
                    label="Estimasi"
                    value={
                      order.estimate_at
                        ? new Date(order.estimate_at).toLocaleDateString(
                            "id-ID",
                          )
                        : "-"
                    }
                  />
                </div>

                {order.status === "dikirim" && (
                  <div className="col-span-2 bg-purple-50 border border-purple-200 rounded-xl p-3 mt-1">
                    <p className="text-xs text-purple-700 flex items-center gap-2">
                      <Truck size={14} />
                      <span>
                        <strong>Kurir menuju lokasi Anda</strong> — mohon
                        standby 🛵
                      </span>
                    </p>
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div className="mt-4 p-3 bg-white/5 rounded-xl text-sm border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Catatan</p>
                    <p className="text-slate-200">{order.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="font-semibold text-white mt-0.5">{value}</p>
    </div>
  );
}
