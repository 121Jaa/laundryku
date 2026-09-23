import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Phone, MapPin, CheckCircle, MessageCircle, Truck, History, Package, Navigation } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

export default function Delivery() {
  const [tab, setTab] = useState('aktif');
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [areaFilter, setAreaFilter] = useState('semua');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const { data: active } = await supabase
      .from('orders')
      .select('*, customers(name, phone, address), services(name)')
      .in('status', ['siap', 'dikirim'])
      .order('created_at');

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const { data: hist } = await supabase
      .from('orders')
      .select('*, customers(name, phone, address), services(name)')
      .eq('status', 'selesai')
      .gte('completed_at', todayStart.toISOString())
      .order('completed_at', { ascending: false });

    setOrders(active || []);
    setHistory(hist || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel('delivery-list')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const areas = ['semua', ...new Set(orders.map(o => extractArea(o.pickup_address || o.customers?.address)).filter(Boolean))];

  const filtered = areaFilter === 'semua'
    ? orders
    : orders.filter(o => extractArea(o.pickup_address || o.customers?.address) === areaFilter);

  const startDelivery = async (id) => {
    const { error } = await supabase.from('orders').update({ status: 'dikirim' }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Pengiriman dimulai!'); load(); }
  };

  const completeDelivery = async (id) => {
    const { error } = await supabase.from('orders').update({
      status: 'selesai',
      completed_at: new Date().toISOString(),
    }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Pengiriman selesai! ✅'); load(); }
  };

  const openMaps = (address) => {
    if (!address) return toast.error('Alamat tidak ada');
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank');
  };

  const callWA = (phone, order) => {
    if (!phone) return toast.error('No. HP tidak ada');
    const name = order.customer_name || order.customers?.name;
    const msg = order.status === 'dikirim'
      ? `Halo ${name}, kurir kami sedang menuju lokasi Anda untuk mengantar cucian *${order.code}*. Mohon standby ya 🛵`
      : `Halo ${name}, cucian Anda *${order.code}* sudah siap. Kurir akan segera menjemput/mengantar. 🧺`;
    window.open(`https://wa.me/${phone.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const stats = {
    siap: orders.filter(o => o.status === 'siap').length,
    dikirim: orders.filter(o => o.status === 'dikirim').length,
    selesai: history.length,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Pengiriman</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola pengiriman cucian ke pelanggan</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatMini icon={Package} label="Siap Kirim" value={stats.siap} color="green" />
        <StatMini icon={Truck} label="Sedang Dikirim" value={stats.dikirim} color="purple" />
        <StatMini icon={CheckCircle} label="Selesai Hari Ini" value={stats.selesai} color="blue" />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 mb-4 max-w-md">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setTab('aktif')}
            className={`py-2.5 px-4 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
              tab === 'aktif'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package size={16} />
            Aktif ({orders.length})
          </button>
          <button
            onClick={() => setTab('riwayat')}
            className={`py-2.5 px-4 rounded-xl text-sm font-medium transition flex items-center justify-center gap-2 ${
              tab === 'riwayat'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History size={16} />
            Riwayat ({history.length})
          </button>
        </div>
      </div>

      {/* Area Filter */}
      {tab === 'aktif' && areas.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Navigation size={14} className="text-slate-500" />
            <p className="text-xs font-medium text-slate-600">Filter Area</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {areas.map(a => (
              <button
                key={a}
                onClick={() => setAreaFilter(a)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  areaFilter === a
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {a === 'semua' ? 'Semua Area' : a}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <p className="text-slate-400 text-center py-10 text-sm">Memuat...</p>
      ) : tab === 'aktif' ? (
        filtered.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="Tidak ada order aktif"
            desc="Semua order udah selesai dikirim"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(o => (
              <ActiveCard
                key={o.id}
                order={o}
                onStart={() => startDelivery(o.id)}
                onComplete={() => completeDelivery(o.id)}
                onMaps={() => openMaps(o.pickup_address || o.customers?.address)}
                onWA={() => callWA(o.customer_phone || o.customers?.phone, o)}
              />
            ))}
          </div>
        )
      ) : (
        history.length === 0 ? (
          <EmptyState
            icon={History}
            title="Belum ada riwayat"
            desc="Order yang selesai hari ini bakal muncul di sini"
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {history.map(o => (
                <div key={o.id} className="p-4 hover:bg-slate-50 transition flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-slate-500">{o.code}</span>
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {o.customer_name || o.customers?.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {o.completed_at
                        ? `Selesai ${new Date(o.completed_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                        : '-'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-800 text-sm">
                      Rp {o.total.toLocaleString('id-ID')}
                    </p>
                    <p className="text-[10px] text-green-600 font-medium">
                      {o.payment_status === 'paid' ? '✓ Lunas' : '⏳ Belum'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { scrollbar-width: none; }`}</style>
    </div>
  );
}

function ActiveCard({ order: o, onStart, onComplete, onMaps, onWA }) {
  const name = o.customer_name || o.customers?.name;
  const phone = o.customer_phone || o.customers?.phone;
  const address = o.pickup_address || o.customers?.address;
  const isDelivering = o.status === 'dikirim';

  return (
    <div className={`bg-white rounded-2xl border-2 p-4 transition ${
      isDelivering ? 'border-purple-300 shadow-lg shadow-purple-500/10' : 'border-slate-200'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-slate-500">{o.code}</span>
            <StatusBadge status={o.status} />
          </div>
          <p className="font-bold text-slate-800 text-sm truncate">{name}</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-2.5 mb-3">
        <p className="text-[11px] text-slate-600">
          {o.services?.name} • {o.weight} {o.services?.unit}
        </p>
        <p className="text-xs font-bold text-slate-800 mt-0.5">
          Rp {o.total.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="space-y-1.5 text-xs text-slate-600 mb-4">
        <p className="flex items-center gap-2">
          <Phone size={12} className="text-slate-400 flex-shrink-0" />
          <span className="truncate">{phone}</span>
        </p>
        {address && (
          <p className="flex items-start gap-2">
            <MapPin size={12} className="mt-0.5 text-slate-400 flex-shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <button
          onClick={onWA}
          className="bg-green-100 hover:bg-green-200 text-green-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
        >
          <MessageCircle size={12} /> WA
        </button>
        <button
          onClick={onMaps}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition"
        >
          <Navigation size={12} /> Maps
        </button>
      </div>

      {isDelivering ? (
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 shadow-lg shadow-green-500/30"
        >
          <CheckCircle size={14} /> Tandai Selesai
        </button>
      ) : (
        <button
          onClick={onStart}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/30"
        >
          <Truck size={14} /> Mulai Kirim
        </button>
      )}
    </div>
  );
}

function StatMini({ icon: Icon, label, value, color }) {
  const colors = {
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    blue: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-10 sm:p-14 text-center">
      <Icon size={44} className="mx-auto mb-3 text-slate-300" />
      <p className="font-semibold text-slate-700 mb-1">{title}</p>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  );
}

function extractArea(address) {
  if (!address) return null;
  const match = address.match(/(?:Kec\.|Kel\.|Kecamatan|Kelurahan)\s+([^,]+)/i);
  if (match) return match[1].trim();
  const parts = address.split(',');
  if (parts.length > 1) return parts[parts.length - 1].trim().slice(0, 30);
  return null;
}