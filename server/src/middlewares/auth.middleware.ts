import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authorization token required' });
    }
    const decoded = AuthService.verifyToken(token);
    // Attach user info to request
    (req as any).user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function requireRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;
    if (userRole !== role && !(role === 'user' && userRole === 'admin')) {
      return res.status(403).json({ error: 'Access denied' });
    }
    return next();
  };
}
