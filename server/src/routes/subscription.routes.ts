import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authenticateAdmin } from '../middlewares/admin.middleware';
import { rateLimitMiddleware } from '../middlewares/rateLimit.middleware';

const router: Router = Router();

/**
 * @route   GET /api/subscription/plans
 * @desc    Get available subscription plans
 * @access  Public
 */
router.get('/plans', SubscriptionController.getAvailablePlans);

/**
 * @route   GET /api/subscription/me
 * @desc    Get current user's subscription info
 * @access  Private (JWT required)
 */
router.get('/me', authenticateJWT, SubscriptionController.getUserSubscription);

/**
 * @route   GET /api/subscription/rate-limit
 * @desc    Get current user's rate limit status
 * @access  Private (JWT required)
 */
router.get('/rate-limit', authenticateJWT, SubscriptionController.getRateLimitStatus);

/**
 * @route   PUT /api/subscription/users/:userId/plan
 * @desc    Update user's subscription plan (Admin only)
 * @access  Private (Admin JWT required)
 * @body    { plan: 'free' | 'pro' | 'enterprise' }
 */
router.put('/users/:userId/plan', 
  authenticateAdmin, 
  rateLimitMiddleware,
  SubscriptionController.updateUserPlan
);

export default router;
