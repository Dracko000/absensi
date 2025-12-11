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
- **Backend**: PostgreSQL (Prisma ORM)
- **Authentication**: JWT-based with bcrypt password hashing
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

3. Buat file `.env.local` dan tambahkan konfigurasi database:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/attendance_db
JWT_SECRET=your_jwt_secret_key
```

4. Jalankan aplikasi:
```bash
npm run dev
```

## Konfigurasi Database

1. Pastikan Anda memiliki PostgreSQL yang berjalan di sistem Anda
2. Buat database baru untuk aplikasi ini
3. Jalankan migrasi Prisma untuk membuat tabel-tabel yang diperlukan:

```bash
npx prisma migrate dev
```

Atau jika Anda ingin menjalankan migrasi secara manual, Anda bisa menggunakan file SQL yang tersedia di direktori `database/migrations/`

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