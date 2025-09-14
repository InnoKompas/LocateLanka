import { User } from '../models/user.model';
import { ApiKey } from '../models/ApiKey.model';
import { UsageLog } from '../models/UsageLog.model';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns';

export class AdminService {
  // Dashboard Overview
  static async getDashboardStats() {
    const now = new Date();
    const startOfToday = startOfDay(now);
    const endOfToday = endOfDay(now);
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    // Get basic counts
    const [
      totalUsers,
      totalActiveUsers,
      totalApiKeys,
      totalActiveApiKeys,
      totalRequestsToday,
      totalRequestsThisMonth,
      totalRequestsLastMonth
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      ApiKey.countDocuments(),
      ApiKey.countDocuments({ isActive: true }),
      UsageLog.countDocuments({
        timestamp: { $gte: startOfToday, $lte: endOfToday }
      }),
      UsageLog.countDocuments({
        timestamp: { $gte: startOfThisMonth, $lte: endOfThisMonth }
      }),
      UsageLog.countDocuments({
        timestamp: { $gte: startOfLastMonth, $lte: endOfLastMonth }
      })
    ]);

    // Calculate growth percentages
    const userGrowth = totalUsers > 0 ? ((totalActiveUsers / totalUsers) * 100) : 0;
    const requestGrowth = totalRequestsLastMonth > 0 
      ? (((totalRequestsThisMonth - totalRequestsLastMonth) / totalRequestsLastMonth) * 100)
      : 0;

    return {
      totalUsers,
      totalActiveUsers,
      totalApiKeys,
      totalActiveApiKeys,
      totalRequestsToday,
      totalRequestsThisMonth,
      userGrowth: Math.round(userGrowth * 100) / 100,
      requestGrowth: Math.round(requestGrowth * 100) / 100,
      revenue: 0 // Placeholder for billing integration
    };
  }

  // Recent Activity
  static async getRecentActivity(_limit: number = 10) {
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt');

    const recentKeys = await ApiKey.find()
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name userId createdAt isActive');

    const recentUsage = await UsageLog.aggregate([
      {
        $match: {
          timestamp: { $gte: subDays(new Date(), 7) }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            endpoint: '$endpoint'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return {
      recentUsers: recentUsers.map(user => ({
        type: 'user_registered',
        user: `${user.firstName} ${user.lastName}`,
        email: user.email,
        timestamp: user.createdAt
      })),
      recentKeys: recentKeys.map(key => ({
        type: 'api_key_created',
        user: key.userId ? `${(key.userId as any).firstName} ${(key.userId as any).lastName}` : 'Unknown',
        keyName: key.name,
        timestamp: key.createdAt,
        isActive: key.isActive
      })),
      topEndpoints: recentUsage.map(item => ({
        endpoint: item._id.endpoint,
        count: item.count,
        date: item._id.date
      }))
    };
  }

  // User Management
  static async getAllUsers(page: number = 1, limit: number = 20, search?: string, role?: string, status?: string): Promise<{ users: any[]; pagination: any }> {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async updateUser(userId: string, updates: any): Promise<any> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // API Key Management
  static async getAllApiKeys(page: number = 1, limit: number = 20, search?: string, status?: string) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (status && status !== 'all') {
      query.isActive = status === 'active';
    }

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { 'user.firstName': { $regex: search, $options: 'i' } },
            { 'user.lastName': { $regex: search, $options: 'i' } },
            { 'user.email': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    if (Object.keys(query).length > 0) {
      pipeline.push({ $match: query });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    );

    const [keys, total] = await Promise.all([
      ApiKey.aggregate(pipeline),
      ApiKey.countDocuments(query)
    ]);

    return {
      keys,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  static async updateApiKey(keyId: string, updates: any) {
    const key = await ApiKey.findByIdAndUpdate(
      keyId,
      { $set: updates },
      { new: true }
    ).populate('userId', 'firstName lastName email');

    if (!key) {
      throw new Error('API key not found');
    }

    return key;
  }

  // Usage Analytics
  static async getUsageAnalytics(_period: 'daily' | 'weekly' | 'monthly' = 'daily', days: number = 30) {
    const now = new Date();
    const startDate = subDays(now, days);

    const usageData = await UsageLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            status: '$statusCode'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          total: { $sum: '$count' },
          success: {
            $sum: {
              $cond: [
                { $and: [{ $gte: ['$_id.status', 200] }, { $lt: ['$_id.status', 300] }] },
                '$count',
                0
              ]
            }
          },
          errors: {
            $sum: {
              $cond: [
                { $gte: ['$_id.status', 400] },
                '$count',
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const topEndpoints = await UsageLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: '$endpoint',
          count: { $sum: 1 },
          avgResponseTime: { $avg: '$responseTime' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topUsers = await UsageLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return {
      usageOverTime: usageData,
      topEndpoints,
      topUsers,
      summary: {
        totalRequests: usageData.reduce((sum, day) => sum + day.total, 0),
        successRate: usageData.length > 0 
          ? (usageData.reduce((sum, day) => sum + day.success, 0) / usageData.reduce((sum, day) => sum + day.total, 0)) * 100
          : 0,
        errorRate: usageData.length > 0
          ? (usageData.reduce((sum, day) => sum + day.errors, 0) / usageData.reduce((sum, day) => sum + day.total, 0)) * 100
          : 0
      }
    };
  }

  // System Settings
  static async getSystemSettings() {
    // This would typically come from a settings collection
    return {
      rateLimits: {
        free: { requestsPerHour: 100, requestsPerDay: 1000, requestsPerMonth: 10000 },
        pro: { requestsPerHour: 1000, requestsPerDay: 10000, requestsPerMonth: 100000 },
        enterprise: { requestsPerHour: 10000, requestsPerDay: 100000, requestsPerMonth: 1000000 }
      },
      maintenanceMode: false,
      globalAnnouncement: null
    };
  }

  static async updateSystemSettings(settings: any) {
    // This would typically update a settings collection
    return settings;
  }
}
