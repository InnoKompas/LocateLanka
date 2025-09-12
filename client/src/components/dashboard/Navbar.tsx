import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { SidebarToggle } from './Sidebar';

interface NavbarProps {
  onSidebarToggle: () => void;
}

export function Navbar({ onSidebarToggle }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-16 bg-surface border-b border-border px-6 backdrop-blur-sm bg-surface/95">
      <div className="flex items-center justify-between h-full">
        {/* Left side */}
        <div className="flex items-center">
          <SidebarToggle onToggle={onSidebarToggle} />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="p-2 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-right">
              <p className="text-body-sm font-medium text-text-primary">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
              </p>
              <p className="text-caption text-text-secondary">
                {user?.email}
              </p>
            </div>
            
            <Avatar 
              name={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email}
              size="sm"
            />
            
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={logout}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
