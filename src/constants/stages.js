// constants/stages.js
export const STAGES = {
  baru: {
    label: 'Baru',
    icon: '📥',
    status: 'Antri',
    progress: 25,
    statusColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    glowColor: 'bg-yellow-500',
    barColor: 'bg-gradient-to-r from-yellow-500 to-orange-400',
    title: 'Order Diterima',
    desc: 'Kurir dalam perjalanan pickup',
  },
  proses: {
    label: 'Proses',
    icon: '🌀',
    status: 'Diproses',
    progress: 60,
    statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    glowColor: 'bg-blue-500',
    barColor: 'bg-gradient-to-r from-blue-500 to-cyan-400',
    title: 'Sedang Dicuci',
    desc: 'Selesai dalam ~2 jam',
  },
  siap: {
    label: 'Siap',
    icon: '✨',
    status: 'Siap Diambil',
    progress: 100,
    statusColor: 'bg-green-500/20 text-green-400 border-green-500/30',
    glowColor: 'bg-green-500',
    barColor: 'bg-gradient-to-r from-green-500 to-emerald-400',
    title: 'Siap Dikirim!',
    desc: 'Kurir menuju lokasi Anda',
  },
};

export const STAGE_ORDER = ['baru', 'proses', 'siap'];

// Helper biar konsisten dipakai di mana-mana
export function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
}