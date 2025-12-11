'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import sql from '@/lib/neonClient';

// Define AttendanceType as both type and constant for runtime usage
type AttendanceType = 'guru' | 'murid';

// Create runtime object
const AttendanceType = {
  guru: 'guru' as const,
  murid: 'murid' as const,
};

export default function RiwayatKehadiranPage() {
  const router = useRouter();
  const { userRole, loading, userDetails } = useAuth();
  const [absensiRecords, setAbsensiRecords] = useState<any[]>([]);
  const [filterTanggal, setFilterTanggal] = useState<string>('');

  useEffect(() => {
    if (!loading && userRole !== 'user') {
      router.push('/login');
    } else if (!loading && userDetails?.id) {
      fetchAbsensiRecords();
    }
  }, [userRole, loading, userDetails?.id, filterTanggal]);

  const fetchAbsensiRecords = async () => {
    if (!userDetails?.id) return;

    try {
      // Only user (student) should see their own attendance records
      if (userDetails.role === 'user') {
        let result;
        if (filterTanggal) {
          // Filter by specific date
          result = await sql`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                             FROM attendance_records ar
                             JOIN users u ON ar.userId = u.id
                             WHERE ar.userId = ${userDetails.id} AND ar.tanggal::date = ${filterTanggal}::date
                             ORDER BY ar.tanggal DESC`;
        } else {
          // Get all records for the user
          result = await sql`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                             FROM attendance_records ar
                             JOIN users u ON ar.userId = u.id
                             WHERE ar.userId = ${userDetails.id}
                             ORDER BY ar.tanggal DESC`;
        }

        setAbsensiRecords(result);
      } else {
        // Admin or superadmin shouldn't be on this page
        setAbsensiRecords([]);
      }
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      alert('Gagal memuat riwayat kehadiran: ' + error.message);
    }
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
      <Sidebar userRole="user" />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Riwayat Kehadiran Saya</h1>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter Tanggal</label>
                <input
                  type="date"
                  value={filterTanggal}
                  onChange={(e) => setFilterTanggal(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchAbsensiRecords}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jam Masuk
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {absensiRecords.length > 0 ? (
                    absensiRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(record.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.jamMasuk ? new Date(record.jamMasuk).toLocaleTimeString('id-ID') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Hadir
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {record.keterangan || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada data kehadiran ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Statistik Kehadiran</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700">Total Hadir</h3>
                <p className="text-3xl font-bold text-blue-700 mt-2">{absensiRecords.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-700">Bulan Ini</h3>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {absensiRecords.filter(r => {
                    const recordDate = new Date(r.tanggal);
                    const now = new Date();
                    return recordDate.getMonth() === now.getMonth() &&
                           recordDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-700">Terakhir Hadir</h3>
                <p className="text-lg font-bold text-purple-700 mt-2">
                  {absensiRecords.length > 0
                    ? new Date(absensiRecords[0].tanggal).toLocaleDateString('id-ID')
                    : 'Belum pernah hadir'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}