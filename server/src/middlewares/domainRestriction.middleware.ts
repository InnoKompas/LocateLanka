import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

/**
 * Middleware to restrict access to specific domains
 * Only allows requests from locatelanka.lk and localhost:5173
 */
export const domainRestrictionMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const originHeader = req.get('Origin');
  const refererHeader = req.get('Referer');
  const allowedDomains = [
    process.env['CLIENT_URL'] || 'http://localhost:5173',
    'https://locatelanka.lk',
    'http://locatelanka.lk',
    'https://www.locatelanka.lk',
    'http://www.locatelanka.lk',
    'http://localhost:5173',
    'https://localhost:5173'
  ].filter(Boolean); // Remove any undefined values

  // Allow requests without origin only if explicit env flag is enabled in development
  if (!originHeader) {
    const allowNoOrigin = process.env['NODE_ENV'] === 'development' && process.env['ALLOW_DEMO_NO_ORIGIN'] === 'true';
    if (!allowNoOrigin) {
      throw new AppError('Access denied: Origin header required', 403);
    }
    return next();
  }

  // Extract domain from origin
  const originDomain = originHeader.split('/').slice(0, 3).join('/');
  const refererDomain = refererHeader ? refererHeader.split('/').slice(0, 3).join('/') : undefined;
  
  // Check if the origin is in the allowed list
  const isAllowed = allowedDomains.some(domain => originDomain === domain);

  // Optional strict referer check: if referer exists, it must match the same allowed origin
  const refererMatches = !refererDomain || refererDomain === originDomain;

  if (!isAllowed || !refererMatches) {
    throw new AppError(`Access denied: Domain ${originDomain} is not authorized`, 403);
  }

  // Set CORS headers for allowed origins
  res.setHeader('Access-Control-Allow-Origin', originDomain);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  next();
};

/**
 * CORS preflight handler for OPTIONS requests
 */
export const corsPreflightHandler = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
};
