import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Key, 
  CreditCard, 
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { getUserStats, getApiKeys, getUsageData } from '../../services/dashboard.service';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatsCard({ title, value, subtitle, icon, trend }: StatsCardProps) {
  return (
    <Card variant="elevated">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-xs ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp size={12} className="mr-1" />
                {trend.value}% from last month
              </div>
            )}
          </div>
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OverviewPage() {
  const { user } = useAuth();
  
  const { data: userStats, isLoading: statsLoading } = useQuery(
    'userStats',
    getUserStats,
    { refetchInterval: 30000 } // Refresh every 30 seconds
  );

  const { data: apiKeys, isLoading: keysLoading } = useQuery(
    'apiKeys',
    getApiKeys
  );

  const { data: recentUsage } = useQuery(
    ['usage', 'daily'],
    () => getUsageData('daily')
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getQuotaStatus = () => {
    if (!userStats) return { status: 'unknown', color: 'gray' };
    
    const dailyUsage = userStats.totalRequestsToday || 0;
    const dailyLimit = userStats.totalDailyLimit || 1;
    const usagePercentage = (dailyUsage / dailyLimit) * 100;
    
    if (usagePercentage >= 90) return { status: 'critical', color: 'red' };
    if (usagePercentage >= 70) return { status: 'warning', color: 'yellow' };
    return { status: 'good', color: 'green' };
  };

  const quotaStatus = getQuotaStatus();

  if (statsLoading || keysLoading) {
    return (
      <div className="p-6 pt-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-4 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {getGreeting()}, {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your API usage today.
          </p>
        </div>
        
        <Link to="/docs?from=dashboard">
          <Button variant="primary">
            View Documentation
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total API Calls"
          value={(userStats?.totalRequests || 0).toLocaleString()}
          subtitle="All time"
          icon={<Activity className="text-indigo-600" size={24} />}
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatsCard
          title="Calls Today"
          value={(userStats?.totalRequestsToday || 0).toLocaleString()}
          subtitle={`of ${(userStats?.totalDailyLimit || 0).toLocaleString()} daily limit`}
          icon={<TrendingUp className="text-green-600" size={24} />}
        />
        
        <StatsCard
          title="Active API Keys"
          value={apiKeys?.filter(key => key.isActive).length || '0'}
          subtitle={`of ${apiKeys?.length || 0} total keys`}
          icon={<Key className="text-blue-600" size={24} />}
        />
        
        <StatsCard
          title="Monthly Usage"
          value={(userStats?.totalRequestsThisMonth || 0).toLocaleString()}
          subtitle={`of ${(userStats?.totalMonthlyLimit || 0).toLocaleString()} monthly limit`}
          icon={<CreditCard className="text-purple-600" size={24} />}
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quota Status */}
        <Card>
          <CardHeader 
            title="Quota Status" 
            description="Monitor your API usage limits"
          />
          <CardContent>
            <div className="flex items-center space-x-3">
              {quotaStatus.status === 'good' && (
                <CheckCircle className="text-green-500" size={24} />
              )}
              {quotaStatus.status === 'warning' && (
                <AlertCircle className="text-yellow-500" size={24} />
              )}
              {quotaStatus.status === 'critical' && (
                <AlertCircle className="text-red-500" size={24} />
              )}
              
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {quotaStatus.status === 'good' && 'You\'re within your limits'}
                  {quotaStatus.status === 'warning' && 'Approaching quota limit'}
                  {quotaStatus.status === 'critical' && 'Quota limit nearly reached'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {((userStats?.totalDailyLimit || 0) - (userStats?.totalRequestsToday || 0)).toLocaleString()} calls remaining today
                </p>
              </div>
              
              {quotaStatus.status !== 'good' && (
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
              )}
            </div>
            
            {/* Progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Used: {(userStats?.totalRequestsToday || 0).toLocaleString()}</span>
                <span>Limit: {(userStats?.totalDailyLimit || 0).toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    quotaStatus.color === 'green' ? 'bg-green-500' :
                    quotaStatus.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, ((userStats?.totalRequestsToday || 0) / 
                    (userStats?.totalDailyLimit || 1)) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader 
            title="Recent Activity" 
            description="Your latest API usage"
          />
          <CardContent>
            <div className="space-y-3">
              {recentUsage?.slice(-5).reverse().map((usage, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(usage.date).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      API calls made
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">
                    {usage.calls.toLocaleString()}
                  </span>
                </div>
              )) || (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader 
          title="Quick Actions" 
          description="Common tasks to get you started"
        />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Generate API Key</p>
                <p className="text-sm text-gray-500 mt-1">Create a new key for your applications</p>
              </div>
            </Button>
            
            <Link to="/docs?from=dashboard">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <p className="font-medium">View Documentation</p>
                  <p className="text-sm text-gray-500 mt-1">Learn how to integrate our API</p>
                </div>
              </Button>
            </Link>
            
            <Button variant="outline" className="justify-start h-auto p-4">
              <div className="text-left">
                <p className="font-medium">Upgrade Plan</p>
                <p className="text-sm text-gray-500 mt-1">Get more quota and features</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
