import { ApiKey, IApiKey } from '../models/ApiKey.model';
import { User } from '../models/user.model';
import { SystemSettings } from '../models/SystemSettings.model';
import { AppError, NotFoundError } from '../utils/errors';
import mongoose from 'mongoose';

export interface CreateApiKeyData {
  userId: string;
  name: string;
  description?: string | undefined;
  environment?: 'development' | 'staging' | 'production';
  permissions?: string[];
  rateLimit?: {
    requestsPerHour?: number;
    requestsPerDay?: number;
    requestsPerMonth?: number;
  };
  restrictions?: {
    allowedIPs?: string[];
    allowedDomains?: string[];
    allowedEndpoints?: string[];
  };
  expiresAt?: Date | undefined;
}

export interface ApiKeyWithPlainKey extends Omit<IApiKey, 'key' | 'hashedKey'> {
  key?: string; // Only included when creating new key
}

export class ApiKeyService {
  /**
   * Create a new API key for a user
   */
  static async createApiKey(data: CreateApiKeyData): Promise<ApiKeyWithPlainKey> {
    // Get user to check subscription limits
    const user = await User.findById(data.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Get API key limit based on subscription plan (with admin settings)
    const apiKeyLimit = await this.getApiKeyLimitFromSettings(user.subscription?.plan || 'free');
    
    // Check if user has reached the maximum number of API keys
    const existingKeysCount = await ApiKey.countDocuments({ 
      userId: data.userId, 
      isActive: true 
    });
    
    if (apiKeyLimit !== -1 && existingKeysCount >= apiKeyLimit) {
      const planName = (user.subscription?.plan || 'free').charAt(0).toUpperCase() + (user.subscription?.plan || 'free').slice(1);
      throw new AppError(`Maximum number of API keys reached for ${planName} plan (${apiKeyLimit}). Upgrade your plan to create more API keys.`, 409);
    }

    // Note: Multiple API keys can have the same name
    // Only the actual key (hashedKey) needs to be unique

    // Generate new API key
    const { key, keyPrefix } = ApiKey.generateKey();
    const hashedKey = ApiKey.hashKey(key);

    // Create the API key document (without storing the plain key)
    const apiKey = new ApiKey({
      userId: data.userId,
      name: data.name,
      keyPrefix,
      hashedKey,
      permissions: data.permissions || ['read:all'],
      rateLimit: {
        requestsPerHour: data.rateLimit?.requestsPerHour || 1000,
        requestsPerDay: data.rateLimit?.requestsPerDay || 10000,
        requestsPerMonth: data.rateLimit?.requestsPerMonth || 100000
      },
      restrictions: data.restrictions || {},
      metadata: {
        description: data.description,
        environment: data.environment || 'development'
      },
      expiresAt: data.expiresAt
    });

    await apiKey.save();

    // Return the API key with the plain key (only time it's returned)
    const result = apiKey.toJSON() as ApiKeyWithPlainKey;
    result.key = key; // Add the plain key to the response only
    
    return result;
  }

  /**
   * Get all API keys for a user
   */
  static async getUserApiKeys(userId: string): Promise<IApiKey[]> {
    return ApiKey.find({ userId, isActive: true })
      .select('-hashedKey')
      .sort({ createdAt: -1 });
  }

  /**
   * Get API key by ID (for the owner)
   */
  static async getApiKeyById(keyId: string, userId: string): Promise<IApiKey> {
    const apiKey = await ApiKey.findOne({ 
      _id: keyId, 
      userId, 
      isActive: true 
    }).select('-hashedKey');

    if (!apiKey) {
      throw new NotFoundError('API key not found');
    }

    return apiKey;
  }

  /**
   * Verify API key and return key details
   */
  static async verifyApiKey(key: string): Promise<IApiKey | null> {
    if (!key || !key.startsWith('lk_')) {
      return null;
    }

    const keyPrefix = key.split('_')[0];
    const hashedKey = ApiKey.hashKey(key);

    const apiKey = await ApiKey.findOne({
      keyPrefix,
      hashedKey,
      isActive: true
    }).populate('userId', 'email firstName lastName role');

    if (!apiKey) {
      return null;
    }

    // Check if key is expired
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
      await ApiKey.updateOne({ _id: apiKey._id }, { isActive: false });
      return null;
    }

    return apiKey;
  }

  /**
   * Update API key
   */
  static async updateApiKey(
    keyId: string, 
    userId: string, 
    updates: Partial<CreateApiKeyData>
  ): Promise<IApiKey> {
    const apiKey = await ApiKey.findOne({ 
      _id: keyId, 
      userId, 
      isActive: true 
    });

    if (!apiKey) {
      throw new NotFoundError('API key not found');
    }

    // Update allowed fields
    if (updates.name) apiKey.name = updates.name;
    if (updates.description !== undefined) apiKey.metadata.description = updates.description;
    if (updates.environment) apiKey.metadata.environment = updates.environment;
    if (updates.permissions) apiKey.permissions = updates.permissions;
    if (updates.rateLimit) {
      apiKey.rateLimit = { ...apiKey.rateLimit, ...updates.rateLimit };
    }
    if (updates.restrictions) {
      apiKey.restrictions = { ...apiKey.restrictions, ...updates.restrictions };
    }
    if (updates.expiresAt !== undefined) apiKey.expiresAt = updates.expiresAt;

    await apiKey.save();
    return apiKey;
  }

  /**
   * Deactivate API key (soft delete)
   */
  static async deactivateApiKey(keyId: string, userId: string): Promise<void> {
    const result = await ApiKey.updateOne(
      { _id: keyId, userId, isActive: true },
      { isActive: false }
    );

    if (result.matchedCount === 0) {
      throw new NotFoundError('API key not found');
    }
  }

  /**
   * Regenerate API key
   */
  static async regenerateApiKey(keyId: string, userId: string): Promise<ApiKeyWithPlainKey> {
    const apiKey = await ApiKey.findOne({ 
      _id: keyId, 
      userId, 
      isActive: true 
    });

    if (!apiKey) {
      throw new NotFoundError('API key not found');
    }

    // Generate new key
    const { key, keyPrefix } = ApiKey.generateKey();
    const hashedKey = ApiKey.hashKey(key);

    // Update the key (only store hashed version)
    apiKey.keyPrefix = keyPrefix;
    apiKey.hashedKey = hashedKey;
    
    // Reset usage stats
    apiKey.usage = {
      totalRequests: 0,
      requestsToday: 0,
      requestsThisMonth: 0
    };

    await apiKey.save();

    // Return with the new plain key
    const result = apiKey.toJSON() as ApiKeyWithPlainKey;
    result.key = key;
    
    return result;
  }

  /**
   * Track API key usage
   */
  static async trackUsage(
    apiKey: IApiKey, 
    endpoint: string, 
    ip: string
  ): Promise<void> {
    await apiKey.incrementUsage(endpoint, ip);
  }

  /**
   * Get API key usage statistics
   */
  static async getUsageStats(keyId: string, userId: string): Promise<any> {
    const apiKey = await ApiKey.findOne({ 
      _id: keyId, 
      userId, 
      isActive: true 
    });

    if (!apiKey) {
      throw new NotFoundError('API key not found');
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
      isWithinLimit: apiKey.isWithinRateLimit()
    };
  }

  /**
   * Get user's total API usage across all keys
   */
  static async getUserTotalUsage(userId: string): Promise<any> {
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
    
    if (result.length === 0) {
      return {
        totalKeys: 0,
        totalRequests: 0,
        totalRequestsToday: 0,
        totalRequestsThisMonth: 0,
        totalDailyLimit: 0,
        totalMonthlyLimit: 0,
        utilizationPercentage: { daily: 0, monthly: 0 }
      };
    }

    const stats = result[0];
    return {
      ...stats,
      utilizationPercentage: {
        daily: stats.totalDailyLimit > 0 ? (stats.totalRequestsToday / stats.totalDailyLimit) * 100 : 0,
        monthly: stats.totalMonthlyLimit > 0 ? (stats.totalRequestsThisMonth / stats.totalMonthlyLimit) * 100 : 0
      }
    };
  }

  /**
   * Clean up expired API keys
   */
  static async cleanupExpiredKeys(): Promise<number> {
    const result = await ApiKey.updateMany(
      { 
        expiresAt: { $lt: new Date() },
        isActive: true 
      },
      { isActive: false }
    );

    return result.modifiedCount;
  }

  /**
   * Get API key limit based on subscription plan
   */
  private static getApiKeyLimitForPlan(plan: string): number {
    const limits = {
      free: 2,
      pro: 10,
      enterprise: -1 // Unlimited
    };

    return limits[plan as keyof typeof limits] || limits.free;
  }

  /**
   * Get API key limit from system settings (admin configurable)
   */
  static async getApiKeyLimitFromSettings(plan: string): Promise<number> {
    try {
      const settings = await SystemSettings.findOne();
      if (settings && settings.apiKeyLimits && settings.apiKeyLimits[plan as keyof typeof settings.apiKeyLimits]) {
        return settings.apiKeyLimits[plan as keyof typeof settings.apiKeyLimits];
      }
      return this.getApiKeyLimitForPlan(plan);
    } catch (error) {
      // Fallback to default limits if settings not available
      return this.getApiKeyLimitForPlan(plan);
    }
  }

  /**
   * Get user's current API key usage and limits
   */
  static async getUserApiKeyUsage(userId: string): Promise<{
    current: number;
    limit: number;
    plan: string;
    canCreate: boolean;
  }> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const plan = user.subscription?.plan || 'free';
    const limit = await this.getApiKeyLimitFromSettings(plan);
    const current = await ApiKey.countDocuments({ 
      userId, 
      isActive: true 
    });

    return {
      current,
      limit,
      plan,
      canCreate: limit === -1 || current < limit
    };
  }
}
