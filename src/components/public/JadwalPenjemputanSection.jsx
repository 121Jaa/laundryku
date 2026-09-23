import { Clock, MapPin, Zap, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const schedules = [
  { day: 'Senin – Jumat', open: '07:00', close: '21:00', note: 'Full service' },
  { day: 'Sabtu', open: '07:00', close: '20:00', note: 'Full service' },
  { day: 'Minggu', open: '08:00', close: '18:00', note: 'Express only' },
  { day: 'Hari Libur', open: '09:00', close: '15:00', note: 'By appointment' },
];

const areas = [
  'Jakarta Selatan',
  'Jakarta Pusat',
  'Jakarta Barat',
  'Jakarta Timur',
  'Jakarta Utara',
  'Depok',
  'Tangerang',
  'Bekasi',
];

export default function JadwalPenjemputanSection() {
  return (
    <section id="jadwal-penjemputan" className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-cyan-400 px-4 py-2 rounded-full text-sm mb-6">
            <CalendarCheck size={16} />
            Jadwal Penjemputan
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
            Kapan Saja Bisa{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Pickup
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Kami siap menjemput cucian Anda dalam 30 menit setelah order. Berikut jadwal operasional kami.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Jadwal */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Clock className="text-white" size={22} />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Jam Operasional</h3>
                <p className="text-slate-400 text-sm">Setiap hari kerja</p>
              </div>
            </div>

            <div className="space-y-3">
              {schedules.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-2xl p-4"
                >
                  <div>
                    <p className="text-white font-medium">{s.day}</p>
                    <p className="text-slate-500 text-xs">{s.note}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold">{s.open} – {s.close}</p>
                    <p className="text-slate-500 text-xs">WIB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Area */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <MapPin className="text-white" size={22} />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl">Area Layanan</h3>
                <p className="text-slate-400 text-sm">Gratis pickup & delivery</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {areas.map((a, i) => (
                <div
                  key={i}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 transition flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0"></span>
                  {a}
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-2xl p-4 flex items-start gap-3">
              <Zap className="text-cyan-400 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-white text-sm font-medium">Express 3 Jam</p>
                <p className="text-slate-400 text-xs">Tersedia di semua area layanan</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">
          <p className="text-white text-lg mb-1 font-medium">Siap menjemput cucian Anda sekarang?</p>
          <p className="text-slate-400 text-sm mb-6">Pickup dalam 30 menit setelah order</p>
          <Link
            to="/booking"
            className="inline-block bg-white hover:bg-blue-50 text-slate-900 px-8 py-3.5 rounded-xl font-semibold transition-all hover:scale-105"
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}