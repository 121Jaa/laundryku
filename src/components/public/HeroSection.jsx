import { Link } from 'react-router-dom';
import {
  Truck, Clock, ShieldCheck, ArrowRight,
  Sparkles, ChevronRight, RefreshCw,
} from 'lucide-react';
import { useState, useEffect } from 'react';

/* ============================================================
   1. CONSTANTS (dulu di ../constants/stages.js)
   ============================================================ */

const STAGES = {
  baru: {
    label: 'Baru',
    icon: '📥',
    status: 'Antri',
    progress: 25,
    statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    glowColor: 'bg-yellow-500',
    barColor: 'bg-gradient-to-r from-yellow-500 to-orange-400',
    title: 'Order Diterima',
    desc: 'Kurir dalam perjalanan pickup',
  },
  proses: {
    label: 'Proses',
    icon: '🌀',
    status: 'Diproses',
    progress: 60,
    statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    glowColor: 'bg-blue-500',
    barColor: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    title: 'Sedang Dicuci',
    desc: 'Selesai dalam ~2 jam',
  },
  siap: {
    label: 'Siap',
    icon: '✨',
    status: 'Siap Diambil',
    progress: 100,
    statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    glowColor: 'bg-green-500',
    barColor: 'bg-gradient-to-r from-green-500 to-emerald-400',
    title: 'Siap Dikirim!',
    desc: 'Kurir menuju lokasi Anda',
  },
};

const STAGE_ORDER = ['baru', 'proses', 'siap'];

const formatRupiah = (num) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);

/* ============================================================
   2. HOOK (dulu di ../hooks/useActiveOrder.js)
   ============================================================ */

function useActiveOrder() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/orders/active', {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
      .then(async (res) => {
        // 404 = nggak ada order aktif, bukan error
        if (res.status === 404) return null;
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setOrder(data ?? null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setOrder(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  return {
    order,
    loading,
    error,
    refetch: () => setTrigger((t) => t + 1),
  };
}

/* ============================================================
   3. DUMMY & CONFIG
   ============================================================ */

const FLOATING_EMOJIS = ['👕', '👟', '🧺', '✨', '🧦', '👗', '👜', '🧸'];

const SHOWCASE_ORDER = {
  orderId: 'LDY-0042',
  service: 'Express 3 Jam',
  status: 'proses',
  items: [
    { icon: '👔', name: 'Cuci Setrika', qty: '3 kg' },
    { icon: '👟', name: 'Laundry Sepatu', qty: '1 pcs' },
  ],
  total: 56000,
};

/* ============================================================
   4. MAIN COMPONENT
   ============================================================ */

export default function HeroSection() {
  const { order: realOrder, loading, error, refetch } = useActiveOrder();

  const isShowcase = !loading && !realOrder;
  const order = realOrder ?? SHOWCASE_ORDER;
  const activeIndex = Math.max(0, STAGE_ORDER.indexOf(order?.status ?? 'baru'));

  const [selectedStage, setSelectedStage] = useState(activeIndex);
  const [autoPlay, setAutoPlay] = useState(true);

  // Sync kalau order berubah
  useEffect(() => {
    setSelectedStage(activeIndex);
  }, [activeIndex]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => {
      setSelectedStage((s) => (s + 1) % STAGE_ORDER.length);
    }, 4000);
    return () => clearInterval(t);
  }, [autoPlay]);

  const handleStageClick = (i) => {
    setSelectedStage(i);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 8000);
  };

  const stageKey = STAGE_ORDER[selectedStage];
  const stage = STAGES[stageKey];

  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center">
      {/* Animated gradient blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <FloatingEmojis />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
        {/* ============ LEFT: COPY ============ */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-white/90 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-6 sm:mb-8 hover:bg-white/10 transition cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            Pickup dalam 30 menit
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-4 sm:mb-6 tracking-tight">
            Laundry Express
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              3 Jam Selesai
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Antar jemput <strong className="text-white">GRATIS</strong>. Harga mulai dari{' '}
            <strong className="text-white">Rp 5.000/kg</strong>. Cucian bersih, wangi, tepat waktu.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-10 sm:mb-12 justify-center lg:justify-start">
            <Link
              to="/booking"
              className="group relative bg-white text-slate-900 px-6 sm:px-7 py-3.5 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2"
            >
              <Sparkles size={18} />
              Pesan Sekarang
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </Link>
            <Link
              to="/track"
              className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-6 sm:px-7 py-3.5 rounded-xl font-semibold transition-all text-center"
            >
              Lacak Order
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-slate-400 text-xs sm:text-sm justify-center lg:justify-start">
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-blue-400" /> Gratis Pickup
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-cyan-400" /> Express 3 Jam
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-purple-400" /> Garansi Bersih
            </div>
          </div>
        </div>

        {/* ============ RIGHT: DEMO CARD ============ */}
        <div className="flex justify-center relative mt-4 lg:mt-0">
          <div className="relative w-full max-w-[380px] sm:max-w-[420px]">
            {loading ? (
              <SkeletonCard />
            ) : error ? (
              <ErrorCard message={error} onRetry={refetch} />
            ) : isShowcase ? (
              <ShowcaseCard
                stage={stage}
                selectedStage={selectedStage}
                onStageClick={handleStageClick}
                order={order}
              />
            ) : (
              <RealOrderCard
                stage={stage}
                activeIndex={activeIndex}
                selectedStage={selectedStage}
                onStageClick={handleStageClick}
                order={order}
              />
            )}

            {/* Floating badges — desktop only */}
            <div className="hidden md:block absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-xl rotate-6 animate-bounce">
              ⚡ 3 Jam
            </div>
            <div
              className="hidden md:block absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-xl -rotate-6 animate-bounce"
              style={{ animationDelay: '1s' }}
            >
              💰 Rp 5.000/kg
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   5. SUB-COMPONENTS
   ============================================================ */

function OrderCard({ stage, selectedStage, onStageClick, order, badge, footer }) {
  return (
    <>
      <div
        className={`absolute inset-0 rounded-3xl blur-3xl opacity-40 transition-all duration-700 ${stage.glowColor}`}
      />

      <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl">
              🧺
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-white font-semibold text-xs sm:text-sm">
                  #{order.orderId}
                </p>
                {badge}
              </div>
              <p className="text-slate-400 text-[10px] sm:text-xs">
                {order.service ?? 'Express 3 Jam'}
              </p>
            </div>
          </div>
          <span
            className={`text-[10px] sm:text-xs px-2 sm:px-2.5 py-1 rounded-full border transition-all ${stage.statusColor}`}
          >
            {stage.status}
          </span>
        </div>

        {/* Progress */}
        <div className="mb-4 sm:mb-5">
          <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mb-2">
            <span>Progress</span>
            <span className="font-semibold text-white">{stage.progress}%</span>
          </div>
          <div className="h-1.5 sm:h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${stage.barColor}`}
              style={{ width: `${stage.progress}%` }}
            />
          </div>
        </div>

        {/* Title / Desc */}
        <div className="mb-4 sm:mb-5">
          <p className="text-white font-semibold text-sm sm:text-base mb-0.5 flex items-center gap-2">
            <span className="text-base sm:text-lg">{stage.icon}</span>
            {stage.title}
          </p>
          <p className="text-slate-400 text-[11px] sm:text-xs">{stage.desc}</p>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4 sm:mb-5">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/5 rounded-xl p-2.5 sm:p-3 hover:bg-white/10 transition cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">{item.icon}</span>
                <span className="text-white text-xs sm:text-sm">{item.name}</span>
              </div>
              <span className="text-slate-400 text-[10px] sm:text-xs">{item.qty}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 mb-4 sm:mb-5">
          <span className="text-slate-400 text-xs sm:text-sm">Total</span>
          <span className="text-white font-bold text-base sm:text-lg">
            {typeof order.total === 'number' ? formatRupiah(order.total) : order.total}
          </span>
        </div>

        {/* Stage buttons */}
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
          {STAGE_ORDER.map((key, i) => (
            <button
              key={key}
              onClick={() => onStageClick(i)}
              className={`text-[10px] sm:text-xs py-2 sm:py-2.5 rounded-xl font-medium transition-all ${
                selectedStage === i
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {STAGES[key].label}
            </button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-center text-[10px] sm:text-xs text-slate-500 mt-3 sm:mt-4 flex items-center justify-center gap-1">
          <ChevronRight size={12} className="animate-pulse" />
          Klik untuk lihat status lainnya
        </p>

        {footer}
      </div>
    </>
  );
}

function ShowcaseCard({ order, ...props }) {
  return (
    <OrderCard
      {...props}
      order={order}
      badge={
        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
          DEMO
        </span>
      }
      footer={
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-400 mb-3">
            Ini contoh tampilan. Pesan sekarang untuk tracking real-time!
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-4 py-2 rounded-lg transition"
          >
            <Sparkles size={14} /> Buat Order Pertama
            <ArrowRight size={14} />
          </Link>
        </div>
      }
    />
  );
}

function RealOrderCard({ order, activeIndex, ...props }) {
  return (
    <OrderCard
      {...props}
      order={order}
      badge={
        <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-300 border border-green-500/30 font-semibold">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          LIVE
        </span>
      }
      footer={
        activeIndex < STAGE_ORDER.length - 1 ? (
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <Link
              to={`/track/${order.orderId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white transition"
            >
              Lacak detail order <ArrowRight size={12} />
            </Link>
          </div>
        ) : (
          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] text-green-400 font-semibold">
              ✨ Order siap! Kurir segera tiba.
            </p>
          </div>
        )
      }
    />
  );
}

function SkeletonCard() {
  return (
    <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl animate-pulse">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-xl" />
          <div className="space-y-2">
            <div className="h-3 w-24 bg-white/10 rounded" />
            <div className="h-2 w-16 bg-white/5 rounded" />
          </div>
        </div>
        <div className="h-6 w-20 bg-white/10 rounded-full" />
      </div>

      <div className="mb-5">
        <div className="flex justify-between mb-2">
          <div className="h-2 w-12 bg-white/5 rounded" />
          <div className="h-2 w-8 bg-white/10 rounded" />
        </div>
        <div className="h-2 bg-white/5 rounded-full" />
      </div>

      <div className="space-y-2 mb-5">
        <div className="h-3 w-32 bg-white/10 rounded" />
        <div className="h-2 w-40 bg-white/5 rounded" />
      </div>

      <div className="space-y-2 mb-5">
        <div className="h-10 bg-white/5 rounded-xl" />
        <div className="h-10 bg-white/5 rounded-xl" />
      </div>

      <div className="flex justify-between pt-4 border-t border-white/10 mb-5">
        <div className="h-3 w-12 bg-white/5 rounded" />
        <div className="h-4 w-24 bg-white/10 rounded" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="h-9 bg-white/5 rounded-xl" />
        <div className="h-9 bg-white/5 rounded-xl" />
        <div className="h-9 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

function ErrorCard({ message, onRetry }) {
  return (
    <div className="relative bg-white/5 backdrop-blur-2xl border border-red-500/20 rounded-3xl p-6 text-center shadow-2xl">
      <div className="text-4xl mb-3">😵</div>
      <h3 className="text-white font-bold mb-1">Gagal Memuat Order</h3>
      <p className="text-slate-400 text-sm mb-5">
        {message || 'Terjadi kesalahan. Coba lagi ya.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
      >
        <RefreshCw size={14} /> Coba Lagi
      </button>
    </div>
  );
}

function FloatingEmojis() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {FLOATING_EMOJIS.map((emoji, i) => {
        const left = `${(i * 13 + 7) % 100}%`;
        const top = `${(i * 17 + 10) % 100}%`;
        const delay = `${(i * 0.7) % 5}s`;
        const duration = `${4 + (i % 3)}s`;
        const size = `${24 + (i % 3) * 12}px`;
        return (
          <div
            key={i}
            className="absolute opacity-10 select-none"
            style={{
              left,
              top,
              fontSize: size,
              animation: `float ${duration} ease-in-out ${delay} infinite`,
            }}
          >
            {emoji}
          </div>
        );
      })}
    </div>
  );
}