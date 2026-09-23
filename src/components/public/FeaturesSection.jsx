import { Clock, Truck, ShieldCheck, Wallet, Headphones, Award } from 'lucide-react';

const features = [
  { icon: Clock, title: 'Express 3 Jam', desc: 'Untuk Anda yang butuh cepat tanpa kompromi kualitas', color: 'blue' },
  { icon: Truck, title: 'Pickup 30 Menit', desc: 'Antar jemput gratis ke seluruh area layanan', color: 'green' },
  { icon: ShieldCheck, title: 'Garansi Bersih', desc: 'Tidak puas? Kami cuci ulang gratis', color: 'purple' },
  { icon: Wallet, title: 'Bayar Mudah', desc: 'Cash, QRIS, atau transfer bank', color: 'yellow' },
  { icon: Headphones, title: 'Support 24/7', desc: 'Chat WhatsApp kapanpun dibutuhkan', color: 'pink' },
  { icon: Award, title: '10.000+ Pelanggan', desc: 'Dipercaya di Jakarta & Bandung', color: 'orange' },
];

const colors = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  pink: 'bg-pink-100 text-pink-600',
  orange: 'bg-orange-100 text-orange-600',
};

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Mengapa <span className="text-blue-600">LaundryKu</span>?
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Ribuan pelanggan sudah mempercayakan cuciannya pada kami
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 hover:shadow-xl transition shadow-sm">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${colors[f.color]}`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-bold text-lg text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}