import { Request, Response, NextFunction } from 'express';
import { AppError, sendErrorResponse } from '../utils/errors';
import { logger } from '../config/logger.config';
import { IS_PRODUCTION } from '../config/environment.config';

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Don't handle if response already sent
  if (res.headersSent) {
    return next(error);
  }

  // Handle specific error types
  if (error.name === 'ValidationError') {
    const validationError = new AppError(error.message, 400, true, 'VALIDATION_ERROR');
    return sendErrorResponse(res, validationError, req);
  }

  if (error.name === 'CastError') {
    const castError = new AppError('Invalid ID format', 400, true, 'INVALID_ID');
    return sendErrorResponse(res, castError, req);
  }

  if (error.name === 'MongoServerError' && (error as any).code === 11000) {
    // Extract field name from MongoDB duplicate key error
    const duplicateField = Object.keys((error as any).keyValue || {})[0];
    let message = 'Duplicate field value';
    
    if (duplicateField) {
      if (duplicateField === 'hashedKey') {
        message = 'Duplicate API key generated. Please try again.';
      } else {
        message = `Duplicate ${duplicateField}: this value already exists`;
      }
    }
    
    const duplicateError = new AppError(message, 409, true, 'DUPLICATE_VALUE');
    return sendErrorResponse(res, duplicateError, req);
  }

  if (error.name === 'JsonWebTokenError') {
    const jwtError = new AppError('Invalid token', 401, true, 'INVALID_TOKEN');
    return sendErrorResponse(res, jwtError, req);
  }

  if (error.name === 'TokenExpiredError') {
    const expiredError = new AppError('Token expired', 401, true, 'TOKEN_EXPIRED');
    return sendErrorResponse(res, expiredError, req);
  }

  // Handle operational errors
  if (error instanceof AppError && error.isOperational) {
    return sendErrorResponse(res, error, req);
  }

  // Handle programming errors
  logger.error('Programming Error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Don't leak error details in production
  const message = IS_PRODUCTION 
    ? 'Something went wrong' 
    : error.message;

  const serverError = new AppError(message, 500, false, 'INTERNAL_ERROR');
  sendErrorResponse(res, serverError, req);
};

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    true,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

// Graceful shutdown handler
export const gracefulShutdown = (signal: string) => {
  return (server: any) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);
    
    server.close(() => {
      logger.info('HTTP server closed');
      
      // Close database connections
      const { DatabaseConfig } = require('../config/database.config');
      DatabaseConfig.getInstance().disconnect()
        .then(() => {
          logger.info('Database connections closed');
          process.exit(0);
        })
        .catch((error: any) => {
          logger.error('Error during database shutdown:', error);
          process.exit(1);
        });
    });

    // Force close after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };
};
