import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LandingPage } from './pages/LandingPage';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route
                path="/"
                element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                }
              />
              {/* Add more routes here */}
            </Routes>
          </Router>
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
