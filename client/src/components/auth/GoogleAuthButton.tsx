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
