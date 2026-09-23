import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'kiloan', label: 'Kiloan' },
  { id: 'express', label: 'Express' },
  { id: 'satuan', label: 'Satuan' },
];

export default function ServicesSection() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('price')
      .then(({ data }) => {
        setServices(data || []);
        setLoading(false);
      });
  }, []);

  const filtered = category === 'all'
    ? services
    : services.filter(s => s.category === category);

  return (
    <section id="layanan-kami" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-cyan-400 px-4 py-2 rounded-full text-sm mb-6">
            <Sparkles size={16} />
            Layanan Kami
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
            Semua yang Cucian Anda{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Butuhkan
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Dari kiloan harian sampai item khusus — sepatu, tas, karpet, bed cover, dan lainnya
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 mb-10 max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`py-2.5 px-3 rounded-2xl text-sm font-medium transition-all ${
                  category === c.id
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-20">
            <Loader className="animate-spin text-cyan-400 mx-auto mb-4" size={32} />
            <p className="text-slate-400">Memuat layanan...</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-400 py-20">
            Belum ada layanan di kategori ini
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(s => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            to="/booking"
            className="group inline-flex items-center gap-2 bg-white hover:bg-blue-50 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105"
          >
            Pesan Sekarang
            <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </Link>
          <p className="text-slate-500 text-sm mt-4">
            Pickup dalam 30 menit • Bayar setelah cucian selesai
          </p>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service: s }) {
  return (
    <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 rounded-2xl p-5 transition-all hover:-translate-y-1 cursor-pointer overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all" />

      <div className="relative">
        {/* Category badge */}
        {s.category && (
          <span className="absolute top-0 right-0 text-[10px] uppercase tracking-wider bg-white/5 border border-white/10 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/30 px-2 py-0.5 rounded-full transition">
            {s.category}
          </span>
        )}

        <div className="text-4xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          {s.icon || '🧺'}
        </div>

        <h3 className="font-bold text-white mb-1 text-sm leading-tight">
          {s.name}
        </h3>

        {s.description && (
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            {s.description}
          </p>
        )}

        <div className="flex items-baseline gap-1 pt-3 border-t border-white/5">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Rp {s.price.toLocaleString('id-ID')}
          </span>
          <span className="text-xs text-slate-500">/{s.unit}</span>
        </div>

        {/* Duration */}
        {s.duration && (
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <span className="w-1 h-1 bg-cyan-400 rounded-full"></span>
            ~{s.duration} jam
          </p>
        )}
      </div>
    </div>
  );
}