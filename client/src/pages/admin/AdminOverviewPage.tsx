import { useQuery } from 'react-query';
import { 
  Users, 
  Key, 
  Activity, 
  TrendingUp,
  AlertCircle,
  UserPlus,
  KeyRound,
  BarChart3
} from 'lucide-react';
import { StatsCard } from '../../components/admin/StatsCard';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { getDashboardStats, getRecentActivity } from '../../services/admin.service';
import { formatDistanceToNow } from 'date-fns';

export const AdminOverviewPage = () => {
  const { data: stats, isLoading: statsLoading } = useQuery(
    'adminStats',
    getDashboardStats,
    { refetchInterval: 30000 }
  );

  const { data: activity, isLoading: activityLoading } = useQuery(
    'adminActivity',
    () => getRecentActivity(10),
    { refetchInterval: 60000 }
  );

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-variant rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-variant rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary mt-2">
            Monitor and manage your LankaLocate API platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            subtitle={`${stats?.totalActiveUsers || 0} active`}
            icon={<Users className="w-6 h-6" />}
            trend={{
              value: stats?.userGrowth || 0,
              isPositive: (stats?.userGrowth || 0) >= 0,
              label: 'this month'
            }}
            color="blue"
          />
          
          <StatsCard
            title="API Keys"
            value={stats?.totalApiKeys || 0}
            subtitle={`${stats?.totalActiveApiKeys || 0} active`}
            icon={<Key className="w-6 h-6" />}
            color="green"
          />
          
          <StatsCard
            title="Requests Today"
            value={stats?.totalRequestsToday || 0}
            icon={<Activity className="w-6 h-6" />}
            color="purple"
          />
          
          <StatsCard
            title="Monthly Requests"
            value={stats?.totalRequestsThisMonth || 0}
            icon={<TrendingUp className="w-6 h-6" />}
            trend={{
              value: stats?.requestGrowth || 0,
              isPositive: (stats?.requestGrowth || 0) >= 0,
              label: 'vs last month'
            }}
            color="orange"
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader 
              title="Recent Activity"
              description="Latest user registrations and API key creations"
            />
            <CardContent>
              {activityLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-3">
                      <div className="w-8 h-8 bg-surface-variant rounded-full"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-surface-variant rounded w-3/4"></div>
                        <div className="h-3 bg-surface-variant rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recent Users */}
                  {activity?.recentUsers?.slice(0, 3).map((user, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-surface-variant rounded-lg">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <UserPlus className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">
                          New user registered
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {user.user} ({user.email})
                        </p>
                      </div>
                      <span className="text-xs text-text-secondary">
                        {formatDistanceToNow(new Date(user.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  ))}

                  {/* Recent API Keys */}
                  {activity?.recentKeys?.slice(0, 2).map((key, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-surface-variant rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <KeyRound className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">
                          API key created
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {key.keyName} by {key.user}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={key.isActive ? 'success' : 'error'}>
                          {key.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs text-text-secondary">
                          {formatDistanceToNow(new Date(key.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Endpoints */}
          <Card>
            <CardHeader 
              title="Top Endpoints"
              description="Most used API endpoints this week"
            />
            <CardContent>
              {activityLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between">
                      <div className="h-4 bg-surface-variant rounded w-1/2"></div>
                      <div className="h-4 bg-surface-variant rounded w-16"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {activity?.topEndpoints?.slice(0, 5).map((endpoint, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-surface-variant rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                          <BarChart3 className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {endpoint.endpoint}
                          </p>
                          <p className="text-xs text-text-secondary">
                            {endpoint.date}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-primary-600">
                        {endpoint.count.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader 
            title="System Status"
            description="Current system health and alerts"
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    API Status
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    All systems operational
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Database
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Connected and healthy
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                    Maintenance
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Scheduled for next week
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
};
