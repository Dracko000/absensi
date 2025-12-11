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
    // For mock implementation, we'll create a random user with a random role
    // This allows the app to work without requiring specific credentials
    const roles: UserRole[] = ['superadmin', 'admin', 'user'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];

    // Store mock role in localStorage for the auth context to use
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock-role', randomRole);
    }

    // Create mock user data
    const mockUser = {
      id: `mock-${randomRole}-${Date.now()}`,
      email: `${randomRole}@demo.test`,
      role: randomRole,
      nomorInduk: `${randomRole.toUpperCase()}${Math.floor(1000 + Math.random() * 9000)}`,
      namaLengkap: `${randomRole === 'superadmin' ? 'Superadmin Demo' : randomRole === 'admin' ? 'Guru Demo' : 'Murid Demo'} ${Math.floor(100 + Math.random() * 900)}`
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

    // Generate JWT token using the mock user data
    const token = generateToken(mockUser);

    // Store the token in localStorage (for client side)
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', token);
    }

    return { user: mockUser, token };
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
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;

    if (token) {
      // Verify token and get user info
      const userInfo = getUserFromToken(token);

      if (userInfo) {
        setUser(userInfo);

        // User details come from the token since database access is disabled
        setUserDetails({
          id: userInfo.id,
          email: userInfo.email,
          namaLengkap: userInfo.namaLengkap,
          nomorInduk: userInfo.nomorInduk,
          role: userInfo.role as UserRole
        });
        setUserRole(userInfo.role as UserRole);
      }
    } else {
      // Default mock user when no token exists
      // For demo purposes, create mock user data based on role
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
    }

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