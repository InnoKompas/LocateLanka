import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Smartphone,
  Eye,
  EyeOff,
  Check,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal, ModalFooter } from '../../components/ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { 
  updateProfile, 
  changePassword, 
  enable2FA, 
  verify2FA, 
  disable2FA 
} from '../../services/dashboard.service';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const changePasswordMutation = useMutation({ mutationFn: changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully');
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  });

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    changePasswordMutation.mutate({
      currentPassword,
      newPassword
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Current Password"
            type={showPasswords ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            error={errors.currentPassword}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          <Input
            label="New Password"
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
            helperText="Must be at least 8 characters long"
          />

          <Input
            label="Confirm New Password"
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
        </div>
        
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={changePasswordMutation.isPending}
          >
            Change Password
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

interface Enable2FAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function Enable2FAModal({ isOpen, onClose, onSuccess }: Enable2FAModalProps) {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      const result = await enable2FA();
      setQrCode(result.qrCode);
      setSecret(result.secret);
      setStep('verify');
    } catch (error) {
      toast.error('Failed to setup 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode) return;

    setIsLoading(true);
    try {
      await verify2FA(verificationCode);
      toast.success('2FA enabled successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Enable Two-Factor Authentication">
      {step === 'setup' && (
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Two-factor authentication adds an extra layer of security to your account. 
            You'll need to scan a QR code with your authenticator app.
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
              Supported Apps:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• Google Authenticator</li>
              <li>• Authy</li>
              <li>• Microsoft Authenticator</li>
              <li>• Any TOTP-compatible app</li>
            </ul>
          </div>
          
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleEnable2FA} isLoading={isLoading}>
              Setup 2FA
            </Button>
          </ModalFooter>
        </div>
      )}

      {step === 'verify' && (
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Scan this QR code with your authenticator app
            </h4>
            
            {qrCode && (
              <div className="bg-white p-4 rounded-lg inline-block">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
            )}
            
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Manual entry key:
              </p>
              <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
                {secret}
              </code>
            </div>
          </div>

          <Input
            label="Verification Code"
            placeholder="Enter 6-digit code from your app"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
          />
          
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleVerify} 
              isLoading={isLoading}
              disabled={verificationCode.length !== 6}
            >
              Verify & Enable
            </Button>
          </ModalFooter>
        </div>
      )}
    </Modal>
  );
}

export function ProfileSettingsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState(user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '');
  const [email, setEmail] = useState(user?.email || '');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEnable2FAModal, setShowEnable2FAModal] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false); // This should come from user data

  const updateProfileMutation = useMutation({ mutationFn: updateProfile,
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  });

  const disable2FAMutation = useMutation({
    mutationFn: (token: string) => disable2FA(token),
    onSuccess: () => {
      toast.success('2FA disabled successfully');
      setIs2FAEnabled(false);
    },
    onError: () => {
      toast.error('Failed to disable 2FA');
    }
  }
  );

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: any = {};
    const currentName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '';
    if (name !== currentName) updates.name = name;
    if (email !== user?.email) updates.email = email;

    if (Object.keys(updates).length > 0) {
      updateProfileMutation.mutate(updates);
    }
  };

  const handle2FASuccess = () => {
    setIs2FAEnabled(true);
  };

  const handleDisable2FA = () => {
    const token = prompt('Enter your current 2FA code to disable:');
    if (token) {
      disable2FAMutation.mutate(token);
    }
  };

  return (
    <div className="p-6 pt-4 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account information and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card>
          <CardHeader 
            title="Profile Information" 
            description="Update your personal information"
          />
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User size={16} />}
                placeholder="Enter your full name"
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail size={16} />}
                placeholder="Enter your email"
              />

              <Button
                type="submit"
                isLoading={updateProfileMutation.isPending}
                disabled={name === (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '') && email === user?.email}
              >
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader 
            title="Security Settings" 
            description="Manage your account security"
          />
          <CardContent>
            <div className="space-y-6">
              {/* Password */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Lock className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Password</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Last changed: Never
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  Change
                </Button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    is2FAEnabled 
                      ? 'bg-green-100 dark:bg-green-900/50' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    {is2FAEnabled ? (
                      <Shield className="text-green-600" size={16} />
                    ) : (
                      <Smartphone className="text-gray-600" size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {is2FAEnabled ? 'Enabled' : 'Not enabled'}
                    </p>
                  </div>
                </div>
                
                {is2FAEnabled ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisable2FA}
                    isLoading={disable2FAMutation.isPending}
                  >
                    Disable
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowEnable2FAModal(true)}
                  >
                    Enable
                  </Button>
                )}
              </div>

              {/* Security Notice */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">
                    <p className="font-medium mb-1">Security Recommendations:</p>
                    <ul className="space-y-1">
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Regularly review your API keys</li>
                      <li>• Monitor account activity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Account Status */}
      <Card>
        <CardHeader 
          title="Account Status" 
          description="Your account information and status"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Check className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
                <p className="font-semibold text-gray-900 dark:text-white">Active</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <User className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Account Type</p>
                <p className="font-semibold text-gray-900 dark:text-white">Developer</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">📅</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Unknown
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
      />

      <Enable2FAModal
        isOpen={showEnable2FAModal}
        onClose={() => setShowEnable2FAModal(false)}
        onSuccess={handle2FASuccess}
      />
    </div>
  );
}
