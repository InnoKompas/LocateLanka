import { Router, Request, Response } from 'express';
import { DatabaseConfig } from '../config/database.config';
import { logger } from '../config/logger.config';
import { asyncHandler } from '../utils/errors';
import { config } from '../config/environment.config';

const router: Router = Router();

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  services: {
    database: {
      mongodb: boolean;
      mongoose: boolean;
    };
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      usage: number;
    };
  };
}

/**
 * Basic health check endpoint
 */
router.get('/health', asyncHandler(async (_req: Request, res: Response) => {
  const dbConfig = DatabaseConfig.getInstance();
  const dbHealth = await dbConfig.healthCheck();
  
  const memoryUsage = process.memoryUsage();
  const totalMemory = memoryUsage.heapTotal;
  const usedMemory = memoryUsage.heapUsed;
  const memoryPercentage = (usedMemory / totalMemory) * 100;

  const healthStatus: HealthStatus = {
    status: dbHealth.mongodb && dbHealth.mongoose ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env['npm_package_version'] || '1.0.0',
    environment: config.NODE_ENV,
    services: {
      database: dbHealth,
      memory: {
        used: Math.round(usedMemory / 1024 / 1024), // MB
        total: Math.round(totalMemory / 1024 / 1024), // MB
        percentage: Math.round(memoryPercentage),
      },
      cpu: {
        usage: Math.round(process.cpuUsage().user / 1000000), // Convert to seconds
      },
    },
  };

  const statusCode = healthStatus.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(healthStatus);
}));

/**
 * Detailed health check endpoint
 */
router.get('/health/detailed', asyncHandler(async (_req: Request, res: Response) => {
  const dbConfig = DatabaseConfig.getInstance();
  const dbHealth = await dbConfig.healthCheck();
  
  // Test database operations
  let dbOperational = false;
  try {
    const collection = dbConfig.getGNDivisionsCollection();
    await collection.findOne({}, { projection: { _id: 1 } });
    dbOperational = true;
  } catch (error) {
    logger.error('Database operation test failed:', error);
  }

  const memoryUsage = process.memoryUsage();
  
  const detailedHealth = {
    status: dbHealth.mongodb && dbHealth.mongoose && dbOperational ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env['npm_package_version'] || '1.0.0',
    environment: config.NODE_ENV,
    pid: process.pid,
    services: {
      database: {
        ...dbHealth,
        operational: dbOperational,
      },
      memory: {
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
        arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024), // MB
      },
      cpu: process.cpuUsage(),
    },
    config: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
  };

  const statusCode = detailedHealth.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(detailedHealth);
}));

/**
 * Readiness probe (for Kubernetes)
 */
router.get('/ready', asyncHandler(async (_req: Request, res: Response) => {
  const dbConfig = DatabaseConfig.getInstance();
  const dbHealth = await dbConfig.healthCheck();
  
  if (dbHealth.mongodb && dbHealth.mongoose) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not ready' });
  }
}));

/**
 * Liveness probe (for Kubernetes)
 */
router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'alive' });
});

/**
 * Metrics endpoint (basic)
 */
router.get('/metrics', asyncHandler(async (_req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      heapUsed: memoryUsage.heapUsed,
      heapTotal: memoryUsage.heapTotal,
      rss: memoryUsage.rss,
      external: memoryUsage.external,
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system,
    },
    eventLoop: {
      // Add event loop lag if needed
    },
  };

  res.json(metrics);
}));

export default router;
