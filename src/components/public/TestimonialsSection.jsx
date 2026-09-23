import { useEffect, useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Dummy fallback — dipakai kalau DB kosong / fetch error
const DUMMY_TESTIMONIALS = [
  { name: 'Sarah Wijaya', role: 'Ibu Rumah Tangga', city: 'Jakarta Selatan',
    text: 'Pickup cepet banget, 20 menit udah sampai. Cucian wangi dan rapi. Recommended!',
    rating: 5, emoji: '👩' },
  { name: 'Andi Pratama', role: 'Karyawan', city: 'Jakarta Pusat',
    text: 'Express 3 jam beneran 3 jam. Buat yang sibuk kayak gue, ini penyelamat.',
    rating: 5, emoji: '👨' },
  { name: 'Maya Sari', role: 'Mahasiswa', city: 'Bandung',
    text: 'Harga terjangkau, hasil bersih. Sudah langganan 6 bulan, gak pernah kecewa.',
    rating: 5, emoji: '👩‍🎓' },
  { name: 'Reza Mahendra', role: 'Pengusaha', city: 'Jakarta Barat',
    text: 'Langganan untuk laundry kantor. Tim-nya profesional, hasil konsisten. Recommended untuk bisnis.',
    rating: 5, emoji: '👨‍💼' },
  { name: 'Dina Amelia', role: 'Content Creator', city: 'Tangerang',
    text: 'Suka banget sama packaging-nya. Bersih, wangi, dan rapi. Worth it banget!',
    rating: 5, emoji: '👩‍🎨' },
];

const EMOJI_POOL = ['👩', '👨', '👩‍🎓', '👨‍💼', '👩‍🎨', '🧑', '👨‍🦱', '👩‍🦰', '🧕', '👨‍🦳'];

// Emoji deterministik dari nama — biar nama "Sarah" selalu dapat emoji yang sama
function pickEmoji(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return EMOJI_POOL[hash % EMOJI_POOL.length];
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState(DUMMY_TESTIMONIALS);
  const [isDemo, setIsDemo] = useState(false); // true kalau fallback ke dummy
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch dari Supabase sekali saat mount
  useEffect(() => {
    let cancelled = false;

    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('customer_name, customer_city, rating, text, approved_at')
          .eq('status', 'approved')
          .order('approved_at', { ascending: false })
          .limit(20);

        if (cancelled) return;

        if (error || !data || data.length === 0) {
          setTestimonials(DUMMY_TESTIMONIALS);
          setIsDemo(true);
        } else {
          setTestimonials(
            data.map((t) => ({
              name: t.customer_name,
              role: 'Pelanggan',
              city: t.customer_city || '-',
              rating: t.rating,
              text: t.text,
              emoji: pickEmoji(t.customer_name || ''),
            }))
          );
          setIsDemo(false);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        if (!cancelled) {
          setTestimonials(DUMMY_TESTIMONIALS);
          setIsDemo(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTestimonials();
    return () => { cancelled = true; };
  }, []);

  // Reset active kalau testimonials berubah (biar nggak out of bounds)
  useEffect(() => {
    setActive(0);
  }, [testimonials.length]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActive((s) => (s + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, testimonials.length]);

  const goTo = (i) => {
    setActive(i);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const next = () => goTo((active + 1) % testimonials.length);
  const prev = () => goTo((active - 1 + testimonials.length) % testimonials.length);

  // Guard: kalau loading atau testimonials kosong, jangan render apa-apa
  // (biar nggak error di akses .rating dst.)
  if (loading || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[active];

  return (
    <section id="testimoni" className="py-16 sm:py-20 lg:py-24 bg-slate-950 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-yellow-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-4 sm:mb-6">
            <Star size={14} className="fill-yellow-400" />
            Testimoni
            {isDemo && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold ml-1">
                CONTOH
              </span>
            )}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-3 sm:mb-4 tracking-tight">
            Apa Kata{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Pelanggan
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Ribuan pelanggan puas, ini sebagian cerita mereka
          </p>
        </div>

        {/* Featured testimonial */}
        <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 relative overflow-hidden transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />

            <Quote className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white/5 w-12 h-12 sm:w-20 sm:h-20" />

            <div className="relative">
              {/* Rating */}
              <div className="flex gap-1 mb-4 sm:mb-6">
                {Array(current.rating).fill(0).map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400 sm:w-[18px] sm:h-[18px]" />
                ))}
              </div>

              {/* Text */}
              <p key={active} className="text-white text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8 animate-[fadeIn_0.5s_ease]">
                "{current.text}"
              </p>

              {/* Author */}
              <div key={active + '-author'} className="flex items-center gap-3 sm:gap-4 animate-[fadeIn_0.5s_ease]">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-lg shadow-blue-500/30 flex-shrink-0">
                  {current.emoji}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-white text-sm sm:text-base truncate">{current.name}</p>
                  <p className="text-xs sm:text-sm text-slate-400 truncate">
                    {current.role} • {current.city}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="relative flex items-center justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
              <div className="flex gap-1.5 sm:gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Testimonial ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === active
                        ? 'w-6 sm:w-8 bg-gradient-to-r from-blue-400 to-cyan-400'
                        : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-1.5 sm:gap-2">
                <button
                  onClick={prev}
                  aria-label="Previous testimonial"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-white transition"
                >
                  <ChevronLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next testimonial"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg sm:rounded-xl flex items-center justify-center text-white transition"
                >
                  <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mini cards — HORIZONTAL SCROLL di HP, grid di desktop */}
        <div className="relative">
          {/* Mobile */}
          <div className="md:hidden flex gap-3 overflow-x-auto pb-3 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide">
            {testimonials.filter((_, i) => i !== active).map((t, i) => (
              <button
                key={i}
                onClick={() => goTo(testimonials.indexOf(t))}
                className="flex-shrink-0 w-[240px] snap-start bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 rounded-2xl p-4 text-left transition-all active:scale-95"
              >
                <div className="flex gap-0.5 mb-2">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={10} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 mb-2">"{t.text}"</p>
                <p className="text-white text-xs font-medium">{t.name}</p>
              </button>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:grid grid-cols-4 gap-3">
            {testimonials.filter((_, i) => i !== active).slice(0, 4).map((t, i) => (
              <button
                key={i}
                onClick={() => goTo(testimonials.indexOf(t))}
                className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 rounded-2xl p-4 text-left transition-all hover:-translate-y-1 group"
              >
                <div className="flex gap-0.5 mb-2">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} size={10} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-400 text-xs line-clamp-2 mb-2 group-hover:text-slate-300 transition">
                  "{t.text}"
                </p>
                <p className="text-white text-xs font-medium">{t.name}</p>
              </button>
            ))}
          </div>

          <p className="md:hidden text-center text-[10px] text-slate-500 mt-2">
            ← Geser untuk lihat testimoni lain →
          </p>
        </div>

        {/* Stats bar */}
        <div className="mt-10 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">4.9</p>
            <p className="text-slate-500 text-[11px] sm:text-xs mt-1">Rating Rata-rata</p>
          </div>
          <div className="text-center border-x border-white/10">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">2K+</p>
            <p className="text-slate-500 text-[11px] sm:text-xs mt-1">Ulasan Pelanggan</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">98%</p>
            <p className="text-slate-500 text-[11px] sm:text-xs mt-1">Repeat Order</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}