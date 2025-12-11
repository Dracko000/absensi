import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sistem Absensi Sekolah
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Aplikasi absensi berbasis web yang dirancang khusus untuk memudahkan manajemen kehadiran guru dan murid di lingkungan sekolah.
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Fitur Utama</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700">Multi Level User</h3>
                <p className="text-sm text-gray-600 mt-2">Tiga tingkat pengguna: Kepala Sekolah, Guru, dan Murid</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-700">Absensi Barcode</h3>
                <p className="text-sm text-gray-600 mt-2">Gunakan barcode untuk proses absensi cepat dan akurat</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-700">Laporan Excel</h3>
                <p className="text-sm text-gray-600 mt-2">Ekspor data absensi harian, mingguan, dan bulanan ke Excel</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/login" 
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Masuk ke Sistem
            </Link>
            <Link 
              href="/about" 
              className="px-6 py-3 bg-white text-indigo-600 border border-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Sistem Absensi Sekolah. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
}