import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Tentang Sistem Absensi Sekolah</h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              Sistem Absensi Sekolah adalah aplikasi berbasis web yang dirancang khusus untuk 
              memudahkan proses pengelolaan kehadiran guru dan murid di lingkungan pendidikan.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Visi Kami</h2>
            <p className="text-gray-700 mb-6">
              Menjadi solusi teknologi terdepan dalam pengelolaan administrasi kehadiran 
              di institusi pendidikan, membantu meningkatkan efisiensi dan akurasi pelaporan kehadiran.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Fitur Utama</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li><strong>Multi-Level User:</strong> Tiga tingkat pengguna dengan otoritas berbeda</li>
              <li><strong>Absensi Menggunakan Barcode:</strong> Proses absensi cepat dan akurat</li>
              <li><strong>Laporan Terperinci:</strong> Laporan harian, mingguan, dan bulanan</li>
              <li><strong>Ekspor Excel:</strong> Kemampuan ekspor data ke format Excel</li>
              <li><strong>Penyimpanan Barcode:</strong> Barcode dapat disimpan dan dicetak</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Tingkatan Pengguna</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="border-l-4 border-indigo-500 pl-4 py-2">
                <h3 className="font-bold text-lg text-indigo-700">Kepala Sekolah (Superadmin)</h3>
                <p className="text-gray-600">Dapat mengelola semua data, termasuk absensi guru</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-bold text-lg text-green-700">Guru (Admin)</h3>
                <p className="text-gray-600">Dapat mengelola absensi murid di kelasnya</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <h3 className="font-bold text-lg text-purple-700">Murid (User)</h3>
                <p className="text-gray-600">Dapat melihat riwayat kehadirannya sendiri</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Teknologi yang Digunakan</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
              <li><strong>Frontend:</strong> Next.js 14 dengan TypeScript dan Tailwind CSS</li>
              <li><strong>Backend:</strong> PostgreSQL (using Prisma ORM)</li>
              <li><strong>Otentikasi:</strong> JWT-based authentication with bcrypt</li>
              <li><strong>UI Library:</strong> Headless UI dan Heroicons</li>
            </ul>
            
            <div className="flex justify-center mt-10">
              <Link 
                href="/login" 
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Mulai Menggunakan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}