import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/auth.service';
import type { AuthResponse, LoginCredentials, RegisterData } from '../services/auth.service';

interface AuthContextType {
  user: AuthResponse['user'] | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to login');
      throw err;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('user');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to logout');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
