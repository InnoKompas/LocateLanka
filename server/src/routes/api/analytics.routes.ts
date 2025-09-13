import { Router } from 'express';
import { AnalyticsController } from '../../controllers/analytics.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { rateLimitMiddleware } from '../../middlewares/rateLimit.middleware';

const router: Router = Router();

// Apply JWT authentication to all routes
router.use(authenticateJWT);

// Apply rate limiting
router.use(rateLimitMiddleware);

/**
 * @route   GET /api/analytics/usage
 * @desc    Get user's usage analytics over time
 * @access  Private (JWT required)
 * @query   period - Time period: daily, weekly, monthly (default: daily)
 * @query   days - Number of days to retrieve (default: 30)
 */
router.get('/usage', AnalyticsController.getUserUsageAnalytics);

/**
 * @route   GET /api/analytics/endpoints
 * @desc    Get user's top endpoints
 * @access  Private (JWT required)
 */
router.get('/endpoints', AnalyticsController.getUserTopEndpoints);

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get comprehensive user analytics for dashboard
 * @access  Private (JWT required)
 * @query   period - Time period: daily, weekly, monthly (default: daily)
 */
router.get('/dashboard', AnalyticsController.getUserDashboardAnalytics);

/**
 * @route   GET /api/analytics/keys/:keyId
 * @desc    Get API key specific analytics
 * @access  Private (JWT required)
 * @query   period - Time period: daily, weekly, monthly (default: daily)
 */
router.get('/keys/:keyId', AnalyticsController.getApiKeyAnalytics);

/**
 * @route   GET /api/analytics/system
 * @desc    Get system-wide analytics (admin only)
 * @access  Private (JWT required, admin role)
 */
router.get('/system', AnalyticsController.getSystemAnalytics);

export default router;
