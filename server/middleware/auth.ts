import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbService } from '../services/dbService.ts';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'imovies-jwt-secret-key-cinema-2026';

export function generateToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export async function protect(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await dbService.findUserById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
      return;
    }

    req.user = {
      _id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

export function adminOnly(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Access denied: Administrator privileges required.' });
    return;
  }
  next();
}
