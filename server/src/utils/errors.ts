import { Response } from 'express';
import { logger } from '../config/logger.config';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (code) this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, _field?: string) {
    super(message, 400, true, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, true, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, true, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, true, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, true, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, true, 'DATABASE_ERROR');
    this.name = 'DatabaseError';
  }
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
  path?: string;
  method?: string;
}

export const createErrorResponse = (
  error: Error | AppError,
  req?: any
): ErrorResponse => {
  const isAppError = error instanceof AppError;
  
  return {
    success: false,
    error: isAppError ? error.constructor.name : 'InternalServerError',
    message: error.message,
    code: isAppError ? error.code : 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
    ...(req && {
      path: req.path,
      method: req.method,
    }),
  };
};

export const sendErrorResponse = (
  res: Response,
  error: Error | AppError,
  req?: any
): void => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const errorResponse = createErrorResponse(error, req);

  // Log error
  if (statusCode >= 500) {
    logger.error('Server Error:', {
      stack: error.stack,
      ...errorResponse,
    });
  } else {
    logger.warn('Client Error:', errorResponse);
  }

  res.status(statusCode).json(errorResponse);
};

export const asyncHandler = (
  fn: (req: any, res: any, next: any) => Promise<any>
) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
