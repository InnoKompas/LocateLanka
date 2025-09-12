import { useForm } from '@mantine/form';
import { useAuth } from '../hooks/useAuth';

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
        <div>
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="input-field"
            placeholder="John"
            required
            {...form.getInputProps('firstName')}
          />
        </div>
        <div>
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className="input-field"
            placeholder="Doe"
            required
            {...form.getInputProps('lastName')}
          />
        </div>
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
          Sign Up
        </button>
      </div>
    </form>
  );
}
