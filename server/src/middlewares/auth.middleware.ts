import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiKeyService } from '../services/apiKey.service';
import { IApiKey } from '../models/ApiKey.model';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
  apiKey?: IApiKey;
}

/**
 * Middleware to authenticate API requests using API key
 */
export const authenticateApiKey = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers['x-api-key'] as string;

    if (!apiKey) {
      res.status(401).json({
        success: false,
        message: 'API key required',
        code: 'API_KEY_MISSING'
      });
      return;
    }

    // Verify API key using the service
    const keyData = await ApiKeyService.verifyApiKey(apiKey);

    if (!keyData) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired API key',
        code: 'INVALID_API_KEY'
      });
      return;
    }

    // Check rate limits
    if (!keyData.isWithinRateLimit()) {
      res.status(429).json({
        success: false,
        message: 'API key rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        meta: {
          dailyLimit: keyData.rateLimit.requestsPerDay,
          dailyUsage: keyData.usage.requestsToday,
          monthlyLimit: keyData.rateLimit.requestsPerMonth,
          monthlyUsage: keyData.usage.requestsThisMonth
        }
      });
      return;
    }

    // Track usage
    const endpoint = req.originalUrl;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    await ApiKeyService.trackUsage(keyData, endpoint, ip);

    req.apiKey = keyData;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid API key',
      code: 'INVALID_API_KEY'
    });
  }
};

/**
 * Middleware to authenticate JWT tokens
 */
export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        code: 'TOKEN_MISSING'
      });
      return;
    }

    const jwtSecret = process.env['JWT_ACCESS_SECRET'] || process.env['JWT_SECRET'] || 'fallback-secret';
    const decoded = jwt.verify(token, jwtSecret) as any;

    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN'
    });
  }
};

/**
 * Legacy middleware for backward compatibility
 */
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = req.headers['x-api-key'] as string;
  const authHeader = req.headers.authorization;

  if (apiKey) {
    return authenticateApiKey(req, res, next);
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateJWT(req, res, next);
  } else {
    res.status(401).json({
      success: false,
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }
};

/**
 * Check if API key has specific permission
 */
export const requirePermission = (permission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.apiKey) {
      res.status(401).json({
        success: false,
        message: 'API key authentication required',
        code: 'API_KEY_REQUIRED'
      });
      return;
    }

    if (!req.apiKey.hasPermission(permission)) {
      res.status(403).json({
        success: false,
        message: `Permission '${permission}' required`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
      return;
    }

    next();
  };
};