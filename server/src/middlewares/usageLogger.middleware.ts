import { Request, Response, NextFunction } from 'express';
import { UsageLog } from '../models/UsageLog.model';
import { AuthenticatedRequest } from './auth.middleware';

interface UsageLogRequest extends AuthenticatedRequest {
  startTime?: number;
}

/**
 * Middleware to log API usage for analytics
 * Should be applied after authentication middleware
 */
export const usageLogger = (req: UsageLogRequest, res: Response, next: NextFunction) => {
  // Record start time
  req.startTime = Date.now();

  // Override res.end to capture response details
  const originalEnd = res.end;
  
  res.end = function(chunk?: any, encoding?: any) {
    // Calculate response time
    const responseTime = Date.now() - (req.startTime || Date.now());
    
    // Log the usage asynchronously (don't block the response)
    setImmediate(async () => {
      try {
        // Only log if we have user/API key info
        if ((req.user?.id || req.apiKey?.userId) && shouldLogEndpoint(req.originalUrl)) {
          // Handle both cases: userId as ObjectId or populated user object
          const userId = req.user?.id || 
                        (typeof req.apiKey?.userId === 'string' ? req.apiKey.userId : req.apiKey?.userId?._id?.toString());
          const apiKeyId = req.apiKey?._id?.toString();
          
          await UsageLog.create({
            apiKeyId: apiKeyId || null,
            userId,
            endpoint: req.originalUrl,
            method: req.method,
            statusCode: res.statusCode,
            responseTime,
            timestamp: new Date(),
            ipAddress: getClientIP(req),
            userAgent: req.get('User-Agent'),
            requestSize: getRequestSize(req),
            responseSize: getResponseSize(chunk)
          });
        }
      } catch (error) {
        // Don't let logging errors affect the API response
        console.warn('Failed to log API usage:', error);
      }
    });

    // Call original end method
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};

/**
 * Determine if an endpoint should be logged
 */
function shouldLogEndpoint(url: string): boolean {
  // Don't log internal endpoints
  const skipEndpoints = [
    '/auth/refresh-token',
    '/health',
    '/metrics',
    '/favicon.ico'
  ];
  
  return !skipEndpoints.some(endpoint => url.includes(endpoint));
}

/**
 * Get client IP address
 */
function getClientIP(req: Request): string {
  return (
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

/**
 * Estimate request size
 */
function getRequestSize(req: Request): number {
  const contentLength = req.get('Content-Length');
  if (contentLength) {
    return parseInt(contentLength, 10);
  }
  
  // Estimate based on body if available
  if (req.body) {
    try {
      return Buffer.byteLength(JSON.stringify(req.body), 'utf8');
    } catch {
      return 0;
    }
  }
  
  return 0;
}

/**
 * Estimate response size
 */
function getResponseSize(chunk: any): number {
  if (!chunk) return 0;
  
  if (Buffer.isBuffer(chunk)) {
    return chunk.length;
  }
  
  if (typeof chunk === 'string') {
    return Buffer.byteLength(chunk, 'utf8');
  }
  
  try {
    return Buffer.byteLength(JSON.stringify(chunk), 'utf8');
  } catch {
    return 0;
  }
}
