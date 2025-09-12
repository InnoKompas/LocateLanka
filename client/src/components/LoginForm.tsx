import { useForm } from '@mantine/form';
import { useAuth } from '../hooks/useAuth';

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
        <div>
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="input-field"
            placeholder="your@email.com"
            required
            {...form.getInputProps('email')}
          />
        </div>
        <div>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder="Your password"
            required
            {...form.getInputProps('password')}
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-6">
          Sign In
        </button>
      </div>
    </form>
  );
}
