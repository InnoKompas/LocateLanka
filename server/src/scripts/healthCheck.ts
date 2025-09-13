#!/usr/bin/env ts-node

import http from 'http';
import { PORT } from '../config/environment.config';

const healthCheck = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: '/health',
      method: 'GET',
      timeout: 5000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          
          if (res.statusCode === 200 && health.status === 'healthy') {
            console.log('✅ Health check passed');
            console.log(`📊 Status: ${health.status}`);
            console.log(`⏱️  Uptime: ${Math.round(health.uptime)}s`);
            console.log(`💾 Memory: ${health.services.memory.used}MB / ${health.services.memory.total}MB`);
            console.log(`🗄️  Database: MongoDB=${health.services.database.mongodb}, Mongoose=${health.services.database.mongoose}`);
            resolve();
          } else {
            console.error('❌ Health check failed');
            console.error(`📊 Status: ${health.status}`);
            console.error(`🔍 Response:`, health);
            reject(new Error(`Health check failed with status: ${health.status}`));
          }
        } catch (error) {
          console.error('❌ Failed to parse health check response:', error);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Health check request failed:', error.message);
      reject(error);
    });

    req.on('timeout', () => {
      console.error('❌ Health check timed out');
      req.destroy();
      reject(new Error('Health check timeout'));
    });

    req.end();
  });
};

// Run health check
healthCheck()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Health check failed:', error.message);
    process.exit(1);
  });
