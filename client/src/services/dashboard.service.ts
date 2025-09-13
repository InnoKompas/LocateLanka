import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests and handle responses
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle API responses and errors
api.interceptors.response.use(
  (response) => {
    // Extract data from server response format
    if (response.data && response.data.success !== undefined) {
      return {
        ...response,
        data: response.data.data || response.data
      };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Don't try to refresh token for refresh token requests or if already retried
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url?.includes('/auth/refresh-token')) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
          withCredentials: true
        });
        
        if (refreshResponse.data.accessToken) {
          localStorage.setItem('accessToken', refreshResponse.data.accessToken);
          
          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export interface UserStats {
  totalKeys: number;
  totalRequests: number;
  totalRequestsToday: number;
  totalRequestsThisMonth: number;
  totalDailyLimit: number;
  totalMonthlyLimit: number;
  utilizationPercentage: {
    daily: number;
    monthly: number;
  };
}

export interface ApiKey {
  _id: string;
  id?: string; // For backward compatibility
  name: string;
  key?: string; // Only available when creating/regenerating
  keyPrefix: string;
  permissions: string[];
  rateLimit: {
    requestsPerHour: number;
    requestsPerDay: number;
    requestsPerMonth: number;
  };
  restrictions: {
    allowedIPs?: string[];
    allowedDomains?: string[];
    allowedEndpoints?: string[];
  };
  usage: {
    totalRequests: number;
    requestsToday: number;
    requestsThisMonth: number;
  };
  metadata: {
    description?: string;
    environment: 'development' | 'staging' | 'production';
  };
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  callsThisMonth?: number; // For backward compatibility
}

export interface CreateApiKeyRequest {
  name: string;
  description?: string;
  environment?: 'development' | 'staging' | 'production';
  permissions?: string[];
  rateLimit?: {
    requestsPerHour?: number;
    requestsPerDay?: number;
    requestsPerMonth?: number;
  };
  restrictions?: {
    allowedIPs?: string[];
    allowedDomains?: string[];
    allowedEndpoints?: string[];
  };
  expiresAt?: string;
}

export interface UsageData {
  date: string;
  calls: number;
  endpoint?: string;
}

export interface ApiKeyUsage {
  keyId: string;
  name: string;
  usage: {
    totalRequests: number;
    requestsToday: number;
    requestsThisMonth: number;
  };
  rateLimit: {
    requestsPerHour: number;
    requestsPerDay: number;
    requestsPerMonth: number;
  };
  utilizationPercentage: {
    daily: number;
    monthly: number;
  };
  isWithinLimit: boolean;
}

export interface BillingInfo {
  currentPlan: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
  paymentMethod: string;
}

export interface PlanFeatures {
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: {
    apiCalls: number;
    apiKeys: number;
  };
}

// User & Stats API
export const getUserStats = async (): Promise<UserStats> => {
  const response = await api.get('/api/keys/usage/total');
  return response.data;
};

// API Keys API
export const getApiKeys = async (): Promise<ApiKey[]> => {
  const response = await api.get('/api/keys');
  const keys = response.data;
  
  // Add backward compatibility fields
  return keys.map((key: ApiKey) => ({
    ...key,
    id: key._id,
    callsThisMonth: key.usage.requestsThisMonth,
    lastUsed: key.lastUsed || null
  }));
};

export const createApiKey = async (name: string, options?: Partial<CreateApiKeyRequest>): Promise<ApiKey> => {
  const requestData: CreateApiKeyRequest = {
    name,
    ...options
  };
  
  const response = await api.post('/api/keys', requestData);
  const key = response.data;
  
  return {
    ...key,
    id: key._id,
    callsThisMonth: key.usage.requestsThisMonth,
    lastUsed: key.lastUsed || null
  };
};

export const revokeApiKey = async (keyId: string): Promise<void> => {
  await api.delete(`/api/keys/${keyId}`);
};

export const updateApiKey = async (keyId: string, data: Partial<CreateApiKeyRequest>): Promise<ApiKey> => {
  const response = await api.put(`/api/keys/${keyId}`, data);
  const key = response.data;
  
  return {
    ...key,
    id: key._id,
    callsThisMonth: key.usage.requestsThisMonth,
    lastUsed: key.lastUsed || null
  };
};

export const regenerateApiKey = async (keyId: string): Promise<ApiKey> => {
  const response = await api.post(`/api/keys/${keyId}/regenerate`);
  const key = response.data;
  
  return {
    ...key,
    id: key._id,
    callsThisMonth: key.usage.requestsThisMonth,
    lastUsed: key.lastUsed || null
  };
};

export const getApiKeyUsage = async (keyId: string): Promise<ApiKeyUsage> => {
  const response = await api.get(`/api/keys/${keyId}/usage`);
  return response.data;
};

// Usage Analytics API
export const getUsageData = async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<UsageData[]> => {
  const days = period === 'daily' ? 30 : period === 'weekly' ? 84 : 365;
  const response = await api.get(`/api/analytics/usage?period=${period}&days=${days}`);
  return response.data;
};

export const getTopEndpoints = async (): Promise<{ endpoint: string; calls: number }[]> => {
  const response = await api.get('/api/analytics/endpoints');
  return response.data;
};

export const getDashboardAnalytics = async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<any> => {
  const response = await api.get(`/api/analytics/dashboard?period=${period}`);
  return response.data;
};

export const getApiKeyAnalytics = async (keyId: string, period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<any> => {
  const response = await api.get(`/api/analytics/keys/${keyId}?period=${period}`);
  return response.data;
};

// Billing API
export const getBillingInfo = async (): Promise<BillingInfo> => {
  const response = await api.get('/billing');
  return response.data;
};

export const getAvailablePlans = async (): Promise<PlanFeatures[]> => {
  const response = await api.get('/billing/plans');
  return response.data;
};

export const upgradePlan = async (planId: string): Promise<{ checkoutUrl: string }> => {
  const response = await api.post('/billing/upgrade', { planId });
  return response.data;
};

// Profile API
export const updateProfile = async (data: { name?: string; email?: string }): Promise<any> => {
  const response = await api.patch('/user/profile', data);
  return response.data;
};

export const changePassword = async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
  await api.post('/user/change-password', data);
};

export const enable2FA = async (): Promise<{ qrCode: string; secret: string }> => {
  const response = await api.post('/user/2fa/enable');
  return response.data;
};

export const verify2FA = async (token: string): Promise<void> => {
  await api.post('/user/2fa/verify', { token });
};

export const disable2FA = async (token: string): Promise<void> => {
  await api.post('/user/2fa/disable', { token });
};
