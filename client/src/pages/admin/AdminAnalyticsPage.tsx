import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { ChartCard } from '../../components/admin/ChartCard';
import { StatsCard } from '../../components/admin/StatsCard';
import { getUsageAnalytics } from '../../services/admin.service';
import { format, parseISO } from 'date-fns';

export const AdminAnalyticsPage = () => {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [days, setDays] = useState(30);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['adminAnalytics', period, days],
    queryFn: () => getUsageAnalytics({ period, days }),
    refetchInterval: 300000 // Refresh every 5 minutes
  });

  // Prepare chart data
  const usageChartData = analytics?.usageOverTime?.map(item => ({
    date: format(parseISO(item._id), 'MMM dd'),
    total: item.total,
    success: item.success,
    errors: item.errors,
    successRate: item.total > 0 ? (item.success / item.total) * 100 : 0
  })) || [];

  const endpointChartData = analytics?.topEndpoints?.slice(0, 8).map(item => ({
    endpoint: item._id.replace('/api/v1/', ''),
    requests: item.count,
    avgResponseTime: Math.round(item.avgResponseTime || 0)
  })) || [];

  const userChartData = analytics?.topUsers?.slice(0, 5).map(item => ({
    user: `${item.user.firstName} ${item.user.lastName}`,
    requests: item.count
  })) || [];

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const periodOptions = [
    { value: 'daily', label: 'Daily', days: 30 },
    { value: 'weekly', label: 'Weekly', days: 84 },
    { value: 'monthly', label: 'Monthly', days: 365 }
  ];

  if (isLoading) {
    return (
      <div>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-surface-variant rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-surface-variant rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-surface-variant rounded-xl"></div>
              ))}
            </div>
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
            <h1 className="text-3xl font-bold text-text-primary">Usage Analytics</h1>
            <p className="text-text-secondary mt-2">
              Monitor API usage patterns and performance metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={period}
              onChange={(e) => {
                const newPeriod = e.target.value as 'daily' | 'weekly' | 'monthly';
                setPeriod(newPeriod);
                const option = periodOptions.find(opt => opt.value === newPeriod);
                if (option) setDays(option.days);
              }}
              className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Requests"
            value={analytics?.summary?.totalRequests || 0}
            icon={<Activity className="w-6 h-6" />}
            color="blue"
          />
          
          <StatsCard
            title="Success Rate"
            value={`${Math.round(analytics?.summary?.successRate || 0)}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="green"
          />
          
          <StatsCard
            title="Error Rate"
            value={`${Math.round(analytics?.summary?.errorRate || 0)}%`}
            icon={<AlertTriangle className="w-6 h-6" />}
            color="red"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Usage Over Time */}
          <ChartCard
            title="API Usage Over Time"
            description="Total requests, success, and error rates"
          >
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={usageChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  className="text-text-secondary"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  className="text-text-secondary"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                  name="Total Requests"
                />
                <Area
                  type="monotone"
                  dataKey="errors"
                  stackId="2"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.6}
                  name="Errors"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Success Rate Trend */}
          <ChartCard
            title="Success Rate Trend"
            description="API success rate percentage over time"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageChartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  className="text-text-secondary"
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  className="text-text-secondary"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Success Rate']}
                />
                <Line
                  type="monotone"
                  dataKey="successRate"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Endpoints */}
          <ChartCard
            title="Top API Endpoints"
            description="Most frequently used endpoints"
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={endpointChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12 }}
                  className="text-text-secondary"
                />
                <YAxis 
                  type="category"
                  dataKey="endpoint"
                  tick={{ fontSize: 12 }}
                  className="text-text-secondary"
                  width={100}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="requests" 
                  fill="#8B5CF6"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Top Users */}
          <ChartCard
            title="Top Users by Requests"
            description="Users with highest API usage"
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="requests"
                >
                  {userChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Endpoint Performance Table */}
        <ChartCard
          title="Endpoint Performance"
          description="Detailed performance metrics for each endpoint"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-variant border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Endpoint
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Avg Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {endpointChartData.map((endpoint, index) => (
                  <tr key={index} className="hover:bg-surface-variant transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm font-mono text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded">
                        /{endpoint.endpoint}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {endpoint.requests.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {endpoint.avgResponseTime}ms
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              endpoint.avgResponseTime < 100 ? 'bg-green-500' :
                              endpoint.avgResponseTime < 300 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ 
                              width: `${Math.min(100, (endpoint.avgResponseTime / 500) * 100)}%` 
                            }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          endpoint.avgResponseTime < 100 ? 'text-green-600' :
                          endpoint.avgResponseTime < 300 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {endpoint.avgResponseTime < 100 ? 'Fast' :
                           endpoint.avgResponseTime < 300 ? 'Normal' : 'Slow'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
        </div>
  );
};