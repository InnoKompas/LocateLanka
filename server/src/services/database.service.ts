import { DatabaseConfig } from '../config/database.config';
import { Collection } from 'mongodb';
import { GNDivisionDocument } from '../types/location.types';

/**
 * @deprecated Use DatabaseConfig directly instead
 * This class is kept for backward compatibility
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private dbConfig: DatabaseConfig;
  
  private constructor() {
    this.dbConfig = DatabaseConfig.getInstance();
  }
  
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }
  
  public async connect(): Promise<void> {
    return this.dbConfig.connect();
  }
  
  public async disconnect(): Promise<void> {
    return this.dbConfig.disconnect();
  }
  
  public getCollection(): Collection<GNDivisionDocument> {
    return this.dbConfig.getGNDivisionsCollection();
  }
  
  public getDb() {
    return this.dbConfig.getDb();
  }
  
  public async isConnected(): Promise<boolean> {
    const health = await this.dbConfig.healthCheck();
    return health.mongodb && health.mongoose;
  }
}
