import { useState, useEffect, createContext, useContext } from 'react';
import { authService } from '../services/auth.service';
import type { LoginCredentials, RegisterData, User } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: true; message: string }>;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated on app start
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            // Try to refresh token
            await authService.refreshToken();
            const refreshedUser = authService.getCurrentUser();
            if (refreshedUser) {
              setUser(refreshedUser);
            }
          }
        }
      } catch (error) {
        console.warn('Failed to initialize auth:', error);
        // Clear any invalid tokens
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.register(data);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to register';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (token: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authService.loginWithGoogle(token);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login with Google';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err: any) {
      console.warn('Logout error:', err);
      // Continue with logout even if server request fails
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      await authService.refreshToken();
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (err: any) {
      setUser(null);
      setError('Session expired');
      throw err;
    }
  };

  const isAuthenticated = !!user && authService.isAuthenticated();

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      loginWithGoogle, 
      logout, 
      refreshToken,
      isLoading, 
      isAuthenticated,
      error 
    }}>
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
