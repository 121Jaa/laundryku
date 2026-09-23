import { AlertTriangle } from 'lucide-react';

export default function WarningBox() {
  const items = [
    'Dengan order, Anda menyetujui Syarat & Ketentuan yang berlaku',
    'Pembayaran Cash / QRIS / Transfer Bank',
    'Estimasi waktu dimulai setelah konfirmasi order',
    'Komplain wajib video unboxing (max 1x24 jam)',
    'Kami tidak bertanggung jawab atas transfer di luar sistem resmi',
  ];

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-2xl">
      <div className="flex gap-3">
        <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-bold text-yellow-800 mb-2 text-sm">PERINGATAN</p>
          <ul className="text-xs text-yellow-800 space-y-1 list-disc list-inside">
            {items.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}