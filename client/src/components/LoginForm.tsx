import { useState } from 'react';
import { useForm } from '@mantine/form';
import { useAuth } from '../hooks/useAuth';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Please enter a valid email address'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    try {
      await login(values);
      toast.success('Welcome back! Redirecting to your dashboard...');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="space-y-5">
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
      
      <Input
        type={showPassword ? 'text' : 'password'}
        label="Password"
        placeholder="Enter your password"
        required
        error={form.errors.password}
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
        {...form.getInputProps('password')}
      />
      
      <div className="pt-2">
        <Button 
          type="submit" 
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="btn-subtle text-body-sm"
          onClick={() => toast('Password reset functionality coming soon!', { icon: 'ℹ️' })}
        >
          Forgot your password?
        </button>
      </div>
    </form>
  );
}
