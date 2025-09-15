import mongoose from 'mongoose';
import { MongoClient, Db, Collection } from 'mongodb';
import { config } from '../config/environment.config';

interface GNDivisionDocument {
  _id: mongoose.Types.ObjectId;
  type: 'Feature';
  properties: {
    GND_N: string;
    GND_NO: string;
    PROVINCE_N: string;
    DISTRICT_N: string;
    DSD_N: string;
    DISTRICT_C?: mongoose.Types.ObjectId;
    PROVINCE_C?: mongoose.Types.ObjectId;
    [key: string]: any;
  };
  geometry: any;
}

class GNDivisionsRollback {
  private mongoClient: MongoClient | null = null;
  private db: Db | null = null;
  private gnCollection: Collection<GNDivisionDocument> | null = null;

  constructor() {}

  /**
   * Connect to MongoDB
   */
  private async connectDatabase(): Promise<void> {
    try {
      this.mongoClient = new MongoClient(config.DATABASE.URI);
      await this.mongoClient.connect();
      
      const dbName = config.DATABASE.NAME || 'locatelanka';
      this.db = this.mongoClient.db(dbName);
      
      const collectionName = config.DATABASE.COLLECTIONS?.GN_DIVISIONS || 'gn_divisions_2020';
      this.gnCollection = this.db.collection<GNDivisionDocument>(collectionName);
      
      console.log(`✅ Connected to collection: ${collectionName}`);
      
    } catch (error) {
      console.error('❌ Database connection error:', error);
      throw error;
    }
  }

  /**
   * Check current state before rollback
   */
  private async analyzeCurrentState(): Promise<void> {
    try {
      if (!this.gnCollection) throw new Error('Collection not initialized');
      
      console.log('🔍 Analyzing current state...');
      
      const totalCount = await this.gnCollection.countDocuments();
      
      const withDistrictC = await this.gnCollection.countDocuments({
        'properties.DISTRICT_C': { $exists: true, $ne: null }
      });
      
      const withProvinceC = await this.gnCollection.countDocuments({
        'properties.PROVINCE_C': { $exists: true, $ne: null }
      });
      
      console.log(`📊 Current State:`);
      console.log(`   Total documents: ${totalCount}`);
      console.log(`   With DISTRICT_C: ${withDistrictC} (${((withDistrictC/totalCount)*100).toFixed(1)}%)`);
      console.log(`   With PROVINCE_C: ${withProvinceC} (${((withProvinceC/totalCount)*100).toFixed(1)}%)`);
      
      if (withDistrictC === 0 && withProvinceC === 0) {
        console.log('ℹ️  No migration fields found. Nothing to rollback.');
        return;
      }
      
    } catch (error) {
      console.error('❌ Error analyzing current state:', error);
      throw error;
    }
  }

  /**
   * Remove the migration fields
   */
  private async performRollback(): Promise<void> {
    try {
      if (!this.gnCollection) throw new Error('Collection not initialized');
      
      console.log('\n🔄 Starting rollback...');
      
      const result = await this.gnCollection.updateMany(
        {
          $or: [
            { 'properties.DISTRICT_C': { $exists: true } },
            { 'properties.PROVINCE_C': { $exists: true } }
          ]
        },
        {
          $unset: {
            'properties.DISTRICT_C': '',
            'properties.PROVINCE_C': ''
          }
        }
      );
      
      console.log(`✅ Rollback completed!`);
      console.log(`   Modified documents: ${result.modifiedCount}`);
      
    } catch (error) {
      console.error('❌ Error during rollback:', error);
      throw error;
    }
  }

  /**
   * Verify rollback results
   */
  private async verifyRollback(): Promise<void> {
    try {
      if (!this.gnCollection) throw new Error('Collection not initialized');
      
      console.log('\n🔍 Verifying rollback...');
      
      const totalCount = await this.gnCollection.countDocuments();
      
      const withDistrictC = await this.gnCollection.countDocuments({
        'properties.DISTRICT_C': { $exists: true, $ne: null }
      });
      
      const withProvinceC = await this.gnCollection.countDocuments({
        'properties.PROVINCE_C': { $exists: true, $ne: null }
      });
      
      console.log(`📊 After Rollback:`);
      console.log(`   Total documents: ${totalCount}`);
      console.log(`   With DISTRICT_C: ${withDistrictC}`);
      console.log(`   With PROVINCE_C: ${withProvinceC}`);
      
      if (withDistrictC === 0 && withProvinceC === 0) {
        console.log('✅ Rollback successful - all migration fields removed');
      } else {
        console.log('⚠️  Some migration fields still exist');
      }
      
    } catch (error) {
      console.error('❌ Error verifying rollback:', error);
      throw error;
    }
  }

  /**
   * Simple prompt function for user input
   */
  private promptUser(question: string): Promise<string> {
    return new Promise((resolve) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question(question, (answer: string) => {
        readline.close();
        resolve(answer.trim());
      });
    });
  }

  /**
   * Main rollback process
   */
  public async rollback(): Promise<void> {
    try {
      console.log('🔄 Starting GN Divisions Rollback');
      console.log('=================================');
      
      await this.connectDatabase();
      await this.analyzeCurrentState();
      
      // Ask for confirmation
      const response = await this.promptUser('\n❓ Do you want to proceed with the rollback? This will remove DISTRICT_C and PROVINCE_C fields. (y/N): ');
      if (response.toLowerCase() !== 'y' && response.toLowerCase() !== 'yes') {
        console.log('❌ Rollback cancelled by user');
        return;
      }
      
      await this.performRollback();
      await this.verifyRollback();
      
      console.log('\n🎉 Rollback completed successfully!');
      console.log('==================================');
      
    } catch (error) {
      console.error('💥 Rollback failed:', error);
      throw error;
    } finally {
      if (this.mongoClient) {
        await this.mongoClient.close();
      }
      console.log('👋 Disconnected from MongoDB');
    }
  }
}

// Script execution
async function main() {
  try {
    const rollback = new GNDivisionsRollback();
    await rollback.rollback();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { GNDivisionsRollback };
