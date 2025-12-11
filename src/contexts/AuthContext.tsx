'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UserRole, getCurrentUser, getUserRole } from '@/lib/authUtils';

interface AuthContextType {
  user: any;
  userDetails: { id: string; email: string; nama_lengkap: string; nomor_induk: string; role: UserRole } | null;
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
  const [userDetails, setUserDetails] = useState<{ id: string; email: string; nama_lengkap: string; nomor_induk: string; role: UserRole } | null>(null);
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
        
        // Get user details from our users table
        const { data: userData, error } = await supabase
          .from('users')
          .select('id, email, nama_lengkap, nomor_induk, role')
          .eq('id', currentUser.id)
          .single();
          
        if (userData) {
          setUserDetails({
            id: userData.id,
            email: userData.email,
            nama_lengkap: userData.nama_lengkap,
            nomor_induk: userData.nomor_induk,
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
        
        // Get user details from our users table
        const fetchUserDetails = async () => {
          const { data: userData, error } = await supabase
            .from('users')
            .select('id, email, nama_lengkap, nomor_induk, role')
            .eq('id', session.user.id)
            .single();
            
          if (userData) {
            setUserDetails({
              id: userData.id,
              email: userData.email,
              nama_lengkap: userData.nama_lengkap,
              nomor_induk: userData.nomor_induk,
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