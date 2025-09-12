import { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';

export function LandingPage() {
  const [activeForm, setActiveForm] = useState<'login' | 'register' | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-indigo-900 mb-6">
          Welcome to LocateLanka
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Your comprehensive Sri Lankan GN Division lookup service
        </p>

        {!activeForm && (
          <div className="space-x-4">
            <button
              className="btn btn-primary"
              onClick={() => setActiveForm('login')}
            >
              Sign In
            </button>
            <button
              className="btn btn-outline"
              onClick={() => setActiveForm('register')}
            >
              Sign Up
            </button>
          </div>
        )}

        {activeForm && (
          <div className="card max-w-md mx-auto mt-8">
            {activeForm === 'login' ? (
              <>
                <LoginForm onSuccess={() => setActiveForm(null)} />
                <p className="mt-4 text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    className="btn-subtle"
                    onClick={() => setActiveForm('register')}
                  >
                    Sign Up
                  </button>
                </p>
              </>
            ) : (
              <>
                <RegisterForm onSuccess={() => setActiveForm(null)} />
                <p className="mt-4 text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    className="btn-subtle"
                    onClick={() => setActiveForm('login')}
                  >
                    Sign In
                  </button>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
