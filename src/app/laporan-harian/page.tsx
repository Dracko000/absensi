'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { exportToExcel, formatAttendanceForExport } from '@/lib/excelUtils';

export default function LaporanHarianPage() {
  const router = useRouter();
  const { userRole, loading } = useAuth();
  const [absensiRecords, setAbsensiRecords] = useState<any[]>([]);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (!loading && userRole !== 'admin') {
      router.push('/login');
    } else if (!loading) {
      fetchAbsensiRecords();
    }
  }, [userRole, loading, tanggal]);

  const fetchAbsensiRecords = async () => {
    try {
      // Database functionality is currently disabled
      console.warn("Database functionality disabled - using mock data");
      // Using mock data since database access is disabled
      // Admin (Guru) can only see student attendance for the day
      if (userRole === 'admin') {
        setAbsensiRecords([
          {
            id: 'mock-s1',
            userId: 'mock-student-1',
            tanggal: new Date(tanggal),
            jamMasuk: new Date(`${tanggal}T08:00:00`),
            jamKeluar: new Date(`${tanggal}T15:00:00`),
            jenisAbsensi: 'murid',
            barcode: 'mock-barcode',
            keterangan: 'Hadir',
            createdAt: new Date(),
            user: {
              id: 'mock-student-1',
              email: 'murid1@sekolah.test',
              password: '',
              namaLengkap: 'Murid Satu',
              nomorInduk: 'MURID001',
              role: 'user',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            id: 'mock-s2',
            userId: 'mock-student-2',
            tanggal: new Date(tanggal),
            jamMasuk: new Date(`${tanggal}T08:15:00`),
            jamKeluar: new Date(`${tanggal}T15:00:00`),
            jenisAbsensi: 'murid',
            barcode: 'mock-barcode',
            keterangan: 'Hadir',
            createdAt: new Date(),
            user: {
              id: 'mock-student-2',
              email: 'murid2@sekolah.test',
              password: '',
              namaLengkap: 'Murid Dua',
              nomorInduk: 'MURID002',
              role: 'user',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            id: 'mock-s3',
            userId: 'mock-student-3',
            tanggal: new Date(tanggal),
            jamMasuk: null, // Tidak masuk
            jamKeluar: null,
            jenisAbsensi: 'murid',
            barcode: 'mock-barcode',
            keterangan: 'Alfa',
            createdAt: new Date(),
            user: {
              id: 'mock-student-3',
              email: 'murid3@sekolah.test',
              password: '',
              namaLengkap: 'Murid Tiga',
              nomorInduk: 'MURID003',
              role: 'user',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        ]);
      } else {
        // Other roles shouldn't access this page
        setAbsensiRecords([]);
      }
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      alert('Gagal memuat data laporan harian: ' + error.message);
    }
  };

  const exportToExcelHandler = () => {
    if (absensiRecords.length === 0) {
      alert('Tidak ada data untuk diekspor');
      return;
    }

    // Format the data for export
    const formattedData = formatAttendanceForExport(
      absensiRecords,
      'murid'
    );

    const fileName = `Laporan_Harian_${tanggal.replace(/-/g, '')}`;

    exportToExcel(formattedData, fileName, 'Laporan Harian');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Memuat halaman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar userRole="admin" />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Laporan Harian Absensi Murid</h1>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Tanggal</label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchAbsensiRecords}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Muat Data
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={exportToExcelHandler}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Ekspor ke Excel
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Data Absensi Tanggal {new Date(tanggal).toLocaleDateString('id-ID')}
              </h2>
              <p className="text-gray-600">Jumlah: {absensiRecords.length} murid hadir</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama Murid
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nomor Induk
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jam Masuk
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {absensiRecords.length > 0 ? (
                    absensiRecords.map((record, index) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.user?.namaLengkap || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.user?.nomorInduk || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.jamMasuk ? new Date(record.jamMasuk).toLocaleTimeString('id-ID') : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {record.keterangan || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada data absensi ditemukan untuk tanggal ini
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {absensiRecords.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Ringkasan</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">Total Hadir</p>
                    <p className="text-xl font-bold text-indigo-600">{absensiRecords.length}</p>
                  </div>
                  <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">Tanggal</p>
                    <p className="text-sm font-medium">{new Date(tanggal).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}