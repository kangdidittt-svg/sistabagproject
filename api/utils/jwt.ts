import jwt from 'jsonwebtoken';
import { IAdminUser } from '../models/AdminUser.js';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-fallback-secret-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';

export interface JWTPayload {
  adminId: string;
  username: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT token for admin user
 */
export const generateToken = (admin: IAdminUser): string => {
  const payload = {
    adminId: admin.id,
    username: admin.username,
    role: admin.role
  };

  return jwt.sign(payload, JWT_SECRET as jwt.Secret, {
    expiresIn: JWT_EXPIRES_IN
  } as jwt.SignOptions);
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET as string) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) {
    return null;
  }

  // Check if header starts with 'Bearer '
  if (!authHeader.startsWith('Bearer ')) {
    return null;
  }

  // Extract token (remove 'Bearer ' prefix)
  const token = authHeader.substring(7);
  return token.trim() || null;
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (payload: JWTPayload): boolean => {
  if (!payload.exp) {
    return true;
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};