import axios, { type AxiosResponse } from 'axios';
import { handleApiError } from '../utils/errorHandler';

// Configure axios instance for admin API
const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/admin`,
  withCredentials: true,
});

// Request interceptor to add JWT token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh-token')) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return adminApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Types
export interface AdminStats {
  totalUsers: number;
  totalActiveUsers: number;
  totalApiKeys: number;
  totalActiveApiKeys: number;
  totalRequestsToday: number;
  totalRequestsThisMonth: number;
  userGrowth: number;
  requestGrowth: number;
  revenue: number;
}

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminApiKey {
  _id: string;
  name: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  isActive: boolean;
  usage: {
    totalRequests: number;
    requestsToday: number;
    requestsThisMonth: number;
  };
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageAnalytics {
  usageOverTime: Array<{
    _id: string;
    total: number;
    success: number;
    errors: number;
  }>;
  topEndpoints: Array<{
    _id: string;
    count: number;
    avgResponseTime: number;
  }>;
  topUsers: Array<{
    _id: string;
    count: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }>;
  summary: {
    totalRequests: number;
    successRate: number;
    errorRate: number;
  };
}

export interface RecentActivity {
  recentUsers: Array<{
    type: string;
    user: string;
    email: string;
    timestamp: string;
  }>;
  recentKeys: Array<{
    type: string;
    user: string;
    keyName: string;
    timestamp: string;
    isActive: boolean;
  }>;
  topEndpoints: Array<{
    endpoint: string;
    count: number;
    date: string;
  }>;
}

export interface SystemSettings {
  rateLimits: {
    free: { requestsPerHour: number; requestsPerDay: number; requestsPerMonth: number };
    pro: { requestsPerHour: number; requestsPerDay: number; requestsPerMonth: number };
    enterprise: { requestsPerHour: number; requestsPerDay: number; requestsPerMonth: number };
  };
  maintenanceMode: boolean;
  globalAnnouncement: string | null;
}

// Dashboard Services
export const getDashboardStats = async (): Promise<AdminStats> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: AdminStats }> = await adminApi.get('/dashboard/stats');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getRecentActivity = async (limit: number = 10): Promise<RecentActivity> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: RecentActivity }> = await adminApi.get(`/dashboard/activity?limit=${limit}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// User Management Services
export const getAllUsers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}): Promise<{ users: AdminUser[]; pagination: any }> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response: AxiosResponse<{ success: boolean; data: AdminUser[]; pagination: any }> = 
      await adminApi.get(`/users?${queryParams.toString()}`);
    
    return {
      users: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUser = async (userId: string, updates: Partial<AdminUser>): Promise<AdminUser> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: AdminUser }> = 
      await adminApi.patch(`/users/${userId}`, updates);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUser = async (userId: string): Promise<AdminUser> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: AdminUser }> = 
      await adminApi.delete(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// API Key Management Services
export const getAllApiKeys = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{ keys: AdminApiKey[]; pagination: any }> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response: AxiosResponse<{ success: boolean; data: AdminApiKey[]; pagination: any }> = 
      await adminApi.get(`/keys?${queryParams.toString()}`);
    
    return {
      keys: response.data.data,
      pagination: response.data.pagination
    };
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateApiKey = async (keyId: string, updates: any): Promise<AdminApiKey> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: AdminApiKey }> = 
      await adminApi.patch(`/keys/${keyId}`, updates);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const revokeApiKey = async (keyId: string): Promise<AdminApiKey> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: AdminApiKey }> = 
      await adminApi.post(`/keys/${keyId}/revoke`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Analytics Services
export const getUsageAnalytics = async (params: {
  period?: 'daily' | 'weekly' | 'monthly';
  days?: number;
}): Promise<UsageAnalytics> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response: AxiosResponse<{ success: boolean; data: UsageAnalytics }> = 
      await adminApi.get(`/analytics/usage?${queryParams.toString()}`);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// System Settings Services
export const getSystemSettings = async (): Promise<SystemSettings> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: SystemSettings }> = 
      await adminApi.get('/settings');
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateSystemSettings = async (settings: Partial<SystemSettings>): Promise<SystemSettings> => {
  try {
    const response: AxiosResponse<{ success: boolean; data: SystemSettings }> = 
      await adminApi.patch('/settings', settings);
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
