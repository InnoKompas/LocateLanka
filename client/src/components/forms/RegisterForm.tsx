import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please enter a valid email address'),
      password: (value) => {
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (value.length < 8) return 'Password should be at least 8 characters for better security';
        return null;
      },
      firstName: (value) => (value.length < 2 ? 'First name must be at least 2 characters' : null),
      lastName: (value) => (value.length < 2 ? 'Last name must be at least 2 characters' : null),
    },
  });

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handlePasswordChange = (value: string) => {
    form.setFieldValue('password', value);
    setPasswordStrength(calculatePasswordStrength(value));
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

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      await register(values);
      toast.success('Account created successfully! Welcome to LocateLanka!');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="text"
          label="First Name"
          placeholder="Enter first name"
          required
          error={form.errors.firstName}
          leftIcon={<User size={18} />}
          className="transition-all duration-200"
          {...form.getInputProps('firstName')}
        />
        
        <Input
          type="text"
          label="Last Name"
          placeholder="Enter last name"
          required
          error={form.errors.lastName}
          leftIcon={<User size={18} />}
          className="transition-all duration-200"
          {...form.getInputProps('lastName')}
        />
      </div>
      
      <Input
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        required
        error={form.errors.email}
        leftIcon={<Mail size={18} />}
        className="transition-all duration-200"
        {...form.getInputProps('email')}
      />
      
      <div>
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          placeholder="Create a password"
          required
          error={form.errors.password as string}
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
          value={form.values.password}
          onChange={(e) => handlePasswordChange(e.target.value)}
        />
        
        {form.values.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-body-sm mb-1">
              <span className="text-text-secondary">Password strength:</span>
              <span className={`font-medium ${
                passwordStrength <= 2 ? 'text-red-600' : 
                passwordStrength <= 3 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {getPasswordStrengthText()}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-caption text-text-secondary">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <div className="flex items-center gap-1">
                  {form.values.password.length >= 8 ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <X size={12} className="text-red-500" />
                  )}
                  <span>8+ characters</span>
                </div>
                <div className="flex items-center gap-1">
                  {/[A-Z]/.test(form.values.password) ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <X size={12} className="text-red-500" />
                  )}
                  <span>Uppercase</span>
                </div>
                <div className="flex items-center gap-1">
                  {/[0-9]/.test(form.values.password) ? (
                    <Check size={12} className="text-green-500" />
                  ) : (
                    <X size={12} className="text-red-500" />
                  )}
                  <span>Number</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-caption text-text-secondary">
          By creating an account, you agree to our{' '}
          <button
            type="button"
            className="btn-subtle text-caption"
            onClick={() => toast('Terms of Service coming soon!', { icon: 'ℹ️' })}
          >
            Terms of Service
          </button>
          {' '}and{' '}
          <button
            type="button"
            className="btn-subtle text-caption"
            onClick={() => toast('Privacy Policy coming soon!', { icon: 'ℹ️' })}
          >
            Privacy Policy
          </button>
        </p>
      </div>
    </form>
  );
}
