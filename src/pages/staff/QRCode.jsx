import { useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Copy, Printer, ExternalLink, QrCode as QrIcon, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QRCodePage() {
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  // URL otomatis dari origin (localhost saat dev, domain saat prod)
  const url = `${window.location.origin}/testimoni`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link dicopy!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal copy link');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* CSS khusus print — sembunyikan elemen selain poster */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area {
            position: absolute;
            left: 0; top: 0;
            width: 100%;
            padding: 2cm;
            background: white !important;
            color: black !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <header className="mb-6 no-print">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <QrIcon size={28} className="text-blue-600" />
            QR Code Testimoni
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Print dan tempel di outlet, atau kirim ke pelanggan
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ==== KIRI: QR PREVIEW ==== */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10">
              {/* Print area — yang muncul saat print */}
              <div
                ref={printRef}
                className="print-area bg-white max-w-md mx-auto text-center"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl">
                    🧺
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
                    Bagikan Pengalaman Anda
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Scan QR code di bawah untuk memberi testimoni
                  </p>
                </div>

                {/* QR */}
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 inline-block mb-6">
                  <QRCode
                    value={url}
                    size={220}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                  />
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-slate-800 font-semibold text-lg">
                    Scan dengan kamera HP
                  </p>
                  <p className="text-slate-500 text-sm">
                    atau kunjungi link di bawah ini
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Link:</p>
                  <p className="text-slate-800 font-mono text-xs break-all">
                    {url}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-400">
                    Terima kasih telah mempercayakan cucian Anda kepada kami 🙏
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-3 no-print">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-5 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-500/30"
              >
                <Printer size={18} />
                Print Poster
              </button>
              <button
                onClick={copyLink}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
              >
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                {copied ? 'Tercopy!' : 'Copy Link'}
              </button>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-semibold transition"
              >
                <ExternalLink size={18} />
                Buka Form
              </a>
            </div>
          </div>

          {/* ==== KANAN: INSTRUKSI ==== */}
          <div className="space-y-4 no-print">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                💡 Cara Pakai
              </h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex gap-2">
                  <span className="font-bold flex-shrink-0">1.</span>
                  <span>Klik <strong>Print Poster</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold flex-shrink-0">2.</span>
                  <span>Print ukuran <strong>A5</strong> atau <strong>A4</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold flex-shrink-0">3.</span>
                  <span>Tempel di <strong>meja kasir</strong> / area pickup</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold flex-shrink-0">4.</span>
                  <span>Minta pelanggan scan setelah order selesai</span>
                </li>
              </ol>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                ⚠️ Penting
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• QR ini <strong>statis</strong>, nggak akan berubah</li>
                <li>• Validasi tetap di form (cek kode order)</li>
                <li>• Cuma order <strong>selesai</strong> yang bisa di-testimoni</li>
                <li>• 1 order = 1 testimoni</li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h3 className="font-bold text-slate-800 mb-2">🔗 URL Aktif</h3>
              <p className="text-xs text-slate-500 mb-2">
                QR akan berisi URL ini:
              </p>
              <p className="text-xs font-mono text-slate-700 bg-white p-2 rounded-lg break-all border border-slate-200">
                {url}
              </p>
              <p className="text-[11px] text-slate-400 mt-2">
                Otomatis ngikutin domain kamu saat ini
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}