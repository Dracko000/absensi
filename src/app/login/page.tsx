'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { signIn, userRole, userDetails } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      // After successful login, redirect based on role (this will be handled by the useEffect in the login page)
    } catch (err: any) {
      setError(err.message || 'Gagal masuk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Redirect based on user role after successful login
  useEffect(() => {
    if (userDetails && userRole) {
      switch(userRole) {
        case 'superadmin':
          router.push('/dashboard-superadmin');
          break;
        case 'admin':
          router.push('/dashboard-guru');
          break;
        case 'user':
          router.push('/dashboard-murid');
          break;
        default:
          router.push('/dashboard'); // fallback
      }
    }
  }, [userDetails, userRole, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sistem Absensi Sekolah
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Masukkan kredensial Anda untuk melanjutkan
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Kata Sandi"
              />
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-600 mb-2">Demo akun (gunakan email berikut):</p>
            <div className="text-xs space-y-1">
              <div className="flex justify-between">
                <span>Superadmin:</span>
                <span className="text-indigo-600">superadmin@sekolah.test</span>
              </div>
              <div className="flex justify-between">
                <span>Admin (Guru):</span>
                <span className="text-indigo-600">admin@sekolah.test</span>
              </div>
              <div className="flex justify-between">
                <span>User (Murid):</span>
                <span className="text-indigo-600">user@sekolah.test</span>
              </div>
              <div className="mt-2 text-gray-500">Password: 123456 (untuk semua akun)</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                Kembali ke Beranda
              </Link>
            </div>
            <div className="text-sm">
              <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                Buat akun baru
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}