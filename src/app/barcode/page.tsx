'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import BarcodeGenerator from '@/components/BarcodeGenerator';

export default function BarcodePage() {
  const router = useRouter();
  const { userRole, loading, userDetails } = useAuth();
  const [barcodeValue, setBarcodeValue] = useState('');

  useEffect(() => {
    if (!loading && userRole !== 'user') {
      router.push('/login');
    } else if (!loading && userDetails) {
      setBarcodeValue(userDetails.nomor_induk);
    }
  }, [userRole, loading, userDetails]);

  const handlePrint = () => {
    window.print();
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Barcode Identitas Saya</h1>
          
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Barcode Identitas Murid</h2>
              <p className="text-gray-600">{userDetails?.nama_lengkap}</p>
              <p className="text-gray-600">{userDetails?.nomor_induk}</p>
            </div>
            
            <div className="bg-white p-4 rounded border border-gray-200 inline-block">
              <BarcodeGenerator 
                value={barcodeValue || userDetails?.nomor_induk || 'MR001'} 
                format="CODE128"
                height={50}
              />
            </div>
            
            <div className="mt-8">
              <button
                onClick={handlePrint}
                className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Cetak Barcode
              </button>
            </div>
            
            <div className="mt-8 text-sm text-gray-600">
              <p>Gunakan barcode ini untuk proses absensi di kelas Anda.</p>
              <p>Jaga kerahasiaan barcode Anda agar tidak disalahgunakan.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}