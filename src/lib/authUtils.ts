import { supabase } from './supabaseClient';
import { getUserById } from './prismaDataAccess';
import { redirect } from 'next/navigation';

// Role types based on our database
export type UserRole = 'superadmin' | 'admin' | 'user';

// Function to get current user session
export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    return null;
  }

  return session.user;
};

// Function to check user role
export const getUserRole = async (): Promise<UserRole | null> => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Get user details from our users table using Prisma
  const userData = await getUserById(user.id);

  if (!userData) {
    return null;
  }

  return userData.role as UserRole;
};

// Function to sign in user
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Function to sign out user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

// Function to protect routes based on role
export const requireAuth = async (allowedRoles?: UserRole[]) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const userRole = await getUserRole();

  if (!userRole) {
    redirect('/login');
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to unauthorized page or home depending on user role
    switch (userRole) {
      case 'superadmin':
        redirect('/dashboard-superadmin');
        break;
      case 'admin':
        redirect('/dashboard-guru');
        break;
      case 'user':
        redirect('/dashboard-murid');
        break;
      default:
        redirect('/login');
    }
  }

  return { user, userRole };
};