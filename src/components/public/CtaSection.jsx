import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, Check, Sparkles, Package, Truck, Droplets, Sparkle } from 'lucide-react';

const FLOW_STEPS = [
  { id: 1, icon: Package, title: 'Pesan', desc: 'Klik pesan, isi data', color: 'from-yellow-500 to-orange-500', glow: 'rgba(234,179,8,0.4)' },
  { id: 2, icon: Truck, title: 'Pickup', desc: 'Kurir datang 30 menit', color: 'from-blue-500 to-cyan-500', glow: 'rgba(59,130,246,0.4)' },
  { id: 3, icon: Droplets, title: 'Dicuci', desc: 'Proses higienis 3 jam', color: 'from-cyan-500 to-teal-500', glow: 'rgba(6,182,212,0.4)' },
  { id: 4, icon: Sparkle, title: 'Selesai', desc: 'Antar ke depan pintu', color: 'from-green-500 to-emerald-500', glow: 'rgba(34,197,94,0.4)' },
];

export default function CtaSection() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(s => (s + 1) % FLOW_STEPS.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[120px]" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Grid 2 kolom */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-cyan-400 px-4 py-2 rounded-full text-sm mb-6">
              <Sparkles size={16} />
              Siap Mulai?
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Cucian Numpuk?
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Chill, Ada Kami.
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-400 mb-8 leading-relaxed max-w-lg">
              Pesan sekarang, pickup dalam 30 menit, selesai dalam 3 jam.
              Tanpa antri, tanpa ribet, tinggal rebahan.
            </p>

            <div className="space-y-3 mb-10">
              {[
                'Pickup GRATIS dalam 30 menit',
                'Express 3 jam untuk yang urgent',
                'Garansi bersih — tidak puas cuci ulang',
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-slate-300">{b}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="group relative bg-white hover:bg-blue-50 text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] flex items-center gap-2 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative">Pesan Sekarang</span>
                <ArrowRight size={20} className="relative group-hover:translate-x-1 transition" />
              </Link>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-green-500/40 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 group"
              >
                <MessageCircle size={20} className="text-green-400 group-hover:scale-110 transition" />
                Chat WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-10 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                2.000+ order hari ini
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                50+ kurir aktif
              </div>
            </div>
          </div>

          {/* Right: Order Flow Visual */}
          <div className="relative">
            {/* Glow besar di belakang */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl" />

            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-white font-bold text-lg">Alur Pesanan</p>
                  <p className="text-slate-500 text-xs">Dari pesan sampai selesai</p>
                </div>
                <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  Live
                </span>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {FLOW_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const isActive = i === activeStep;
                  const isPast = i < activeStep;
                  const isDone = i < activeStep;
                  
                  return (
                    <div
                      key={step.id}
                      className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-500 ${
                        isActive
                          ? 'bg-white/10 border border-white/20 scale-[1.02]'
                          : 'bg-white/5 border border-white/5'
                      }`}
                    >
                      {/* Connector line */}
                      {i < FLOW_STEPS.length - 1 && (
                        <div className={`absolute left-9 top-full w-0.5 h-4 transition-all duration-500 ${
                          isDone ? 'bg-gradient-to-b from-cyan-400 to-blue-500' : 'bg-white/10'
                        }`} />
                      )}

                      {/* Icon */}
                      <div className={`relative w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                        isActive || isDone
                          ? `bg-gradient-to-br ${step.color} shadow-lg`
                          : 'bg-white/5 border border-white/10'
                      }`}
                        style={isActive ? { boxShadow: `0 0 30px ${step.glow}` } : {}}
                      >
                        <Icon size={18} className={isActive || isDone ? 'text-white' : 'text-slate-500'} />
                        {isDone && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-slate-950">
                            <Check size={9} className="text-white" strokeWidth={4} />
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute inset-0 rounded-2xl animate-ping opacity-30"
                            style={{ background: `linear-gradient(135deg, ${step.glow}, transparent)` }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`font-bold text-sm transition ${
                            isActive || isDone ? 'text-white' : 'text-slate-400'
                          }`}>
                            {step.title}
                          </p>
                          <span className={`text-[10px] font-mono transition ${
                            isActive ? 'text-cyan-400' : isDone ? 'text-green-400' : 'text-slate-600'
                          }`}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 truncate transition ${
                          isActive || isDone ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom stats */}
              <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">30</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Menit pickup</p>
                </div>
                <div className="text-center border-x border-white/10">
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">3</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Jam express</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">100%</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Garansi</p>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-5 -right-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 shadow-xl rotate-6 animate-bounce">
              <p className="text-white text-xs font-semibold">⚡ 30 Menit</p>
              <p className="text-slate-400 text-[10px]">Pickup cepat</p>
            </div>
            <div className="absolute -bottom-5 -left-5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-4 py-2 shadow-xl -rotate-6 animate-bounce" style={{ animationDelay: '1s' }}>
              <p className="text-white text-xs font-semibold">💯 Garansi</p>
              <p className="text-slate-400 text-[10px]">Bersih atau ulang</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}