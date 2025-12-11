# Panduan Instalasi - Sistem Absensi Sekolah

## Prasyarat Sistem

- Node.js versi 18.0 atau lebih baru
- npm (Node Package Manager) versi 8.0 atau lebih baru
- Git untuk pengambilan kode sumber

## Langkah Instalasi

### 1. Clone atau Unduh Proyek

Jika Anda memiliki akses ke repository:
```bash
git clone <url-repository>
cd attendance-web
```

Jika Anda mendapatkan file WPA (Web Project Archive):
1. Ekstrak file ke direktori tujuan
2. Buka terminal dan arahkan ke direktori hasil ekstraksi

### 2. Instal Dependensi

Jalankan perintah berikut untuk menginstal semua dependensi yang diperlukan:
```bash
npm install
```

### 3. Konfigurasi Lingkungan

1. Buat file `.env.local` di direktori root proyek
2. Tambahkan konfigurasi database PostgreSQL:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/attendance_db
JWT_SECRET=your_jwt_secret_key
```

Ganti dengan informasi koneksi database PostgreSQL Anda dan buat kunci JWT yang kuat.

### 4. Konfigurasi Database

1. Pastikan Anda memiliki PostgreSQL yang berjalan di sistem Anda
2. Buat database baru untuk aplikasi ini
3. Jalankan migrasi Prisma untuk membuat tabel-tabel yang diperlukan:

```bash
npx prisma migrate dev
```

Atau jika Anda ingin menjalankan migrasi secara manual, Anda bisa menggunakan file SQL yang tersedia di direktori `database/migrations/`

Pastikan semua migrasi berhasil dijalankan tanpa error.

### 5. Jalankan Aplikasi

Untuk menjalankan aplikasi dalam mode pengembangan:
```bash
npm run dev
```

Aplikasi akan tersedia di:
- http://localhost:3000

Untuk produksi, buat build terlebih dahulu:
```bash
npm run build
```

Kemudian jalankan:
```bash
npm start
```

## Konfigurasi Tambahan

### Pengguna Awal
Setelah migrasi database selesai, pengguna awal akan otomatis dibuat:
- **Superadmin (Kepala Sekolah)**: 
  - Email: `kepalasekolah@example.com`
  - Password: (atur saat login pertama kali)

- **Admin (Guru)**:
  - Email: `guru@example.com`
  - Password: (atur saat login pertama kali)

- **User (Murid)**:
  - Email: `murid@example.com`
  - Password: (atur saat login pertama kali)

### Pengaturan Barcode
- Sistem menggunakan nomor induk sebagai nilai barcode
- Barcode akan otomatis dibuat berdasarkan nomor induk pengguna

## Deploy ke Produksi

Jika Anda ingin mendeploy ke platform seperti Vercel:

1. Pastikan Anda telah mengkonfigurasi variabel lingkungan
2. Gunakan build command: `npm run build`
3. Set output directory ke `out`
4. Tambahkan variabel lingkungan di platform deploy

## Troubleshooting

### Error saat npm install
- Pastikan Node.js dan npm terinstal dengan benar
- Coba gunakan perintah: `npm install --legacy-peer-deps`

### Error koneksi Supabase
- Pastikan URL dan API key di file `.env.local` benar
- Pastikan firewall tidak memblokir koneksi ke Supabase

### Masalah barcode
- Pastikan kamera memiliki izin untuk diakses
- Gunakan HTTPS untuk fitur pemindaian (termasuk localhost)

## Dukungan

Jika mengalami masalah selama instalasi, silakan:
1. Pastikan semua prasyarat terpenuhi
2. Cek kembali konfigurasi lingkungan
3. Pastikan database telah benar-benar terkonfigurasi