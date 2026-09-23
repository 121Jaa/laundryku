import { forwardRef } from 'react'

const Receipt = forwardRef(({ order }, ref) => {
  if (!order) return null
  return (
    <div ref={ref} style={{ width: '58mm', padding: '4mm', fontFamily: 'monospace', fontSize: '11px', color: '#000', background: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>LAUNDRYKU</div>
        <div>Jl. Contoh No. 123</div>
        <div>Telp: 0812-3456-7890</div>
      </div>
      <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '4px 0', margin: '6px 0' }}>
        <Row label="Kode" value={order.code} />
        <Row label="Tanggal" value={new Date(order.created_at).toLocaleString('id-ID')} />
        <Row label="Pelanggan" value={order.customers?.name || order.customer_name} />
        <Row label="Telp" value={order.customers?.phone || order.phone} />
      </div>
      <div style={{ margin: '6px 0' }}>
        <Row label={order.services?.name} value={`${order.weight} ${order.services?.unit}`} />
        <Row label="Harga" value={`Rp ${order.services?.price?.toLocaleString('id-ID')}`} />
      </div>
      <div style={{ borderTop: '1px dashed #000', paddingTop: '4px', marginTop: '6px' }}>
        <Row label="TOTAL" value={`Rp ${order.total.toLocaleString('id-ID')}`} bold />
      </div>
      <div style={{ borderTop: '1px dashed #000', marginTop: '6px', paddingTop: '6px', textAlign: 'center' }}>
        <div>Estimasi Selesai:</div>
        <div style={{ fontWeight: 'bold' }}>{order.estimate_at ? new Date(order.estimate_at).toLocaleDateString('id-ID') : '-'}</div>
        <div style={{ marginTop: '8px' }}>Terima kasih 🧺</div>
        <div style={{ marginTop: '4px' }}>Lacak: /track/{order.code}</div>
      </div>
    </div>
  )
})

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: bold ? 'bold' : 'normal' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  )
}

Receipt.displayName = 'Receipt'
export default Receipt