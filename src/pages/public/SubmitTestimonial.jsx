import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  Search, Star, ArrowRight, CheckCircle2,
  Loader, AlertCircle, Sparkles,
} from 'lucide-react';
import PublicNavbar from '../../components/public/PublicNavbar';
import toast from 'react-hot-toast';

const STEPS = { INPUT: 'input', FORM: 'form', SUCCESS: 'success' };

export default function SubmitTestimonial() {
  const [step, setStep] = useState(STEPS.INPUT);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({
    customer_name: '',
    customer_city: '',
    rating: 5,
    text: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const resetError = () => setError('');

  const handleSearch = async (e) => {
    e.preventDefault();
    resetError();

    if (!code.trim()) return;

    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('id, code, status, customer_id, customers(name)')
        .eq('code', code.toUpperCase().trim())
        .maybeSingle();

      if (err) throw err;

      if (!data) {
        setError('Kode order tidak ditemukan. Cek lagi ya.');
        return;
      }

      if (data.status !== 'selesai') {
        setError(
          `Order ini belum selesai (status: ${data.status}). Testimoni bisa diisi setelah order selesai.`
        );
        return;
      }

      const { data: existing } = await supabase
        .from('testimonials')
        .select('id')
        .eq('order_id', data.id)
        .maybeSingle();

      if (existing) {
        setError('Order ini sudah pernah di-testimoni. Terima kasih!');
        return;
      }

      setOrder(data);
      setForm((f) => ({
        ...f,
        customer_name: data.customers?.name || '',
      }));
      setStep(STEPS.FORM);
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan. Coba lagi ya.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetError();

    if (!form.customer_name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    if (!form.customer_city.trim()) {
      setError('Kota wajib diisi.');
      return;
    }
    if (form.text.trim().length < 10) {
      setError('Testimoni minimal 10 karakter.');
      return;
    }
    if (form.text.trim().length > 500) {
      setError('Testimoni maksimal 500 karakter.');
      return;
    }

    setSubmitting(true);
    try {
      const { error: err } = await supabase.from('testimonials').insert({
        order_id: order.id,
        customer_name: form.customer_name.trim(),
        customer_city: form.customer_city.trim(),
        rating: form.rating,
        text: form.text.trim(),
        status: 'pending',
      });

      if (err) throw err;

      setStep(STEPS.SUCCESS);
      toast.success('Testimoni terkirim!');
    } catch (err) {
      console.error(err);
      setError('Gagal mengirim testimoni. Coba lagi ya.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse"
        style={{ animationDelay: '1s' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="relative">
        <PublicNavbar />

        <div className="pt-28 pb-16 px-6">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-5xl mb-2">⭐</div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Bagikan Pengalaman
              </h1>
              <p className="text-slate-400 mt-2">
                Ceritakan pengalaman laundry Anda untuk membantu kami lebih baik
              </p>
            </div>

            {step !== STEPS.SUCCESS && (
              <div className="flex items-center justify-center gap-3 mb-6">
                <StepDot active={step === STEPS.INPUT} done={step !== STEPS.INPUT} n={1} label="Kode Order" />
                <div className={`h-0.5 w-8 ${step === STEPS.FORM ? 'bg-cyan-500' : 'bg-white/10'}`} />
                <StepDot active={step === STEPS.FORM} done={false} n={2} label="Testimoni" />
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/30 text-red-300 p-4 rounded-2xl mb-4 flex items-start gap-2">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {step === STEPS.INPUT && (
              <form
                onSubmit={handleSearch}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kode Order
                </label>
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Contoh: LDY-0001"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/10 transition uppercase font-mono mb-4"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={loading || !code.trim()}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
                >
                  {loading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
                  {loading ? 'Mencari...' : 'Cari Order'}
                </button>
                <p className="text-xs text-slate-500 text-center mt-4">
                  Kode order ada di struk / WhatsApp konfirmasi
                </p>
              </form>
            )}

            {step === STEPS.FORM && order && (
              <form
                onSubmit={handleSubmit}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                  <div>
                    <p className="text-xs text-slate-400">Order</p>
                    <p className="text-white font-bold font-mono">{order.code}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    ✓ Selesai
                  </span>
                </div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nama <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  placeholder="Nama Anda"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/10 transition mb-4"
                  required
                />

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Kota <span className="text-red-400">*</span>
                </label>
                <input
                  value={form.customer_city}
                  onChange={(e) => setForm({ ...form, customer_city: e.target.value })}
                  placeholder="Contoh: Jakarta Selatan"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/10 transition mb-4"
                  required
                />

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Rating <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      className="transition hover:scale-110"
                      aria-label={`${n} bintang`}
                    >
                      <Star
                        size={32}
                        className={
                          n <= form.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-600'
                        }
                      />
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Testimoni <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Ceritakan pengalaman Anda... (min 10, maks 500 karakter)"
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl outline-none focus:border-cyan-500/50 focus:bg-white/10 transition resize-none mb-2"
                  required
                />
                <p className="text-xs text-slate-500 text-right mb-4">
                  {form.text.length}/500
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition"
                >
                  {submitting ? (
                    <>
                      <Loader size={18} className="animate-spin" /> Mengirim...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> Kirim Testimoni
                    </>
                  )}
                </button>
              </form>
            )}

            {step === STEPS.SUCCESS && (
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <CheckCircle2 size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Terima Kasih! 🎉</h2>
                <p className="text-slate-400 mb-6">
                  Testimoni Anda sudah kami terima dan akan direview oleh tim kami sebelum
                  ditampilkan di website.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition"
                >
                  Kembali ke Beranda <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepDot({ active, done, n, label }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
          done
            ? 'bg-green-500 text-white'
            : active
            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/30'
            : 'bg-white/5 border border-white/10 text-slate-500'
        }`}
      >
        {done ? '✓' : n}
      </div>
      <span className={`text-xs ${active || done ? 'text-white' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );
}