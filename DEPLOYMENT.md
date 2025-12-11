# Sistem Absensi Sekolah

Aplikasi absensi berbasis web untuk sekolah dengan tiga tingkat pengguna: Kepala Sekolah (Superadmin), Guru (Admin), dan Murid (User). Sistem ini menggunakan barcode untuk proses absensi dan menyediakan laporan yang dapat diekspor ke Excel.

## Fitur Utama

- **Tiga Tingkat Pengguna**: Kepala Sekolah, Guru, dan Murid
- **Absensi Menggunakan Barcode**: Pemindaian cepat dan akurat
- **Manajemen Pengguna**: Tambah, edit, dan kelola pengguna
- **Laporan Lengkap**: Harian, mingguan, dan bulanan
- **Ekspor Excel**: Kemampuan ekspor data ke format Excel
- **Penyimpanan Barcode**: Barcode dapat dicetak dan digunakan berulang

## Teknologi yang Digunakan

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication)
- **Barcode**: Zxing for scanning, JsBarcode for generation
- **UI/UX**: Headless UI, Heroicons
- **Ekspor Excel**: xlsx library

## Instalasi

1. Clone repository ini:
```bash
git clone <repository-url>
cd attendance-web
```

2. Install dependensi:
```bash
npm install
```

3. Buat file `.env.local` dan tambahkan konfigurasi Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Jalankan aplikasi:
```bash
npm run dev
```

## Konfigurasi Database

1. Buat proyek di [Supabase](https://supabase.com)
2. Gunakan skema database dari folder `database/migrations/`
3. Terapkan migrasi SQL secara berurutan:
   - Jalankan `database/migrations/01_create_tables.sql`
   - Jalankan `database/migrations/02_create_policies.sql`
4. Perbarui file `.env.local` dengan URL dan anon key dari Supabase Anda

## Struktur Pengguna

- **Kepala Sekolah (Superadmin)**: Dapat mengelami semua data, termasuk absensi guru
- **Guru (Admin)**: Dapat mengelola absensi murid di kelasnya
- **Murid (User)**: Dapat melihat riwayat kehadirannya sendiri

## Deployment

Aplikasi siap untuk dideploy ke berbagai platform berkat konfigurasi berikut:

### Vercel (Rekomendasi)
1. Hubungkan repository ke Vercel
2. Atur environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Build command: `npm run build`
4. Output directory: `standalone` (Next.js standalone output)

### Docker
1. Gunakan file `Dockerfile` yang disertakan
2. Gunakan file `docker-compose.yml` untuk pengaturan cepat
3. Atur environment variables dalam file `.env.local`

## Pengguna Awal
Setelah migrasi database selesai, pengguna awal akan otomatis dibuat:
- **Superadmin (Kepala Sekolah)**:
  - Email: `kepalasekolah@example.com`
  - Password: (diatur saat login pertama kali)

- **Admin (Guru)**:
  - Email: `guru@example.com`
  - Password: (diatur saat login pertama kali)

- **User (Murid)**:
  - Email: `murid@example.com`
  - Password: (diatur saat login pertama kali)

## Kontribusi

Kontribusi sangat dihargai! Silakan buat pull request untuk perbaikan atau tambahan fitur.

## Lisensi

Proyek ini dilisensikan di bawah MIT License.