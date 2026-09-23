import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#eab308', '#3b82f6', '#22c55e', '#64748b'];

export default function Reports() {
  const [orders, setOrders] = useState([]);
  const [range, setRange] = useState(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const since = new Date();
    since.setDate(since.getDate() - range);

    supabase.from('orders')
      .select('*, services(name)')
      .gte('created_at', since.toISOString())
      .order('created_at')
      .then(({ data }) => {
        setOrders(data || []);
        setLoading(false);
      });
  }, [range]);

  const dailyData = buildDailyData(orders, range);
  const serviceData = buildServiceData(orders);
  const statusData = buildStatusData(orders);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-5 flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Laporan</h1>
          <p className="text-slate-500 text-sm mt-1">Analisa performa bisnis</p>
        </div>
        <select value={range} onChange={e => setRange(Number(e.target.value))}
          className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-sm outline-none focus:border-blue-500">
          <option value={7}>7 Hari Terakhir</option>
          <option value={30}>30 Hari Terakhir</option>
          <option value={90}>90 Hari Terakhir</option>
        </select>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        <KPI title="Total Pendapatan" value={`Rp ${totalRevenue.toLocaleString('id-ID')}`} />
        <KPI title="Total Order" value={orders.length} />
        <KPI title="Rata-rata Order" value={`Rp ${avgOrder.toLocaleString('id-ID')}`} />
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-10 text-sm">Memuat...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card title="Pendapatan Harian">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} tickFormatter={v => `${v / 1000}k`} stroke="#94a3b8" />
                <Tooltip formatter={v => `Rp ${v.toLocaleString('id-ID')}`} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Order per Layanan">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Status Order">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label fontSize={11}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Top Layanan by Revenue">
            {serviceData.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">Belum ada data</p>
            ) : (
              <div className="space-y-3">
                {[...serviceData].sort((a, b) => b.revenue - a.revenue).map((s, i) => (
                  <div key={s.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 truncate">{s.name}</span>
                      <span className="text-slate-500 flex-shrink-0 ml-2">
                        Rp {s.revenue.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                        style={{ width: `${(s.revenue / serviceData[0].revenue) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
      <h3 className="font-bold text-slate-800 mb-4 text-sm sm:text-base">{title}</h3>
      {children}
    </div>
  );
}

function KPI({ title, value }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5">
      <p className="text-xs sm:text-sm text-slate-500">{title}</p>
      <p className="text-lg sm:text-2xl font-bold text-slate-800 mt-1 break-words">{value}</p>
    </div>
  );
}

function buildDailyData(orders, days) {
  const map = {};
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    map[key] = {
      date: d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
      revenue: 0,
      count: 0,
    };
  }
  orders.forEach(o => {
    const key = o.created_at.split('T')[0];
    if (map[key]) {
      map[key].revenue += o.total;
      map[key].count++;
    }
  });
  return Object.values(map);
}

function buildServiceData(orders) {
  const map = {};
  orders.forEach(o => {
    const name = o.services?.name || 'Unknown';
    if (!map[name]) map[name] = { name, count: 0, revenue: 0 };
    map[name].count++;
    map[name].revenue += o.total;
  });
  return Object.values(map);
}

function buildStatusData(orders) {
  const map = {};
  orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
  const labels = { antri: 'Antri', proses: 'Proses', siap: 'Siap', selesai: 'Selesai' };
  return Object.entries(map).map(([name, value]) => ({ name: labels[name] || name, value }));
}