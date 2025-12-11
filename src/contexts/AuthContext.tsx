'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authenticateUser, generateToken, getUserFromToken } from '@/lib/jwtAuth';
import { UserRole } from '@/lib/authUtils';

interface AuthContextType {
  user: any;
  userDetails: { id: string; email: string; namaLengkap: string; nomorInduk: string; role: UserRole } | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userDetails, setUserDetails] = useState<{ id: string; email: string; namaLengkap: string; nomorInduk: string; role: UserRole } | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    // For mock implementation, extract role from email
    // In a real app, this would authenticate with the database
    let mockRole = 'user';
    if (email.includes('superadmin')) mockRole = 'superadmin';
    else if (email.includes('admin')) mockRole = 'admin';

    // Store mock role in localStorage for the auth context to use
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock-role', mockRole);
    }

    // Create mock user data
    const mockUser = {
      id: `mock-${mockRole}-1`,
      email,
      role: mockRole,
      nomorInduk: `${mockRole.toUpperCase()}001`,
      namaLengkap: `Mock ${mockRole === 'superadmin' ? 'Superadmin' : mockRole === 'admin' ? 'Admin' : 'User'} 1`
    };

    setUser(mockUser);

    // Set user details
    setUserDetails({
      id: mockUser.id,
      email: mockUser.email,
      namaLengkap: mockUser.namaLengkap,
      nomorInduk: mockUser.nomorInduk,
      role: mockUser.role as UserRole
    });

    setUserRole(mockUser.role as UserRole);

    // In a real implementation, we would generate and store an actual token
    // For mock, we just return the mock user data
    return { user: mockUser, token: 'mock-token' };
  };

  const signOut = async () => {
    // Clear the token from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }

    setUser(null);
    setUserDetails(null);
    setUserRole(null);
  };

  // Check active session and set user data
  useEffect(() => {
    // For demo purposes, create mock user data based on role
    // In a real application, this would come from the actual token and database
    const mockRole = localStorage.getItem('mock-role') || 'user'; // Default to user role

    // Create mock user data
    const mockUser = {
      id: `mock-${mockRole}-1`,
      email: `${mockRole}@sekolah.test`,
      role: mockRole,
      nomorInduk: `${mockRole.toUpperCase()}001`,
      namaLengkap: `Mock ${mockRole === 'superadmin' ? 'Superadmin' : mockRole === 'admin' ? 'Admin' : 'User'} 1`
    };

    setUser(mockUser);
    setUserDetails({
      id: mockUser.id,
      email: mockUser.email,
      namaLengkap: mockUser.namaLengkap,
      nomorInduk: mockUser.nomorInduk,
      role: mockUser.role as UserRole
    });
    setUserRole(mockUser.role as UserRole);

    setLoading(false);
  }, []);

  const value = {
    user,
    userDetails,
    userRole,
    loading,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};