import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { logger } from '../config/logger.config';

export interface RateLimitRequest extends Request {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
  apiKey?: {
    userId: string;
  };
}

/**
 * User-based rate limiting middleware
 * Checks rate limits based on user's subscription plan
 */
export const userRateLimitMiddleware = async (
  req: RateLimitRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get user ID from either authenticated user or API key
    let userId: string | undefined;
    
    if (req.user?.id) {
      userId = req.user.id;
    } else if (req.apiKey?.userId) {
      userId = req.apiKey.userId;
    }

    // If no user ID found, apply default rate limiting
    if (!userId) {
      logger.warn('No user ID found for rate limiting, applying default limits');
      return next();
    }

    // Check subscription expiry first
    await SubscriptionService.checkSubscriptionExpiry(userId);

    // Check rate limits
    const rateLimitCheck = await SubscriptionService.checkRateLimit(userId);

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit-Hour': rateLimitCheck.limits.requestsPerHour.toString(),
      'X-RateLimit-Limit-Day': rateLimitCheck.limits.requestsPerDay.toString(),
      'X-RateLimit-Limit-Month': rateLimitCheck.limits.requestsPerMonth.toString(),
      'X-RateLimit-Remaining-Hour': Math.max(0, rateLimitCheck.limits.requestsPerHour - rateLimitCheck.usage.hour).toString(),
      'X-RateLimit-Remaining-Day': Math.max(0, rateLimitCheck.limits.requestsPerDay - rateLimitCheck.usage.day).toString(),
      'X-RateLimit-Remaining-Month': Math.max(0, rateLimitCheck.limits.requestsPerMonth - rateLimitCheck.usage.month).toString(),
      'X-RateLimit-Reset-Hour': Math.ceil(rateLimitCheck.resetTimes.hour.getTime() / 1000).toString(),
      'X-RateLimit-Reset-Day': Math.ceil(rateLimitCheck.resetTimes.day.getTime() / 1000).toString(),
      'X-RateLimit-Reset-Month': Math.ceil(rateLimitCheck.resetTimes.month.getTime() / 1000).toString()
    });

    // Check if rate limit exceeded
    if (!rateLimitCheck.allowed) {
      const exceedsHourly = rateLimitCheck.usage.hour >= rateLimitCheck.limits.requestsPerHour;
      const exceedsDaily = rateLimitCheck.usage.day >= rateLimitCheck.limits.requestsPerDay;
      const exceedsMonthly = rateLimitCheck.usage.month >= rateLimitCheck.limits.requestsPerMonth;

      let limitType = 'monthly';
      let resetTime = rateLimitCheck.resetTimes.month;

      if (exceedsHourly) {
        limitType = 'hourly';
        resetTime = rateLimitCheck.resetTimes.hour;
      } else if (exceedsDaily) {
        limitType = 'daily';
        resetTime = rateLimitCheck.resetTimes.day;
      }

      logger.warn(`Rate limit exceeded for user ${userId}: ${limitType} limit`);

      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Rate limit exceeded. You have reached your ${limitType} limit.`,
          details: {
            limitType,
            limits: rateLimitCheck.limits,
            usage: rateLimitCheck.usage,
            resetTime: resetTime.toISOString()
          }
        }
      });
      return;
    }

    // Increment usage counter
    await SubscriptionService.incrementUsage(userId);

    next();
  } catch (error) {
    logger.error('Error in user rate limit middleware:', error);
    
    // On error, allow the request but log the issue
    res.set({
      'X-RateLimit-Error': 'true'
    });
    
    next();
  }
};

/**
 * Get rate limit status for a user (without incrementing)
 */
export const getRateLimitStatus = async (userId: string) => {
  try {
    await SubscriptionService.checkSubscriptionExpiry(userId);
    return await SubscriptionService.checkRateLimit(userId);
  } catch (error) {
    logger.error('Error getting rate limit status:', error);
    throw error;
  }
};
