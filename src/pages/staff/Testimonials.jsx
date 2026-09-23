import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Star, Check, X, Trash2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TABS = [
  { key: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
  { key: 'approved', label: 'Approved', icon: CheckCircle2, color: 'green' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: 'red' },
];

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      toast.error('Gagal memuat testimoni');
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel('testimonials-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, load)
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const updateStatus = async (id, status) => {
    setBusyId(id);
    const payload = {
      status,
      approved_at: status === 'approved' ? new Date().toISOString() : null,
    };

    const { error } = await supabase.from('testimonials').update(payload).eq('id', id);
    setBusyId(null);

    if (error) {
      toast.error('Gagal update: ' + error.message);
    } else {
      toast.success(
        status === 'approved'
          ? 'Testimoni di-approve ✓'
          : status === 'rejected'
          ? 'Testimoni di-reject'
          : 'Testimoni di-unpublish'
      );
    }
  };

  const remove = async (id) => {
    if (!confirm('Yakin hapus testimoni ini? Nggak bisa dibalikin.')) return;
    setBusyId(id);
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    setBusyId(null);

    if (error) toast.error('Gagal hapus: ' + error.message);
    else toast.success('Testimoni dihapus');
  };

  const counts = {
    pending: items.filter((i) => i.status === 'pending').length,
    approved: items.filter((i) => i.status === 'approved').length,
    rejected: items.filter((i) => i.status === 'rejected').length,
  };

  const filtered = items.filter((i) => i.status === tab);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Testimoni</h1>
        <p className="text-slate-500 text-sm mt-1">
          Review dan pilih testimoni yang tampil di landing page
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        <StatCard
          icon={Clock}
          label="Pending"
          value={counts.pending}
          color="yellow"
          onClick={() => setTab('pending')}
          active={tab === 'pending'}
        />
        <StatCard
          icon={CheckCircle2}
          label="Approved"
          value={counts.approved}
          color="green"
          onClick={() => setTab('approved')}
          active={tab === 'approved'}
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={counts.rejected}
          color="red"
          onClick={() => setTab('rejected')}
          active={tab === 'rejected'}
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        {loading ? (
          <p className="text-slate-400 text-center py-10 text-sm">Memuat...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-500 text-sm">
              Belum ada testimoni <strong>{tab}</strong>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((t) => (
              <TestimonialCard
                key={t.id}
                data={t}
                busy={busyId === t.id}
                onApprove={() => updateStatus(t.id, 'approved')}
                onReject={() => updateStatus(t.id, 'rejected')}
                onUnpublish={() => updateStatus(t.id, 'pending')}
                onDelete={() => remove(t.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, onClick, active }) {
  const colors = {
    yellow: 'bg-yellow-100 text-yellow-700',
    green: 'bg-green-100 text-green-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <button
      onClick={onClick}
      className={`text-left bg-white rounded-2xl border p-4 sm:p-5 transition ${
        active ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-xs sm:text-sm text-slate-500">{label}</p>
      <p className="font-bold text-slate-800 mt-1 text-2xl sm:text-3xl">{value}</p>
    </button>
  );
}

function TestimonialCard({ data, busy, onApprove, onReject, onUnpublish, onDelete }) {
  const date = new Date(data.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 transition">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-slate-800 text-sm truncate">{data.customer_name}</p>
            <span className="text-xs text-slate-400 flex-shrink-0">•</span>
            <p className="text-xs text-slate-500 truncate">{data.customer_city || '-'}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-0.5">
              {Array(data.rating)
                .fill(0)
                .map((_, i) => (
                  <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                ))}
            </div>
            <span className="text-xs text-slate-400">•</span>
            <p className="text-xs text-slate-500 font-mono">
              {data.order_id?.slice(0, 8) || '-'}
            </p>
            <span className="text-xs text-slate-400">•</span>
            <p className="text-xs text-slate-500">{date}</p>
          </div>
        </div>

        <StatusPill status={data.status} />
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">"{data.text}"</p>

      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100">
        {data.status === 'pending' && (
          <>
            <button
              onClick={onApprove}
              disabled={busy}
              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
            >
              <Check size={14} /> Approve
            </button>
            <button
              onClick={onReject}
              disabled={busy}
              className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
            >
              <X size={14} /> Reject
            </button>
          </>
        )}

        {data.status === 'approved' && (
          <button
            onClick={onUnpublish}
            disabled={busy}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
          >
            <X size={14} /> Unpublish
          </button>
        )}

        {data.status === 'rejected' && (
          <button
            onClick={onApprove}
            disabled={busy}
            className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50"
          >
            <Check size={14} /> Approve
          </button>
        )}

        <button
          onClick={onDelete}
          disabled={busy}
          className="inline-flex items-center gap-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50 ml-auto"
        >
          <Trash2 size={14} /> Hapus
        </button>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    approved: 'bg-green-100 text-green-700 border-green-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
  };
  const labels = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected' };

  return (
    <span
      className={`text-[10px] px-2 py-1 rounded-full border font-semibold flex-shrink-0 ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}