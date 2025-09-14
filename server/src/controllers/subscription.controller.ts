import { Response } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { AuthenticatedRequest } from '../types/auth.types';
import { handleApiError } from '../utils/errorHandler';
import { logger } from '../config/logger.config';

export class SubscriptionController {
  /**
   * Get current user's subscription info
   */
  static async getUserSubscription(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User authentication required'
          }
        });
        return;
      }

      const subscription = await SubscriptionService.getUserSubscription(userId);
      
      if (!subscription) {
        res.status(404).json({
          success: false,
          error: {
            code: 'SUBSCRIPTION_NOT_FOUND',
            message: 'Subscription not found'
          }
        });
        return;
      }

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      logger.error('Error getting user subscription:', error);
      handleApiError(error, res);
    }
  }

  /**
   * Update user's subscription plan (Admin only)
   */
  static async updateUserPlan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { plan } = req.body;

      // Validate plan
      if (!['free', 'pro', 'enterprise'].includes(plan)) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PLAN',
            message: 'Invalid subscription plan. Must be one of: free, pro, enterprise'
          }
        });
        return;
      }

      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_USER_ID',
            message: 'User ID is required'
          }
        });
        return;
      }

      const updatedUser = await SubscriptionService.updateUserPlan(userId, plan);
      
      if (!updatedUser) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found'
          }
        });
        return;
      }

      res.json({
        success: true,
        message: `User subscription updated to ${plan} plan`,
        data: {
          userId: updatedUser._id,
          plan: updatedUser.subscription.plan,
          status: updatedUser.subscription.status,
          limits: updatedUser.subscription.rateLimit
        }
      });
    } catch (error) {
      logger.error('Error updating user plan:', error);
      handleApiError(error, res);
    }
  }

  /**
   * Get rate limit status for current user
   */
  static async getRateLimitStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User authentication required'
          }
        });
        return;
      }

      const rateLimitStatus = await SubscriptionService.checkRateLimit(userId);

      res.json({
        success: true,
        data: {
          allowed: rateLimitStatus.allowed,
          limits: rateLimitStatus.limits,
          usage: rateLimitStatus.usage,
          resetTimes: rateLimitStatus.resetTimes,
          remaining: {
            hour: Math.max(0, rateLimitStatus.limits.requestsPerHour - rateLimitStatus.usage.hour),
            day: Math.max(0, rateLimitStatus.limits.requestsPerDay - rateLimitStatus.usage.day),
            month: Math.max(0, rateLimitStatus.limits.requestsPerMonth - rateLimitStatus.usage.month)
          }
        }
      });
    } catch (error) {
      logger.error('Error getting rate limit status:', error);
      handleApiError(error, res);
    }
  }

  /**
   * Get available subscription plans
   */
  static async getAvailablePlans(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const planLimits = SubscriptionService.getPlanLimits();
      
      const plans = Object.entries(planLimits).map(([planName, limits]) => ({
        name: planName,
        displayName: planName.charAt(0).toUpperCase() + planName.slice(1),
        limits,
        features: this.getPlanFeatures(planName as 'free' | 'pro' | 'enterprise')
      }));

      res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      logger.error('Error getting available plans:', error);
      handleApiError(error, res);
    }
  }

  /**
   * Get plan features
   */
  private static getPlanFeatures(plan: 'free' | 'pro' | 'enterprise'): string[] {
    const features = {
      free: [
        'Basic API access',
        'Community support',
        'Standard rate limits'
      ],
      pro: [
        'Enhanced API access',
        'Priority support',
        'Higher rate limits',
        'Advanced analytics'
      ],
      enterprise: [
        'Full API access',
        'Dedicated support',
        'Custom rate limits',
        'Advanced analytics',
        'SLA guarantee',
        'Custom integrations'
      ]
    };

    return features[plan] || [];
  }
}
