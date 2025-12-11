'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getUserById } from '@/lib/prismaDataAccess';
import { UserRole, getCurrentUser, getUserRole } from '@/lib/authUtils';

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  };

  // Check active session and set user data
  useEffect(() => {
    // Get current session
    const checkSession = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);

        // Get user details from our users table using Prisma
        const userData = await getUserById(currentUser.id);
        if (userData) {
          setUserDetails({
            id: userData.id,
            email: userData.email,
            namaLengkap: userData.namaLengkap,
            nomorInduk: userData.nomorInduk,
            role: userData.role as UserRole
          });
          setUserRole(userData.role as UserRole);
        }
      }
      setLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);

        // Get user details from our users table using Prisma
        const fetchUserDetails = async () => {
          const userData = await getUserById(session.user.id);
          if (userData) {
            setUserDetails({
              id: userData.id,
              email: userData.email,
              namaLengkap: userData.namaLengkap,
              nomorInduk: userData.nomorInduk,
              role: userData.role as UserRole
            });
            setUserRole(userData.role as UserRole);
          }
        };

        fetchUserDetails();
      } else {
        setUser(null);
        setUserDetails(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
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