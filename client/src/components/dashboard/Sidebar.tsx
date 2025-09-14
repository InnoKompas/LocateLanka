import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Key, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Menu,
  X,
  Moon,
  Sun,
  Users,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: any;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  // Define navigation items based on user role
  const getNavigationItems = (): NavigationItem[] => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/dashboard/users', icon: Users },
        { name: 'API Keys', href: '/dashboard/keys', icon: Key },
        { name: 'Usage Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { name: 'Billing & Plans', href: '/dashboard/billing', icon: CreditCard },
        { name: 'System Settings', href: '/dashboard/settings', icon: Settings },
      ];
    } else {
      return [
        { name: 'Overview', href: '/dashboard', icon: Home },
        { name: 'API Keys', href: '/dashboard/api-keys', icon: Key },
        { name: 'Usage Analytics', href: '/dashboard/usage', icon: BarChart3 },
        { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
      ];
    }
  };

  const navigation = getNavigationItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border',
          'transform transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm">LL</span>
            </div>
            <div className="ml-3">
              <span className="text-heading-3 text-text-primary font-semibold">
                {user?.role === 'admin' ? 'Admin Panel' : 'LocateLanka'}
              </span>
              {user?.role === 'admin' && (
                <p className="text-xs text-text-secondary">LankaLocate</p>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="lg:hidden p-2"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2.5 text-body-sm font-medium rounded-lg transition-all duration-200',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  isActive
                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-primary'
                )}
              >
                <Icon size={20} className="mr-3 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="w-full justify-start"
            leftIcon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </div>
    </>
  );
}

export function SidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="lg:hidden p-2"
    >
      <Menu size={20} />
    </Button>
  );
}
