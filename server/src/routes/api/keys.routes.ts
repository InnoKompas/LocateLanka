import { Router } from 'express';
import { ApiKeyController } from '../../controllers/apiKey.controller';
import { authenticateJWT } from '../../middlewares/auth.middleware';
import { rateLimitMiddleware } from '../../middlewares/rateLimit.middleware';

const router: Router = Router();

// Apply JWT authentication to all routes
router.use(authenticateJWT);

// Apply rate limiting (stricter for key management)
router.use(rateLimitMiddleware);

/**
 * @route   GET /api/keys/usage/total
 * @desc    Get user's total API usage across all keys
 * @access  Private (JWT required)
 */
router.get('/usage/total', ApiKeyController.getTotalUsage);

/**
 * @route   POST /api/keys
 * @desc    Create a new API key
 * @access  Private (JWT required)
 * @body    { name, description?, environment?, permissions?, rateLimit?, restrictions?, expiresAt? }
 */
router.post('/', ApiKeyController.createApiKey);

/**
 * @route   GET /api/keys
 * @desc    Get all API keys for the authenticated user
 * @access  Private (JWT required)
 */
router.get('/', ApiKeyController.getUserApiKeys);

/**
 * @route   GET /api/keys/:keyId
 * @desc    Get specific API key details
 * @access  Private (JWT required)
 */
router.get('/:keyId', ApiKeyController.getApiKey);

/**
 * @route   PUT /api/keys/:keyId
 * @desc    Update API key
 * @access  Private (JWT required)
 * @body    { name?, description?, environment?, permissions?, rateLimit?, restrictions?, expiresAt? }
 */
router.put('/:keyId', ApiKeyController.updateApiKey);

/**
 * @route   DELETE /api/keys/:keyId
 * @desc    Deactivate API key
 * @access  Private (JWT required)
 */
router.delete('/:keyId', ApiKeyController.deactivateApiKey);

/**
 * @route   POST /api/keys/:keyId/regenerate
 * @desc    Regenerate API key
 * @access  Private (JWT required)
 */
router.post('/:keyId/regenerate', ApiKeyController.regenerateApiKey);

/**
 * @route   GET /api/keys/:keyId/usage
 * @desc    Get API key usage statistics
 * @access  Private (JWT required)
 */
router.get('/:keyId/usage', ApiKeyController.getApiKeyUsage);

export default router;
