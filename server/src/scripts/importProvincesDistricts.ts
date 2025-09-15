import mongoose from 'mongoose';
import fs from 'fs';
import { config } from '../config/environment.config';
import { District, IDistrict } from '../models/District.model';
import { Province, IProvince } from '../models/Province.model';

// Types for the JSON data
interface DistrictData {
  id: number;
  name: string;
  sinhala: string;
  tamil: string;
  code: string;
  capital: string;
  province: string;
  province_id: number;
  area: number;
  population: number;
  createdAt: string;
  updatedAt: string;
}

interface ProvinceData {
  id: number;
  name: string;
  sinhala: string;
  tamil: string;
  code: string;
  capital: string;
  area: number;
  population: number;
  districts: string[];
  createdAt: string;
  updatedAt: string;
}

class ProvincesDistrictsImporter {
  private districtsData: DistrictData[] = [];
  private provincesData: ProvinceData[] = [];
  private districtIdMap: Map<number, mongoose.Types.ObjectId> = new Map();

  constructor() {
    this.loadData();
  }

  /**
   * Load JSON data from files
   */
  private loadData(): void {
    try {
      // Load districts data
      const districtsPath = process.argv[2] || 'c:\\Users\\USER\\Downloads\\srilanka-districts.json';
      const provincesPath = process.argv[3] || 'c:\\Users\\USER\\Downloads\\srilanka-provinces.json';

      console.log(`📂 Loading districts from: ${districtsPath}`);
      console.log(`📂 Loading provinces from: ${provincesPath}`);

      if (!fs.existsSync(districtsPath)) {
        throw new Error(`Districts file not found: ${districtsPath}`);
      }

      if (!fs.existsSync(provincesPath)) {
        throw new Error(`Provinces file not found: ${provincesPath}`);
      }

      const districtsContent = fs.readFileSync(districtsPath, 'utf-8');
      const provincesContent = fs.readFileSync(provincesPath, 'utf-8');

      this.districtsData = JSON.parse(districtsContent);
      this.provincesData = JSON.parse(provincesContent);

      console.log(`✅ Loaded ${this.districtsData.length} districts`);
      console.log(`✅ Loaded ${this.provincesData.length} provinces`);
    } catch (error) {
      console.error('❌ Error loading data files:', error);
      throw error;
    }
  }

  /**
   * Connect to MongoDB
   */
  private async connectDatabase(): Promise<void> {
    try {
      const mongoUri = config.DATABASE.URI;
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Clean existing data (optional)
   */
  private async cleanExistingData(): Promise<void> {
    try {
      console.log('🧹 Cleaning existing data...');
      
      const districtCount = await District.countDocuments();
      const provinceCount = await Province.countDocuments();
      
      if (districtCount > 0 || provinceCount > 0) {
        console.log(`Found ${districtCount} districts and ${provinceCount} provinces`);
        const response = await this.promptUser('Do you want to delete existing data? (y/N): ');
        
        if (response.toLowerCase() === 'y' || response.toLowerCase() === 'yes') {
          await District.deleteMany({});
          await Province.deleteMany({});
          console.log('✅ Existing data cleaned');
        } else {
          console.log('⚠️  Keeping existing data - this might cause duplicates');
        }
      }
    } catch (error) {
      console.error('❌ Error cleaning data:', error);
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
   * Insert districts first and collect their ObjectIds
   */
  private async insertDistricts(): Promise<void> {
    try {
      console.log('📍 Inserting districts...');
      
      const districts: Partial<IDistrict>[] = this.districtsData.map(district => ({
        id: district.id,
        name: district.name,
        sinhala: district.sinhala,
        tamil: district.tamil,
        code: district.code,
        capital: district.capital,
        province: district.province,
        province_id: district.province_id,
        area: district.area,
        population: district.population,
        createdAt: new Date(district.createdAt),
        updatedAt: new Date(district.updatedAt)
      }));

      // Insert districts and get the created documents
      const insertedDistricts = await District.insertMany(districts);
      
      // Create mapping of district ID to MongoDB ObjectId
      insertedDistricts.forEach(district => {
        if (typeof district.id === 'number') {
          this.districtIdMap.set(district.id, district._id as mongoose.Types.ObjectId);
        }
      });

      console.log(`✅ Inserted ${insertedDistricts.length} districts`);
      console.log('📋 District ID mapping created');
      
    } catch (error) {
      console.error('❌ Error inserting districts:', error);
      throw error;
    }
  }

  /**
   * Insert provinces with district references
   */
  private async insertProvinces(): Promise<void> {
    try {
      console.log('🏛️  Inserting provinces with district references...');
      
      const provinces: Partial<IProvince>[] = this.provincesData.map(province => {
        // Find district ObjectIds for this province
        const districtObjectIds: mongoose.Types.ObjectId[] = [];
        
        // Get districts that belong to this province
        const provinceDistricts = this.districtsData.filter(
          district => district.province_id === province.id
        );
        
        provinceDistricts.forEach(district => {
          const objectId = this.districtIdMap.get(district.id);
          if (objectId) {
            districtObjectIds.push(objectId);
          }
        });

        console.log(`📍 Province "${province.name}" has ${districtObjectIds.length} districts`);

        return {
          id: province.id,
          name: province.name,
          sinhala: province.sinhala,
          tamil: province.tamil,
          code: province.code,
          capital: province.capital,
          area: province.area,
          population: province.population,
          districts: districtObjectIds,
          createdAt: new Date(province.createdAt),
          updatedAt: new Date(province.updatedAt)
        };
      });

      const insertedProvinces = await Province.insertMany(provinces);
      console.log(`✅ Inserted ${insertedProvinces.length} provinces`);
      
    } catch (error) {
      console.error('❌ Error inserting provinces:', error);
      throw error;
    }
  }

  /**
   * Update districts with province references
   */
  private async updateDistrictProvinceReferences(): Promise<void> {
    try {
      console.log('🔗 Updating district province references...');
      
      // Get all provinces to create a mapping
      const provinces = await Province.find({});
      const provinceIdMap = new Map<number, mongoose.Types.ObjectId>();
      
        provinces.forEach(province => {
          if (typeof province.id === 'number') {
            provinceIdMap.set(province.id, province._id as mongoose.Types.ObjectId);
          }
        });

      // Update each district with its province reference
      for (const districtData of this.districtsData) {
        const provinceObjectId = provinceIdMap.get(districtData.province_id);
        
        if (provinceObjectId) {
          await District.updateOne(
            { id: districtData.id },
            { provinceRef: provinceObjectId }
          );
        }
      }

      console.log('✅ Updated district province references');
      
    } catch (error) {
      console.error('❌ Error updating district references:', error);
      throw error;
    }
  }

  /**
   * Verify the import
   */
  private async verifyImport(): Promise<void> {
    try {
      console.log('🔍 Verifying import...');
      
      const districtCount = await District.countDocuments();
      const provinceCount = await Province.countDocuments();
      
      console.log(`📊 Import Summary:`);
      console.log(`   Districts: ${districtCount}`);
      console.log(`   Provinces: ${provinceCount}`);
      
      // Check relationships
      const districtsWithProvinceRef = await District.countDocuments({ 
        provinceRef: { $exists: true, $ne: null } 
      });
      
      console.log(`   Districts with province references: ${districtsWithProvinceRef}`);
      
      // Sample verification - get a province with its districts
      const sampleProvince = await Province.findOne().populate('districts');
      if (sampleProvince) {
        console.log(`📋 Sample: Province "${sampleProvince.name}" has ${sampleProvince.districts.length} districts`);
      }
      
      // Sample verification - get a district with its province
      const sampleDistrict = await District.findOne({ provinceRef: { $exists: true } }).populate('provinceRef');
      if (sampleDistrict) {
        console.log(`📋 Sample: District "${sampleDistrict.name}" belongs to province "${(sampleDistrict.provinceRef as any)?.name}"`);
      }
      
    } catch (error) {
      console.error('❌ Error during verification:', error);
      throw error;
    }
  }

  /**
   * Main import process
   */
  public async import(): Promise<void> {
    try {
      console.log('🚀 Starting Provinces & Districts Import Process');
      console.log('================================================');
      
      await this.connectDatabase();
      await this.cleanExistingData();
      
      // Step 1: Insert districts first
      await this.insertDistricts();
      
      // Step 2: Insert provinces with district references
      await this.insertProvinces();
      
      // Step 3: Update districts with province references (bidirectional relationship)
      await this.updateDistrictProvinceReferences();
      
      // Step 4: Verify the import
      await this.verifyImport();
      
      console.log('🎉 Import completed successfully!');
      console.log('================================================');
      
    } catch (error) {
      console.error('💥 Import failed:', error);
      throw error;
    } finally {
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
    }
  }
}

// Script execution
async function main() {
  try {
    const importer = new ProvincesDistrictsImporter();
    await importer.import();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { ProvincesDistrictsImporter };
