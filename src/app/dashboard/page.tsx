'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardRedirect() {
  const router = useRouter();
  const { userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (userRole === 'superadmin') {
        router.push('/dashboard-superadmin');
      } else if (userRole === 'admin') {
        router.push('/dashboard-guru');
      } else if (userRole === 'user') {
        router.push('/dashboard-murid');
      } else {
        router.push('/login');
      }
    }
  }, [userRole, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">Mengarahkan ke dashboard...</p>
      </div>
    </div>
  );
}