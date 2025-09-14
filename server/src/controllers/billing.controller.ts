import { Response } from 'express';
import { BillingService } from '../services/billing.service';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { handleApiError } from '../utils/errorHandler';
// import { logger } from '../config/logger.config';

export class BillingController {
  /**
   * Get user's billing information
   */
  static async getBillingInfo(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
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

      const billingInfo = await BillingService.getBillingInfo(userId);
      
      res.json({
        success: true,
        data: billingInfo
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  /**
   * Get available subscription plans
   */
  static async getAvailablePlans(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const plans = await BillingService.getAvailablePlans();
      
      res.json({
        success: true,
        data: plans
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  /**
   * Upgrade user's subscription plan
   */
  static async upgradePlan(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { planId } = req.body;
      
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

      if (!planId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PLAN_ID',
            message: 'Plan ID is required'
          }
        });
        return;
      }

      const result = await BillingService.upgradePlan(userId, planId);
      
      res.json({
        success: true,
        data: result,
        message: 'Checkout session created successfully'
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  /**
   * Process successful payment webhook
   */
  static async processPaymentSuccess(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId, planId, paymentId } = req.body;
      
      if (!userId || !planId || !paymentId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'userId, planId, and paymentId are required'
          }
        });
        return;
      }

      await BillingService.processPaymentSuccess(userId, planId, paymentId);
      
      res.json({
        success: true,
        message: 'Payment processed successfully'
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  /**
   * Cancel user subscription
   */
  static async cancelSubscription(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
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

      await BillingService.cancelSubscription(userId);
      
      res.json({
        success: true,
        message: 'Subscription cancelled successfully'
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  /**
   * Get billing history
   */
  static async getBillingHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
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

      const history = await BillingService.getBillingHistory(userId);
      
      res.json({
        success: true,
        data: history
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  /**
   * Download invoice
   */
  static async downloadInvoice(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      const { invoiceId } = req.params;
      
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

      if (!invoiceId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_INVOICE_ID',
            message: 'Invoice ID is required'
          }
        });
        return;
      }

      // In production, this would generate and return the actual invoice PDF
      // For demo, return a mock response
      res.json({
        success: true,
        data: {
          downloadUrl: `/api/billing/invoice/${invoiceId}/download`,
          message: 'Invoice download feature coming soon'
        }
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  /**
   * Get current usage statistics
   */
  static async getUsageStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      
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

      const billingInfo = await BillingService.getBillingInfo(userId);
      
      res.json({
        success: true,
        data: {
          usage: billingInfo.usage,
          plan: billingInfo.currentPlan,
          status: billingInfo.status
        }
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }
}
