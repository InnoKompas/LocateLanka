import { useAuth } from '../../hooks/useAuth';
import { OverviewPage } from '../../pages/dashboard/OverviewPage';
import { AdminOverviewPage } from '../../pages/admin/AdminOverviewPage';

export function DashboardOverview() {
  const { user } = useAuth();

  // Render admin overview for admin users, regular overview for regular users
  if (user?.role === 'admin') {
    return <AdminOverviewPage />;
  }

  return <OverviewPage />;
}
