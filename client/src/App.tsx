import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { NewLandingPage } from './pages/NewLandingPage';
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { ApiKeysPage } from './pages/dashboard/ApiKeysPage';
import { UsageAnalyticsPage } from './pages/dashboard/UsageAnalyticsPage';
import { BillingPage } from './pages/dashboard/BillingPage';
import { ProfileSettingsPage } from './pages/dashboard/ProfileSettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
}

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const AppContent = () => (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <ThemeProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <NewLandingPage />
                    </PublicRoute>
                  }
                />

                {/* Auth Routes */}
                <Route
                  path="/signin"
                  element={
                    <PublicRoute>
                      <SignInPage />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <PublicRoute>
                      <SignUpPage />
                    </PublicRoute>
                  }
                />

                {/* Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={
                  <ErrorBoundary>
                    <OverviewPage />
                  </ErrorBoundary>
                } />
                <Route path="api-keys" element={
                  <ErrorBoundary>
                    <ApiKeysPage />
                  </ErrorBoundary>
                } />
                <Route path="usage" element={
                  <ErrorBoundary>
                    <UsageAnalyticsPage />
                  </ErrorBoundary>
                } />
                <Route path="billing" element={
                  <ErrorBoundary>
                    <BillingPage />
                  </ErrorBoundary>
                } />
                <Route path="settings" element={
                  <ErrorBoundary>
                    <ProfileSettingsPage />
                  </ErrorBoundary>
                } />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                border: '1px solid var(--toast-border)',
              },
            }}
          />
          </AuthProvider>
        </ThemeProvider>
      </MantineProvider>
    </QueryClientProvider>
  );

  // Only wrap with GoogleOAuthProvider if client ID is available
  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <AppContent />
      </GoogleOAuthProvider>
    );
  }

  return <AppContent />;
}
