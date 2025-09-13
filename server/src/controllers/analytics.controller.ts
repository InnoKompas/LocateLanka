import { Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { asyncHandler } from '../utils/errors';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class AnalyticsController {
  /**
   * Get user's usage analytics over time
   * GET /api/analytics/usage?period=daily&days=30
   */
  static getUserUsageAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const period = (req.query['period'] as 'daily' | 'weekly' | 'monthly') || 'daily';
    const days = parseInt(req.query['days'] as string) || 30;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const usageData = await AnalyticsService.getUserUsageOverTime(userId, period, days);

    res.json({
      success: true,
      data: usageData,
      message: 'Usage analytics retrieved successfully',
      meta: {
        period,
        days,
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Get user's top endpoints
   * GET /api/analytics/endpoints
   */
  static getUserTopEndpoints = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const topEndpoints = await AnalyticsService.getUserTopEndpoints(userId);

    res.json({
      success: true,
      data: topEndpoints,
      message: 'Top endpoints retrieved successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Get comprehensive user analytics
   * GET /api/analytics/dashboard?period=daily
   */
  static getUserDashboardAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;
    const period = (req.query['period'] as 'daily' | 'weekly' | 'monthly') || 'daily';

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const analytics = await AnalyticsService.getUserAnalytics(userId, period);

    res.json({
      success: true,
      data: analytics,
      message: 'Dashboard analytics retrieved successfully',
      meta: {
        period,
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Get API key specific analytics
   * GET /api/analytics/keys/:keyId?period=daily
   */
  static getApiKeyAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { keyId } = req.params;
    const userId = req.user?.id;
    const period = (req.query['period'] as 'daily' | 'weekly' | 'monthly') || 'daily';

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const analytics = await AnalyticsService.getApiKeyAnalytics(keyId!, userId, period);

    res.json({
      success: true,
      data: analytics,
      message: 'API key analytics retrieved successfully',
      meta: {
        keyId,
        period,
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Get system-wide analytics (admin only)
   * GET /api/analytics/system
   */
  static getSystemAnalytics = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
      return;
    }

    const analytics = await AnalyticsService.getSystemAnalytics();

    res.json({
      success: true,
      data: analytics,
      message: 'System analytics retrieved successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  });
}
