import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  User, Package, Calendar, CheckCircle, ArrowLeft, ArrowRight,
  Plus, Minus, Trash2, Copy, MessageCircle, Sparkles, Truck, Clock, Loader
} from 'lucide-react';
import WarningBox from '../../components/public/WarningBox';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, title: 'Identitas', short: 'Diri', icon: User },
  { id: 2, title: 'Layanan', short: 'Layanan', icon: Package },
  { id: 3, title: 'Jadwal', short: 'Jadwal', icon: Calendar },
  { id: 4, title: 'Konfirmasi', short: 'Konfirmasi', icon: CheckCircle },
];

export default function Booking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    booking_type: 'pickup',
    pickup_date: '',
    pickup_time: '',
    items: [],
  });

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('price')
      .then(({ data, error }) => {
        if (error) toast.error('Gagal memuat layanan');
        setServices(data || []);
        setLoadingServices(false);
      });
  }, []);

  const addItem = (service) => {
    const exists = form.items.find(i => i.service.id === service.id);
    if (exists) {
      setForm({
        ...form,
        items: form.items.map(i => i.service.id === service.id ? { ...i, qty: i.qty + 1 } : i),
      });
    } else {
      setForm({ ...form, items: [...form.items, { service, qty: 1 }] });
    }
    setErrors({ ...errors, items: null });
  };

  const updateQty = (serviceId, delta) => {
    setForm({
      ...form,
      items: form.items
        .map(i => i.service.id === serviceId ? { ...i, qty: Math.max(0, i.qty + delta) } : i)
        .filter(i => i.qty > 0),
    });
  };

  const total = form.items.reduce((sum, i) => sum + i.service.price * i.qty, 0);
  const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`;

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.name.trim()) e.name = 'Nama wajib diisi';
      if (!form.phone.trim()) e.phone = 'No. WhatsApp wajib diisi';
      else if (!/^0\d{9,13}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Format: 08xxxxxxxxxx';
    }
    if (step === 2) {
      if (form.items.length === 0) e.items = 'Pilih minimal 1 layanan';
    }
    if (step === 3) {
      if (form.booking_type === 'pickup') {
        if (!form.pickup_date) e.pickup_date = 'Pilih tanggal';
        if (!form.pickup_time) e.pickup_time = 'Pilih jam';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) {
      toast.error('Lengkapi data dulu');
      return;
    }
    setStep(s => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setSubmitting(true);

    try {
      // 1. Upsert customer
      const { data: cust, error: custErr } = await supabase
        .from('customers')
        .upsert(
          { name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim() || null },
          { onConflict: 'phone' }
        )
        .select()
        .single();

      if (custErr) throw custErr;

      // 2. Hitung estimasi
      const maxDuration = Math.max(...form.items.map(i => i.service.duration));
      const estimate = new Date(Date.now() + maxDuration * 3600000).toISOString();

      // 3. Compile items detail
      const primaryService = form.items[0].service;
      const itemsDetail = form.items
        .map(i => `${i.service.name} (${i.qty} ${i.service.unit})`)
        .join(', ');

      const pickupAt = form.booking_type === 'pickup' && form.pickup_date
        ? new Date(`${form.pickup_date}T${form.pickup_time || '09:00'}`).toISOString()
        : null;

      // 4. Insert order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          customer_id: cust.id,
          service_id: primaryService.id,
          weight: form.items.reduce((s, i) => s + i.qty, 0),
          total,
          notes: `${itemsDetail}${form.notes ? ' | ' + form.notes : ''}`,
          estimate_at: estimate,
          status: 'antri',
          payment_status: 'unpaid',
          booking_type: form.booking_type,
          pickup_address: form.address || null,
          pickup_at: pickupAt,
          customer_name: form.name.trim(),
          customer_phone: form.phone.trim(),
        })
        .select('*, customers(name, phone, address), services(name, price, unit)')
        .single();

      if (orderErr) throw orderErr;

      setSuccess(order);
      toast.success('Booking berhasil! 🎉');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Gagal membuat booking');
    } finally {
      setSubmitting(false);
    }
  };

  const sendWA = () => {
    if (!success) return;
    const trackUrl = `${window.location.origin}/track/${success.code}`;
    const msg =
      `Halo ${form.name}, booking laundry Anda sudah kami terima! 🧺\n\n` +
      `Kode: *${success.code}*\n` +
      `Total: ${formatRp(success.total)}\n` +
      `Estimasi selesai: ${new Date(success.estimate_at).toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
      })}\n\n` +
      `Lacak status: ${trackUrl}\n\n` +
      `Terima kasih!`;
    const phone = form.phone.replace(/^0/, '62').replace(/\D/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const copyCode = () => {
    navigator.clipboard.writeText(success.code);
    toast.success('Kode dicopy!');
  };

  // ============ SUCCESS VIEW ============
  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        <MiniNavbar />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

        <div className="relative max-w-xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-16">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center animate-[fadeIn_0.5s_ease]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="text-green-400" size={36} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Booking Berhasil!</h2>
            <p className="text-slate-400 text-sm sm:text-base mb-6">
              Simpan kode ini untuk lacak status cucian Anda
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3">
              <span className="font-mono text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {success.code}
              </span>
              <button onClick={copyCode}
                className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition flex-shrink-0">
                <Copy size={18} />
              </button>
            </div>

            <div className="text-left bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 mb-6 space-y-3 text-sm">
              <Row label="Nama" value={form.name} />
              <Row label="WhatsApp" value={form.phone} />
              <Row label="Total" value={formatRp(success.total)} bold />
              <Row label="Tipe" value={form.booking_type === 'pickup' ? 'Pickup (dijemput)' : 'Drop-off (antar sendiri)'} />
              <Row
                label="Estimasi"
                value={new Date(success.estimate_at).toLocaleDateString('id-ID', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              />
            </div>

            <div className="space-y-3">
              <button onClick={sendWA}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                <MessageCircle size={18} /> Kirim ke WhatsApp
              </button>
              <button onClick={() => navigate(`/track/${success.code}`)}
                className="w-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 text-white py-3.5 rounded-xl font-semibold transition">
                Lacak Order
              </button>
              <button onClick={() => navigate('/')}
                className="w-full text-slate-500 hover:text-cyan-400 py-2 text-sm transition">
                Kembali ke Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============ BOOKING FORM ============
  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <MiniNavbar />

      {/* Glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      <div className="relative pt-24 sm:pt-28 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 text-cyan-400 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm mb-4">
              <Sparkles size={14} />
              Booking
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
              Booking{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Laundry
              </span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              4 langkah mudah, pickup dalam 30 menit
            </p>
          </header>

          {/* Stepper */}
          <div className="mb-6 sm:mb-8">
            <div className="flex justify-between items-center">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <div key={s.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                        done ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' :
                        active ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white ring-4 ring-blue-500/20 scale-110' :
                        'bg-white/5 text-slate-500 border border-white/10'
                      }`}>
                        {done ? (
                          <CheckCircle size={18} className="sm:w-5 sm:h-5" />
                        ) : (
                          <Icon size={18} className="sm:w-5 sm:h-5" />
                        )}
                      </div>
                      <span className={`text-[10px] sm:text-xs font-medium transition whitespace-nowrap ${
                        active ? 'text-cyan-400' : done ? 'text-blue-400' : 'text-slate-500'
                      }`}>
                        <span className="hidden sm:inline">{s.title}</span>
                        <span className="inline sm:hidden">{s.short}</span>
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 sm:h-1 mx-1.5 sm:mx-3 rounded-full transition-all ${
                        step > s.id ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/10'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
            {step === 1 && (
              <div className="space-y-4 sm:space-y-5 animate-[fadeIn_0.3s_ease]">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Identitas Anda</h2>

                <Field label="Nama Lengkap *" error={errors.name}>
                  <input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Budi Santoso"
                    className="input-dark"
                  />
                </Field>

                <Field label="No. WhatsApp *" error={errors.phone}>
                  <input
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="081234567890"
                    type="tel"
                    inputMode="numeric"
                    className="input-dark"
                  />
                </Field>

                <Field label="Alamat (untuk pickup)">
                  <textarea
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    placeholder="Jl. Contoh No. 123, Kel. ABC, Kec. XYZ"
                    rows={3}
                    className="input-dark resize-none"
                  />
                </Field>
              </div>
            )}

            {step === 2 && (
              <div className="animate-[fadeIn_0.3s_ease]">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Pilih Layanan</h2>
                <p className="text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">Pilih satu atau lebih layanan</p>

                {loadingServices ? (
                  <div className="text-center py-12">
                    <Loader className="animate-spin text-cyan-400 mx-auto mb-3" size={28} />
                    <p className="text-slate-400 text-sm">Memuat layanan...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
                      {services.map(s => {
                        const selected = form.items.find(i => i.service.id === s.id);
                        return (
                          <button key={s.id} type="button"
                            onClick={() => addItem(s)}
                            className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all ${
                              selected
                                ? 'border-cyan-500/60 bg-cyan-500/10 scale-[1.02]'
                                : 'border-white/10 hover:border-white/20 bg-white/5'
                            }`}>
                            <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">{s.icon || '🧺'}</div>
                            <p className="font-bold text-xs sm:text-sm text-white leading-tight">{s.name}</p>
                            <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                              Rp {s.price.toLocaleString('id-ID')}/{s.unit}
                            </p>
                            {selected && (
                              <div className="mt-1.5 text-[10px] sm:text-xs text-cyan-400 font-semibold">
                                ✓ {selected.qty} {s.unit}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {errors.items && (
                      <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                        {errors.items}
                      </p>
                    )}

                    {form.items.length > 0 && (
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
                        <h3 className="font-bold text-white mb-3 sm:mb-4 text-sm sm:text-base">Keranjang</h3>
                        <div className="space-y-2 sm:space-y-3">
                          {form.items.map(item => (
                            <div key={item.service.id} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-3 gap-2">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <span className="text-xl sm:text-2xl flex-shrink-0">{item.service.icon}</span>
                                <div className="min-w-0">
                                  <p className="font-semibold text-xs sm:text-sm text-white truncate">{item.service.name}</p>
                                  <p className="text-[10px] sm:text-xs text-slate-400">
                                    Rp {item.service.price.toLocaleString('id-ID')}/{item.service.unit}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <button type="button" onClick={() => updateQty(item.service.id, -1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white transition">
                                  <Minus size={12} />
                                </button>
                                <span className="w-6 sm:w-8 text-center font-semibold text-sm text-white">{item.qty}</span>
                                <button type="button" onClick={() => updateQty(item.service.id, 1)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 flex items-center justify-center transition">
                                  <Plus size={12} />
                                </button>
                                <button type="button" onClick={() => updateQty(item.service.id, -item.qty)}
                                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 flex items-center justify-center transition ml-1">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 sm:space-y-5 animate-[fadeIn_0.3s_ease]">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Jadwal & Metode</h2>

                <Field label="Metode Pengambilan">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button type="button"
                      onClick={() => setForm({ ...form, booking_type: 'pickup' })}
                      className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all ${
                        form.booking_type === 'pickup'
                          ? 'border-cyan-500/60 bg-cyan-500/10'
                          : 'border-white/10 hover:border-white/20 bg-white/5'
                      }`}>
                      <Truck size={20} className={form.booking_type === 'pickup' ? 'text-cyan-400 mb-1.5' : 'text-slate-400 mb-1.5'} />
                      <p className="font-bold text-xs sm:text-sm text-white">Pickup</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">Kami jemput</p>
                    </button>
                    <button type="button"
                      onClick={() => setForm({ ...form, booking_type: 'dropoff' })}
                      className={`p-3 sm:p-4 rounded-2xl border-2 text-left transition-all ${
                        form.booking_type === 'dropoff'
                          ? 'border-cyan-500/60 bg-cyan-500/10'
                          : 'border-white/10 hover:border-white/20 bg-white/5'
                      }`}>
                      <Package size={20} className={form.booking_type === 'dropoff' ? 'text-cyan-400 mb-1.5' : 'text-slate-400 mb-1.5'} />
                      <p className="font-bold text-xs sm:text-sm text-white">Drop-off</p>
                      <p className="text-[10px] sm:text-xs text-slate-400">Antar sendiri</p>
                    </button>
                  </div>
                </Field>

                {form.booking_type === 'pickup' && (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 animate-[fadeIn_0.3s_ease]">
                    <Field label="Tanggal *" error={errors.pickup_date}>
                      <input
                        type="date"
                        value={form.pickup_date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setForm({ ...form, pickup_date: e.target.value })}
                        className="input-dark"
                      />
                    </Field>
                    <Field label="Jam *" error={errors.pickup_time}>
                      <input
                        type="time"
                        value={form.pickup_time}
                        onChange={e => setForm({ ...form, pickup_time: e.target.value })}
                        className="input-dark"
                      />
                    </Field>
                  </div>
                )}

                <Field label="Catatan (opsional)">
                  <textarea
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Misal: pisahkan pakaian putih, jangan pakai pelicin"
                    rows={3}
                    className="input-dark resize-none"
                  />
                </Field>

                <WarningBox />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4 sm:space-y-5 animate-[fadeIn_0.3s_ease]">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Konfirmasi Booking</h2>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2.5 sm:space-y-3 text-sm">
                  <Row label="Nama" value={form.name} />
                  <Row label="WhatsApp" value={form.phone} />
                  {form.address && <Row label="Alamat" value={form.address} />}
                  <Row label="Metode" value={form.booking_type === 'pickup' ? 'Pickup' : 'Drop-off'} />
                  {form.booking_type === 'pickup' && form.pickup_date && (
                    <Row
                      label="Jadwal"
                      value={`${new Date(form.pickup_date).toLocaleDateString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric'
                      })} • ${form.pickup_time}`}
                    />
                  )}
                  {form.notes && <Row label="Catatan" value={form.notes} />}
                </div>

                <div className="border-t border-white/10 pt-4">
                  <h3 className="font-bold text-white mb-3 text-sm sm:text-base">Rincian Layanan</h3>
                  <div className="space-y-2">
                    {form.items.map(item => (
                      <div key={item.service.id} className="flex justify-between gap-3 text-xs sm:text-sm">
                        <span className="text-slate-400 truncate">
                          {item.service.icon} {item.service.name} × {item.qty} {item.service.unit}
                        </span>
                        <span className="font-semibold text-white whitespace-nowrap">
                          {formatRp(item.service.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex justify-between items-center">
                  <span className="font-semibold text-slate-300 text-sm sm:text-base">Total Bayar</span>
                  <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {formatRp(total)}
                  </span>
                </div>

                <WarningBox />
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-3 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/10">
              <button type="button" onClick={back} disabled={step === 1}
                className="px-4 sm:px-6 py-3 rounded-xl font-semibold text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition text-sm">
                <ArrowLeft size={16} /> <span className="hidden sm:inline">Kembali</span>
              </button>

              {step < 4 ? (
                <button type="button" onClick={next}
                  className="px-6 sm:px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-blue-500/30 text-sm">
                  Lanjut <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={submitting}
                  className="px-6 sm:px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 text-sm">
                  {submitting ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Konfirmasi
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Butuh bantuan? <a href="https://wa.me/6281234567890" className="text-cyan-400 hover:underline">Chat WhatsApp</a>
          </p>
        </div>
      </div>

      <style>{`
        .input-dark {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 0.75rem;
          outline: none;
          transition: all 0.2s;
          font-size: 0.875rem;
          background: rgba(255,255,255,0.05);
          color: white;
        }
        .input-dark::placeholder {
          color: #64748b;
        }
        .input-dark:focus {
          border-color: rgba(34,211,238,0.5);
          box-shadow: 0 0 0 3px rgba(34,211,238,0.1);
          background: rgba(255,255,255,0.08);
        }
        .input-dark[type="date"]::-webkit-calendar-picker-indicator,
        .input-dark[type="time"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

/* ============ MINI NAVBAR ============ */
function MiniNavbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/30 group-hover:scale-110 transition">
            🧺
          </div>
          <div className="font-bold text-base sm:text-lg text-white">
            LaundryKu
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">.</span>
          </div>
        </Link>

        <Link to="/"
          className="flex items-center gap-2 text-slate-400 hover:text-white transition text-xs sm:text-sm">
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Kembali ke Home</span>
          <span className="inline sm:hidden">Home</span>
        </Link>
      </div>
    </nav>
  );
}

/* ============ FIELD ============ */
function Field({ label, children, error }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-1.5 sm:mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-400 text-[11px] sm:text-xs mt-1.5 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  );
}

/* ============ ROW ============ */
function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-slate-500 text-xs sm:text-sm flex-shrink-0">{label}</span>
      <span className={`text-right break-words min-w-0 ${
        bold ? 'font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent text-base sm:text-lg' :
        'text-white font-medium text-xs sm:text-sm'
      }`}>
        {value}
      </span>
    </div>
  );
}