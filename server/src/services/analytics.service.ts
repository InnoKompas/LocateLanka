import mongoose from 'mongoose';
import { ApiKey } from '../models/ApiKey.model';
import { NotFoundError } from '../utils/errors';

export interface UsageAnalytics {
  date: string;
  calls: number;
  endpoint?: string;
}

export interface EndpointStats {
  endpoint: string;
  calls: number;
  percentage: number;
}

export interface UserAnalytics {
  totalKeys: number;
  totalRequests: number;
  totalRequestsToday: number;
  totalRequestsThisMonth: number;
  totalDailyLimit: number;
  totalMonthlyLimit: number;
  utilizationPercentage: {
    daily: number;
    monthly: number;
  };
  usageOverTime: UsageAnalytics[];
  topEndpoints: EndpointStats[];
}

export class AnalyticsService {
  /**
   * Get usage data over time for a user
   */
  static async getUserUsageOverTime(
    userId: string, 
    _period: 'daily' | 'weekly' | 'monthly' = 'daily',
    days: number = 30
  ): Promise<UsageAnalytics[]> {
    const userKeys = await ApiKey.find({ 
      userId: new mongoose.Types.ObjectId(userId), 
      isActive: true 
    });

    if (userKeys.length === 0) {
      return [];
    }

    // For now, generate mock data based on current usage
    // In a real implementation, you'd store daily/hourly usage logs
    const totalMonthlyUsage = userKeys.reduce((sum, key) => sum + key.usage.requestsThisMonth, 0);
    const avgDailyUsage = totalMonthlyUsage / 30;

    const usageData: UsageAnalytics[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Generate realistic usage pattern with some randomness
      const baseUsage = avgDailyUsage;
      const variation = 0.3; // 30% variation
      const randomFactor = 1 + (Math.random() - 0.5) * variation * 2;
      const dailyCalls = Math.max(0, Math.floor(baseUsage * randomFactor));

      usageData.push({
        date: date.toISOString().split('T')[0] as string,
        calls: dailyCalls
      });
    }

    return usageData;
  }

  /**
   * Get top endpoints for a user
   */
  static async getUserTopEndpoints(userId: string): Promise<EndpointStats[]> {
    const userKeys = await ApiKey.find({ 
      userId: new mongoose.Types.ObjectId(userId), 
      isActive: true 
    });

    if (userKeys.length === 0) {
      return [];
    }

    // For now, return mock data based on typical API usage patterns
    // In a real implementation, you'd track endpoint usage in detail
    const totalRequests = userKeys.reduce((sum, key) => sum + key.usage.totalRequests, 0);

    if (totalRequests === 0) {
      return [];
    }

    const mockEndpoints = [
      { endpoint: '/api/v1/divisions', percentage: 45 },
      { endpoint: '/api/v1/districts', percentage: 25 },
      { endpoint: '/api/v1/provinces', percentage: 20 },
      { endpoint: '/api/v1/dsds', percentage: 10 }
    ];

    return mockEndpoints.map(ep => ({
      endpoint: ep.endpoint,
      calls: Math.floor((totalRequests * ep.percentage) / 100),
      percentage: ep.percentage
    }));
  }

  /**
   * Get comprehensive user analytics
   */
  static async getUserAnalytics(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<UserAnalytics> {
    // Get basic stats
    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: true } },
      {
        $group: {
          _id: null,
          totalKeys: { $sum: 1 },
          totalRequests: { $sum: '$usage.totalRequests' },
          totalRequestsToday: { $sum: '$usage.requestsToday' },
          totalRequestsThisMonth: { $sum: '$usage.requestsThisMonth' },
          totalDailyLimit: { $sum: '$rateLimit.requestsPerDay' },
          totalMonthlyLimit: { $sum: '$rateLimit.requestsPerMonth' }
        }
      }
    ];

    const result = await ApiKey.aggregate(pipeline);
    
    const stats = result[0] || {
      totalKeys: 0,
      totalRequests: 0,
      totalRequestsToday: 0,
      totalRequestsThisMonth: 0,
      totalDailyLimit: 0,
      totalMonthlyLimit: 0
    };

    // Get usage over time
    const days = period === 'daily' ? 30 : period === 'weekly' ? 84 : 365;
    const usageOverTime = await this.getUserUsageOverTime(userId, period, days);

    // Get top endpoints
    const topEndpoints = await this.getUserTopEndpoints(userId);

    return {
      ...stats,
      utilizationPercentage: {
        daily: stats.totalDailyLimit > 0 ? (stats.totalRequestsToday / stats.totalDailyLimit) * 100 : 0,
        monthly: stats.totalMonthlyLimit > 0 ? (stats.totalRequestsThisMonth / stats.totalMonthlyLimit) * 100 : 0
      },
      usageOverTime,
      topEndpoints
    };
  }

  /**
   * Get API key specific analytics
   */
  static async getApiKeyAnalytics(
    keyId: string, 
    userId: string,
    period: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<any> {
    const apiKey = await ApiKey.findOne({ 
      _id: keyId, 
      userId: new mongoose.Types.ObjectId(userId), 
      isActive: true 
    });

    if (!apiKey) {
      throw new NotFoundError('API key not found');
    }

    // Generate usage over time for this specific key
    const days = period === 'daily' ? 30 : period === 'weekly' ? 84 : 365;
    const avgDailyUsage = apiKey.usage.requestsThisMonth / 30;
    
    const usageOverTime: UsageAnalytics[] = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const variation = 0.4; // 40% variation
      const randomFactor = 1 + (Math.random() - 0.5) * variation * 2;
      const dailyCalls = Math.max(0, Math.floor(avgDailyUsage * randomFactor));

      usageOverTime.push({
        date: date.toISOString().split('T')[0] as string,
        calls: dailyCalls
      });
    }

    return {
      keyId: apiKey._id,
      name: apiKey.name,
      usage: apiKey.usage,
      rateLimit: apiKey.rateLimit,
      utilizationPercentage: {
        daily: (apiKey.usage.requestsToday / apiKey.rateLimit.requestsPerDay) * 100,
        monthly: (apiKey.usage.requestsThisMonth / apiKey.rateLimit.requestsPerMonth) * 100
      },
      isWithinLimit: apiKey.isWithinRateLimit(),
      usageOverTime,
      environment: apiKey.metadata.environment,
      permissions: apiKey.permissions
    };
  }

  /**
   * Get system-wide analytics (admin only)
   */
  static async getSystemAnalytics(): Promise<any> {
    const pipeline = [
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalKeys: { $sum: 1 },
          totalUsers: { $addToSet: '$userId' },
          totalRequests: { $sum: '$usage.totalRequests' },
          totalRequestsToday: { $sum: '$usage.requestsToday' },
          totalRequestsThisMonth: { $sum: '$usage.requestsThisMonth' },
          avgRequestsPerKey: { $avg: '$usage.totalRequests' }
        }
      }
    ];

    const result = await ApiKey.aggregate(pipeline);
    
    if (result.length === 0) {
      return {
        totalKeys: 0,
        totalUsers: 0,
        totalRequests: 0,
        totalRequestsToday: 0,
        totalRequestsThisMonth: 0,
        avgRequestsPerKey: 0
      };
    }

    const stats = result[0];
    return {
      ...stats,
      totalUsers: stats.totalUsers.length,
      avgRequestsPerKey: Math.round(stats.avgRequestsPerKey)
    };
  }
}
