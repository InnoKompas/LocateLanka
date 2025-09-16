import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import demoTokenService, { DemoTokenPayload } from '../services/demoToken.service';

// Extend Request interface to include demo token data
declare global {
  namespace Express {
    interface Request {
      demoSession?: DemoTokenPayload;
    }
  }
}

/**
 * Middleware to validate demo JWT tokens
 * Extracts token from Authorization header and validates it
 */
export const validateDemoToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.get('Authorization');
    
    if (!authHeader) {
      throw new AppError('Demo token required. Please get a demo token first.', 401);
    }

    // Extract token from "Bearer <token>" format
    const tokenMatch = authHeader.match(/^Bearer\s+(.+)$/);
    if (!tokenMatch || !tokenMatch[1]) {
      throw new AppError('Invalid token format. Use: Authorization: Bearer <token>', 401);
    }

    const token = tokenMatch[1];
    
    // Validate and consume token
    const session = demoTokenService.validateAndConsumeToken(token);
    
    // Attach session info to request
    req.demoSession = session;

    // Add response headers for client tracking
    res.setHeader('X-Demo-Requests-Used', session.requestsUsed.toString());
    res.setHeader('X-Demo-Requests-Remaining', (session.maxRequests - session.requestsUsed).toString());
    res.setHeader('X-Demo-Expires-At', new Date(session.expiresAt).toISOString());

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
        code: 'DEMO_TOKEN_ERROR',
        hint: error.statusCode === 401 
          ? 'Get a new demo token from /api/v1/demo/token'
          : 'Demo usage limit reached. Sign up for a full API key.'
      });
      return;
    }

    console.error('Demo token validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error during demo token validation'
    });
  }
};

/**
 * Optional middleware to log demo usage for analytics
 */
export const logDemoUsage = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.demoSession) {
    console.log(`[Demo Usage] Session: ${req.demoSession.sessionId}, ` +
               `Requests: ${req.demoSession.requestsUsed}/${req.demoSession.maxRequests}, ` +
               `Endpoint: ${req.method} ${req.path}, ` +
               `Origin: ${req.get('Origin') || 'unknown'}`);
  }
  next();
};
