'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { exportToExcel, formatAttendanceForExport } from '@/lib/excelUtils';
import getNeonClient from '@/lib/neonClient';
const sql = getNeonClient();

// Define AttendanceType as both type and constant for runtime usage
type AttendanceType = 'guru' | 'murid';

// Create runtime object
const AttendanceType = {
  guru: 'guru' as const,
  murid: 'murid' as const,
};

export default function LaporanPage() {
  const router = useRouter();
  const { userRole, loading } = useAuth();
  const [absensiRecords, setAbsensiRecords] = useState<any[]>([]);
  const [filterJenis, setFilterJenis] = useState<AttendanceType | 'all'>('all');
  const [filterTanggal, setFilterTanggal] = useState<string>('');
  const [filterBulan, setFilterBulan] = useState<string>('');
  const [filterTahun, setFilterTahun] = useState<string>(new Date().getFullYear().toString());

  useEffect(() => {
    if (!loading && userRole !== 'superadmin') {
      router.push('/login');
    } else if (!loading) {
      fetchAbsensiRecords();
    }
  }, [userRole, loading, filterJenis, filterTanggal, filterBulan, filterTahun]);

  const fetchAbsensiRecords = async () => {
    try {
      // Get the database client
      const dbClient = getNeonClient();
      if (!dbClient) {
        alert('Database tidak tersedia');
        return;
      }

      // Build the query based on filters
      let query;

      if (filterTanggal) {
        // Filter by specific date
        if (filterJenis === 'all') {
          query = await dbClient`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                            FROM attendance_records ar
                            JOIN users u ON ar.userId = u.id
                            WHERE ar.tanggal::date = ${filterTanggal}::date
                            ORDER BY ar.tanggal DESC`;
        } else {
          query = await dbClient`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                            FROM attendance_records ar
                            JOIN users u ON ar.userId = u.id
                            WHERE ar.jenisAbsensi = ${filterJenis} AND ar.tanggal::date = ${filterTanggal}::date
                            ORDER BY ar.tanggal DESC`;
        }
      } else if (filterBulan && filterTahun) {
        // Filter by month and year
        const dateFilter = `${filterTahun}-${filterBulan}`;
        if (filterJenis === 'all') {
          query = await dbClient`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                            FROM attendance_records ar
                            JOIN users u ON ar.userId = u.id
                            WHERE ar.tanggal::text LIKE ${dateFilter + '%'}
                            ORDER BY ar.tanggal DESC`;
        } else {
          query = await dbClient`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                            FROM attendance_records ar
                            JOIN users u ON ar.userId = u.id
                            WHERE ar.jenisAbsensi = ${filterJenis} AND ar.tanggal::text LIKE ${dateFilter + '%'}
                            ORDER BY ar.tanggal DESC`;
        }
      } else {
        // No specific date filter - get all records
        if (filterJenis === 'all') {
          query = await dbClient`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                            FROM attendance_records ar
                            JOIN users u ON ar.userId = u.id
                            ORDER BY ar.tanggal DESC`;
        } else {
          query = await dbClient`SELECT ar.*, u.namaLengkap, u.nomorInduk, u.role
                            FROM attendance_records ar
                            JOIN users u ON ar.userId = u.id
                            WHERE ar.jenisAbsensi = ${filterJenis}
                            ORDER BY ar.tanggal DESC`;
        }
      }

      setAbsensiRecords(query);
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      alert('Gagal memuat data laporan: ' + error.message);
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
      filterJenis === 'all' ? undefined : (filterJenis as AttendanceType)
    );

    // Build filename based on filters
    let fileName = 'Laporan_Absensi';
    if (filterTanggal) {
      fileName += `_${filterTanggal}`;
    } else if (filterBulan) {
      fileName += `_${filterTahun}_${filterBulan}`;
    } else {
      fileName += '_Semua_Period';
    }

    if (filterJenis !== 'all') {
      fileName += `_${filterJenis === 'guru' ? 'Guru' : 'Murid'}`;
    }

    exportToExcel(formattedData, fileName);
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
      <Sidebar userRole="superadmin" />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Laporan Absensi</h1>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Filter Laporan</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Absensi</label>
                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value as AttendanceType | 'all')}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">Semua</option>
                  <option value="guru">Guru</option>
                  <option value="murid">Murid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Tertentu</label>
                <input
                  type="date"
                  value={filterTanggal}
                  onChange={(e) => {
                    setFilterTanggal(e.target.value);
                    // Clear month filter when date is selected
                    if (e.target.value) setFilterBulan('');
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter Bulan</label>
                <select
                  value={filterBulan}
                  onChange={(e) => {
                    setFilterBulan(e.target.value);
                    // Clear date filter when month is selected
                    if (e.target.value) setFilterTanggal('');
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Pilih Bulan</option>
                  <option value="01">Januari</option>
                  <option value="02">Februari</option>
                  <option value="03">Maret</option>
                  <option value="04">April</option>
                  <option value="05">Mei</option>
                  <option value="06">Juni</option>
                  <option value="07">Juli</option>
                  <option value="08">Agustus</option>
                  <option value="09">September</option>
                  <option value="10">Oktober</option>
                  <option value="11">November</option>
                  <option value="12">Desember</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <select
                  value={filterTahun}
                  onChange={(e) => setFilterTahun(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return (
                      <option key={year} value={year.toString()}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={fetchAbsensiRecords}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Terapkan Filter
              </button>

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
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {filterTanggal
                ? `Data Absensi Tanggal ${new Date(filterTanggal).toLocaleDateString('id-ID')}`
                : filterBulan
                ? `Data Absensi Bulan ${new Date(`${filterTahun}-${filterBulan}-01`).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`
                : 'Semua Data Absensi'}
            </h2>

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

            <div className="mt-6 text-sm text-gray-600">
              <p>Jumlah data: {absensiRecords.length} catatan</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}