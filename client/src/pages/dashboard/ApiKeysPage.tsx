import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  Plus, 
  Trash2, 
  MoreVertical,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal, ModalFooter } from '../../components/ui/Modal';
import { ApiKeyDisplay } from '../../components/models/ApiKeyDisplay';
import { 
  getApiKeys, 
  createApiKey, 
  revokeApiKey,
  getApiKeyLimits,
  type ApiKey
} from '../../services/dashboard.service';

interface CreateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newKey?: ApiKey) => void;
}

function CreateKeyModal({ isOpen, onClose, onSuccess }: CreateKeyModalProps) {
  const [keyName, setKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    setIsLoading(true);
    try {
      const newKey = await createApiKey(keyName.trim());
      toast.success('API key created successfully!');
      onSuccess(newKey);
      onClose();
      setKeyName('');
    } catch (error) {
      toast.error('Failed to create API key');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New API Key">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Key Name"
            placeholder="e.g., Production App, Testing Environment"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            helperText="Choose a descriptive name to identify this key"
            required
          />
        </div>
        
        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={!keyName.trim()}>
            Create Key
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onRevoke: (keyId: string) => void;
}

function ApiKeyCard({ apiKey, onRevoke }: ApiKeyCardProps) {
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  const handleToggleStatus = () => {
    toast('Status toggle feature coming soon!', { icon: 'ℹ️' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Card variant="elevated">
        <CardContent>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {apiKey.name}
                </h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  apiKey.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                }`}>
                  {apiKey.isActive ? (
                    <>
                      <CheckCircle size={12} className="mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertCircle size={12} className="mr-1" />
                      Inactive
                    </>
                  )}
                </span>
              </div>
              
              <div className="mb-3">
                <ApiKeyDisplay
                  apiKey={apiKey.key}
                  keyPrefix={apiKey.keyPrefix}
                  size="md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Created</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(apiKey.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Last Used</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {apiKey.lastUsed ? formatDate(apiKey.lastUsed) : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Calls This Month</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {(apiKey.callsThisMonth || apiKey.usage?.requestsThisMonth || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Environment</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {apiKey.metadata?.environment || 'development'}
                  </p>
                </div>
              </div>
            </div>

            <div className="ml-4 flex flex-col space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleStatus}
                className="p-2"
              >
                <MoreVertical size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRevokeConfirm(true)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revoke Confirmation Modal */}
      <Modal 
        isOpen={showRevokeConfirm} 
        onClose={() => setShowRevokeConfirm(false)}
        title="Revoke API Key"
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to revoke the API key "{apiKey.name}"? This action cannot be undone.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-300">
              ⚠️ Applications using this key will immediately lose access to the API.
            </p>
          </div>
        </div>
        
        <ModalFooter>
          <Button 
            variant="outline" 
            onClick={() => setShowRevokeConfirm(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="danger"
            onClick={() => {
              onRevoke(apiKey.id || apiKey._id);
              setShowRevokeConfirm(false);
            }}
          >
            Revoke Key
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

interface NewKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: ApiKey | null;
}

function NewKeyModal({ isOpen, onClose, apiKey }: NewKeyModalProps) {
  if (!apiKey) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="API Key Created Successfully">
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="text-green-600" size={20} />
            <h3 className="font-medium text-green-800 dark:text-green-300">
              Your API key has been created!
            </h3>
          </div>
          <p className="text-sm text-green-700 dark:text-green-400">
            Please copy and save this key now. For security reasons, it won't be shown again.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            API Key
          </label>
          <ApiKeyDisplay
            apiKey={apiKey.key}
            keyPrefix={apiKey.keyPrefix}
            size="lg"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400">Name</p>
            <p className="font-medium text-gray-900 dark:text-white">{apiKey.name}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400">Environment</p>
            <p className="font-medium text-gray-900 dark:text-white capitalize">
              {apiKey.metadata?.environment || 'development'}
            </p>
          </div>
        </div>
      </div>
      
      <ModalFooter>
        <Button onClick={onClose} className="w-full">
          I've Saved My Key
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export function ApiKeysPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<ApiKey | null>(null);
  const queryClient = useQueryClient();

  const { data: apiKeys, isLoading } = useQuery('apiKeys', getApiKeys);
  const { data: apiKeyLimits, isLoading: limitsLoading } = useQuery('apiKeyLimits', getApiKeyLimits);

  const revokeMutation = useMutation(revokeApiKey, {
    onSuccess: () => {
      queryClient.invalidateQueries('apiKeys');
      queryClient.invalidateQueries('apiKeyLimits');
      toast.success('API key revoked successfully');
    },
    onError: () => {
      toast.error('Failed to revoke API key');
    }
  });


  const handleCreateSuccess = (newKey?: ApiKey) => {
    queryClient.invalidateQueries('apiKeys');
    queryClient.invalidateQueries('apiKeyLimits');
    if (newKey) {
      setNewlyCreatedKey(newKey);
      setShowNewKeyModal(true);
    }
  };

  const canCreateMore = apiKeyLimits?.canCreate ?? false;

  if (isLoading) {
    return (
      <div className="p-6 pt-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            API Keys
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your API keys and monitor their usage
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          disabled={!canCreateMore}
          leftIcon={<Plus size={20} />}
        >
          Create New Key
        </Button>
      </div>

      {/* Info Card */}
      <Card>
        <CardContent>
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <AlertCircle className="text-blue-600" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                API Key Guidelines
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                <li>• Keep your API keys secure and never share them publicly</li>
                <li>• You can create up to 5 API keys per account</li>
                <li>• Use different keys for different environments (development, production)</li>
                <li>• Monitor usage regularly and revoke unused keys</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Keys Usage Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your API Keys
        </h2>
        {!limitsLoading && apiKeyLimits && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>
              {apiKeyLimits.current} / {apiKeyLimits.limit === -1 ? '∞' : apiKeyLimits.limit} used
            </span>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full capitalize">
              {apiKeyLimits.plan}
            </span>
          </div>
        )}
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {apiKeys && apiKeys.length > 0 ? (
          apiKeys.map((apiKey) => (
            <ApiKeyCard
              key={apiKey.id}
              apiKey={apiKey}
              onRevoke={(keyId) => revokeMutation.mutate(keyId)}
            />
          ))
        ) : (
          <Card>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-400 text-xl">🔑</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No API Keys Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first API key to start using our services
                </p>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(true)}
                  leftIcon={<Plus size={20} />}
                >
                  Create Your First Key
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Limit Notice */}
      {!canCreateMore && (
        <Card>
          <CardContent>
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-yellow-500" size={20} />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  API Key Limit Reached
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You've reached the maximum of {apiKeyLimits?.limit} API keys for your {apiKeyLimits?.plan} plan. 
                  {apiKeyLimits?.plan === 'free' ? (
                    <> Upgrade to Pro for 10 API keys or Enterprise for unlimited keys.</>
                  ) : (
                    <> Revoke an existing key to create a new one.</>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Key Modal */}
      <CreateKeyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* New Key Display Modal */}
      <NewKeyModal
        isOpen={showNewKeyModal}
        onClose={() => {
          setShowNewKeyModal(false);
          setNewlyCreatedKey(null);
        }}
        apiKey={newlyCreatedKey}
      />
    </div>
  );
}
