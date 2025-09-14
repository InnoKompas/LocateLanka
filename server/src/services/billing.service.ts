import { User } from '../models/user.model';
import { logger } from '../config/logger.config';

export interface BillingInfo {
  currentPlan: string;
  nextBillingDate: string | null;
  amount: number;
  currency: string;
  paymentMethod: string | null;
  status: string;
  usage: {
    currentMonth: number;
    limit: number;
    percentage: number;
  };
}

export interface PlanFeatures {
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: {
    apiCalls: number;
    apiKeys: number;
    requestsPerHour: number;
    requestsPerDay: number;
    requestsPerMonth: number;
  };
}

export class BillingService {
  /**
   * Get user's billing information
   */
  static async getBillingInfo(userId: string): Promise<BillingInfo> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const subscription = user.subscription || {
        plan: 'free',
        status: 'active',
        startDate: new Date(),
        endDate: null,
        rateLimit: {
          requestsPerHour: 100,
          requestsPerDay: 1000,
          requestsPerMonth: 10000
        }
      };

      const usage = user.usage || {
        currentHour: { count: 0, resetTime: new Date() },
        currentDay: { count: 0, resetTime: new Date() },
        currentMonth: { count: 0, resetTime: new Date() }
      };

      // Calculate next billing date (monthly billing)
      let nextBillingDate: string | null = null;
      if (subscription.plan !== 'free' && subscription.endDate) {
        const nextBilling = new Date(subscription.endDate);
        nextBilling.setMonth(nextBilling.getMonth() + 1);
        nextBillingDate = nextBilling.toISOString();
      }

      // Get plan pricing
      const planPricing = this.getPlanPricing();
      const currentPlanPrice = planPricing[subscription.plan as keyof typeof planPricing] || 0;

      return {
        currentPlan: subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1),
        nextBillingDate,
        amount: currentPlanPrice,
        currency: 'month',
        paymentMethod: subscription.plan === 'free' ? null : 'Credit Card',
        status: subscription.status || 'active',
        usage: {
          currentMonth: usage.currentMonth.count,
          limit: subscription.rateLimit.requestsPerMonth,
          percentage: Math.round((usage.currentMonth.count / subscription.rateLimit.requestsPerMonth) * 100)
        }
      };
    } catch (error) {
      logger.error('Error getting billing info:', error);
      throw error;
    }
  }

  /**
   * Get available subscription plans
   */
  static async getAvailablePlans(): Promise<PlanFeatures[]> {
    const planPricing = this.getPlanPricing();
    
    return [
      {
        name: 'Free',
        price: planPricing.free,
        currency: 'USD',
        features: [
          'Basic API access',
          'Community support',
          'Standard rate limits',
          'Basic analytics'
        ],
        limits: {
          apiCalls: 10000,
          apiKeys: 2,
          requestsPerHour: 100,
          requestsPerDay: 1000,
          requestsPerMonth: 10000
        }
      },
      {
        name: 'Pro',
        price: planPricing.pro,
        currency: 'USD',
        features: [
          'Higher rate limits',
          'Priority support',
          'Advanced analytics',
          'Multiple API keys',
          'Custom integrations'
        ],
        limits: {
          apiCalls: 100000,
          apiKeys: 10,
          requestsPerHour: 1000,
          requestsPerDay: 10000,
          requestsPerMonth: 100000
        }
      },
      {
        name: 'Enterprise',
        price: planPricing.enterprise,
        currency: 'USD',
        features: [
          'Unlimited API calls',
          'Dedicated support',
          'Custom rate limits',
          'Unlimited API keys',
          'SLA guarantee',
          'Custom integrations',
          'Priority feature requests'
        ],
        limits: {
          apiCalls: -1, // Unlimited
          apiKeys: -1,  // Unlimited
          requestsPerHour: 10000,
          requestsPerDay: 100000,
          requestsPerMonth: 1000000
        }
      }
    ];
  }

  /**
   * Upgrade user's plan
   */
  static async upgradePlan(userId: string, planId: string): Promise<{ checkoutUrl: string }> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Validate plan
      const validPlans = ['free', 'pro', 'enterprise'];
      const normalizedPlan = planId.toLowerCase();
      
      if (!validPlans.includes(normalizedPlan)) {
        throw new Error('Invalid plan selected');
      }

      // For demo purposes, we'll simulate a checkout URL
      // In production, this would integrate with Stripe, PayPal, etc.
      const checkoutUrl = this.generateCheckoutUrl(userId, normalizedPlan);

      // Log the upgrade attempt
      logger.info(`User ${userId} attempting to upgrade to ${normalizedPlan} plan`);

      return { checkoutUrl };
    } catch (error) {
      logger.error('Error upgrading plan:', error);
      throw error;
    }
  }

  /**
   * Process successful payment and update user plan
   */
  static async processPaymentSuccess(userId: string, planId: string, paymentId: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // Monthly billing

      // Get new rate limits for the plan
      const planLimits = this.getPlanLimits(planId);

      // Update user subscription
      user.subscription = {
        plan: planId as 'free' | 'pro' | 'enterprise',
        status: 'active',
        startDate: now,
        endDate: endDate,
        rateLimit: planLimits
      };

      await user.save();

      logger.info(`Successfully upgraded user ${userId} to ${planId} plan with payment ${paymentId}`);
    } catch (error) {
      logger.error('Error processing payment success:', error);
      throw error;
    }
  }

  /**
   * Get plan pricing
   */
  private static getPlanPricing() {
    return {
      free: 0,
      pro: 29,
      enterprise: 99
    };
  }

  /**
   * Get rate limits for a plan
   */
  private static getPlanLimits(plan: string) {
    const limits = {
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

    return limits[plan as keyof typeof limits] || limits.free;
  }

  /**
   * Generate checkout URL (demo implementation)
   */
  private static generateCheckoutUrl(userId: string, planId: string): string {
    // In production, this would create a Stripe checkout session or similar
    const baseUrl = process.env['CLIENT_URL'] || 'http://localhost:5173';
    const sessionId = `checkout_${userId}_${planId}_${Date.now()}`;
    
    // For demo, redirect to a success page after 3 seconds
    return `${baseUrl}/billing/checkout?session=${sessionId}&plan=${planId}&demo=true`;
  }

  /**
   * Cancel user subscription
   */
  static async cancelSubscription(userId: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.subscription && user.subscription.plan !== 'free') {
        // Set to cancel at period end
        user.subscription.status = 'cancelled';
        await user.save();

        logger.info(`Cancelled subscription for user ${userId}`);
      }
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  /**
   * Get billing history
   */
  static async getBillingHistory(_userId: string): Promise<any[]> {
    try {
      // In production, this would fetch from payment processor
      // For now, return mock data
      return [
        {
          id: 'inv_001',
          date: new Date().toISOString(),
          amount: 29,
          status: 'paid',
          plan: 'Pro',
          downloadUrl: '/api/billing/invoice/inv_001'
        }
      ];
    } catch (error) {
      logger.error('Error getting billing history:', error);
      throw error;
    }
  }
}
