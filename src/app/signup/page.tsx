'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nomorInduk, setNomorInduk] = useState('');
  const [userRole, setUserRole] = useState<'admin' | 'user'>('user'); // Only allow admin or user signup
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Insert user data into our custom users table
        const { error: userError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email,
            nama_lengkap: namaLengkap,
            nomor_induk: nomorInduk,
            role: userRole
          }]);

        if (userError) {
          // If user table creation failed, delete the auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          throw userError;
        }

        // Send email confirmation
        if (authData.session) {
          // User is already logged in
          router.push('/dashboard');
        } else {
          alert('Akun berhasil dibuat! Silakan cek email Anda untuk verifikasi.');
          router.push('/login');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Gagal membuat akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Silakan lengkapi informasi di bawah ini
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="nama-lengkap" className="sr-only">
                Nama Lengkap
              </label>
              <input
                id="nama-lengkap"
                name="nama-lengkap"
                type="text"
                autoComplete="name"
                required
                value={namaLengkap}
                onChange={(e) => setNamaLengkap(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nama Lengkap"
              />
            </div>
            <div>
              <label htmlFor="nomor-induk" className="sr-only">
                Nomor Induk
              </label>
              <input
                id="nomor-induk"
                name="nomor-induk"
                type="text"
                required
                value={nomorInduk}
                onChange={(e) => setNomorInduk(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Nomor Induk"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Alamat Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Alamat Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Kata Sandi"
              />
            </div>
            <div className="pt-2">
              <label htmlFor="role" className="sr-only">
                Peran Pengguna
              </label>
              <select
                id="role"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as 'admin' | 'user')}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="user">Murid</option>
                <option value="admin">Guru</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sudah punya akun? Masuk di sini
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}