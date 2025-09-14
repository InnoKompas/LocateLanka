import { type ReactNode, useRef, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Search, Command, LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';

interface DocsLayoutProps {
  children: ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const DocsLayout = ({ children, searchQuery = '', onSearchChange }: DocsLayoutProps) => {
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  const fromDashboard = searchParams.get('from') === 'dashboard';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border backdrop-blur-sm bg-surface/80">
        <div className="docs-container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {fromDashboard ? (
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Back to Dashboard</span>
              </Link>
            ) : (
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">Back to Home</span>
              </Link>
            )}
            <div className="h-6 w-px bg-border hidden sm:block" />
            <Link to="/docs" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LL</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-text-primary">LankaLocate API</h1>
                <p className="text-xs text-text-secondary">Documentation</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          {onSearchChange && (
            <div className="flex-1 max-w-md mx-4 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-text-secondary" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="
                    w-full pl-10 pr-12 py-2 
                    bg-surface-variant border border-border 
                    rounded-lg text-sm text-text-primary placeholder-text-secondary
                    focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100
                    transition-all duration-200
                  "
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="flex items-center space-x-1 text-xs text-text-secondary bg-surface px-2 py-1 rounded border">
                    <Command className="h-3 w-3" />
                    <span>K</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2"
              onClick={() => window.open('https://github.com/your-repo', '_blank')}
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </Button>
            
            {user ? (
              fromDashboard ? (
                <Link to="/dashboard">
                  <Button size="sm" className="flex items-center space-x-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <Button size="sm" className="flex items-center space-x-2">
                    <span>Dashboard</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              )
            ) : (
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="docs-container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-variant">
        <div className="docs-container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <span>© 2025 LankaLocate API</span>
              <span>•</span>
              <Link to="/terms" className="hover:text-text-primary transition-colors">Terms</Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-text-primary transition-colors">Privacy</Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">Made with ❤️ for Sri Lanka</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
