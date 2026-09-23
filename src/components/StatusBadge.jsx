const styles = {
  antri: 'bg-yellow-100 text-yellow-700',
  proses: 'bg-blue-100 text-blue-700',
  siap: 'bg-green-100 text-green-700',
  dikirim: 'bg-purple-100 text-purple-700',
  selesai: 'bg-slate-100 text-slate-600',
};

const labels = {
  antri: 'Antri',
  proses: 'Proses',
  siap: 'Siap Diambil',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {labels[status] || status}
    </span>
  );
}