import { Response } from 'express';
import { ApiKeyService } from '../services/apiKey.service';
import { asyncHandler } from '../utils/errors';
import { validateRequest } from '../utils/validation';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import Joi from 'joi';

// Validation schemas
const createApiKeySchema = Joi.object({
  name: Joi.string().required().min(1).max(100).trim(),
  description: Joi.string().optional().max(500),
  environment: Joi.string().valid('development', 'staging', 'production').default('development'),
  permissions: Joi.array().items(
    Joi.string().valid(
      'read:provinces', 'read:districts', 'read:divisions', 
      'read:dsds', 'read:all', 'write:data', 'admin:all'
    )
  ).default(['read:all']),
  rateLimit: Joi.object({
    requestsPerHour: Joi.number().min(1).max(10000).default(1000),
    requestsPerDay: Joi.number().min(1).max(100000).default(10000),
    requestsPerMonth: Joi.number().min(1).max(1000000).default(100000)
  }).optional(),
  restrictions: Joi.object({
    allowedIPs: Joi.array().items(Joi.string().ip()).optional(),
    allowedDomains: Joi.array().items(Joi.string().domain()).optional(),
    allowedEndpoints: Joi.array().items(Joi.string()).optional()
  }).optional(),
  expiresAt: Joi.date().greater('now').optional()
});

const updateApiKeySchema = Joi.object({
  name: Joi.string().min(1).max(100).trim().optional(),
  description: Joi.string().max(500).allow('').optional(),
  environment: Joi.string().valid('development', 'staging', 'production').optional(),
  permissions: Joi.array().items(
    Joi.string().valid(
      'read:provinces', 'read:districts', 'read:divisions', 
      'read:dsds', 'read:all', 'write:data', 'admin:all'
    )
  ).optional(),
  rateLimit: Joi.object({
    requestsPerHour: Joi.number().min(1).max(10000).optional(),
    requestsPerDay: Joi.number().min(1).max(100000).optional(),
    requestsPerMonth: Joi.number().min(1).max(1000000).optional()
  }).optional(),
  restrictions: Joi.object({
    allowedIPs: Joi.array().items(Joi.string().ip()).optional(),
    allowedDomains: Joi.array().items(Joi.string().domain()).optional(),
    allowedEndpoints: Joi.array().items(Joi.string()).optional()
  }).optional(),
  expiresAt: Joi.date().greater('now').allow(null).optional()
});

export class ApiKeyController {
  /**
   * Create a new API key
   * POST /api/keys
   */
  static createApiKey = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const validatedData = validateRequest(req, createApiKeySchema);
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const apiKey = await ApiKeyService.createApiKey({
      ...validatedData,
      userId
    });

    res.status(201).json({
      success: true,
      data: apiKey,
      message: 'API key created successfully',
      meta: {
        timestamp: new Date().toISOString(),
        warning: 'This is the only time the full API key will be shown. Please save it securely.'
      }
    });
  });

  /**
   * Get all API keys for the authenticated user
   * GET /api/keys
   */
  static getUserApiKeys = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const apiKeys = await ApiKeyService.getUserApiKeys(userId);

    res.json({
      success: true,
      data: apiKeys,
      message: 'API keys retrieved successfully',
      meta: {
        total: apiKeys.length,
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Get specific API key details
   * GET /api/keys/:keyId
   */
  static getApiKey = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { keyId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const apiKey = await ApiKeyService.getApiKeyById(keyId!, userId!);

    res.json({
      success: true,
      data: apiKey,
      message: 'API key retrieved successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Update API key
   * PUT /api/keys/:keyId
   */
  static updateApiKey = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { keyId } = req.params;
    const userId = req.user?.id;
    const validatedData = validateRequest(req, updateApiKeySchema);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const apiKey = await ApiKeyService.updateApiKey(keyId!, userId!, validatedData);

    res.json({
      success: true,
      data: apiKey,
      message: 'API key updated successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Deactivate API key
   * DELETE /api/keys/:keyId
   */
  static deactivateApiKey = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { keyId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    await ApiKeyService.deactivateApiKey(keyId!, userId!);

    res.json({
      success: true,
      message: 'API key deactivated successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Regenerate API key
   * POST /api/keys/:keyId/regenerate
   */
  static regenerateApiKey = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { keyId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const apiKey = await ApiKeyService.regenerateApiKey(keyId!, userId!);

    res.json({
      success: true,
      data: apiKey,
      message: 'API key regenerated successfully',
      meta: {
        timestamp: new Date().toISOString(),
        warning: 'This is the only time the new API key will be shown. Please save it securely.'
      }
    });
  });

  /**
   * Get API key usage statistics
   * GET /api/keys/:keyId/usage
   */
  static getApiKeyUsage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { keyId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const usage = await ApiKeyService.getUsageStats(keyId!, userId!);

    res.json({
      success: true,
      data: usage,
      message: 'API key usage retrieved successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Get user's total API usage across all keys
   * GET /api/keys/usage/total
   */
  static getTotalUsage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
      return;
    }

    const usage = await ApiKeyService.getUserTotalUsage(userId);

    res.json({
      success: true,
      data: usage,
      message: 'Total API usage retrieved successfully',
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  });

  /**
   * Get user's API key limits and current usage
   */
  static getApiKeyLimits = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
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

    const usage = await ApiKeyService.getUserApiKeyUsage(userId);

    res.json({
      success: true,
      data: usage,
      message: 'API key limits retrieved successfully'
    });
  });
}
