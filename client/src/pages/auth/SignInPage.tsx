import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

import { AuthLayout } from '../../components/auth/AuthLayout';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Welcome back! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error: any) {
      console.error('Sign in failed:', error);
      toast.error(error?.response?.data?.message || 'Sign in failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    navigate('/dashboard');
  };

  const handleForgotPassword = () => {
    toast('Password reset functionality coming soon!', { 
      icon: 'ℹ️',
      duration: 4000 
    });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your LankaLocate developer account"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            error={errors.email?.message}
            leftIcon={<Mail size={18} />}
            className="transition-all duration-200"
            {...register('email')}
          />
        </div>

        {/* Password Field */}
        <div>
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            leftIcon={<Lock size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            className="transition-all duration-200"
            {...register('password')}
          />
        </div>

        {/* Forgot Password Link */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="btn-subtle text-body-sm hover:text-primary-700 transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        {/* Sign In Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            size="lg"
            className="w-full flex items-center justify-center space-x-2"
            isLoading={isLoading}
            disabled={isLoading}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            {!isLoading && <ArrowRight size={18} />}
          </Button>
        </motion.div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-body-sm">
            <span className="px-4 bg-surface text-text-secondary">OR</span>
          </div>
        </div>

        {/* Google Sign In */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GoogleAuthButton mode="signin" onSuccess={handleGoogleSuccess} />
        </motion.div>

        {/* Sign Up Link */}
        <div className="text-center pt-4">
          <p className="text-body-sm text-text-secondary">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
