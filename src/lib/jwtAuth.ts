import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import getNeonClient from './neonClient';
const sql = getNeonClient();

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
  try {
    // Get the database client
    const dbClient = getNeonClient();
    if (!dbClient) {
      console.error('Database client not available for authentication');
      return null;
    }

    // Query the user from Neon database
    const result = await dbClient`SELECT id, email, password, namaLengkap, nomorInduk, role, createdAt, updatedAt FROM users WHERE email = ${email}`;

    if (result && result.length > 0) {
      const userData = result[0];

      // Compare the provided password with the hashed password
      const isValidPassword = await comparePassword(password, userData.password);

      if (isValidPassword) {
        // Return user with proper typing
        return {
          id: userData.id,
          email: userData.email,
          password: userData.password,
          namaLengkap: userData.namaLengkap,
          nomorInduk: userData.nomorInduk,
          role: userData.role,
          createdAt: new Date(userData.createdAt),
          updatedAt: new Date(userData.updatedAt),
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