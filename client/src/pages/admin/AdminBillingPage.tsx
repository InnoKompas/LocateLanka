import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Users,
  AlertCircle
} from 'lucide-react';

export const AdminBillingPage = () => {
  // Mock data - in real implementation, this would come from the server
  const billingStats = {
    totalRevenue: 12450,
    monthlyRevenue: 3200,
    activeSubscriptions: 156,
    churnRate: 2.3
  };

  const plans = [
    {
      name: 'Free',
      price: 0,
      users: 89,
      revenue: 0,
      features: ['1,000 requests/month', 'Basic support', 'Community access']
    },
    {
      name: 'Pro',
      price: 29,
      users: 45,
      revenue: 1305,
      features: ['100,000 requests/month', 'Priority support', 'Advanced analytics']
    },
    {
      name: 'Enterprise',
      price: 99,
      users: 22,
      revenue: 2178,
      features: ['Unlimited requests', 'Dedicated support', 'Custom integrations']
    }
  ];

  const recentTransactions = [
    { id: '1', user: 'John Doe', plan: 'Pro', amount: 29, date: '2025-01-15', status: 'completed' },
    { id: '2', user: 'Jane Smith', plan: 'Enterprise', amount: 99, date: '2025-01-14', status: 'completed' },
    { id: '3', user: 'Bob Johnson', plan: 'Pro', amount: 29, date: '2025-01-13', status: 'pending' },
    { id: '4', user: 'Alice Brown', plan: 'Enterprise', amount: 99, date: '2025-01-12', status: 'completed' },
    { id: '5', user: 'Charlie Wilson', plan: 'Pro', amount: 29, date: '2025-01-11', status: 'failed' }
  ];

  return (
      <div className="p-6 pt-4 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Billing & Revenue</h1>
          <p className="text-text-secondary mt-2">
            Monitor subscription plans, revenue, and billing analytics
          </p>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Total Revenue</p>
                  <p className="text-2xl font-bold text-text-primary">
                    ${billingStats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-text-primary">
                    ${billingStats.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {billingStats.activeSubscriptions}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Churn Rate</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {billingStats.churnRate}%
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans */}
        <Card>
          <CardHeader 
            title="Subscription Plans"
            description="Overview of all available plans and their performance"
          />
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div key={plan.name} className="border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">{plan.name}</h3>
                    <Badge variant={plan.name === 'Free' ? 'gray' : plan.name === 'Pro' ? 'primary' : 'success'}>
                      ${plan.price}/month
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Users:</span>
                      <span className="font-medium text-text-primary">{plan.users}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Revenue:</span>
                      <span className="font-medium text-text-primary">${plan.revenue}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-text-secondary">Features:</p>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="text-xs text-text-secondary flex items-center">
                          <div className="w-1 h-1 bg-primary-600 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader 
            title="Recent Transactions"
            description="Latest billing transactions and payments"
          />
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-variant border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-surface-variant transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                              {transaction.user.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <span className="font-medium text-text-primary">{transaction.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={transaction.plan === 'Pro' ? 'primary' : 'success'}>
                          {transaction.plan}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        ${transaction.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={
                            transaction.status === 'completed' ? 'success' :
                            transaction.status === 'pending' ? 'warning' : 'error'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <CreditCard className="w-12 h-12 text-text-secondary mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Advanced Billing Features</h3>
                <p className="text-text-secondary">
                  Advanced billing management, payment processing, and subscription analytics are coming soon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};
