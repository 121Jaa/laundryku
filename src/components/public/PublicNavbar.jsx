import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, Info, Sparkles, Calendar, Star } from 'lucide-react';

const HOME_SUBMENU = [
  { id: 'tentang-kami', label: 'Tentang Kami', icon: Info, desc: 'Kenali kami lebih dekat' },
  { id: 'layanan-kami', label: 'Layanan Kami', icon: Sparkles, desc: 'Semua jenis laundry' },
  { id: 'jadwal-penjemputan', label: 'Jadwal Penjemputan', icon: Calendar, desc: 'Kapan bisa pickup' },
  { id: 'testimoni', label: 'Testimoni', icon: Star, desc: 'Kata pelanggan' },
];

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close semua saat pindah halaman
  useEffect(() => {
    setOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // Lock body scroll saat mobile menu terbuka
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Esc untuk close mobile menu
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Click outside untuk dropdown
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollToSection = (id) => {
    setDropdownOpen(false);
    setOpen(false);

    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg sm:text-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition">
              🧺
            </div>
            <div className="font-bold text-base sm:text-lg text-white">
              LaundryKu
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">.</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-2">
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium transition ${
                  dropdownOpen
                    ? 'bg-white/10 text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/5'
                }`}
              >
                Home
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <div className={`absolute top-full left-0 pt-3 w-[320px] transition-all duration-200 ${
                dropdownOpen
                  ? 'opacity-100 visible translate-y-0'
                  : 'opacity-0 invisible -translate-y-2 pointer-events-none'
              }`}>
                <div className="bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50">
                  {HOME_SUBMENU.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left group"
                      >
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition">
                          <Icon size={16} className="text-cyan-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium">{item.label}</p>
                          <p className="text-slate-500 text-xs truncate">{item.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Link
              to="/booking"
              className={`px-4 py-2 rounded-xl font-medium transition ${
                location.pathname === '/booking'
                  ? 'bg-white/10 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              Pesan
            </Link>
            <Link
              to="/track"
              className={`px-4 py-2 rounded-xl font-medium transition ${
                location.pathname === '/track'
                  ? 'bg-white/10 text-white'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              Lacak Order
            </Link>

            <Link
              to="/booking"
              className="ml-2 bg-white hover:bg-blue-50 text-slate-900 px-5 py-2.5 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            >
              Pesan Sekarang
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white p-2 -mr-2"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden absolute top-full inset-x-0 transition-all duration-300 ${
          open
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-4 pointer-events-none'
        }`}>
          <div className="bg-slate-950/95 backdrop-blur-2xl border-t border-white/10 px-4 sm:px-6 py-4 space-y-1 max-h-[calc(100vh-70px)] overflow-y-auto">
            <p className="text-xs text-slate-500 uppercase tracking-wider px-2 py-2">Menu</p>
            {HOME_SUBMENU.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition text-left"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-cyan-400" />
                  </div>
                  <span className="text-white/90 text-sm">{item.label}</span>
                </button>
              );
            })}

            <div className="border-t border-white/10 my-2" />

            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="block py-3 px-3 font-medium text-white/90 hover:bg-white/5 rounded-xl transition"
            >
              Pesan
            </Link>
            <Link
              to="/track"
              onClick={() => setOpen(false)}
              className="block py-3 px-3 font-medium text-white/90 hover:bg-white/5 rounded-xl transition"
            >
              Lacak Order
            </Link>

            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="block bg-white text-slate-900 text-center py-3 rounded-xl font-semibold mt-3"
            >
              Pesan Sekarang
            </Link>

            <p className="text-center text-[10px] text-slate-600 pt-3">
              Tekan Esc atau klik area gelap untuk menutup
            </p>
          </div>
        </div>
      </nav>

      {/* Backdrop Overlay untuk Mobile Menu */}
      <div
        onClick={() => setOpen(false)}
        className={`md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        aria-hidden="true"
      />
    </>
  );
}