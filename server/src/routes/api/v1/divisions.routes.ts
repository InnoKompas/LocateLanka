import { Router } from 'express';
import { DivisionController } from '../../../controllers/division.controller';
import { authenticateApiKey } from '../../../middlewares/auth.middleware';
import { userRateLimitMiddleware } from '../../../middlewares/userRateLimit.middleware';

const router: Router = Router();
const divisionController = new DivisionController();

/**
 * @route   GET /api/v1/divisions
 * @desc    Get GN divisions with optional filters
 * @access  Private (requires API key)
 * @query   district - Filter by district name
 * @query   city - Filter by city name
 * @query   province - Filter by province name
 * @example GET /api/v1/divisions
 * @example GET /api/v1/divisions?district=Colombo
 * @example GET /api/v1/divisions?city=Kandy
 * @example GET /api/v1/divisions?province=Western
 */
router.get(
  '/',
  authenticateApiKey,
  userRateLimitMiddleware,
  divisionController.getDivisions
);

/**
 * @route   GET /api/v1/divisions/:id
 * @desc    Get a specific GN division by ID
 * @access  Private (requires API key)
 * @example GET /api/v1/divisions/1
 */
router.get(
  '/:id',
  authenticateApiKey,
  userRateLimitMiddleware,
  divisionController.getDivisionById
);

/**
 * @route   GET /api/v1/divisions/search
 * @desc    Search GN divisions by name or code
 * @access  Private (requires API key)
 * @query   q - Search query (name or code)
 * @query   limit - Number of results (default: 10, max: 100)
 * @example GET /api/v1/divisions/search?q=Colombo&limit=20
 */
router.get(
  '/search',
  authenticateApiKey,
  userRateLimitMiddleware,
  divisionController.searchDivisions
);

export default router;
