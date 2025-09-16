import { Router } from 'express';
import { ProvinceController } from '../../../controllers/province.controller';
import { DSDController } from '../../../controllers/dsd.controller';
import { DivisionController } from '../../../controllers/division.controller';
import { domainRestrictionMiddleware, corsPreflightHandler } from '../../../middlewares/domainRestriction.middleware';
import { validateDemoToken, logDemoUsage } from '../../../middlewares/demoToken.middleware';
import { usageLogger } from '../../../middlewares/usageLogger.middleware';

const router: Router = Router();

// Initialize controllers
const provinceController = new ProvinceController();
const dsdController = new DSDController();
const divisionController = new DivisionController();

// Disable demo endpoints entirely unless explicitly enabled
router.use((_req, res, next) => {
  if (process.env['DEMO_ENDPOINTS_ENABLED'] === 'true') {
    return next();
  }
  return res.status(404).json({ success: false, message: 'Not found' });
});

// Apply domain restriction, CORS and demo token validation to all demo routes
router.use(corsPreflightHandler);
router.use(domainRestrictionMiddleware);
router.use(validateDemoToken);
router.use(logDemoUsage);

// Optional: Add usage logging for analytics (without user tracking)
router.use(usageLogger);

/**
 * @route   GET /api/v1/demo/provinces
 * @desc    Get all provinces in Sri Lanka (Public Demo)
 * @access  Public (domain restricted)
 * @example GET /api/v1/demo/provinces
 */
router.get('/provinces', provinceController.getAllProvinces);

/**
 * @route   GET /api/v1/demo/provinces/:id/districts
 * @desc    Get all districts in a specific province (Public Demo)
 * @access  Public (domain restricted)
 * @example GET /api/v1/demo/provinces/1/districts
 */
router.get('/provinces/:id/districts', provinceController.getDistrictsByProvince);

/**
 * @route   GET /api/v1/demo/dsds
 * @desc    Get DSDs filtered by district (Public Demo)
 * @access  Public (domain restricted)
 * @query   district - Filter by district name (required for demo)
 * @example GET /api/v1/demo/dsds?district=Colombo
 */
router.get('/dsds', dsdController.getDSDs);

/**
 * @route   GET /api/v1/demo/dsds/:id/divisions
 * @desc    Get all GN divisions in a specific DSD (Public Demo)
 * @access  Public (domain restricted)
 * @example GET /api/v1/demo/dsds/24/divisions
 */
router.get('/dsds/:id/divisions', dsdController.getDivisionsByDSD);

/**
 * @route   GET /api/v1/demo/divisions/search
 * @desc    Search GN divisions by name (Public Demo)
 * @access  Public (domain restricted)
 * @query   q - Search query string
 * @query   limit - Maximum number of results (optional, default: 10)
 * @example GET /api/v1/demo/divisions/search?q=Colombo&limit=5
 */
router.get('/divisions/search', divisionController.searchDivisions);

export default router;
