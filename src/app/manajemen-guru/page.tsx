'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { hashPassword } from '@/lib/jwtAuth';
import sql from '@/lib/neonClient';

export default function ManajemenGuruPage() {
  const router = useRouter();
  const { userRole, loading } = useAuth();
  const [guruList, setGuruList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nomorInduk: '',
    password: ''
  });

  useEffect(() => {
    if (!loading && userRole !== 'superadmin') {
      router.push('/login');
    } else if (!loading) {
      fetchGuruList();
    }
  }, [userRole, loading]);

  const fetchGuruList = async () => {
    try {
      // Fetch all users with role 'admin' (guru) from the database
      const result = await sql`SELECT id, email, namaLengkap, nomorInduk, role, createdAt, updatedAt FROM users WHERE role = 'admin'`;
      setGuruList(result);
    } catch (error: any) {
      console.error('Error fetching guru list:', error);
      alert('Gagal memuat daftar guru: ' + error.message);
    }
  };

  const handleAddGuru = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Hash the password
      const hashedPassword = await hashPassword(formData.password);

      // Add the new guru to the database
      const result = await sql`INSERT INTO users (email, password, namaLengkap, nomorInduk, role)
                               VALUES (${formData.email}, ${hashedPassword}, ${formData.namaLengkap}, ${formData.nomorInduk}, 'admin')
                               RETURNING *`;

      if (result && result.length > 0) {
        alert('Guru berhasil ditambahkan');
        setShowForm(false);
        setFormData({
          namaLengkap: '',
          email: '',
          nomorInduk: '',
          password: ''
        });
        fetchGuruList();
      } else {
        throw new Error('Gagal menambahkan guru');
      }
    } catch (error: any) {
      console.error('Error adding guru:', error);
      alert('Gagal menambahkan guru: ' + error.message);
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
      <Sidebar userRole="superadmin" />
      <main className="md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Guru</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {showForm ? 'Batal' : '+ Tambah Guru'}
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Tambah Guru Baru</h2>
              <form onSubmit={handleAddGuru}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={formData.namaLengkap}
                      onChange={(e) => setFormData({...formData, namaLengkap: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Induk</label>
                    <input
                      type="text"
                      value={formData.nomorInduk}
                      onChange={(e) => setFormData({...formData, nomorInduk: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Simpan Guru
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Daftar Guru</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nomor Induk
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Terdaftar
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guruList.length > 0 ? (
                    guruList.map((guru) => (
                      <tr key={guru.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {guru.namaLengkap}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {guru.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {guru.nomorInduk}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(guru.createdAt).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Tidak ada data guru
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