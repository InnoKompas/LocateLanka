import { MongoClient, Db, Collection } from 'mongodb';
import mongoose from 'mongoose';
import { GNDivisionDocument } from '../types/location.types';
import { config } from './environment.config';

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private mongoClient: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;

  // Collection names
  public static readonly COLLECTIONS = {
    GN_DIVISIONS: config.DATABASE.COLLECTIONS.GN_DIVISIONS,
    USERS: 'users',
    REFRESH_TOKENS: 'refresh_tokens',
    API_KEYS: 'api_keys'
  } as const;

  private constructor() {}

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  /**
   * Initialize all database connections
   */
  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('Database already connected');
      return;
    }

    try {
      // Connect MongoDB native client for GN divisions data
      await this.connectMongoDB();
      
      // Connect Mongoose for user/auth models
      await this.connectMongoose();
      
      this.isConnected = true;
      console.log('✅ All database connections established successfully');
    } catch (error) {
      console.error('❌ Failed to connect to databases:', error);
      throw error;
    }
  }

  /**
   * Connect MongoDB native client
   */
  private async connectMongoDB(): Promise<void> {
    const mongoUri = process.env['MONGO_URI'] || 'mongodb://localhost:27017';
    const dbName = process.env['MONGODB_DB_NAME'] || process.env['DB_NAME'] || 'lankalocate';

    this.mongoClient = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    await this.mongoClient.connect();
    this.db = this.mongoClient.db(dbName);
    
    console.log('✅ MongoDB native client connected');
  }

  /**
   * Connect Mongoose for ODM
   */
  private async connectMongoose(): Promise<void> {
    const mongoUri = process.env['MONGO_URI'] || 'mongodb://localhost:27017';
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Mongoose connected');
  }

  /**
   * Get MongoDB database instance
   */
  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  /**
   * Get GN Divisions collection
   */
  public getGNDivisionsCollection(): Collection<GNDivisionDocument> {
    return this.getDb().collection<GNDivisionDocument>(DatabaseConfig.COLLECTIONS.GN_DIVISIONS);
  }

  /**
   * Get any collection by name
   */
  public getCollection<T extends Record<string, any> = any>(name: string): Collection<T> {
    return this.getDb().collection<T>(name);
  }

  /**
   * Health check for all connections
   */
  public async healthCheck(): Promise<{ mongodb: boolean; mongoose: boolean }> {
    const health = { mongodb: false, mongoose: false };

    try {
      // Check MongoDB native client
      if (this.mongoClient) {
        await this.mongoClient.db('admin').admin().ping();
        health.mongodb = true;
      }
    } catch (error) {
      console.error('MongoDB health check failed:', error);
    }

    try {
      // Check Mongoose connection
      if (mongoose.connection.readyState === 1) {
        health.mongoose = true;
      }
    } catch (error) {
      console.error('Mongoose health check failed:', error);
    }

    return health;
  }

  /**
   * Graceful shutdown
   */
  public async disconnect(): Promise<void> {
    try {
      if (this.mongoClient) {
        await this.mongoClient.close();
        this.mongoClient = null;
        this.db = null;
        console.log('✅ MongoDB native client disconnected');
      }

      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        console.log('✅ Mongoose disconnected');
      }

      this.isConnected = false;
      console.log('✅ All database connections closed');
    } catch (error) {
      console.error('❌ Error during database disconnect:', error);
      throw error;
    }
  }
}
