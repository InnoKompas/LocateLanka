export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
  meta?: {
    total?: number;
    count?: number;
    limit?: number;
    offset?: number;
    timestamp?: string;
    [key: string]: any;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: any;
  timestamp?: string;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface SearchParams extends PaginationParams {
  query: string;
}

export interface FilterParams {
  district?: string;
  city?: string;
  province?: string;
  limit?: number;
  offset?: number;
}
