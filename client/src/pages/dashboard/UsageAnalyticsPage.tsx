import { useState } from 'react';
import { useQuery } from 'react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Calendar, TrendingUp, Activity, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { getUsageData, getTopEndpoints } from '../../services/dashboard.service';

type TimePeriod = 'daily' | 'weekly' | 'monthly';

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export function UsageAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('daily');

  const { data: usageData, isLoading: usageLoading } = useQuery(
    ['usage', selectedPeriod],
    () => getUsageData(selectedPeriod),
    { keepPreviousData: true }
  );

  const { data: topEndpoints } = useQuery(
    'topEndpoints',
    getTopEndpoints
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    switch (selectedPeriod) {
      case 'daily':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'weekly':
        return `Week ${Math.ceil(date.getDate() / 7)}`;
      case 'monthly':
        return date.toLocaleDateString('en-US', { month: 'short' });
      default:
        return dateString;
    }
  };

  const chartData = usageData?.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  })) || [];

  const totalCalls = usageData?.reduce((sum, item) => sum + item.calls, 0) || 0;
  const averageCalls = totalCalls / (usageData?.length || 1);
  const maxCalls = Math.max(...(usageData?.map(item => item.calls) || [0]));

  const pieChartData = topEndpoints?.map((endpoint, index) => ({
    name: endpoint.endpoint,
    value: endpoint.calls,
    color: COLORS[index % COLORS.length]
  })) || [];

  if (usageLoading && !usageData) {
    return (
      <div className="p-6 pt-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
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
            Usage Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your API usage patterns and trends
          </p>
        </div>
        
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'monthly'] as TimePeriod[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Calls
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalCalls.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {selectedPeriod} period
                </p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                <Activity className="text-indigo-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Average Daily
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(averageCalls).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  calls per day
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Peak Usage
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {maxCalls.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  highest single day
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trend Chart */}
      <Card>
        <CardHeader 
          title="Usage Trend" 
          description={`API calls over the past ${selectedPeriod} period`}
        />
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="formattedDate" 
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                />
                <YAxis className="text-xs fill-gray-600 dark:fill-gray-400" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--tw-bg-white)',
                    border: '1px solid var(--tw-border-gray-200)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ color: 'var(--tw-text-gray-900)' }}
                />
                <Line
                  type="monotone"
                  dataKey="calls"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#6366f1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Endpoints Bar Chart */}
        <Card>
          <CardHeader 
            title="Most Used Endpoints" 
            description="Your most frequently called API endpoints"
          />
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topEndpoints || []} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" className="text-xs fill-gray-600 dark:fill-gray-400" />
                  <YAxis 
                    type="category" 
                    dataKey="endpoint" 
                    className="text-xs fill-gray-600 dark:fill-gray-400"
                    width={120}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tw-bg-white)',
                      border: '1px solid var(--tw-border-gray-200)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="calls" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Endpoint Distribution Pie Chart */}
        <Card>
          <CardHeader 
            title="Endpoint Distribution" 
            description="Breakdown of API calls by endpoint"
          />
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--tw-bg-white)',
                      border: '1px solid var(--tw-border-gray-200)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Endpoint Stats */}
      <Card>
        <CardHeader 
          title="Endpoint Details" 
          description="Detailed statistics for each endpoint"
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Endpoint
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Total Calls
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Percentage
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody>
                {(topEndpoints || []).map((endpoint) => {
                  const percentage = ((endpoint.calls / totalCalls) * 100).toFixed(1);
                  return (
                    <tr 
                      key={endpoint.endpoint} 
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Globe size={16} className="text-gray-400" />
                          <code className="text-sm font-mono text-gray-900 dark:text-white">
                            {endpoint.endpoint}
                          </code>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                        {endpoint.calls.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                        {percentage}%
                      </td>
                      <td className="text-right py-3 px-4">
                        {endpoint.trend !== undefined && (
                          <span className={`inline-flex items-center text-xs ${
                            endpoint.trend >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp size={12} className="mr-1" />
                            {endpoint.trend >= 0 ? '+' : ''}{endpoint.trend}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {(!topEndpoints || topEndpoints.length === 0) && (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Usage Data
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start making API calls to see your usage analytics here
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
