import { useAuth } from '../../hooks/useAuth';
import { ProfileSettingsPage } from '../../pages/dashboard/ProfileSettingsPage';
import { AdminSettingsPage } from '../../pages/admin/AdminSettingsPage';

export function AdminSettingsWrapper() {
  const { user } = useAuth();

  // Render admin settings for admin users, regular settings for regular users
  if (user?.role === 'admin') {
    return <AdminSettingsPage />;
  }

  return <ProfileSettingsPage />;
}
