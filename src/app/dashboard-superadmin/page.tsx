'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && userRole !== 'superadmin') {
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
      <Sidebar userRole="superadmin" />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Kepala Sekolah</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700">Total Guru</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">24</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700">Total Murid</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">420</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700">Hari Ini</h2>
              <p className="text-3xl font-bold text-indigo-600 mt-2">{new Date().toLocaleDateString('id-ID')}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manajemen Absensi Guru</h2>
            <p className="text-gray-600">Kelola dan pantau kehadiran guru di sini.</p>
            
            <div className="mt-4">
              <button 
                onClick={() => router.push('/absensi-guru')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Lihat Absensi Guru
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Manajemen Pengguna</h2>
            <p className="text-gray-600">Atur pengguna sistem (guru dan murid).</p>
            
            <div className="mt-4 flex space-x-4">
              <button 
                onClick={() => router.push('/manajemen-guru')}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Kelola Guru
              </button>
              <button 
                onClick={() => router.push('/manajemen-murid')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Kelola Murid
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}