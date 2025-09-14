import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/auth/SignInPage';
import { SignUpPage } from './pages/auth/SignUpPage';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AdminBillingWrapper } from './components/dashboard/AdminBillingWrapper';
import { AdminSettingsWrapper } from './components/dashboard/AdminSettingsWrapper';
import { ApiKeysPage } from './pages/dashboard/ApiKeysPage';
import { UsageAnalyticsPage } from './pages/dashboard/UsageAnalyticsPage';
import { DocsPage } from './pages/DocsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminKeysPage } from './pages/admin/AdminKeysPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

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
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Allow authenticated users to view public pages (like landing page)
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Redirect authenticated users away from auth pages to dashboard
  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

function PremiumRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Check if user has Pro or Enterprise access
  const userPlan = user.subscription?.plan || 'free';
  const hasAccess = userPlan === 'pro' || userPlan === 'enterprise';

  if (!hasAccess) {
    return <Navigate to="/dashboard/billing" />;
  }

  return <>{children}</>;
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
                      <LandingPage />
                    </PublicRoute>
                  }
                />

                {/* Documentation Route */}
                <Route
                  path="/docs"
                  element={
                    <PublicRoute>
                      <DocsPage />
                    </PublicRoute>
                  }
                />

                {/* Auth Routes */}
                <Route
                  path="/signin"
                  element={
                    <AuthRoute>
                      <SignInPage />
                    </AuthRoute>
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <AuthRoute>
                      <SignUpPage />
                    </AuthRoute>
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
                    <DashboardOverview />
                  </ErrorBoundary>
                } />
                <Route path="api-keys" element={
                  <ErrorBoundary>
                    <ApiKeysPage />
                  </ErrorBoundary>
                } />
                <Route path="usage" element={
                  <PremiumRoute>
                    <ErrorBoundary>
                      <UsageAnalyticsPage />
                    </ErrorBoundary>
                  </PremiumRoute>
                } />
                <Route path="billing" element={
                  <ErrorBoundary>
                    <AdminBillingWrapper />
                  </ErrorBoundary>
                } />
                <Route path="settings" element={
                  <ErrorBoundary>
                    <AdminSettingsWrapper />
                  </ErrorBoundary>
                } />
                
                {/* Admin routes using shared dashboard layout */}
                <Route path="users" element={
                  <AdminRoute>
                    <ErrorBoundary>
                      <AdminUsersPage />
                    </ErrorBoundary>
                  </AdminRoute>
                } />
                <Route path="keys" element={
                  <AdminRoute>
                    <ErrorBoundary>
                      <AdminKeysPage />
                    </ErrorBoundary>
                  </AdminRoute>
                } />
                <Route path="analytics" element={
                  <AdminRoute>
                    <ErrorBoundary>
                      <AdminAnalyticsPage />
                    </ErrorBoundary>
                  </AdminRoute>
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
