import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

export interface AuthUser {
  userId: string;
  username: string;
  role: 'Admin' | 'User';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    let token = '';

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.isuru_token) {
      token = req.cookies.isuru_token;
    }

    if (!token) {
      res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
      return;
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthUser;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid or expired session. Please log in again.' });
  }
}

export function requireRole(...allowedRoles: Array<'Admin' | 'User'>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Access denied. Requires ${allowedRoles.join(' or ')} privileges.`,
      });
      return;
    }

    next();
  };
}
