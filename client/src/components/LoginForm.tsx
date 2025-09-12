import { useForm } from '@mantine/form';
import { useAuth } from '../hooks/useAuth';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await login(values);
      onSuccess();
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="your@email.com"
          required
          error={form.errors.email}
          {...form.getInputProps('email')}
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="Your password"
          required
          error={form.errors.password}
          {...form.getInputProps('password')}
        />
        
        <Button type="submit" className="w-full mt-6">
          Sign In
        </Button>
      </div>
    </form>
  );
}
