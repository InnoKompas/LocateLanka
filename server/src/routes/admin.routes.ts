import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authenticateAdmin } from '../middlewares/admin.middleware';
import { rateLimitMiddleware } from '../middlewares/rateLimit.middleware';

const router: Router = Router();

// Apply admin authentication to all routes
router.use(authenticateAdmin);

// Apply rate limiting (stricter for admin operations)
router.use(rateLimitMiddleware);

/**
 * Dashboard Routes
 */

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard overview statistics
 * @access  Private (Admin only)
 */
router.get('/dashboard/stats', AdminController.getDashboardStats);

/**
 * @route   GET /api/admin/dashboard/activity
 * @desc    Get recent activity feed
 * @access  Private (Admin only)
 */
router.get('/dashboard/activity', AdminController.getRecentActivity);

/**
 * User Management Routes
 */

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filters
 * @access  Private (Admin only)
 * @query   page, limit, search, role, status
 */
router.get('/users', AdminController.getAllUsers);

/**
 * @route   PATCH /api/admin/users/:userId
 * @desc    Update user details (role, status, etc.)
 * @access  Private (Admin only)
 */
router.patch('/users/:userId', AdminController.updateUser);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Deactivate user account
 * @access  Private (Admin only)
 */
router.delete('/users/:userId', AdminController.deleteUser);

/**
 * API Key Management Routes
 */

/**
 * @route   GET /api/admin/keys
 * @desc    Get all API keys with pagination and filters
 * @access  Private (Admin only)
 * @query   page, limit, search, status
 */
router.get('/keys', AdminController.getAllApiKeys);

/**
 * @route   PATCH /api/admin/keys/:keyId
 * @desc    Update API key details
 * @access  Private (Admin only)
 */
router.patch('/keys/:keyId', AdminController.updateApiKey);

/**
 * @route   POST /api/admin/keys/:keyId/revoke
 * @desc    Revoke API key
 * @access  Private (Admin only)
 */
router.post('/keys/:keyId/revoke', AdminController.revokeApiKey);

/**
 * Analytics Routes
 */

/**
 * @route   GET /api/admin/analytics/usage
 * @desc    Get usage analytics and charts data
 * @access  Private (Admin only)
 * @query   period, days
 */
router.get('/analytics/usage', AdminController.getUsageAnalytics);

/**
 * System Settings Routes
 */

/**
 * @route   GET /api/admin/settings
 * @desc    Get system settings
 * @access  Private (Admin only)
 */
router.get('/settings', AdminController.getSystemSettings);

/**
 * @route   PATCH /api/admin/settings
 * @desc    Update system settings
 * @access  Private (Admin only)
 */
router.patch('/settings', AdminController.updateSystemSettings);

export default router;
