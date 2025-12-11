'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BarcodeScanner from '@/components/BarcodeScanner';
import BarcodeGenerator from '@/components/BarcodeGenerator';
import sql from '@/lib/neonClient';

// Define AttendanceType as both type and constant for runtime usage
type AttendanceType = 'guru' | 'murid';

// Create runtime object
const AttendanceType = {
  guru: 'guru' as const,
  murid: 'murid' as const,
};

export default function AbsensiMuridPage() {
  const router = useRouter();
  const { userRole, loading, userDetails } = useAuth();
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [scannedBarcode, setScannedBarcode] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [absensiRecords, setAbsensiRecords] = useState<any[]>([]);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [keterangan, setKeterangan] = useState<string>('');

  useEffect(() => {
    if (!loading && userRole !== 'admin') {
      router.push('/login');
    }
  }, [userRole, loading, router]);

  useEffect(() => {
    if (scannedBarcode) {
      // Fetch user by barcode
      fetchUserByBarcode(scannedBarcode);
    }
  }, [scannedBarcode]);

  const fetchUserByBarcode = async (barcode: string) => {
    try {
      // Query the user from Neon database by barcode (which is stored as nomorInduk)
      const result = await sql`SELECT id, email, password, namaLengkap, nomorInduk, role, createdAt, updatedAt FROM users WHERE nomorInduk = ${barcode}`;

      if (result && result.length > 0) {
        const user = result[0];

        if (!user) {
          alert('Murid tidak ditemukan dengan barcode tersebut');
          return;
        }

        if (user.role !== 'user') {
          alert('Barcode ini bukan milik murid');
          return;
        }

        setSelectedUser(user);
      } else {
        alert('Murid tidak ditemukan dengan barcode tersebut');
        return;
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Terjadi kesalahan saat mencari murid');
    }
  };

  const handleScan = async (result: string) => {
    setScannedBarcode(result);
  };

  const handleSaveAttendance = async () => {
    if (!selectedUser || !tanggal) {
      alert('Silakan pilih murid dan tanggal');
      return;
    }

    try {
      // Check if attendance already exists for this user and date
      const existingRecord = await sql`SELECT * FROM attendance_records WHERE userId = ${selectedUser.id} AND tanggal::date = ${tanggal}::date`;

      if (existingRecord && existingRecord.length > 0) {
        alert('Kehadiran untuk tanggal ini sudah dicatat');
        return;
      }

      // Create attendance record in the database
      const date = new Date(tanggal);
      const now = new Date(); // Current time for jamMasuk

      const result = await sql`INSERT INTO attendance_records (userId, tanggal, jamMasuk, jenisAbsensi, barcode, keterangan)
                               VALUES (${selectedUser.id}, ${date}, ${now}, ${AttendanceType.murid}, ${scannedBarcode || selectedUser.nomorInduk}, ${keterangan})
                               RETURNING *`;

      if (result && result.length > 0) {
        alert('Absensi murid berhasil disimpan');
        setScannedBarcode(null);
        setSelectedUser(null);
        setKeterangan('');
      } else {
        throw new Error('Gagal menyimpan data absensi');
      }
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      alert('Gagal menyimpan absensi: ' + error.message);
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
      <Sidebar userRole="admin" />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Absensi Murid</h1>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'scan' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('scan')}
              >
                Scan Barcode
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'manual' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('manual')}
              >
                Input Manual
              </button>
            </div>

            {activeTab === 'scan' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Pemindai Barcode</h2>
                  <div className="mb-6">
                    <BarcodeScanner
                      onScan={handleScan}
                      onError={(err) => console.error('Barcode scanning error:', err)}
                    />
                  </div>

                  {scannedBarcode && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="font-medium">Barcode Terdeteksi:</p>
                      <p className="break-all">{scannedBarcode}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Detail Murid</h2>

                  {selectedUser ? (
                    <div className="mb-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-lg font-medium">{selectedUser.namaLengkap}</p>
                        <p className="text-gray-600">Nomor Induk: {selectedUser.nomorInduk}</p>
                        <p className="text-gray-600">Email: {selectedUser.email}</p>
                        <p className="text-gray-600">Status: Murid</p>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                        <input
                          type="date"
                          value={tanggal}
                          onChange={(e) => setTanggal(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                        <input
                          type="text"
                          value={keterangan}
                          onChange={(e) => setKeterangan(e.target.value)}
                          placeholder="Masukkan keterangan (opsional)"
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <button
                        onClick={handleSaveAttendance}
                        className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Simpan Absensi
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                      <p className="text-gray-500">Silakan scan barcode murid untuk melanjutkan</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Input Manual</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Induk Murid</label>
                      <input
                        type="text"
                        value={scannedBarcode || ''}
                        onChange={(e) => setScannedBarcode(e.target.value)}
                        placeholder="Masukkan nomor induk murid"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                      <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
                      <input
                        type="text"
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        placeholder="Masukkan keterangan (opsional)"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <button
                      onClick={() => scannedBarcode && fetchUserByBarcode(scannedBarcode)}
                      className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Cari Murid
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Detail Murid</h2>

                  {selectedUser ? (
                    <div className="mb-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-lg font-medium">{selectedUser.namaLengkap}</p>
                        <p className="text-gray-600">Nomor Induk: {selectedUser.nomor_induk}</p>
                        <p className="text-gray-600">Email: {selectedUser.email}</p>
                        <p className="text-gray-600">Status: Murid</p>
                      </div>

                      <button
                        onClick={handleSaveAttendance}
                        className="mt-4 w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Simpan Absensi
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                      <p className="text-gray-500">Silakan cari murid untuk melanjutkan</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Barcode Identitas Murid</h2>
            <p className="text-gray-600 mb-4">Barcode untuk identifikasi murid (gunakan nomor induk murid sebagai barcode)</p>

            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[300px]">
                <h3 className="font-medium text-gray-700 mb-2">Contoh Barcode</h3>
                <BarcodeGenerator value={userDetails?.nomorInduk || 'MR001'} />
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => alert('Fitur cetak barcode akan segera tersedia')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Cetak Barcode Semua Murid
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}