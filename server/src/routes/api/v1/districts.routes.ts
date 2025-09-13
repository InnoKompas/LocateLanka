import { Router } from 'express';
import { DistrictController } from '../../../controllers/district.controller';
import { authenticateApiKey } from '../../../middlewares/auth.middleware';
import { rateLimitMiddleware } from '../../../middlewares/rateLimit.middleware';

const router: Router = Router();
const districtController = new DistrictController();

/**
 * @route   GET /api/v1/districts
 * @desc    Get all districts or filter by province
 * @access  Private (requires API key)
 * @query   province - Filter districts by province name
 * @example GET /api/v1/districts
 * @example GET /api/v1/districts?province=Western
 */
router.get(
  '/',
  authenticateApiKey,
  rateLimitMiddleware,
  districtController.getDistricts
);

/**
 * @route   GET /api/v1/districts/:id
 * @desc    Get a specific district by ID
 * @access  Private (requires API key)
 * @example GET /api/v1/districts/1
 */
router.get(
  '/:id',
  authenticateApiKey,
  rateLimitMiddleware,
  districtController.getDistrictById
);

/**
 * @route   GET /api/v1/districts/:id/divisions
 * @desc    Get all GN divisions in a specific district
 * @access  Private (requires API key)
 * @example GET /api/v1/districts/1/divisions
 */
router.get(
  '/:id/divisions',
  authenticateApiKey,
  rateLimitMiddleware,
  districtController.getDivisionsByDistrict
);

export default router;
