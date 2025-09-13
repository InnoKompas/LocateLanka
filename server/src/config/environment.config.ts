import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  
  PORT: Joi.number().default(3000),
  
  // Database
  MONGO_URI: Joi.string().required(),
  MONGODB_DB_NAME: Joi.string().default('locatelanka'),
  GN_DIVISIONS_COLLECTION: Joi.string().default('gn_divisions_2020'),
  
  // Legacy support
  DB_NAME: Joi.string().optional(),
  
  // Security
  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),
  
  // CORS
  CLIENT_URL: Joi.string().default('http://localhost:5173'),
  ALLOWED_ORIGINS: Joi.string().optional(),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(3600000), // 1 hour
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(1000),
  
  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('info'),
  LOG_FORMAT: Joi.string()
    .valid('combined', 'common', 'dev', 'short', 'tiny')
    .default('combined'),
  
  // Clustering
  CLUSTER_ENABLED: Joi.boolean().default(false),
  CLUSTER_WORKERS: Joi.number().optional(),
  
  // Health checks
  HEALTH_CHECK_ENABLED: Joi.boolean().default(true),
  HEALTH_CHECK_INTERVAL: Joi.number().default(30000), // 30 seconds
  
  // Performance
  REQUEST_TIMEOUT: Joi.number().default(30000), // 30 seconds
  BODY_LIMIT: Joi.string().default('1mb'),
  
  // Monitoring
  ENABLE_METRICS: Joi.boolean().default(false),
  METRICS_PORT: Joi.number().default(9090),
}).unknown();

// Validate environment variables
const { error, value: env } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

// Export typed configuration
export const config = {
  // Environment
  NODE_ENV: env.NODE_ENV as 'development' | 'production' | 'test' | 'staging',
  IS_PRODUCTION: env.NODE_ENV === 'production',
  IS_DEVELOPMENT: env.NODE_ENV === 'development',
  IS_TEST: env.NODE_ENV === 'test',
  
  // Server
  PORT: env.PORT as number,
  
  // Database
  DATABASE: {
    URI: env.MONGO_URI || env.MONGO_URI,
    NAME: env.MONGODB_DB_NAME || env.DB_NAME,
    COLLECTIONS: {
      GN_DIVISIONS: env.GN_DIVISIONS_COLLECTION,
    },
  },
  
  // Security
  JWT: {
    SECRET: env.JWT_ACCESS_SECRET,
    EXPIRES_IN: env.JWT_EXPIRES_IN,
    REFRESH_EXPIRES_IN: env.JWT_REFRESH_EXPIRES_IN,
  },
  
  // CORS
  CORS: {
    ORIGIN: env.CLIENT_URL,
    ALLOWED_ORIGINS: env.ALLOWED_ORIGINS 
      ? env.ALLOWED_ORIGINS.split(',').map((origin: string) => origin.trim())
      : [env.CLIENT_URL],
  },
  
  // Rate limiting
  RATE_LIMIT: {
    WINDOW_MS: env.RATE_LIMIT_WINDOW_MS,
    MAX_REQUESTS: env.RATE_LIMIT_MAX_REQUESTS,
  },
  
  // Logging
  LOGGING: {
    LEVEL: env.LOG_LEVEL,
    FORMAT: env.LOG_FORMAT,
  },
  
  // Clustering
  CLUSTER: {
    ENABLED: env.CLUSTER_ENABLED,
    WORKERS: env.CLUSTER_WORKERS || require('os').cpus().length,
  },
  
  // Health checks
  HEALTH_CHECK: {
    ENABLED: env.HEALTH_CHECK_ENABLED,
    INTERVAL: env.HEALTH_CHECK_INTERVAL,
  },
  
  // Performance
  PERFORMANCE: {
    REQUEST_TIMEOUT: env.REQUEST_TIMEOUT,
    BODY_LIMIT: env.BODY_LIMIT,
  },
  
  // Monitoring
  MONITORING: {
    ENABLED: env.ENABLE_METRICS,
    PORT: env.METRICS_PORT,
  },
} as const;

// Export individual configs for convenience
export const {
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  PORT,
  DATABASE,
  JWT,
  CORS,
  RATE_LIMIT,
  LOGGING,
  CLUSTER,
  HEALTH_CHECK,
  PERFORMANCE,
  MONITORING,
} = config;
