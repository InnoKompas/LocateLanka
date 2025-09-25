import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  UserCheck, 
  UserX, 
  Shield, 
  ShieldOff,
  Eye,
  Trash2
} from 'lucide-react';
import { DataTable, type Column } from '../../components/admin/DataTable';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { getAllUsers, updateUser, deleteUser, type AdminUser } from '../../services/admin.service';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export const AdminUsersPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page, search, roleFilter, statusFilter],
    queryFn: () => getAllUsers({
      page,
      limit: 20,
      search: search || undefined,
      role: roleFilter !== 'all' ? roleFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    }),
    placeholderData: (previousData) => previousData
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<AdminUser> }) =>
      updateUser(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setShowDeleteModal(false);
      setSelectedUser(null);
      toast.success('User deactivated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to deactivate user');
    }
  }
  );

  const handleToggleStatus = (user: AdminUser) => {
    updateUserMutation.mutate({
      userId: user._id,
      updates: { isActive: !user.isActive }
    });
  };

  const handleToggleRole = (user: AdminUser) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    updateUserMutation.mutate({
      userId: user._id,
      updates: { role: newRole }
    });
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser._id);
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      header: 'User',
      render: (_, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-text-primary">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-text-secondary">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (role) => (
        <Badge variant={role === 'admin' ? 'primary' : 'gray'}>
          {role === 'admin' ? (
            <>
              <Shield className="w-3 h-3 mr-1" />
              Admin
            </>
          ) : (
            'User'
          )}
        </Badge>
      )
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (isActive) => (
        <Badge variant={isActive ? 'success' : 'error'}>
          {isActive ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'createdAt',
      header: 'Joined',
      render: (createdAt) => (
        <span className="text-sm text-text-secondary">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, user) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(user)}
            disabled={updateUserMutation.isPending}
          >
            {user.isActive ? (
              <UserX className="w-4 h-4 text-red-600" />
            ) : (
              <UserCheck className="w-4 h-4 text-green-600" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleRole(user)}
            disabled={updateUserMutation.isPending}
          >
            {user.role === 'admin' ? (
              <ShieldOff className="w-4 h-4 text-orange-600" />
            ) : (
              <Shield className="w-4 h-4 text-blue-600" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedUser(user);
              setShowDeleteModal(true);
            }}
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
            <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
            <p className="text-text-secondary mt-2">
              Manage user accounts, roles, and permissions
            </p>
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
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-secondary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Users Table */}
        <DataTable
          data={data?.users || []}
          columns={columns}
          pagination={data?.pagination}
          onPageChange={setPage}
          loading={isLoading}
          emptyMessage="No users found"
        />

        {/* User Details Modal */}
        {selectedUser && (
          <Modal
            isOpen={showUserModal}
            onClose={() => {
              setShowUserModal(false);
              setSelectedUser(null);
            }}
            title="User Details"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                  <span className="text-xl font-medium text-primary-700 dark:text-primary-300">
                    {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-text-secondary">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant={selectedUser.role === 'admin' ? 'primary' : 'gray'}>
                      {selectedUser.role}
                    </Badge>
                    <Badge variant={selectedUser.isActive ? 'success' : 'error'}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-text-secondary">User ID</p>
                  <p className="text-sm text-text-primary font-mono">{selectedUser._id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Joined</p>
                  <p className="text-sm text-text-primary">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary">Last Updated</p>
                  <p className="text-sm text-text-primary">
                    {new Date(selectedUser.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          title="Deactivate User"
        >
          <div className="space-y-4">
            <p className="text-text-secondary">
              Are you sure you want to deactivate this user? This will disable their access to the platform.
            </p>
            {selectedUser && (
              <div className="p-4 bg-surface-variant rounded-lg">
                <p className="font-medium text-text-primary">
                  {selectedUser.firstName} {selectedUser.lastName}
                </p>
                <p className="text-sm text-text-secondary">{selectedUser.email}</p>
              </div>
            )}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleDeleteUser}
                disabled={deleteUserMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteUserMutation.isPending ? 'Deactivating...' : 'Deactivate User'}
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  );
};
