import cluster from 'cluster';
import { CLUSTER } from './config/environment.config';
import { logger } from './config/logger.config';

if (cluster.isPrimary) {
  const numWorkers = CLUSTER.ENABLED ? CLUSTER.WORKERS : 1;
  
  logger.info(`🎯 Primary process ${process.pid} is running`);
  logger.info(`🔧 Starting ${numWorkers} worker(s)`);

  // Fork workers
  for (let i = 0; i < numWorkers; i++) {
    const worker = cluster.fork();
    logger.info(`👷 Worker ${worker.process.pid} started`);
  }

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`👷 Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
    
    const newWorker = cluster.fork();
    logger.info(`👷 New worker ${newWorker.process.pid} started`);
  });

  // Handle worker online
  cluster.on('online', (worker) => {
    logger.info(`👷 Worker ${worker.process.pid} is online`);
  });

  // Handle worker disconnect
  cluster.on('disconnect', (worker) => {
    logger.warn(`👷 Worker ${worker.process.pid} disconnected`);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`📡 Received ${signal}. Shutting down cluster...`);
    
    for (const id in cluster.workers) {
      const worker = cluster.workers[id];
      if (worker) {
        worker.kill();
      }
    }
    
    setTimeout(() => {
      logger.error('🔥 Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

} else {
  // Worker process
  require('./server');
  
  logger.info(`👷 Worker ${process.pid} started`);
}