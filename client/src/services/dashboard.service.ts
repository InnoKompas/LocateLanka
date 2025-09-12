import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface UserStats {
  totalApiCalls: number;
  remainingQuota: number;
  subscriptionStatus: string;
  currentPlan: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  callsThisMonth: number;
  isActive: boolean;
}

export interface UsageData {
  date: string;
  calls: number;
  endpoint?: string;
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
  const response = await api.get('/user/stats');
  return response.data;
};

// API Keys API
export const getApiKeys = async (): Promise<ApiKey[]> => {
  const response = await api.get('/keys');
  return response.data;
};

export const createApiKey = async (name: string): Promise<ApiKey> => {
  const response = await api.post('/keys', { name });
  return response.data;
};

export const revokeApiKey = async (keyId: string): Promise<void> => {
  await api.delete(`/keys/${keyId}`);
};

export const updateApiKey = async (keyId: string, data: { name?: string; isActive?: boolean }): Promise<ApiKey> => {
  const response = await api.patch(`/keys/${keyId}`, data);
  return response.data;
};

// Usage Analytics API
export const getUsageData = async (period: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<UsageData[]> => {
  const response = await api.get(`/usage?period=${period}`);
  return response.data;
};

export const getTopEndpoints = async (): Promise<{ endpoint: string; calls: number }[]> => {
  const response = await api.get('/usage/top-endpoints');
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
