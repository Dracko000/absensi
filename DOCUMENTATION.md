# Dokumentasi Aplikasi - Sistem Absensi Sekolah

## Struktur Proyek

```
attendance-web/
├── database/
│   ├── migrations/
│   │   ├── 01_create_tables.sql
│   │   └── 02_create_policies.sql
│   └── README.md
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── dashboard-superadmin/
│   │   ├── dashboard-guru/
│   │   ├── dashboard-murid/
│   │   ├── absensi-guru/
│   │   ├── absensi-murid/
│   │   ├── riwayat-absensi/
│   │   ├── riwayat-kehadiran/
│   │   ├── manajemen-guru/
│   │   ├── manajemen-murid/
│   │   ├── laporan/
│   │   ├── laporan-harian/
│   │   ├── barcode/
│   │   ├── about/
│   │   └── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── BarcodeScanner.tsx
│   │   └── BarcodeGenerator.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   ├── supabaseServer.ts
│   │   ├── authUtils.ts
│   │   └── excelUtils.ts
│   └── types/
│       └── index.ts
├── public/
├── .env.local
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
├── INSTALL.md
└── tsconfig.json
```

## Arsitektur Aplikasi

### 1. Database (Supabase)
- **users**: Tabel untuk menyimpan informasi pengguna (guru dan murid)
- **attendance_records**: Tabel untuk menyimpan catatan kehadiran
- **Enums**: user_role (superadmin, admin, user) dan attendance_type (guru, murid)

### 2. Sistem Otentikasi
- Menggunakan Supabase Auth untuk manajemen sesi
- Tiga level izin akses berdasarkan peran pengguna
- Middleware untuk proteksi rute berdasarkan peran

### 3. Komponen Utama
- **AuthContext**: Menyediakan status otentikasi di seluruh aplikasi
- **Header/Sidebar**: Komponen navigasi yang berbeda berdasarkan peran
- **BarcodeScanner**: Untuk memindai kode batang
- **BarcodeGenerator**: Untuk menampilkan dan mencetak barcode

## Fungsi Utama

### 1. Kepala Sekolah (Superadmin)
- Mengelola pengguna (guru dan murid)
- Mencatat dan melihat kehadiran guru
- Melihat laporan kehadiran guru dan murid
- Mengekspor data kehadiran ke Excel

### 2. Guru (Admin)
- Mencatat kehadiran murid di kelasnya
- Melihat riwayat kehadiran murid
- Membuat laporan harian kehadiran
- Mengekspor laporan ke Excel

### 3. Murid (User)
- Melihat riwayat kehadiran sendiri
- Melihat dan mencetak barcode identitas

## Teknologi yang Digunakan

### Frontend
- **Next.js 16**: Framework React untuk aplikasi web
- **TypeScript**: Penambahan tipe statis untuk JavaScript
- **Tailwind CSS**: Framework CSS untuk styling
- **Headless UI**: Komponen UI tanpa styling bawaan

### Backend
- **Supabase**: Backend sebagai layanan (BaaS) dengan PostgreSQL
- **Supabase Auth**: Sistem otentikasi bawaan
- **Rust/WASM**: Untuk pemrosesan barcode

### Lainnya
- **Zxing**: Pemindai barcode
- **JsBarcode**: Generator barcode
- **XLSX**: Ekspor ke Excel

## API dan Integrasi

### Supabase Konfigurasi
- Row Level Security (RLS) diaktifkan untuk proteksi data
- Kebijakan berdasarkan peran pengguna
- Otentikasi berbasis session

### Ekspor Data
- Fungsi untuk konversi data ke format Excel
- Filter data sebelum ekspor
- Nama file dinamis berdasarkan parameter filter

## Keamanan

- Otentikasi wajib untuk akses halaman terproteksi
- Pembatasan akses berdasarkan peran pengguna
- Row Level Security di Supabase mencegah akses data tidak sah
- Enkripsi password otomatis oleh Supabase Auth

## Deployment

Aplikasi siap untuk dideploy ke platform hosting modern seperti:
- Vercel
- Netlify
- AWS Amplify
- Atau server Node.js sendiri

Pastikan konfigurasi lingkungan disesuaikan dengan lingkungan production.