import { redirect } from 'next/navigation';
import { getUserFromToken } from './jwtAuth';

// Role types based on our database
export type UserRole = 'superadmin' | 'admin' | 'user';

// Function to get current user session
export const getCurrentUser = async () => {
  // Get token from localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth-token');
    if (token) {
      const userInfo = getUserFromToken(token);
      return userInfo;
    }
  }

  return null;
};

// Function to check user role
export const getUserRole = async (): Promise<UserRole | null> => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Get user details from our users table using Prisma (currently disabled)
  // This would normally fetch from database
  console.warn("Database access disabled - using role from token");
  return user.role as UserRole;
};

// Function to sign in user
export const signIn = async (email: string, password: string) => {
  // This function is deprecated since we now handle sign in directly in AuthContext
  // This function is just kept for compatibility if needed elsewhere
  console.warn('signIn function in authUtils is deprecated. Use AuthContext.signIn instead.');
  return null;
};

// Function to sign out user
export const signOut = async () => {
  // This function is deprecated since we now handle sign out directly in AuthContext
  // Clear the token from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-token');
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