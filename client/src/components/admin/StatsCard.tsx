import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

export const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color = 'blue' 
}: StatsCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600',
    orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-600',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600'
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
            <p className="text-3xl font-bold text-text-primary mb-1">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-sm text-text-secondary">{subtitle}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="font-medium">
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                {trend.label && (
                  <span className="ml-1 text-text-secondary">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
