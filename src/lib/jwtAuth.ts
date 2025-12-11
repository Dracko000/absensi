import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_for_development';

// Generate a JWT token for a user
export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    nomorInduk: user.nomorInduk,
    namaLengkap: user.namaLengkap
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' }); // Token expires in 24 hours
};

// Verify a JWT token and return the decoded payload
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash a password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare a plain password with a hashed password
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Authenticate a user by email and password
export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // For mock implementation, check if email exists and password is correct
  // In a real implementation, this would query the database
  if (!email || !password) {
    return null;
  }

  // Simple validation - any non-empty password is accepted for demo purposes
  // In a real app, you'd verify the password hash
  if (password.length < 1) {
    return null;
  }

  // Determine role based on email
  let role: string = 'user';
  if (email.includes('superadmin')) role = 'superadmin';
  else if (email.includes('admin')) role = 'admin';
  else if (email.includes('user')) role = 'user';

  // Create mock user based on email and role
  const nomorInduk = `${role.toUpperCase()}${Math.floor(100 + Math.random() * 900)}`; // Generate random ID

  return {
    id: `mock-${role}-${Date.now()}`,
    email,
    password: '', // Don't expose password
    namaLengkap: `Mock ${role === 'superadmin' ? 'Superadmin' : role === 'admin' ? 'Guru' : 'Murid'}`,
    nomorInduk,
    role: role as UserRole,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

// Get user info from token
export const getUserFromToken = (token: string | null): User | null => {
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  // For this implementation, we'll return a simplified user object
  // In a real implementation, you might want to validate against DB
  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
    nomorInduk: decoded.nomorInduk,
    namaLengkap: decoded.namaLengkap,
    password: '', // Don't expose password
    createdAt: new Date(), // Placeholder - would come from DB in real scenario
    updatedAt: new Date(), // Placeholder - would come from DB in real scenario
  };
};