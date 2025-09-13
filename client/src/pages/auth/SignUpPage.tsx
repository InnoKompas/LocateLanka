import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { AuthLayout } from '../../components/auth/AuthLayout';
import { GoogleAuthButton } from '../../components/auth/GoogleAuthButton';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';

const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const password = watch('password', '');

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Medium';
    return 'Strong';
  };

  // Update password strength when password changes
  useState(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      const response = await registerUser(userData);
      toast.success(response.message);
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    } catch (error: any) {
      console.error('Sign up failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    navigate('/dashboard');
  };

  const handleTermsClick = () => {
    toast('Terms of Service coming soon!', { 
      icon: 'ℹ️',
      duration: 4000 
    });
  };

  const handlePrivacyClick = () => {
    toast('Privacy Policy coming soon!', { 
      icon: 'ℹ️',
      duration: 4000 
    });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of developers using LankaLocate API"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="text"
            label="First Name"
            placeholder="Enter first name"
            error={errors.firstName?.message}
            leftIcon={<User size={18} />}
            className="transition-all duration-200"
            {...register('firstName')}
          />
          
          <Input
            type="text"
            label="Last Name"
            placeholder="Enter last name"
            error={errors.lastName?.message}
            leftIcon={<User size={18} />}
            className="transition-all duration-200"
            {...register('lastName')}
          />
        </div>

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

        {/* Password Field with Strength Indicator */}
        <div>
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Create a password"
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
          
          {password && (
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between text-body-sm mb-2">
                <span className="text-text-secondary">Password strength:</span>
                <span className={`font-medium ${
                  passwordStrength <= 2 ? 'text-red-600' : 
                  passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {getPasswordStrengthText()}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <div className="text-caption text-text-secondary">
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1">
                    {password.length >= 8 ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <X size={12} className="text-red-500" />
                    )}
                    <span>8+ characters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/[A-Z]/.test(password) ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <X size={12} className="text-red-500" />
                    )}
                    <span>Uppercase</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/[0-9]/.test(password) ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <X size={12} className="text-red-500" />
                    )}
                    <span>Number</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/[^A-Za-z0-9]/.test(password) ? (
                      <Check size={12} className="text-green-500" />
                    ) : (
                      <X size={12} className="text-red-500" />
                    )}
                    <span>Special char</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirm Password"
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            leftIcon={<Lock size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            className="transition-all duration-200"
            {...register('confirmPassword')}
          />
        </div>

        {/* Terms and Privacy */}
        <div className="text-center">
          <p className="text-caption text-text-secondary">
            By creating an account, you agree to our{' '}
            <button
              type="button"
              onClick={handleTermsClick}
              className="btn-subtle text-caption"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button
              type="button"
              onClick={handlePrivacyClick}
              className="btn-subtle text-caption"
            >
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Sign Up Button */}
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
            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
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

        {/* Google Sign Up */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GoogleAuthButton mode="signup" onSuccess={handleGoogleSuccess} />
        </motion.div>

        {/* Sign In Link */}
        <div className="text-center pt-4">
          <p className="text-body-sm text-text-secondary">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
