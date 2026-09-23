import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import StatusBadge from '../../components/StatusBadge';
import { Search, MessageCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: 'antri', label: 'Antri' },
  { value: 'proses', label: 'Proses' },
  { value: 'siap', label: 'Siap Diambil' },
  { value: 'selesai', label: 'Selesai' },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('semua');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    let query = supabase
      .from('orders')
      .select('*, customers(name, phone), services(name)')
      .order('created_at', { ascending: false });

    if (filter !== 'semua') query = query.eq('status', filter);

    const { data, error } = await query;
    if (error) toast.error(error.message);
    else setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel('orders-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [filter]);

  const filtered = orders.filter(o => {
    const name = o.customer_name || o.customers?.name || '';
    return name.toLowerCase().includes(search.toLowerCase()) ||
      o.code.toLowerCase().includes(search.toLowerCase());
  });

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) toast.error(error.message);
    else toast.success('Status diupdate');
  };

  const togglePayment = async (order) => {
    const next = order.payment_status === 'paid' ? 'unpaid' : 'paid';
    const { error } = await supabase.from('orders').update({ payment_status: next }).eq('id', order.id);
    if (error) toast.error(error.message);
    else toast.success(next === 'paid' ? 'Ditandai lunas' : 'Ditandai belum bayar');
  };

  const notifyWA = (o) => {
    const phone = o.customer_phone || o.customers?.phone;
    if (!phone) return toast.error('No. HP tidak ada');
    const trackUrl = `${window.location.origin}/track/${o.code}`;
    const statusLabel = STATUSES.find(s => s.value === o.status)?.label || o.status;
    const name = o.customer_name || o.customers?.name || 'Pelanggan';
    const msg = `Halo ${name}, cucian Anda *${o.code}* statusnya: *${statusLabel}*.\n\nLacak: ${trackUrl}\n\nTerima kasih! 🧺`;
    window.open(`https://wa.me/${phone.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success('Kode dicopy!');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Daftar Order</h1>
        <p className="text-slate-500 text-sm mt-1">Update status 1 klik, notif WA otomatis</p>
      </header>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau kode..."
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[{ value: 'semua', label: 'Semua' }, ...STATUSES].map(s => (
            <button key={s.value} onClick={() => setFilter(s.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                filter === s.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-slate-400 text-center py-10 text-sm">Memuat...</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-400 text-center py-10 text-sm bg-white rounded-2xl border border-slate-200">
          Tidak ada order
        </p>
      ) : (
        <>
          {/* Mobile: card */}
          <div className="lg:hidden space-y-3">
            {filtered.map(order => (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-slate-500">{order.code}</span>
                      <button onClick={() => copyCode(order.code)} className="text-slate-400 hover:text-blue-600">
                        <Copy size={12} />
                      </button>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {order.customer_name || order.customers?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {order.customer_phone || order.customers?.phone}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-slate-100">
                  <span className="text-slate-500">
                    {order.services?.name} • {order.weight} {order.services?.unit}
                  </span>
                  <span className="font-bold text-slate-800">
                    Rp {order.total.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="flex gap-2">
                  <select value={order.status}
                    onChange={e => updateStatus(order.id, e.target.value)}
                    className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-2 outline-none focus:border-blue-500">
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <button onClick={() => togglePayment(order)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                      order.payment_status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {order.payment_status === 'paid' ? 'Lunas' : 'Belum'}
                  </button>
                  <button onClick={() => notifyWA(order)}
                    className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                    <MessageCircle size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden lg:block bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 text-left text-xs text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Kode</th>
                  <th className="px-4 py-3 font-medium">Pelanggan</th>
                  <th className="px-4 py-3 font-medium">Layanan</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Bayar</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-600">{order.code}</span>
                        <button onClick={() => copyCode(order.code)} className="text-slate-400 hover:text-blue-600">
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 text-sm">
                        {order.customer_name || order.customers?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.customer_phone || order.customers?.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {order.services?.name}
                      <br />
                      <span className="text-slate-400">
                        {order.weight} {order.services?.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800 text-sm">
                      Rp {order.total.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => togglePayment(order)}
                        className={`text-xs px-2 py-1 rounded-lg font-semibold ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.payment_status === 'paid' ? 'Lunas' : 'Belum'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select value={order.status}
                        onChange={e => updateStatus(order.id, e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-blue-500">
                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => notifyWA(order)}
                        className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                        <MessageCircle size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { scrollbar-width: none; }`}</style>
    </div>
  );
}