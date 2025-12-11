'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function AdminDashboard() {
  const router = useRouter();
  const { userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && userRole !== 'admin') {
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
      <Sidebar userRole="admin" />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Guru</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700">Total Murid</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">32</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700">Absensi Hari Ini</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">30</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700">Hari Ini</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Absensi Murid</h2>
            <p className="text-gray-600">Catat dan pantau kehadiran murid di kelas Anda.</p>
            
            <div className="mt-4">
              <button 
                onClick={() => router.push('/absensi-murid')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Absen Murid Hari Ini
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Riwayat Absensi</h2>
            <p className="text-gray-600">Lihat riwayat absensi murid yang telah Anda buat.</p>
            
            <div className="mt-4">
              <button 
                onClick={() => router.push('/riwayat-absensi')}
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