import { useAuth } from '../../hooks/useAuth';
import { BillingPage } from '../../pages/dashboard/BillingPage';
import { AdminBillingPage } from '../../pages/admin/AdminBillingPage';

export function AdminBillingWrapper() {
  const { user } = useAuth();

  // Render admin billing for admin users, regular billing for regular users
  if (user?.role === 'admin') {
    return <AdminBillingPage />;
  }

  return <BillingPage />;
}
