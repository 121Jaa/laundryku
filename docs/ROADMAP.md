# 🗺️ Roadmap — LaundryKu Express

Rencana pengembangan fitur ke depan.

---

## ✅ Selesai (v1.0)

### Public
- [x] Landing page interaktif (glassmorphism dark)
- [x] Booking multi-step (4 langkah)
- [x] Tracking order publik
- [x] WhatsApp notif otomatis

### Staff
- [x] Login multi-role
- [x] Dashboard real-time
- [x] Order walk-in
- [x] Daftar order + filter
- [x] Database pelanggan
- [x] Modul pengiriman (kurir)
- [x] Laporan dengan grafik

### Tech
- [x] Supabase (PostgreSQL + Auth + Realtime)
- [x] PWA (installable di HP)
- [x] Dark theme konsisten
- [x] Mobile-friendly

---

## 🚧 Dalam Pengerjaan (v1.1)

### Fitur
- [ ] **Print struk thermal** (58mm/80mm)
- [ ] **Export Excel** laporan
- [ ] **Filter tanggal** di halaman orders
- [ ] **Detail order page** (klik order → lihat lengkap)
- [ ] **Edit order** (ubah berat/qty setelah input)
- [ ] **Batal order** (soft delete)

### UI/UX
- [ ] Animasi transisi antar halaman
- [ ] Skeleton loading
- [ ] Empty state ilustrasi
- [ ] Onboarding tour untuk first-time user

### Tech
- [ ] Error boundary
- [ ] Retry logic untuk network error
- [ ] Offline support (PWA cache)
- [ ] Auto-save draft booking

---

## 📅 Q1 2027 — Business Features

### Payment
- [ ] **QRIS instant** (Midtrans/Xendit)
- [ ] **Payment link** via WhatsApp
- [ ] **Auto-verify** pembayaran transfer
- [ ] **Riwayat pembayaran** di customer

### Membership
- [ ] **Poin loyalitas** (10x order → 1 gratis)
- [ ] **Member tier** (silver, gold, platinum)
- [ ] **Voucher & promo**
- [ ] **Referral program**

### Reports
- [ ] **Export PDF** laporan bulanan
- [ ] **Comparison bulan** (bulan ini vs lalu)
- [ ] **Forecast** pendapatan
- [ ] **Detail per layanan** (revenue, qty, margin)

---

## 📅 Q2 2027 — Mobile & Scale

### Mobile App
- [ ] **React Native app** (Android + iOS)
- [ ] Push notifications
- [ ] Camera untuk foto before/after
- [ ] Offline mode untuk kurir

### Multi-Outlet
- [ ] Support multiple outlet per organisasi
- [ ] Transfer order antar outlet
- [ ] Laporan per outlet
- [ ] Dashboard owner (overview semua outlet)

### Inventory
- [ ] Manajemen stok (detergen, plastik, hanger)
- [ ] Alert stok menipis
- [ ] Purchase order otomatis
- [ ] Cost tracking per order

---

## 📅 Q3 2027 — SaaS & Franchise

### Multi-Tenant SaaS
- [ ] **Subdomain** per klien (`budi.laundryku.com`)
- [ ] **Signup page** publik (self-service trial)
- [ ] **Onboarding wizard** otomatis
- [ ] **Billing integration** (auto-charge)
- [ ] **Super admin dashboard** untuk lu

### Franchise
- [ ] Sistem **franchisee** (multi-owner)
- [ ] **Revenue sharing** otomatis
- [ ] **Central kitchen** untuk laundry
- [ ] **Standar SOP** digital

### B2B
- [ ] **Kontrak B2B** (hotel, RS, asrama)
- [ ] **Invoicing bulanan** otomatis
- [ ] **Pickup schedule** rutin
- [ ] **API** untuk integrasi pihak ketiga

---

## 📅 Q4 2027 — Advanced & AI

### AI Features
- [ ] **Chatbot WhatsApp** untuk customer service
- [ ] **Prediksi waktu selesai** (berdasarkan beban kerja)
- [ ] **Auto-assign kurir** (berdasarkan lokasi)
- [ ] **Deteksi anomali** (order mencurigakan)

### Analytics
- [ ] **Customer segmentation** (aktif, pasif, churn)
- [ ] **Retention analysis**
- [ ] **Cohort analysis**
- [ ] **A/B testing** untuk landing page

### Integrations
- [ ] **Google Maps API** (rute optimal kurir)
- [ ] **WhatsApp Business API** (Fonnte/Wablas)
- [ ] **Telegram bot** untuk staff
- [ ] **Slack/Teams** untuk notif internal

---

## 💡 Fitur yang Mungkin Ditambah (Nice to Have)

- **Face recognition** untuk pickup (verify customer)
- **IoT integration** (sensor berat di mesin)
- **Blockchain** untuk tracking chain-of-custody
- **Voice command** untuk kasir
- **AR preview** (lihat cucian sebelum pickup)

---

## 🎯 Prioritas Saat Ini

**Fokus 3 bulan ke depan:**

1. **Print struk** — wajib untuk walk-in
2. **Detail order page** — UX improvement
3. **QRIS payment** — modernisasi pembayaran
4. **Multi-outlet** — buat scale-up

**Setelah 5-10 klien puas:**
- Migrasi ke **SaaS multi-tenant**
- Billing integration
- Self-service signup

---

## 🤝 Kontribusi

Mau bantu develop fitur di roadmap ini? 

1. Pilih fitur yang mau dikerjain
2. Buat branch baru
3. Commit changes
4. Buat Pull Request

Atau diskusi dulu di **GitHub Issues**.

---

## 📞 Update & Feedback

- **Changelog:** Lihat file `CHANGELOG.md` (akan datang)
- **Feature request:** Buat issue di GitHub
- **Bug report:** WhatsApp developer langsung

---

<p align="center">
  🚀 Keep building, keep shipping!
</p>