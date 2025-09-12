import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900/20 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-200 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <MapPin className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-heading-2 font-bold text-text-primary">
                LankaLocate
              </h1>
              <p className="text-caption text-text-secondary -mt-1">
                Developer API for Sri Lanka GN Divisions
              </p>
            </div>
          </motion.div>
        </div>

        {/* Auth Card */}
        <motion.div
          className="bg-surface/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-heading-1 font-bold text-text-primary mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-body-sm text-text-secondary">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-caption text-text-secondary">
            © 2024 LankaLocate. Built for developers, by developers.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
