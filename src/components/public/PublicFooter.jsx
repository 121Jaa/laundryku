import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Camera, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

export default function PublicFooter() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 relative overflow-hidden border-t border-white/10">
      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/30">
                🧺
              </div>
              <span className="font-bold text-white text-xl">
                LaundryKu
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">.</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-md">
              Layanan laundry express 3 jam selesai dengan pickup 30 menit.
              Bersih, wangi, higienis, tepat waktu.
            </p>

            {/* Sosial */}
            <div className="flex gap-3">
              <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500/40 text-slate-400 hover:text-green-400 rounded-xl flex items-center justify-center transition">
                <MessageCircle size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-10 h-10 bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 text-slate-400 hover:text-pink-400 rounded-xl flex items-center justify-center transition">
                <Camera size={18} />
              </a>
            </div>
          </div>

          {/* Menu */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Menu</h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/booking', label: 'Pesan' },
                { to: '/track', label: 'Lacak Order' },
                { to: '/login', label: 'Login Staff' },
              ].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="text-slate-400 hover:text-cyan-400 transition flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-slate-600 group-hover:bg-cyan-400 rounded-full transition" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Kontak</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <Phone size={16} className="mt-0.5 flex-shrink-0 text-cyan-400" />
                <span>0812-3456-7890</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Mail size={16} className="mt-0.5 flex-shrink-0 text-cyan-400" />
                <span>hello@laundryku.com</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-cyan-400" />
                <span>Jl. Contoh No. 123, Jakarta</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <p className="text-white font-semibold text-sm mb-0.5">Dapatkan promo & update</p>
            <p className="text-slate-400 text-xs">Promo khusus tiap bulan, langsung ke inbox Anda</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@anda.com"
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/50 transition w-full md:w-56"
            />
            <button type="submit"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition">
              <Send size={14} />
              <span className="hidden sm:inline">Subscribe</span>
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 LaundryKu Express. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-slate-300 transition">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
}