import { Router } from 'express';
import { DSDController } from '../../../controllers/dsd.controller';
import { authenticateApiKey } from '../../../middlewares/auth.middleware';
import { rateLimitMiddleware } from '../../../middlewares/rateLimit.middleware';

const router: Router = Router();
const dsdController = new DSDController();

/**
 * @route   GET /api/v1/dsds
 * @desc    Get all DSDs (Divisional Secretariat Divisions) with optional filters
 * @access  Private (requires API key)
 * @query   district - Filter by district name or code
 * @query   province - Filter by province name
 * @example GET /api/v1/dsds
 * @example GET /api/v1/dsds?district=Colombo
 * @example GET /api/v1/dsds?province=Western
 */
router.get(
  '/',
  authenticateApiKey,
  rateLimitMiddleware,
  dsdController.getDSDs
);

/**
 * @route   GET /api/v1/dsds/:id
 * @desc    Get a specific DSD by ID (code)
 * @access  Private (requires API key)
 * @example GET /api/v1/dsds/24
 */
router.get(
  '/:id',
  authenticateApiKey,
  rateLimitMiddleware,
  dsdController.getDSDById
);

/**
 * @route   GET /api/v1/dsds/:id/divisions
 * @desc    Get all GN divisions in a specific DSD
 * @access  Private (requires API key)
 * @query   includeGeometry - Include GeoJSON geometry (true/false)
 * @example GET /api/v1/dsds/24/divisions
 * @example GET /api/v1/dsds/24/divisions?includeGeometry=true
 */
router.get(
  '/:id/divisions',
  authenticateApiKey,
  rateLimitMiddleware,
  dsdController.getDivisionsByDSD
);

export default router;
