// Error handling utilities

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Extract error message from various error formats
 */
export function extractErrorMessage(error: any, fallback: string = 'An error occurred'): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.response?.data) {
    const data = error.response.data;
    
    // Server response format: { success: false, message: "...", code: "..." }
    if (data.message) {
      return data.message;
    }
    
    // Legacy format: { error: "..." }
    if (data.error) {
      return data.error;
    }
    
    // Validation errors format: { errors: [...] }
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors[0].message || data.errors[0];
    }
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
}

/**
 * Create a standardized API error object
 */
export function createApiError(error: any, fallback: string = 'An error occurred'): ApiError {
  const message = extractErrorMessage(error, fallback);
  
  let status: number | undefined;
  let code: string | undefined;
  let details: any;

  if (error?.response) {
    status = error.response.status;
    code = error.response.data?.code;
    details = error.response.data?.details;
  }

  return {
    message,
    code,
    status,
    details
  };
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: any, fallback: string = 'An error occurred'): never {
  const apiError = createApiError(error, fallback);
  throw new Error(apiError.message);
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: any): boolean {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('Network Error') ||
         !error?.response;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: any): boolean {
  return error?.response?.status === 401 || 
         error?.response?.data?.code === 'INVALID_TOKEN' ||
         error?.response?.data?.code === 'TOKEN_MISSING';
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: any): boolean {
  return error?.response?.status === 400 || 
         error?.response?.data?.code === 'VALIDATION_ERROR';
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: any): boolean {
  return error?.response?.status === 429 || 
         error?.response?.data?.code === 'RATE_LIMIT_EXCEEDED';
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your internet connection.';
  }

  if (isAuthError(error)) {
    return 'Your session has expired. Please sign in again.';
  }

  if (isRateLimitError(error)) {
    return 'You have exceeded the rate limit. Please try again later.';
  }

  if (isValidationError(error)) {
    return extractErrorMessage(error, 'Please check your input and try again.');
  }

  const status = error?.response?.status;
  
  switch (status) {
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 500:
      return 'A server error occurred. Please try again later.';
    case 503:
      return 'The service is temporarily unavailable. Please try again later.';
    default:
      return extractErrorMessage(error, 'An unexpected error occurred.');
  }
}
