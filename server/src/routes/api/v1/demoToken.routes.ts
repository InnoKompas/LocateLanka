import { Router, Request, Response } from 'express';
import { domainRestrictionMiddleware, corsPreflightHandler } from '../../../middlewares/domainRestriction.middleware';
import { demoRateLimitMiddleware } from '../../../middlewares/rateLimit.middleware';
import demoTokenService from '../../../services/demoToken.service';
import { AppError } from '../../../utils/errors';

const router: Router = Router();

// Apply domain restriction and rate limiting to all demo token routes
router.use(corsPreflightHandler);
router.use(domainRestrictionMiddleware);
router.use(demoRateLimitMiddleware);

/**
 * @route   POST /api/v1/demo-token/generate
 * @desc    Generate a new demo token for accessing demo endpoints
 * @access  Public (domain restricted)
 * @body    { purpose?: string } - Optional purpose description
 * @example POST /api/v1/demo-token/generate
 */
router.post('/generate', (req: Request, res: Response) => {
  try {
    const origin = req.get('Origin');
    const purpose = req.body?.purpose || 'demo';

    // Generate demo token
    const tokenData = demoTokenService.generateDemoToken(origin);

    console.log(`[Demo Token] Generated for origin: ${origin}, purpose: ${purpose}, session: ${tokenData.sessionId}`);

    res.status(201).json({
      success: true,
      message: 'Demo token generated successfully',
      data: {
        token: tokenData.token,
        sessionId: tokenData.sessionId,
        maxRequests: tokenData.maxRequests,
        expiresAt: new Date(tokenData.expiresAt).toISOString(),
        usage: {
          requestsUsed: 0,
          requestsRemaining: tokenData.maxRequests
        }
      },
      meta: {
        validFor: '1 hour',
        requestLimit: tokenData.maxRequests,
        usage: 'Add this token to Authorization header: Bearer <token>',
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Demo token generation error:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate demo token'
    });
  }
});

/**
 * @route   GET /api/v1/demo-token/info/:sessionId
 * @desc    Get information about a demo session
 * @access  Public (domain restricted)
 * @example GET /api/v1/demo-token/info/demo_1234567890_abc123
 */
router.get('/info/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    if (!sessionId) {
      throw new AppError('Session ID is required', 400);
    }

    const sessionInfo = demoTokenService.getSessionInfo(sessionId);
    
    if (!sessionInfo) {
      throw new AppError('Demo session not found or expired', 404);
    }

    const now = Date.now();
    const isExpired = now > sessionInfo.expiresAt;

    res.json({
      success: true,
      message: 'Demo session info retrieved',
      data: {
        sessionId: sessionInfo.sessionId,
        status: isExpired ? 'expired' : 'active',
        usage: {
          requestsUsed: sessionInfo.requestsUsed,
          requestsRemaining: sessionInfo.maxRequests - sessionInfo.requestsUsed,
          maxRequests: sessionInfo.maxRequests
        },
        timing: {
          createdAt: new Date(sessionInfo.createdAt).toISOString(),
          expiresAt: new Date(sessionInfo.expiresAt).toISOString(),
          timeRemaining: Math.max(0, sessionInfo.expiresAt - now)
        },
        origin: sessionInfo.origin || 'unknown'
      }
    });
  } catch (error) {
    console.error('Demo session info error:', error);
    
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Failed to retrieve demo session info'
    });
  }
});

/**
 * @route   GET /api/v1/demo-token/stats
 * @desc    Get demo usage statistics (for monitoring)
 * @access  Public (domain restricted)
 * @example GET /api/v1/demo-token/stats
 */
router.get('/stats', (_req: Request, res: Response) => {
  try {
    const stats = demoTokenService.getStats();

    res.json({
      success: true,
      message: 'Demo statistics retrieved',
      data: stats,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Demo stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve demo statistics'
    });
  }
});

export default router;
