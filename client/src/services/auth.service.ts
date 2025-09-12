import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      withCredentials: true // Important for receiving httpOnly cookies
    });
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data, {
      withCredentials: true
    });
    return response.data;
  }

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/auth/logout`, {}, {
      withCredentials: true
    });
  }

  async refreshToken(): Promise<{ accessToken: string }> {
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
      withCredentials: true
    });
    return response.data;
  }
}

export const authService = new AuthService();
