import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { Clock, Loader, PackageCheck, Wallet, TrendingUp, ArrowRight } from 'lucide-react';
import StatusBadge from '../../components/StatusBadge';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ antri: 0, proses: 0, siap: 0, revenue: 0 });

  const load = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, customers(name), services(name)')
      .order('created_at', { ascending: false })
      .limit(50);

    const orders = data || [];
    setOrders(orders);

    const today = new Date().toISOString().split('T')[0];
    setStats({
      antri: orders.filter(o => o.status === 'antri').length,
      proses: orders.filter(o => o.status === 'proses').length,
      siap: orders.filter(o => o.status === 'siap').length,
      revenue: orders
        .filter(o => o.created_at.startsWith(today))
        .reduce((s, o) => s + o.total, 0),
    });

    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase.channel('dash')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`;

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Ringkasan operasional hari ini</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard icon={Clock} label="Antri" value={stats.antri} color="yellow" />
        <StatCard icon={Loader} label="Proses" value={stats.proses} color="blue" />
        <StatCard icon={PackageCheck} label="Siap Diambil" value={stats.siap} color="green" />
        <StatCard icon={Wallet} label="Pendapatan Hari Ini" value={formatRp(stats.revenue)} color="purple" small />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-slate-800">Order Terbaru</h2>
          <Link to="/orders" className="text-xs sm:text-sm text-blue-600 hover:underline flex items-center gap-1">
            Lihat semua <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-400 text-center py-10 text-sm">Memuat...</p>
        ) : orders.length === 0 ? (
          <p className="text-slate-400 text-center py-10 text-sm">Belum ada order</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 8).map(order => (
              <Link
                key={order.id}
                to="/orders"
                className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {order.customer_name || order.customers?.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {order.code} • {order.services?.name} • {order.weight} {order.services?.unit}
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                  <span className="font-semibold text-slate-700 text-xs sm:text-sm hidden xs:inline">
                    {formatRp(order.total)}
                  </span>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, small }) {
  const colors = {
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-xs sm:text-sm text-slate-500">{label}</p>
      <p className={`font-bold text-slate-800 mt-1 ${small ? 'text-lg sm:text-xl' : 'text-2xl sm:text-3xl'}`}>
        {value}
      </p>
    </div>
  );
}