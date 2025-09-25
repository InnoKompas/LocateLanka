import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Key, 
  KeyRound, 
  Shield, 
  ShieldOff,
  Eye,
  Trash2,
  Clock,
  Activity
} from 'lucide-react';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { getAllApiKeys, updateApiKey, revokeApiKey, type AdminApiKey } from '../../services/admin.service';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export const AdminKeysPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedKey, setSelectedKey] = useState<AdminApiKey | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['adminApiKeys', page, search, statusFilter],
    queryFn: () => getAllApiKeys({
      page,
      limit: 20,
      search: search || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    }),
    placeholderData: (previousData) => previousData
  });

  const updateKeyMutation = useMutation({
    mutationFn: ({ keyId, updates }: { keyId: string; updates: any }) =>
      updateApiKey(keyId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminApiKeys'] });
      toast.success('API key updated successfully');
    },
    onError: (error: any) => {
        toast.error(error.message || 'Failed to update API key');
      }
    }
  );

  const revokeKeyMutation = useMutation({
    mutationFn: (keyId: string) => revokeApiKey(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminApiKeys'] });
      setShowRevokeModal(false);
      setSelectedKey(null);
      toast.success('API key revoked successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to revoke API key');
    }
  });

  const handleToggleStatus = (key: AdminApiKey) => {
    updateKeyMutation.mutate({
      keyId: key._id,
      updates: { isActive: !key.isActive }
    });
  };

  const handleRevokeKey = () => {
    if (selectedKey) {
      revokeKeyMutation.mutate(selectedKey._id);
    }
  };

  const maskApiKey = (key: string) => {
    if (!key) return 'No key available';
    return `${key.substring(0, 8)}${'*'.repeat(24)}${key.substring(key.length - 4)}`;
  };

  const columns: Column<AdminApiKey>[] = [
    {
      key: 'name',
      header: 'API Key',
      render: (_, key) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-primary-600" />
            <span className="font-medium text-text-primary">{key.name}</span>
          </div>
          <code className="text-xs text-text-secondary font-mono bg-surface-variant px-2 py-1 rounded">
            {maskApiKey(key._id)}
          </code>
        </div>
      )
    },
    {
      key: 'user',
      header: 'Owner',
      render: (_, key) => (
        <div>
          <p className="font-medium text-text-primary">
            {key.user.firstName} {key.user.lastName}
          </p>
          <p className="text-sm text-text-secondary">{key.user.email}</p>
        </div>
      )
    },
    {
      key: 'usage',
      header: 'Usage',
      render: (usage) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-3 h-3 text-blue-600" />
            <span className="text-sm text-text-primary">
              {usage?.totalRequests?.toLocaleString() || 0} total
            </span>
          </div>
          <div className="text-xs text-text-secondary">
            {usage?.requestsToday?.toLocaleString() || 0} today • {usage?.requestsThisMonth?.toLocaleString() || 0} this month
          </div>
        </div>
      )
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (isActive) => (
        <Badge variant={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Revoked'}
        </Badge>
      )
    },
    {
      key: 'lastUsed',
      header: 'Last Used',
      render: (lastUsed) => (
        <div className="flex items-center space-x-2">
          <Clock className="w-3 h-3 text-text-secondary" />
          <span className="text-sm text-text-secondary">
            {lastUsed ? formatDistanceToNow(new Date(lastUsed), { addSuffix: true }) : 'Never'}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (createdAt) => (
        <span className="text-sm text-text-secondary">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, key) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedKey(key);
              setShowKeyModal(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(key)}
            disabled={updateKeyMutation.isPending}
          >
            {key.isActive ? (
              <ShieldOff className="w-4 h-4 text-orange-600" />
            ) : (
              <Shield className="w-4 h-4 text-green-600" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedKey(key);
              setShowRevokeModal(true);
            }}
            disabled={!key.isActive}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
      <div className="p-6 pt-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">API Key Management</h1>
            <p className="text-text-secondary mt-2">
              Monitor and manage all API keys across the platform
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total Keys</p>
                <p className="text-2xl font-bold text-text-primary">
                  {data?.pagination?.total || 0}
                </p>
              </div>
              <Key className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Active Keys</p>
                <p className="text-2xl font-bold text-text-primary">
                  {data?.keys?.filter(key => key.isActive).length || 0}
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Revoked Keys</p>
                <p className="text-2xl font-bold text-text-primary">
                  {data?.keys?.filter(key => !key.isActive).length || 0}
                </p>
              </div>
              <ShieldOff className="w-8 h-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Total Requests</p>
                <p className="text-2xl font-bold text-text-primary">
                  {data?.keys?.reduce((sum, key) => sum + (key.usage?.totalRequests || 0), 0).toLocaleString() || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-text-secondary" />
            </div>
            <input
              type="text"
              placeholder="Search by key name or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Revoked</option>
          </select>
        </div>

        {/* API Keys Table */}
        <DataTable
          data={data?.keys || []}
          columns={columns}
          pagination={data?.pagination}
          onPageChange={setPage}
          loading={isLoading}
          emptyMessage="No API keys found"
        />

        {/* Key Details Modal */}
        {selectedKey && (
          <Modal
            isOpen={showKeyModal}
            onClose={() => {
              setShowKeyModal(false);
              setSelectedKey(null);
            }}
            title="API Key Details"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">{selectedKey.name}</h3>
                  <p className="text-text-secondary">
                    Owned by {selectedKey.user.firstName} {selectedKey.user.lastName}
                  </p>
                  <Badge variant={selectedKey.isActive ? 'success' : 'error'} className="mt-1">
                    {selectedKey.isActive ? 'Active' : 'Revoked'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Key ID</p>
                  <code className="text-sm text-text-primary font-mono break-all">
                    {selectedKey._id}
                  </code>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Owner Email</p>
                  <p className="text-sm text-text-primary">{selectedKey.user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Requests</p>
                  <p className="text-sm text-text-primary">
                    {selectedKey.usage?.totalRequests?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Requests Today</p>
                  <p className="text-sm text-text-primary">
                    {selectedKey.usage?.requestsToday?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Created</p>
                  <p className="text-sm text-text-primary">
                    {new Date(selectedKey.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Last Used</p>
                  <p className="text-sm text-text-primary">
                    {selectedKey.lastUsed 
                      ? new Date(selectedKey.lastUsed).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Revoke Confirmation Modal */}
        <Modal
          isOpen={showRevokeModal}
          onClose={() => {
            setShowRevokeModal(false);
            setSelectedKey(null);
          }}
          title="Revoke API Key"
        >
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to revoke this API key? This action cannot be undone and will immediately disable all access for this key.
            </p>
            {selectedKey && (
              <div className="p-4 bg-surface-variant rounded-lg">
                <p className="font-medium text-text-primary">{selectedKey.name}</p>
                <p className="text-sm text-text-secondary">
                  Owned by {selectedKey.user.firstName} {selectedKey.user.lastName}
                </p>
                <code className="text-xs text-text-secondary font-mono">
                  {maskApiKey(selectedKey._id)}
                </code>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRevokeModal(false);
                  setSelectedKey(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRevokeKey}
                disabled={revokeKeyMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {revokeKeyMutation.isPending ? 'Revoking...' : 'Revoke Key'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
  );
};
