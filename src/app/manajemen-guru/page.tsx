'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { supabase } from '@/lib/supabaseClient';

export default function ManajemenGuruPage() {
  const router = useRouter();
  const { userRole, loading } = useAuth();
  const [guruList, setGuruList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    nomor_induk: '',
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setGuruList(data || []);
    } catch (error: any) {
      console.error('Error fetching guru list:', error);
      alert('Gagal memuat daftar guru: ' + error.message);
    }
  };

  const handleAddGuru = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First, create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true
      });

      if (authError) {
        throw authError;
      }

      // Then, create the user in our users table
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: formData.email,
          nama_lengkap: formData.nama_lengkap,
          nomor_induk: formData.nomor_induk,
          role: 'admin'
        }]);

      if (userError) {
        // If user table creation failed, delete the auth user
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw userError;
      }

      alert('Guru berhasil ditambahkan');
      setShowForm(false);
      setFormData({
        nama_lengkap: '',
        email: '',
        nomor_induk: '',
        password: ''
      });
      fetchGuruList();
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
                      value={formData.nama_lengkap}
                      onChange={(e) => setFormData({...formData, nama_lengkap: e.target.value})}
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
                      value={formData.nomor_induk}
                      onChange={(e) => setFormData({...formData, nomor_induk: e.target.value})}
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
                          {guru.nama_lengkap}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {guru.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {guru.nomor_induk}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(guru.created_at).toLocaleDateString('id-ID')}
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