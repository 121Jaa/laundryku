import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Send, MessageCircle, ArrowLeft, Scale, CheckCircle2, Wallet, Clock } from 'lucide-react';import toast from 'react-hot-toast';

export default function NewOrder() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    notes: '',
    items: [],        // [{ service, qty (berat/pcs), unit }]
    paidNow: true,    // default: bayar langsung
    paymentMethod: 'cash',
  });

  useEffect(() => {
    supabase.from('services').select('*').eq('active', true).order('price')
      .then(({ data }) => setServices(data || []));
  }, []);

  const addItem = (service) => {
    const exists = form.items.find(i => i.service.id === service.id);
    if (exists) {
      setForm({ ...form, items: form.items.map(i => i.service.id === service.id ? { ...i, qty: i.qty + 1 } : i) });
    } else {
      // Default qty: 1 untuk pcs, 1 untuk kg (kasir bisa ubah manual)
      setForm({ ...form, items: [...form.items, { service, qty: 1 }] });
    }
  };

  const updateQty = (serviceId, newQty) => {
    const qty = Math.max(0, Number(newQty) || 0);
    setForm({
      ...form,
      items: form.items
        .map(i => i.service.id === serviceId ? { ...i, qty } : i)
        .filter(i => i.qty > 0),
    });
  };

  const incrementQty = (serviceId, delta) => {
    const item = form.items.find(i => i.service.id === serviceId);
    if (!item) return;
    updateQty(serviceId, item.qty + delta);
  };

  const total = form.items.reduce((sum, i) => sum + i.service.price * i.qty, 0);
  const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return toast.error('Nama wajib diisi');
    if (!form.phone) return toast.error('No. WhatsApp wajib diisi');
    if (form.items.length === 0) return toast.error('Pilih minimal 1 layanan');

    setLoading(true);
    try {
      // 1. Upsert customer
      const { data: cust, error: custErr } = await supabase
        .from('customers')
        .upsert(
          { name: form.name.trim(), phone: form.phone.trim(), address: null },
          { onConflict: 'phone' }
        )
        .select()
        .single();
      if (custErr) throw custErr;

      // 2. Hitung estimasi dari layanan terlama
      const maxDuration = Math.max(...form.items.map(i => i.service.duration));
      const estimate = new Date(Date.now() + maxDuration * 3600000).toISOString();

      // 3. Compile items detail dengan berat/qty
      const itemsDetail = form.items
        .map(i => `${i.service.name} ${i.qty}${i.service.unit}`)
        .join(', ');

      // 4. Insert order
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_id: cust.id,
          service_id: form.items[0].service.id,
          weight: form.items.reduce((s, i) => s + i.qty, 0),
          total,
          notes: itemsDetail + (form.notes ? ' | ' + form.notes : ''),
          estimate_at: estimate,
          status: 'antri',
          payment_status: form.paidNow ? 'paid' : 'unpaid',
          payment_method: form.paidNow ? form.paymentMethod : 'cash',
          booking_type: 'walkin',
          customer_name: form.name.trim(),
          customer_phone: form.phone.trim(),
        })
        .select('*, customers(name, phone), services(name, unit)')
        .single();

      if (error) throw error;
      setSuccess(order);
      toast.success('Order walk-in berhasil!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendWA = () => {
    if (!success) return;
    const msg =
      `Halo ${form.name}, order laundry Anda *${success.code}* sudah kami terima.\n\n` +
      `Total: ${formatRp(success.total)}\n` +
      `Status bayar: *${form.paidNow ? 'LUNAS' : 'BELUM BAYAR'}*\n` +
      `Estimasi: ${new Date(success.estimate_at).toLocaleDateString('id-ID')}\n\n` +
      `Lacak: ${window.location.origin}/track/${success.code}\n\nTerima kasih! 🧺`;
    window.open(`https://wa.me/${form.phone.replace(/^0/, '62').replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const reset = () => {
    setForm({ name: '', phone: '', notes: '', items: [], paidNow: true, paymentMethod: 'cash' });
    setSuccess(null);
  };

  // ============ SUCCESS ============
  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl sm:text-4xl">✅</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Order Berhasil!</h2>
          <p className="text-slate-500 text-sm mb-6">
            Kode <strong className="font-mono text-blue-600">{success.code}</strong> untuk {form.name}
          </p>

          <div className="bg-slate-50 rounded-xl p-4 text-left mb-6 space-y-2">
            <Row label="Total" value={formatRp(success.total)} bold />
            <Row label="Status Bayar"
              value={form.paidNow ? `✅ Lunas (${form.paymentMethod.toUpperCase()})` : '⏳ Belum Bayar'} />
            <Row label="Estimasi"
              value={new Date(success.estimate_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={sendWA}
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition text-sm">
              <MessageCircle size={18} /> Kirim WA
            </button>
            <button onClick={reset}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition text-sm">
              Order Lagi
            </button>
            <button onClick={() => navigate('/orders')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition text-sm">
              Lihat Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============ FORM ============
  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate('/dashboard')}
        className="text-slate-500 hover:text-blue-600 text-xs sm:text-sm flex items-center gap-1 mb-4 transition">
        <ArrowLeft size={14} /> Kembali ke Dashboard
      </button>

      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Order Walk-in</h1>
        <p className="text-slate-500 text-sm mt-1">Input order dari pelanggan yang datang langsung ke outlet</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-5">
        {/* Customer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nama Pelanggan *">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Budi Santoso" className="input-light" required />
          </Field>
          <Field label="No. WhatsApp *">
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              placeholder="081234567890" type="tel" inputMode="numeric" className="input-light" required />
          </Field>
        </div>

        {/* Services */}
        <Field label="Pilih Layanan">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {services.map(s => {
              const selected = form.items.find(i => i.service.id === s.id);
              return (
                <button type="button" key={s.id} onClick={() => addItem(s)}
                  className={`p-3 rounded-xl border-2 text-left transition ${
                    selected ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                  <div className="text-xl mb-1">{s.icon || '🧺'}</div>
                  <p className="font-semibold text-xs text-slate-800 leading-tight">{s.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Rp {s.price.toLocaleString('id-ID')}/{s.unit}
                  </p>
                  {selected && <p className="text-[10px] text-blue-600 font-bold mt-1">✓ {selected.qty} {s.unit}</p>}
                </button>
              );
            })}
          </div>
        </Field>

        {/* Cart dengan input berat/qty manual */}
        {form.items.length > 0 && (
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Scale size={14} className="text-blue-600" />
              <h3 className="font-bold text-sm text-slate-700">Keranjang (timbang/isi manual)</h3>
            </div>
            <div className="space-y-2">
              {form.items.map(item => (
                <div key={item.service.id} className="flex items-center justify-between bg-white rounded-lg p-2.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-lg flex-shrink-0">{item.service.icon}</span>
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-slate-700 truncate block">{item.service.name}</span>
                      <span className="text-[10px] text-slate-500">
                        {formatRp(item.service.price)}/{item.service.unit}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button type="button" onClick={() => incrementQty(item.service.id, -0.5)}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-xs font-bold">−</button>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={e => updateQty(item.service.id, e.target.value)}
                      step="0.1"
                      min="0"
                      className="w-14 text-center font-semibold text-sm border border-slate-200 rounded-lg py-1 outline-none focus:border-blue-500"
                    />
                    <button type="button" onClick={() => incrementQty(item.service.id, 0.5)}
                      className="w-7 h-7 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 flex items-center justify-center text-xs font-bold">+</button>
                    <span className="text-[10px] text-slate-500 w-6">{item.service.unit}</span>
                    <button type="button" onClick={() => updateQty(item.service.id, 0)}
                      className="w-7 h-7 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center text-xs font-bold ml-1">×</button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              💡 Untuk kiloan, ketik berat timbangan (misal 3.5). Untuk pcs, ketik jumlah (misal 2).
            </p>
          </div>
        )}

        <Field label="Catatan (opsional)">
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Misal: pisahkan pakaian putih" rows={2} className="input-light resize-none" />
        </Field>

                {/* Payment — 2 option side-by-side */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-700">Status Pembayaran</p>

          <div className="grid grid-cols-2 gap-3">
            {/* Opsi 1: Bayar Sekarang */}
            <button type="button"
              onClick={() => setForm({ ...form, paidNow: true })}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                form.paidNow
                  ? 'border-green-500 bg-green-50 shadow-lg shadow-green-500/20 scale-[1.02]'
                  : 'border-slate-200 bg-white hover:border-green-300 hover:bg-green-50/30'
              }`}>
              {form.paidNow && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                form.paidNow ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <Wallet size={20} />
              </div>
              <p className={`font-bold text-sm mb-0.5 ${form.paidNow ? 'text-green-700' : 'text-slate-700'}`}>
                Bayar Sekarang
              </p>
              <p className={`text-[10px] leading-tight ${form.paidNow ? 'text-green-600' : 'text-slate-500'}`}>
                Lunas saat ini
              </p>
            </button>

            {/* Opsi 2: Bayar Nanti */}
            <button type="button"
              onClick={() => setForm({ ...form, paidNow: false })}
              className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                !form.paidNow
                  ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-500/20 scale-[1.02]'
                  : 'border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/30'
              }`}>
              {!form.paidNow && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={14} className="text-white" />
                </div>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                !form.paidNow ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <Clock size={20} />
              </div>
              <p className={`font-bold text-sm mb-0.5 ${!form.paidNow ? 'text-orange-700' : 'text-slate-700'}`}>
                Bayar Nanti
              </p>
              <p className={`text-[10px] leading-tight ${!form.paidNow ? 'text-orange-600' : 'text-slate-500'}`}>
                Saat ambil cucian
              </p>
            </button>
          </div>

          {/* Metode bayar (cuma muncul kalau bayar sekarang) */}
          {form.paidNow && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 animate-[fadeIn_0.3s_ease]">
              <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wider mb-2">
                Metode Pembayaran
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash', label: '💵 Cash' },
                  { id: 'qris', label: '📱 QRIS' },
                  { id: 'transfer', label: '🏦 Transfer' },
                ].map(m => (
                  <button key={m.id} type="button"
                    onClick={() => setForm({ ...form, paymentMethod: m.id })}
                    className={`py-2.5 rounded-lg text-xs font-semibold transition ${
                      form.paymentMethod === m.id
                        ? 'bg-green-600 text-white shadow-lg shadow-green-500/30'
                        : 'bg-white text-slate-600 border border-green-200 hover:bg-green-100'
                    }`}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Info kalau bayar nanti */}
          {!form.paidNow && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 animate-[fadeIn_0.3s_ease]">
              <p className="text-[11px] text-orange-700 flex items-start gap-2">
                <span className="text-base">⏳</span>
                <span>Pembayaran akan ditagih saat customer ambil cucian. Status order: <strong>Belum Bayar</strong>.</span>
              </p>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Total</span>
          <span className="text-2xl font-bold text-blue-600">{formatRp(total)}</span>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50">
          {loading ? 'Menyimpan...' : <><Send size={18} /> Simpan Order</>}
        </button>
      </form>

      <style>{`
        .input-light {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
          font-size: 0.875rem;
          background: white;
          color: #0f172a;
        }
        .input-light:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37,99,235,0.1);
        }
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className={bold ? 'font-bold text-blue-600' : 'text-slate-800'}>{value}</span>
    </div>
  );
}