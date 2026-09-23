import { useState, useEffect, useRef } from 'react';
import { Target, Users, Workflow, Trophy, CheckCircle2, Zap, Sparkles, Heart, Leaf } from 'lucide-react';

const TABS = [
  { id: 'visi', label: 'Visi', icon: Target },
  { id: 'proses', label: 'Proses', icon: Workflow },
  { id: 'tim', label: 'Tim', icon: Users },
  { id: 'pencapaian', label: 'Pencapaian', icon: Trophy },
];

const STATS = [
  { value: 10000, suffix: '+', label: 'Pelanggan Puas', icon: Heart },
  { value: 50, suffix: '+', label: 'Tim Profesional', icon: Users },
  { value: 3, suffix: ' Outlet', label: 'Jakarta & Bandung', icon: Sparkles },
  { value: 99, suffix: '%', label: 'Rating Kepuasan', icon: Trophy },
];

const VISI_POINTS = [
  { title: 'Bersih & Higienis', desc: 'Standar kebersihan rumah sakit untuk setiap cucian' },
  { title: 'Cepat & Tepat', desc: 'Express 3 jam, pickup 30 menit, tanpa kompromi' },
  { title: 'Ramah Lingkungan', desc: 'Detergen biodegradable, hemat air & energi' },
  { title: 'Harga Jujur', desc: 'Transparan dari awal, tanpa biaya tersembunyi' },
];

const PROSES_STEPS = [
  { num: '01', title: 'Pickup', desc: 'Kurir jemput cucian dalam 30 menit', icon: '🚚' },
  { num: '02', title: 'Sortir', desc: 'Dipisah per warna & jenis kain', icon: '🧦' },
  { num: '03', title: 'Cuci', desc: 'Detergen premium + air bersih', icon: '💧' },
  { num: '04', title: 'Setrika', desc: 'Rapi, wangi, siap pakai', icon: '🔥' },
  { num: '05', title: 'Quality Check', desc: 'Dicek ulang sebelum dikirim', icon: '✅' },
  { num: '06', title: 'Antar', desc: 'Dikirim ke depan pintu Anda', icon: '📦' },
];

const TIM = [
  { name: 'Tim Operasional', count: '20+', desc: 'Menangani cuci, setrika, sortir', emoji: '👥' },
  { name: 'Tim Kurir', count: '15+', desc: 'Pickup & delivery cepat', emoji: '🏍️' },
  { name: 'Tim Quality', count: '10+', desc: 'Cek kualitas sebelum kirim', emoji: '🔍' },
  { name: 'Tim CS', count: '5+', desc: 'Support 24/7 via WhatsApp', emoji: '💬' },
];

export default function TentangKamiSection() {
  const [activeTab, setActiveTab] = useState('visi');

  return (
    <section id="tentang-kami" className="py-16 sm:py-20 lg:py-24 bg-slate-950 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-cyan-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-4 sm:mb-6">
            <Sparkles size={14} />
            Tentang Kami
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4 tracking-tight">
            Lebih dari Sekadar{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Laundry
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Kami percaya mencuci bukan cuma soal bersih — tapi soal waktu, kepercayaan, dan kualitas hidup.
          </p>
        </div>

        {/* Interactive Tabs — grid-cols-4 tetap, tapi font responsif */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 mb-6 sm:mb-8 max-w-3xl mx-auto">
          <div className="grid grid-cols-4 gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl sm:rounded-2xl text-[11px] sm:text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} className="sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                  <span className="inline xs:hidden sm:hidden">{tab.label.slice(0, 4)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px] sm:min-h-[420px]">
          {activeTab === 'visi' && <VisiTab />}
          {activeTab === 'proses' && <ProsesTab />}
          {activeTab === 'tim' && <TimTab />}
          {activeTab === 'pencapaian' && <PencapaianTab />}
        </div>
      </div>
    </section>
  );
}

/* ============ TAB 1: VISI ============ */
function VisiTab() {
  return (
    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center animate-[fadeIn_0.4s_ease]">
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          Misi kami sederhana: <span className="text-cyan-400">bikin hidup Anda lebih ringan</span>
        </h3>
        <p className="text-slate-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
          LaundryKu Express berdiri sejak 2020 dengan satu tujuan: membebaskan orang dari beban mencuci,
          biar waktu berharga bisa dipakai untuk hal yang lebih penting.
        </p>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
          {VISI_POINTS.map((p, i) => (
            <div
              key={i}
              className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3.5 sm:p-4 transition cursor-default group"
            >
              <CheckCircle2 className="text-cyan-400 mb-2 group-hover:scale-110 transition" size={18} />
              <p className="text-white font-semibold text-xs sm:text-sm mb-1">{p.title}</p>
              <p className="text-slate-500 text-[11px] sm:text-xs leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visual — badge floating dipindah ke DALAM card di mobile */}
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-10 min-h-[280px] sm:aspect-square flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_70%)]" />
          <div className="relative text-center">
            <div className="text-6xl sm:text-8xl mb-3 sm:mb-4">💙</div>
            <p className="text-white text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Sejak 2020</p>
            <p className="text-slate-400 text-xs sm:text-sm">Melayani dengan hati</p>

            {/* Badge di DALAM card untuk mobile */}
            <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-2xl px-3 py-2">
              <Leaf className="text-green-400" size={18} />
              <div className="text-left">
                <p className="text-white text-xs font-semibold">Ramah Lingkungan</p>
                <p className="text-slate-400 text-[10px]">Hemat air & energi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badge floating — HANYA di desktop */}
        <div className="hidden md:block absolute -bottom-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Leaf className="text-green-400" size={24} />
            <div>
              <p className="text-white text-sm font-semibold">Ramah Lingkungan</p>
              <p className="text-slate-400 text-xs">Hemat air & energi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ TAB 2: PROSES ============ */
function ProsesTab() {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="text-center mb-8 sm:mb-10">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">6 Langkah, Hasil Sempurna</h3>
        <p className="text-slate-400 text-sm sm:text-base">Dari pickup sampai antar, semuanya terstandar</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {PROSES_STEPS.map((step, i) => (
          <div
            key={i}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-2xl p-5 sm:p-6 transition-all hover:-translate-y-1 relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-4xl sm:text-5xl font-bold text-white/5 group-hover:text-cyan-500/10 transition">
              {step.num}
            </div>
            <div className="relative">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{step.icon}</div>
              <p className="text-cyan-400 text-[10px] sm:text-xs font-mono mb-1">{step.num}</p>
              <p className="text-white font-bold text-base sm:text-lg mb-1">{step.title}</p>
              <p className="text-slate-400 text-xs sm:text-sm">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-2xl p-4 sm:p-6 flex items-start sm:items-center gap-3 sm:gap-4 backdrop-blur-xl">
        <Zap className="text-cyan-400 flex-shrink-0 mt-0.5 sm:mt-0" size={24} />
        <div>
          <p className="text-white font-semibold text-sm sm:text-base">Express 3 Jam</p>
          <p className="text-slate-400 text-xs sm:text-sm">Semua langkah dipercepat tanpa mengurangi kualitas</p>
        </div>
      </div>
    </div>
  );
}

/* ============ TAB 3: TIM ============ */
function TimTab() {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="text-center mb-8 sm:mb-10">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Tim di Balik LaundryKu</h3>
        <p className="text-slate-400 text-sm sm:text-base">50+ orang yang siap melayani Anda setiap hari</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {TIM.map((t, i) => (
          <div
            key={i}
            className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 sm:p-6 text-center transition-all hover:-translate-y-1"
          >
            <div className="text-3xl sm:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition">{t.emoji}</div>
            <p className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">{t.count}</p>
            <p className="text-cyan-400 font-semibold text-[11px] sm:text-sm mb-1 sm:mb-2">{t.name}</p>
            <p className="text-slate-500 text-[10px] sm:text-xs leading-relaxed">{t.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">Setiap orang di tim kami dilatih dengan standar kualitas tinggi</p>
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-white hover:bg-blue-50 text-slate-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-semibold transition-all hover:scale-105"
        >
          Bergabung dengan Tim
        </a>
      </div>
    </div>
  );
}

/* ============ TAB 4: PENCAPAIAN ============ */
function PencapaianTab() {
  return (
    <div className="animate-[fadeIn_0.4s_ease]">
      <div className="text-center mb-8 sm:mb-12">
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Angka yang Bicara Sendiri</h3>
        <p className="text-slate-400 text-sm sm:text-base">Pencapaian kami selama melayani pelanggan</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {STATS.map((stat, i) => {
          const Icon = stat.icon;
          return <CounterCard key={i} stat={stat} Icon={Icon} />;
        })}
      </div>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-center">
        <Trophy className="text-yellow-400 mx-auto mb-3 sm:mb-4" size={32} />
        <p className="text-white text-base sm:text-xl font-semibold mb-2">
          Dipercaya sebagai #1 Laundry Express di Jakarta & Bandung
        </p>
        <p className="text-slate-400 text-xs sm:text-sm">
          Rating 4.9/5 dari 2.000+ ulasan pelanggan
        </p>
      </div>
    </div>
  );
}

/* ============ COUNTER ANIMATION ============ */
function CounterCard({ stat, Icon }) {
  const [count, setCount] = useState(0);
  const cardRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1500;
          const steps = 40;
          const increment = stat.value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= stat.value) {
              setCount(stat.value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [stat.value, hasAnimated]);

  const formatNum = (n) => {
    if (n >= 1000) return `${Math.floor(n / 1000)}.${n % 1000 === 0 ? '000' : n % 1000}`;
    return n.toLocaleString('id-ID');
  };

  return (
    <div
      ref={cardRef}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 text-center hover:border-cyan-500/30 transition group"
    >
      <Icon className="text-cyan-400 mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition" size={22} />
      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-0.5 sm:mb-1">
        {formatNum(count)}
        <span className="text-cyan-400">{stat.suffix}</span>
      </p>
      <p className="text-slate-400 text-[11px] sm:text-sm">{stat.label}</p>
    </div>
  );
}