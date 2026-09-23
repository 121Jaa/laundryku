import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Phone, TrendingUp, Search, MapPin } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('customers')
      .select('id, name, phone, address, created_at, orders(id, total)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        const mapped = (data || []).map(c => ({
          ...c,
          orderCount: c.orders?.length || 0,
          totalSpent: c.orders?.reduce((s, o) => s + (o.total || 0), 0) || 0,
        })).sort((a, b) => b.totalSpent - a.totalSpent);
        setCustomers(mapped);
        setLoading(false);
      });
  }, []);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Pelanggan</h1>
        <p className="text-slate-500 text-sm mt-1">{customers.length} pelanggan terdaftar</p>
      </header>

      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau no. HP..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-10 text-sm">Memuat...</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-400 text-center py-10 text-sm bg-white rounded-2xl border border-slate-200">
          Belum ada pelanggan
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 text-sm truncate">{c.name}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone size={11} /> {c.phone}
                  </p>
                </div>
              </div>

              {c.address && (
                <p className="text-xs text-slate-500 flex items-start gap-1.5 mb-3 line-clamp-2">
                  <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                  {c.address}
                </p>
              )}

              <div className="flex justify-between pt-3 border-t border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Order</p>
                  <p className="font-bold text-slate-800 text-sm">{c.orderCount}×</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">Total</p>
                  <p className="font-bold text-blue-600 text-sm flex items-center gap-1 justify-end">
                    <TrendingUp size={12} /> Rp {c.totalSpent.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}