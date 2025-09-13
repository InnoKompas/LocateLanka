import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { CORS, IS_PRODUCTION } from '../config/environment.config';

/**
 * Security headers middleware
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: IS_PRODUCTION ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  } : false,
  crossOriginEmbedderPolicy: false,
});

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (CORS.ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'X-API-Key',
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'Retry-After',
  ],
};

/**
 * Request timeout middleware
 */
export const requestTimeout = (timeoutMs: number = 30000) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const timeout = setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          error: 'RequestTimeout',
          message: 'Request timeout',
          code: 'REQUEST_TIMEOUT',
          timestamp: new Date().toISOString(),
        });
      }
    }, timeoutMs);

    res.on('finish', () => clearTimeout(timeout));
    res.on('close', () => clearTimeout(timeout));
    
    next();
  };
};

/**
 * Request ID middleware for tracing
 */
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const id = req.headers['x-request-id'] || 
             Math.random().toString(36).substring(2, 15) + 
             Math.random().toString(36).substring(2, 15);
  
  req.id = id as string;
  res.setHeader('X-Request-ID', id);
  
  next();
};

/**
 * IP whitelist middleware (for admin endpoints)
 */
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (allowedIPs.includes(clientIP as string) || allowedIPs.includes('*')) {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'IP address not allowed',
        code: 'IP_NOT_ALLOWED',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}
