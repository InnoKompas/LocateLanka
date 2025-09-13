import http from 'http';
import app from './app';
import { PORT, IS_PRODUCTION } from './config/environment.config';
import { logger } from './config/logger.config';
import { gracefulShutdown } from './middlewares/error.middleware';

// Create HTTP server
const server = http.createServer(app);

// Start server
const startServer = async (): Promise<void> => {
  try {
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env['NODE_ENV']}`);
      logger.info(`🔧 Process ID: ${process.pid}`);
      
      if (!IS_PRODUCTION) {
        logger.info(`🌐 Local URL: http://localhost:${PORT}`);
        logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
        logger.info(`📖 API Docs: http://localhost:${PORT}/api/v1`);
      }
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

      switch (error.code) {
        case 'EACCES':
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM')(server));
    process.on('SIGINT', () => gracefulShutdown('SIGINT')(server));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      logger.error('Unhandled Rejection at:', { promise, reason });
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();