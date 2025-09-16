import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory rate limit store (in production, use Redis)
const rateLimitStore: RateLimitStore = {};

/**
 * Rate limiting middleware
 * Default: 1000 requests per hour per API key/user
 */
export const rateLimitMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const identifier = req.user?.id || req.ip || 'anonymous';
    const now = Date.now();
    const windowMs = 60 * 60 * 1000; // 1 hour
    const maxRequests = 1000; // requests per window

    if (!rateLimitStore[identifier]) {
      rateLimitStore[identifier] = {
        count: 1,
        resetTime: now + windowMs
      };
      
      // Set rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': (maxRequests - 1).toString(),
        'X-RateLimit-Reset': new Date(rateLimitStore[identifier].resetTime).toISOString()
      });
      
      return next();
    }

    const userLimit = rateLimitStore[identifier];

    // Reset if window has expired
    if (now > userLimit.resetTime) {
      userLimit.count = 1;
      userLimit.resetTime = now + windowMs;
      
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': (maxRequests - 1).toString(),
        'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString()
      });
      
      return next();
    }

    // Check if limit exceeded
    if (userLimit.count >= maxRequests) {
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString(),
        'Retry-After': Math.ceil((userLimit.resetTime - now) / 1000).toString()
      });
      
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: `Too many requests. Limit: ${maxRequests} requests per hour`,
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
      });
      return;
    }

    // Increment counter
    userLimit.count++;
    
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - userLimit.count).toString(),
      'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString()
    });
    
    next();
  } catch (error) {
    console.error('Rate limit middleware error:', error);
    next(); // Continue on error to avoid breaking the API
  }
};

/**
 * Cleanup expired rate limit entries (should be called periodically)
 */
export const cleanupRateLimitStore = (): void => {
  const now = Date.now();
  Object.keys(rateLimitStore).forEach(key => {
    if (rateLimitStore[key] && now > rateLimitStore[key].resetTime) {
      delete rateLimitStore[key];
    }
  });
};

// Cleanup every 10 minutes
setInterval(cleanupRateLimitStore, 10 * 60 * 1000);

/**
 * Stricter rate limiter for demo endpoints
 * Default: 60 requests per minute per IP
 */
interface DemoRateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const demoRateLimitStore: DemoRateLimitStore = {};

export const demoRateLimitMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const identifier = req.ip || 'anonymous';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 60; // requests per window

    if (!demoRateLimitStore[identifier]) {
      demoRateLimitStore[identifier] = {
        count: 1,
        resetTime: now + windowMs
      };
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': (maxRequests - 1).toString(),
        'X-RateLimit-Reset': new Date(demoRateLimitStore[identifier].resetTime).toISOString()
      });
      return next();
    }

    const userLimit = demoRateLimitStore[identifier];

    if (now > userLimit.resetTime) {
      userLimit.count = 1;
      userLimit.resetTime = now + windowMs;
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': (maxRequests - 1).toString(),
        'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString()
      });
      return next();
    }

    if (userLimit.count >= maxRequests) {
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString(),
        'Retry-After': Math.ceil((userLimit.resetTime - now) / 1000).toString()
      });
      res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: `Too many requests. Limit: ${maxRequests} requests per minute`,
        retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
      });
      return;
    }

    userLimit.count++;
    res.set({
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - userLimit.count).toString(),
      'X-RateLimit-Reset': new Date(userLimit.resetTime).toISOString()
    });
    next();
  } catch (error) {
    console.error('Demo rate limit middleware error:', error);
    next();
  }
};