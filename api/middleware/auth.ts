import { Request, Response, NextFunction } from 'express';
import { AdminUser } from '../models/index.js';
import { verifyToken, extractTokenFromHeader, JWTPayload } from '../utils/jwt.js';

// Extend Request interface to include admin user
declare global {
  namespace Express {
    interface Request {
      admin?: {
        _id: string;
        username: string;
        name: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to authenticate admin users
 */
export const authenticateAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
      return;
    }

    // Verify token
    let payload: JWTPayload;
    try {
      payload = verifyToken(token);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
      return;
    }

    // Find admin user in database
    const admin = await AdminUser.findById(payload.adminId).select('-password_hash');
    
    if (!admin) {
      res.status(401).json({
        success: false,
        error: 'Admin user not found'
      });
      return;
    }

    // Attach admin info to request object
    req.admin = {
      _id: admin._id.toString(),
      username: admin.username,
      name: admin.name,
      role: admin.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during authentication'
    });
  }
};

/**
 * Middleware to check if admin has specific role
 */
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin) {
      res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.admin.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if admin is super admin
 */
export const requireSuperAdmin = requireRole('super_admin');

/**
 * Middleware to check if admin is admin or super admin
 */
export const requireAdmin = requireRole(['admin', 'super_admin']);