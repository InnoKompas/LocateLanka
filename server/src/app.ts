import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import apiKeyRoutes from './routes/api/keys.routes';
import analyticsRoutes from './routes/api/analytics.routes';
import adminRoutes from './routes/admin.routes';
import subscriptionRoutes from './routes/subscription.routes';
import billingRoutes from './routes/billing.routes';

// Configuration
import { 
  DatabaseConfig, 
  LOGGING, 
  PERFORMANCE, 
  IS_PRODUCTION 
} from './config';
import { logger } from './config/logger.config';

// Middleware
import { 
  securityHeaders, 
  corsOptions, 
  requestTimeout, 
  requestId 
} from './middlewares/security.middleware';
import { 
  errorHandler, 
  notFoundHandler 
} from './middlewares/error.middleware';

// Routes
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import apiV1Routes from './routes/api/v1';

const app: Application = express();

// Trust proxy (for production behind load balancer)
if (IS_PRODUCTION) {
  app.set('trust proxy', 1);
}

// Request ID and timeout
app.use(requestId);
app.use(requestTimeout(PERFORMANCE.REQUEST_TIMEOUT));

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: PERFORMANCE.BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: PERFORMANCE.BODY_LIMIT }));
app.use(cookieParser());

// Logging
if (LOGGING.FORMAT === 'dev') {
  app.use(morgan('dev'));
} else {
  app.use(morgan(LOGGING.FORMAT, {
    stream: {
      write: (message: string) => {
        logger.http(message.trim());
      }
    }
  }));
}

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../public')));

// Health check routes (no authentication required)
app.use('/', healthRoutes);

// Auth routes (no API key required)
app.use('/auth', authRoutes);

// API Key management routes (require JWT authentication)
app.use('/api/keys', apiKeyRoutes);

// Analytics routes (require JWT authentication)
app.use('/api/analytics', analyticsRoutes);

// Admin routes (require admin JWT authentication)
app.use('/api/admin', adminRoutes);

// Subscription routes
app.use('/api/subscription', subscriptionRoutes);

// Billing routes (require JWT authentication)
app.use('/api/billing', billingRoutes);

// API v1 routes (require API key authentication)
app.use('/api/v1', apiV1Routes);

// Catch-all handler: send back frontend's index.html file for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Initialize database connection
const initializeDatabase = async (): Promise<void> => {
  try {
    const dbConfig = DatabaseConfig.getInstance();
    await dbConfig.connect();
    logger.info('Application initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Initialize on startup
initializeDatabase();

export default app;