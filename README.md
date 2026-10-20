# 👑 Aish Catering Singkawang — Web Platform v2.0

Platform Web Katering Tradisional & Resepsi Pernikahan Warisan Budaya Singkawang, Kalimantan Barat. Dilengkapi Portal Konsumen VIP, Simulasi Racik Prasmanan, Keranjang & Checkout Berotentikasi, serta Dashboard Admin CMS Lengkap.

---

## 📁 Struktur Direktori Proyek

```
web_aishcateringv2/
│
├── index.html                   # 🏠 Landing Page & Beranda Resmi
├── menu.html                    # 🍽️ Katalog Lengkap Hidangan & Paket
├── login.html                   # 🔐 Portal Masuk & Pendaftaran Konsumen
├── menu-konsumen.html           # 👑 Portal Eksklusif Konsumen VIP & Simulasi Prasmanan
├── admin-dashboard.html         # ⚙️ Dashboard Admin & Pusat Kendali CMS Web
│
├── css/                         # 🎨 Berkas Gaya Tampilan (Modular CSS)
│   ├── style.css                # Desain Utama, Navbar, Hero, & Footer
│   ├── auth.css                 # Desain Halaman Login & Registrasi
│   ├── checkout.css             # Desain Keranjang & Formulir Checkout
│   ├── consumer-portal.css      # Desain Portal Eksklusif Konsumen VIP
│   └── admin-dashboard.css      # Desain Dark Emerald Dashboard Admin
│
├── js/                          # ⚡ Logika & Pengendali Sistem (JavaScript)
│   ├── app.js                   # Interaktivitas Beranda & Filter Katalog
│   ├── data.js                  # Database Lokal Menu, Testimoni & Add-on
│   ├── auth.js                  # Sistem Sesi, Login, & Role Pengguna
│   ├── session-nav.js           # Dropdown Avatar Profil Global di Navbar
│   ├── checkout.js              # Keranjang Persisten & Proteksi Login Checkout
│   ├── consumer-portal.js       # Kalkulator Porsi & Racik Menu Mandiri VIP
│   ├── admin-dashboard.js       # Pengendali Manajemen Pesanan, Menu & CMS
│   └── livereload.js            # Skrip Pembaruan Halaman Realtime
│
├── assets/                      # 🖼️ Aset Media Lokal
│   ├── images/                  # Foto Dokumentasi Resepsi, Hidangan & Dekorasi
│   ├── icons/                   # Ikon Grafis, Logo, & Lambang Halal
│   └── README.md                # Panduan Penempatan Aset
│
├── scripts/                     # 🛠️ Skrip Utilitas & Otomatisasi
│   └── auto-push.ps1            # Watcher Auto Commit & Push ke GitHub
│
├── START-AUTO-PUSH.bat          # 🚀 Pintasan Cepat Menjalankan Auto Push
├── vercel.json                  # ☁️ Konfigurasi Deployment Hosting Vercel
└── README.md                    # 📖 Dokumentasi Proyek
```

---

## 🔑 Akun Demo Pengujian

| Peran (Role) | Email / Username | Kata Sandi | Halaman Tujuan Setelah Login |
| :--- | :--- | :--- | :--- |
| **Konsumen VIP** | `pelanggan@aishcatering.com` | `aish123` | [`menu-konsumen.html`](menu-konsumen.html) & Pembelian Checkout |
| **Admin Pengelola** | `admin@aishcatering.com` | `admin123` | [`admin-dashboard.html`](admin-dashboard.html) |

---

## 🚀 Fitur Utama

1. **Katalog Hidangan & Prasmanan**: Menu adat pernikahan, tumpeng syukuran, bento kantor, dan stall live kambing guling khas Singkawang.
2. **Keranjang Belanja Persisten**: Data pesanan tersimpan di browser tanpa hilang saat berpindah halaman.
3. **Checkout Terproteksi Login**: Konsumen wajib memiliki akun untuk checkout, mendapatkan diskon 5% anggota VIP, dan memilih jadwal acara minimal H-3.
4. **Dashboard Admin (CMS)**:
   - Pantau omset dan status reservasi masuk (Menunggu, Dikonfirmasi, Diproses, Selesai).
   - Tambah, ubah, dan nonaktifkan menu di website publik.
   - Kalender reservasi acara per tanggal.
   - CMS untuk mengubah identitas usaha, WhatsApp, rekening bank, dan teks banner.
5. **Otomatisasi Deployment**:
   - Skrip `START-AUTO-PUSH.bat` memantau setiap pengeditan file secara lokal, otomatis melakukan *commit* dan *push* ke GitHub (`main`), memicu *redeploy* instan di Vercel.
