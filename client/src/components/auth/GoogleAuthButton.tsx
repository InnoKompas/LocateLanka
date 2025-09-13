import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

interface GoogleAuthButtonProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const GoogleAuthButton = ({ mode, onSuccess }: GoogleAuthButtonProps) => {
  const { loginWithGoogle } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google authentication failed');
      return;
    }

    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success(`Successfully ${mode === 'signin' ? 'signed in' : 'signed up'} with Google!`);
      onSuccess?.();
    } catch (error: any) {
      console.error('Google auth error:', error);
      toast.error(error?.response?.data?.message || 'Google authentication failed');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google authentication was cancelled or failed');
  };

  // Don't render if Google OAuth is not configured
  if (!googleClientId) {
    return (
      <div className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Google Sign-In is not configured
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        text={mode === 'signin' ? 'signin_with' : 'signup_with'}
        theme="outline"
        size="large"
        width="100%"
      />
    </div>
  );
};
