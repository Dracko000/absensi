'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { getAttendanceRecords } from '@/actions';

// Define AttendanceType as both type and constant for runtime usage
type AttendanceType = 'guru' | 'murid';

// Create runtime object
const AttendanceType = {
  guru: 'guru' as const,
  murid: 'murid' as const,
};

export default function RiwayatAbsensiPage() {
  const router = useRouter();
  const { userRole, loading, userDetails } = useAuth();
  const [absensiRecords, setAbsensiRecords] = useState<any[]>([]);
  const [filterTanggal, setFilterTanggal] = useState<string>('');
  const [filterJenis, setFilterJenis] = useState<AttendanceType | ''>('');

  useEffect(() => {
    if (!loading && !['admin', 'superadmin'].includes(userRole || '')) {
      router.push('/login');
    } else if (!loading) {
      fetchAbsensiRecords();
    }
  }, [userRole, loading, filterTanggal, filterJenis]);

  const fetchAbsensiRecords = async () => {
    try {
      // Build the query based on user role and filters
      let query: any[];
      if (userRole === 'admin') {
        // Admin (Guru) can only see student attendance
        query = await getAttendanceRecords(null, filterTanggal || null, filterJenis || null);
        // Filter for user role only
        query = query.filter((record: any) => record.role === 'user');
      } else if (userRole === 'superadmin') {
        // Superadmin can see all attendance (teacher and student)
        query = await getAttendanceRecords(null, filterTanggal || null, filterJenis || null);
      } else {
        query = [];
      }

      setAbsensiRecords(query);
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      alert('Gagal memuat riwayat absensi: ' + error.message);
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
      <Sidebar userRole={userRole as 'admin' | 'superadmin' | 'user'} />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {userRole === 'admin' ? 'Riwayat Absensi Murid' : 'Riwayat Absensi'}
          </h1>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter Tanggal</label>
                <input
                  type="date"
                  value={filterTanggal}
                  onChange={(e) => setFilterTanggal(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              {userRole === 'superadmin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter Jenis</label>
                  <select
                    value={filterJenis}
                    onChange={(e) => setFilterJenis(e.target.value as AttendanceType | '')}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Semua Jenis</option>
                    <option value="guru">Guru</option>
                    <option value="murid">Murid</option>
                  </select>
                </div>
              )}

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
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nomor Induk
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jam Masuk
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {absensiRecords.length > 0 ? (
                    absensiRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.user?.namaLengkap || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.user?.nomorInduk || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(record.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.jamMasuk ? new Date(record.jamMasuk).toLocaleTimeString('id-ID') : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {record.keterangan || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${record.jenisAbsensi === 'guru' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {record.jenisAbsensi === 'guru' ? 'Guru' : 'Murid'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada data absensi ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}