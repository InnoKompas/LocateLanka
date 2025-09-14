import { Router } from 'express';
import { ProvinceController } from '../../../controllers/province.controller';
import { authenticateApiKey } from '../../../middlewares/auth.middleware';
import { userRateLimitMiddleware } from '../../../middlewares/userRateLimit.middleware';

const router: Router = Router();
const provinceController = new ProvinceController();

/**
 * @route   GET /api/v1/provinces
 * @desc    Get all provinces in Sri Lanka
 * @access  Private (requires API key)
 * @example GET /api/v1/provinces
 */
router.get(
  '/',
  authenticateApiKey,
  userRateLimitMiddleware,
  provinceController.getAllProvinces
);

/**
 * @route   GET /api/v1/provinces/:id
 * @desc    Get a specific province by ID
 * @access  Private (requires API key)
 * @example GET /api/v1/provinces/1
 */
router.get(
  '/:id',
  authenticateApiKey,
  userRateLimitMiddleware,
  provinceController.getProvinceById
);

/**
 * @route   GET /api/v1/provinces/:id/districts
 * @desc    Get all districts in a specific province
 * @access  Private (requires API key)
 * @example GET /api/v1/provinces/1/districts
 */
router.get(
  '/:id/districts',
  authenticateApiKey,
  userRateLimitMiddleware,
  provinceController.getDistrictsByProvince
);

export default router;

