'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function UserDashboard() {
  const router = useRouter();
  const { userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && userRole !== 'user') {
      router.push('/login');
    }
  }, [userRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Memuat dashboard...</p>
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Murid</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700">Status Kehadiran</h2>
              <p className="text-3xl font-bold text-green-600 mt-2">Hadir</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700">Jam Masuk</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">07:30</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700">Hari Ini</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Barcode Identitas</h2>
            <p className="text-gray-600 mb-4">Barcode identitas Anda untuk proses absensi:</p>
            
            {/* Placeholder for barcode - in real app, we'd generate actual barcode */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block bg-black text-white font-mono p-4 rounded mb-2">
                  {Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}
                </div>
                <p className="text-sm text-gray-600">Barcode Identitas Murid</p>
              </div>
            </div>
            
            <div className="mt-4">
              <button 
                onClick={() => alert('Fitur cetak barcode akan segera tersedia')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Cetak Barcode
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Riwayat Kehadiran</h2>
            <p className="text-gray-600">Lihat riwayat kehadiran Anda.</p>
            
            <div className="mt-4">
              <button 
                onClick={() => router.push('/riwayat-kehadiran')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Lihat Riwayat
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}