import mongoose from 'mongoose';
import { MongoClient, Db, Collection } from 'mongodb';
import { config } from '../config/environment.config';
import { District } from '../models/District.model';
import { Province } from '../models/Province.model';

interface GNDivisionDocument {
  _id: mongoose.Types.ObjectId;
  type: 'Feature';
  properties: {
    GND_N: string;
    GND_NO: string;
    PROVINCE_N: string;
    DISTRICT_N: string;
    DSD_N: string;
    GND_NAME_Cen?: string;
    GND_NAME_Gaz?: string;
    Ext_SqKm: number;
    Pop_2020: number;
    // New fields we'll add
    DISTRICT_C?: mongoose.Types.ObjectId;
    PROVINCE_C?: mongoose.Types.ObjectId;
    [key: string]: any;
  };
  geometry: any;
}


class GNDivisionsMigrator {
  private mongoClient: MongoClient | null = null;
  private db: Db | null = null;
  private gnCollection: Collection<GNDivisionDocument> | null = null;
  
  // Name mappings for districts and provinces
  private districtMap: Map<string, mongoose.Types.ObjectId> = new Map();
  private provinceMap: Map<string, mongoose.Types.ObjectId> = new Map();

  constructor() {}

  /**
   * Connect to MongoDB
   */
  private async connectDatabase(): Promise<void> {
    try {
      await mongoose.connect(config.DATABASE.URI);
      console.log('✅ Connected to MongoDB (Mongoose)');
      
      // Also connect native MongoDB client for direct collection access
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
   * Load district and province mappings from the new collections
   */
  private async loadMappings(): Promise<void> {
    try {
      console.log('📋 Loading district and province mappings...');
      
      // Load districts
      const districts = await District.find({});
      if (districts.length === 0) {
        throw new Error('No districts found! Please run the import script first.');
      }
      
      districts.forEach(district => {
        // Map both the exact name and uppercase version
        this.districtMap.set(district.name.toUpperCase(), district._id as mongoose.Types.ObjectId);
        this.districtMap.set(district.name, district._id as mongoose.Types.ObjectId);
      });
      
      // Load provinces  
      const provinces = await Province.find({});
      if (provinces.length === 0) {
        throw new Error('No provinces found! Please run the import script first.');
      }
      
      provinces.forEach(province => {
        // Map various name formats
        this.provinceMap.set(province.name.toUpperCase(), province._id as mongoose.Types.ObjectId);
        this.provinceMap.set(province.name, province._id as mongoose.Types.ObjectId);
        
        // Handle specific name variations
        const nameVariations = this.getProvinceNameVariations(province.name);
        nameVariations.forEach(variation => {
          this.provinceMap.set(variation, province._id as mongoose.Types.ObjectId);
        });
      });
      
      console.log(`✅ Loaded ${districts.length} districts and ${provinces.length} provinces`);
      console.log('📋 District mappings:', Array.from(this.districtMap.keys()));
      console.log('📋 Province mappings:', Array.from(this.provinceMap.keys()));
      
    } catch (error) {
      console.error('❌ Error loading mappings:', error);
      throw error;
    }
  }

  /**
   * Get name variations for provinces to handle different naming conventions
   */
  private getProvinceNameVariations(provinceName: string): string[] {
    const variations: string[] = [];
    
    // Common variations found in GN divisions data
    const variationMap: { [key: string]: string[] } = {
      'Western Province': ['WESTERN'],
      'Central Province': ['CENTRAL'],
      'Southern Province': ['SOUTHERN'],
      'Northern Province': ['NORTHERN'],
      'Eastern Province': ['EASTERN'],
      'North Western Province': ['NORTH WESTERN', 'NORTHWESTERN'],
      'North Central Province': ['NORTH CENTRAL', 'NORTHCENTRAL'],
      'Uva Province': ['UVA'],
      'Sabaragamuwa Province': ['SABARAGAMUWA']
    };
    
    if (variationMap[provinceName]) {
      variations.push(...variationMap[provinceName]);
    }
    
    return variations;
  }

  /**
   * Check current state of the collection
   */
  private async analyzeCollection(): Promise<void> {
    try {
      if (!this.gnCollection) throw new Error('Collection not initialized');
      
      console.log('🔍 Analyzing GN divisions collection...');
      
      const totalCount = await this.gnCollection.countDocuments();
      console.log(`📊 Total documents: ${totalCount}`);
      
      // Check how many already have the new fields
      const withDistrictC = await this.gnCollection.countDocuments({
        'properties.DISTRICT_C': { $exists: true, $ne: null }
      });
      
      const withProvinceC = await this.gnCollection.countDocuments({
        'properties.PROVINCE_C': { $exists: true, $ne: null }
      });
      
      console.log(`📍 Documents with DISTRICT_C: ${withDistrictC}`);
      console.log(`🏛️  Documents with PROVINCE_C: ${withProvinceC}`);
      
      // Sample a few documents to see the current structure
      const samples = await this.gnCollection.find({}).limit(3).toArray();
      console.log('\n📋 Sample documents:');
      samples.forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc.properties.GND_N}`);
        console.log(`      District: ${doc.properties.DISTRICT_N}`);
        console.log(`      Province: ${doc.properties.PROVINCE_N}`);
        console.log(`      Has DISTRICT_C: ${!!doc.properties.DISTRICT_C}`);
        console.log(`      Has PROVINCE_C: ${!!doc.properties.PROVINCE_C}`);
      });
      
      // Get unique district and province names to verify mappings
      const uniqueDistricts = await this.gnCollection.distinct('properties.DISTRICT_N');
      const uniqueProvinces = await this.gnCollection.distinct('properties.PROVINCE_N');
      
      console.log(`\n🗂️  Unique districts in collection: ${uniqueDistricts.length}`);
      console.log('   Districts:', uniqueDistricts.sort());
      
      console.log(`\n🗂️  Unique provinces in collection: ${uniqueProvinces.length}`);
      console.log('   Provinces:', uniqueProvinces.sort());
      
    } catch (error) {
      console.error('❌ Error analyzing collection:', error);
      throw error;
    }
  }

  /**
   * Verify mappings before migration
   */
  private async verifyMappings(): Promise<void> {
    try {
      if (!this.gnCollection) throw new Error('Collection not initialized');
      
      console.log('\n🔍 Verifying name mappings...');
      
      const uniqueDistricts = await this.gnCollection.distinct('properties.DISTRICT_N');
      const uniqueProvinces = await this.gnCollection.distinct('properties.PROVINCE_N');
      
      // Check district mappings
      const unmappedDistricts: string[] = [];
      uniqueDistricts.forEach(districtName => {
        if (!this.districtMap.has(districtName) && !this.districtMap.has(districtName.toUpperCase())) {
          unmappedDistricts.push(districtName);
        }
      });
      
      // Check province mappings
      const unmappedProvinces: string[] = [];
      uniqueProvinces.forEach(provinceName => {
        if (!this.provinceMap.has(provinceName) && !this.provinceMap.has(provinceName.toUpperCase())) {
          unmappedProvinces.push(provinceName);
        }
      });
      
      if (unmappedDistricts.length > 0) {
        console.log('❌ Unmapped districts:', unmappedDistricts);
      } else {
        console.log('✅ All districts can be mapped');
      }
      
      if (unmappedProvinces.length > 0) {
        console.log('❌ Unmapped provinces:', unmappedProvinces);
      } else {
        console.log('✅ All provinces can be mapped');
      }
      
      if (unmappedDistricts.length > 0 || unmappedProvinces.length > 0) {
        throw new Error('Some names cannot be mapped. Please check the mappings.');
      }
      
    } catch (error) {
      console.error('❌ Error verifying mappings:', error);
      throw error;
    }
  }

  /**
   * Perform the migration in batches
   */
  private async performMigration(): Promise<void> {
    try {
      if (!this.gnCollection) throw new Error('Collection not initialized');
      
      console.log('\n🚀 Starting migration...');
      
      const batchSize = 1000;
      let processedCount = 0;
      let updatedCount = 0;
      
      const totalCount = await this.gnCollection.countDocuments();
      console.log(`📊 Total documents to process: ${totalCount}`);
      
      // Process in batches
      let skip = 0;
      
      while (skip < totalCount) {
        console.log(`\n📦 Processing batch: ${skip + 1} - ${Math.min(skip + batchSize, totalCount)}`);
        
        const batch = await this.gnCollection.find({})
          .skip(skip)
          .limit(batchSize)
          .toArray();
        
        const bulkOps = [];
        
        for (const doc of batch) {
          processedCount++;
          
          const districtName = doc.properties.DISTRICT_N;
          const provinceName = doc.properties.PROVINCE_N;
          
          // Get ObjectIds for district and province
          const districtId = this.districtMap.get(districtName) || this.districtMap.get(districtName.toUpperCase());
          const provinceId = this.provinceMap.get(provinceName) || this.provinceMap.get(provinceName.toUpperCase());
          
          if (!districtId) {
            console.warn(`⚠️  No mapping found for district: ${districtName}`);
            continue;
          }
          
          if (!provinceId) {
            console.warn(`⚠️  No mapping found for province: ${provinceName}`);
            continue;
          }
          
          // Prepare update operation
          bulkOps.push({
            updateOne: {
              filter: { _id: doc._id },
              update: {
                $set: {
                  'properties.DISTRICT_C': districtId,
                  'properties.PROVINCE_C': provinceId
                }
              }
            }
          });
        }
        
        // Execute bulk update
        if (bulkOps.length > 0) {
          const result = await this.gnCollection.bulkWrite(bulkOps);
          updatedCount += result.modifiedCount;
          console.log(`✅ Updated ${result.modifiedCount} documents in this batch`);
        }
        
        skip += batchSize;
        
        // Progress indicator
        const progress = ((processedCount / totalCount) * 100).toFixed(1);
        console.log(`📈 Progress: ${progress}% (${processedCount}/${totalCount})`);
      }
      
      console.log(`\n🎉 Migration completed!`);
      console.log(`   Processed: ${processedCount} documents`);
      console.log(`   Updated: ${updatedCount} documents`);
      
    } catch (error) {
      console.error('❌ Error during migration:', error);
      throw error;
    }
  }

  /**
   * Verify the migration results
   */
  private async verifyMigration(): Promise<void> {
    try {
      if (!this.gnCollection) throw new Error('Collection not initialized');
      
      console.log('\n🔍 Verifying migration results...');
      
      const totalCount = await this.gnCollection.countDocuments();
      
      const withDistrictC = await this.gnCollection.countDocuments({
        'properties.DISTRICT_C': { $exists: true, $ne: null }
      });
      
      const withProvinceC = await this.gnCollection.countDocuments({
        'properties.PROVINCE_C': { $exists: true, $ne: null }
      });
      
      console.log(`📊 Migration Results:`);
      console.log(`   Total documents: ${totalCount}`);
      console.log(`   With DISTRICT_C: ${withDistrictC} (${((withDistrictC/totalCount)*100).toFixed(1)}%)`);
      console.log(`   With PROVINCE_C: ${withProvinceC} (${((withProvinceC/totalCount)*100).toFixed(1)}%)`);
      
      // Sample some migrated documents
      const samples = await this.gnCollection.find({
        'properties.DISTRICT_C': { $exists: true },
        'properties.PROVINCE_C': { $exists: true }
      }).limit(5).toArray();
      
      console.log('\n📋 Sample migrated documents:');
      samples.forEach((doc, index) => {
        console.log(`   ${index + 1}. ${doc.properties.GND_N}`);
        console.log(`      District: ${doc.properties.DISTRICT_N} → ${doc.properties.DISTRICT_C}`);
        console.log(`      Province: ${doc.properties.PROVINCE_N} → ${doc.properties.PROVINCE_C}`);
      });
      
    } catch (error) {
      console.error('❌ Error verifying migration:', error);
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
   * Main migration process
   */
  public async migrate(): Promise<void> {
    try {
      console.log('🚀 Starting GN Divisions Migration');
      console.log('==================================');
      
      await this.connectDatabase();
      await this.loadMappings();
      await this.analyzeCollection();
      await this.verifyMappings();
      
      // Ask for confirmation
      const response = await this.promptUser('\n❓ Do you want to proceed with the migration? (y/N): ');
      if (response.toLowerCase() !== 'y' && response.toLowerCase() !== 'yes') {
        console.log('❌ Migration cancelled by user');
        return;
      }
      
      await this.performMigration();
      await this.verifyMigration();
      
      console.log('\n🎉 Migration completed successfully!');
      console.log('===================================');
      
    } catch (error) {
      console.error('💥 Migration failed:', error);
      throw error;
    } finally {
      if (this.mongoClient) {
        await this.mongoClient.close();
      }
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
    }
  }
}

// Script execution
async function main() {
  try {
    const migrator = new GNDivisionsMigrator();
    await migrator.migrate();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { GNDivisionsMigrator };
