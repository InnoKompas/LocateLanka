import axios, { type AxiosResponse } from 'axios';
import { handleApiError } from '../utils/errorHandler';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Create axios instance with default config
const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for receiving httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor to handle token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't try to refresh token for refresh token requests or if already retried
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url?.includes('/auth/refresh-token')) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await authApi.post('/auth/refresh-token');
        const { accessToken } = refreshResponse.data;
        
        // Store new token
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear token and redirect to login
        localStorage.removeItem('accessToken');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authApi.post('/auth/login', credentials);
      
      // Store access token
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Login failed');
    }
  }

  async register(data: RegisterData): Promise<{ success: true; message: string }> {
    try {
      // Register the user
      await authApi.post('/auth/register', data);
      
      return { 
        success: true, 
        message: 'Registration successful! Please sign in with your credentials.' 
      };
    } catch (error: any) {
      handleApiError(error, 'Registration failed');
    }
  }

  async loginWithGoogle(token: string): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await authApi.post('/auth/google', { token });
      
      // Store access token
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response.data;
    } catch (error: any) {
      handleApiError(error, 'Google login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.warn('Logout request failed:', error);
    } finally {
      localStorage.removeItem('accessToken');
    }
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      const response = await authApi.post('/auth/refresh-token');
      
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response.data;
    } catch (error: any) {
      localStorage.removeItem('accessToken');
      handleApiError(error, 'Token refresh failed');
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      await authApi.post('/auth/change-password', 
        { oldPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
    } catch (error: any) {
      handleApiError(error, 'Password change failed');
    }
  }

  getCurrentUser(): User | null {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      // Decode JWT token to get user info (basic implementation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user || null;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
