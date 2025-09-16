import { Router } from 'express';
import provincesRoutes from './provinces.routes';
import districtsRoutes from './districts.routes';
import dsdsRoutes from './dsds.routes';
import divisionsRoutes from './divisions.routes';
import demoRoutes from './demo.routes';
import demoTokenRoutes from './demoToken.routes';

const router: Router = Router();

// API v1 routes
router.use('/provinces', provincesRoutes);
router.use('/districts', districtsRoutes);
router.use('/dsds', dsdsRoutes);
router.use('/divisions', divisionsRoutes);

// Public demo routes (domain restricted)
router.use('/demo', demoRoutes);

// Demo token management routes
router.use('/demo-token', demoTokenRoutes);

// API health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    message: 'LankaLocate API v1 is running'
  });
});

// API info endpoint
router.get('/', (_req, res) => {
  res.json({
    name: 'LankaLocate API',
    version: '1.0.0',
    description: 'Developer API for Sri Lanka GN Divisions',
    endpoints: {
      provinces: '/api/v1/provinces',
      districts: '/api/v1/districts',
      dsds: '/api/v1/dsds',
      divisions: '/api/v1/divisions',
      demo: '/api/v1/demo',
      demoToken: '/api/v1/demo-token'
    },
    documentation: 'https://lankalocate.dev/docs'
  });
});

export default router;
