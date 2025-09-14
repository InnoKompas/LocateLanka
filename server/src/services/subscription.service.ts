import { User } from '../models/user.model';
import { IUser, IRateLimit } from '../types/models/auth.types';
import { logger } from '../config/logger.config';

export class SubscriptionService {
  /**
   * Get plan limits configuration
   */
  static getPlanLimits(): Record<string, IRateLimit> {
    return {
      free: {
        requestsPerHour: 100,
        requestsPerDay: 1000,
        requestsPerMonth: 10000
      },
      pro: {
        requestsPerHour: 1000,
        requestsPerDay: 10000,
        requestsPerMonth: 100000
      },
      enterprise: {
        requestsPerHour: 10000,
        requestsPerDay: 100000,
        requestsPerMonth: 1000000
      }
    };
  }

  /**
   * Update user subscription plan
   */
  static async updateUserPlan(userId: string, plan: 'free' | 'pro' | 'enterprise'): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update subscription plan
      user.subscription.plan = plan;
      user.subscription.status = 'active';
      user.subscription.startDate = new Date();

      // Set end date for paid plans (30 days from now)
      if (plan !== 'free') {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);
        user.subscription.endDate = endDate;
      } else {
        delete user.subscription.endDate;
      }

      // Reset usage counters when plan changes
      const now = new Date();
      user.usage = {
        currentHour: { count: 0, resetTime: now },
        currentDay: { count: 0, resetTime: now },
        currentMonth: { count: 0, resetTime: now }
      };

      await user.save();
      logger.info(`Updated user ${userId} to ${plan} plan`);
      
      return user;
    } catch (error) {
      logger.error('Error updating user plan:', error);
      throw error;
    }
  }

  /**
   * Check if user has exceeded rate limits
   */
  static async checkRateLimit(userId: string): Promise<{
    allowed: boolean;
    limits: IRateLimit;
    usage: {
      hour: number;
      day: number;
      month: number;
    };
    resetTimes: {
      hour: Date;
      day: Date;
      month: Date;
    };
  }> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const now = new Date();
      const limits = user.subscription.rateLimit;
      
      // Check and reset counters if needed
      await this.resetExpiredCounters(user, now);

      const usage = {
        hour: user.usage.currentHour.count,
        day: user.usage.currentDay.count,
        month: user.usage.currentMonth.count
      };

      const resetTimes = {
        hour: user.usage.currentHour.resetTime,
        day: user.usage.currentDay.resetTime,
        month: user.usage.currentMonth.resetTime
      };

      // Check if any limit is exceeded
      const allowed = 
        usage.hour < limits.requestsPerHour &&
        usage.day < limits.requestsPerDay &&
        usage.month < limits.requestsPerMonth;

      return {
        allowed,
        limits,
        usage,
        resetTimes
      };
    } catch (error) {
      logger.error('Error checking rate limit:', error);
      throw error;
    }
  }

  /**
   * Increment usage counters
   */
  static async incrementUsage(userId: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const now = new Date();
      
      // Reset counters if needed
      await this.resetExpiredCounters(user, now);

      // Increment counters
      user.usage.currentHour.count += 1;
      user.usage.currentDay.count += 1;
      user.usage.currentMonth.count += 1;

      await user.save();
    } catch (error) {
      logger.error('Error incrementing usage:', error);
      throw error;
    }
  }

  /**
   * Reset expired usage counters
   */
  private static async resetExpiredCounters(user: IUser, now: Date): Promise<void> {
    let needsSave = false;

    // Reset hourly counter if hour has passed
    const hourDiff = now.getTime() - user.usage.currentHour.resetTime.getTime();
    if (hourDiff >= 60 * 60 * 1000) { // 1 hour in milliseconds
      user.usage.currentHour.count = 0;
      user.usage.currentHour.resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours());
      needsSave = true;
    }

    // Reset daily counter if day has passed
    const dayDiff = now.getTime() - user.usage.currentDay.resetTime.getTime();
    if (dayDiff >= 24 * 60 * 60 * 1000) { // 1 day in milliseconds
      user.usage.currentDay.count = 0;
      user.usage.currentDay.resetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      needsSave = true;
    }

    // Reset monthly counter if month has passed
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    if (user.usage.currentMonth.resetTime < monthStart) {
      user.usage.currentMonth.count = 0;
      user.usage.currentMonth.resetTime = monthStart;
      needsSave = true;
    }

    if (needsSave) {
      await (user as any).save();
    }
  }

  /**
   * Get user subscription info
   */
  static async getUserSubscription(userId: string): Promise<{
    plan: string;
    status: string;
    limits: IRateLimit;
    usage: {
      hour: number;
      day: number;
      month: number;
    };
    resetTimes: {
      hour: Date;
      day: Date;
      month: Date;
    };
  } | null> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return null;
      }

      const now = new Date();
      await this.resetExpiredCounters(user, now);

      return {
        plan: user.subscription.plan,
        status: user.subscription.status,
        limits: user.subscription.rateLimit,
        usage: {
          hour: user.usage.currentHour.count,
          day: user.usage.currentDay.count,
          month: user.usage.currentMonth.count
        },
        resetTimes: {
          hour: user.usage.currentHour.resetTime,
          day: user.usage.currentDay.resetTime,
          month: user.usage.currentMonth.resetTime
        }
      };
    } catch (error) {
      logger.error('Error getting user subscription:', error);
      throw error;
    }
  }

  /**
   * Check if subscription is expired
   */
  static async checkSubscriptionExpiry(userId: string): Promise<boolean> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return true; // Consider expired if user not found
      }

      // Free plan never expires
      if (user.subscription.plan === 'free') {
        return false;
      }

      // Check if paid plan has expired
      if (user.subscription.endDate && user.subscription.endDate < new Date()) {
        // Downgrade to free plan
        user.subscription.plan = 'free';
        user.subscription.status = 'expired';
        delete user.subscription.endDate;
        await user.save();
        
        logger.info(`User ${userId} subscription expired, downgraded to free plan`);
        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error checking subscription expiry:', error);
      throw error;
    }
  }
}
