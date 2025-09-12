import { useForm } from '@mantine/form';
import { useAuth } from '../hooks/useAuth';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useAuth();
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      firstName: (value) => (value.length < 2 ? 'First name is required' : null),
      lastName: (value) => (value.length < 2 ? 'Last name is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      await register(values);
      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            label="First Name"
            placeholder="John"
            required
            error={form.errors.firstName}
            {...form.getInputProps('firstName')}
          />
          
          <Input
            type="text"
            label="Last Name"
            placeholder="Doe"
            required
            error={form.errors.lastName}
            {...form.getInputProps('lastName')}
          />
        </div>
        
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
          helperText="Password must be at least 6 characters"
          {...form.getInputProps('password')}
        />
        
        <Button type="submit" className="w-full mt-6">
          Sign Up
        </Button>
      </div>
    </form>
  );
}
