import { Router } from 'express';
import { BillingController } from '../controllers/billing.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { rateLimitMiddleware } from '../middlewares/rateLimit.middleware';

const router: Router = Router();

// Apply JWT authentication to all routes
router.use(authenticateJWT);

// Apply rate limiting
router.use(rateLimitMiddleware);

/**
 * @route   GET /api/billing
 * @desc    Get user's billing information
 * @access  Private (JWT required)
 */
router.get('/', BillingController.getBillingInfo);

/**
 * @route   GET /api/billing/plans
 * @desc    Get available subscription plans
 * @access  Private (JWT required)
 */
router.get('/plans', BillingController.getAvailablePlans);

/**
 * @route   POST /api/billing/upgrade
 * @desc    Upgrade user's subscription plan
 * @access  Private (JWT required)
 * @body    { planId: string }
 */
router.post('/upgrade', BillingController.upgradePlan);

/**
 * @route   POST /api/billing/cancel
 * @desc    Cancel user's subscription
 * @access  Private (JWT required)
 */
router.post('/cancel', BillingController.cancelSubscription);

/**
 * @route   GET /api/billing/history
 * @desc    Get user's billing history
 * @access  Private (JWT required)
 */
router.get('/history', BillingController.getBillingHistory);

/**
 * @route   GET /api/billing/usage
 * @desc    Get current usage statistics
 * @access  Private (JWT required)
 */
router.get('/usage', BillingController.getUsageStats);

/**
 * @route   GET /api/billing/invoice/:invoiceId
 * @desc    Download invoice
 * @access  Private (JWT required)
 */
router.get('/invoice/:invoiceId', BillingController.downloadInvoice);

/**
 * @route   POST /api/billing/webhook/payment-success
 * @desc    Process successful payment webhook (for payment processors)
 * @access  Public (webhook)
 * @body    { userId: string, planId: string, paymentId: string }
 */
router.post('/webhook/payment-success', BillingController.processPaymentSuccess);

export default router;
