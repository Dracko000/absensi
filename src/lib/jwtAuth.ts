import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../actions';

// Define User type based on our schema
interface User {
  id: string;
  email: string;
  password: string;
  namaLengkap: string;
  nomorInduk: string;
  role: 'superadmin' | 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || '240103800a4d1eda34cc6e9db9b94e88';

// Generate a JWT token for a user using the provided secret
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
    // Ensure token and secret are valid before attempting to verify
    if (!token || typeof token !== 'string' || !JWT_SECRET) {
      return null;
    }
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Error verifying token:', error);
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
  try {
    // Query the user from Neon database
    const user = await getUserByEmail(email);

    if (user) {
      // Compare the provided password with the hashed password
      const isValidPassword = await comparePassword(password, user.password);

      if (isValidPassword) {
        // Return user with proper typing
        return {
          id: user.id,
          email: user.email,
          password: user.password,
          namaLengkap: user.namaLengkap,
          nomorInduk: user.nomorInduk,
          role: user.role,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        };
      }
    }

    return null; // Return null if user not found or password invalid
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
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
  // The real data would come from the token validation
  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
    nomorInduk: decoded.nomorInduk,
    namaLengkap: decoded.namaLengkap,
    password: '', // Don't expose password
    createdAt: new Date(decoded.createdAt) || new Date(), // Would come from DB in real scenario
    updatedAt: new Date(decoded.updatedAt) || new Date(), // Would come from DB in real scenario
  };
};