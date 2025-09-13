import { Province, District } from '../types/location.types';
import { DatabaseService } from './database.service';

export class ProvinceService {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  /**
   * Get all provinces from the database
   */
  async getAllProvinces(): Promise<Province[]> {
    try {
      const collection = this.dbService.getCollection();
      
      // Aggregate to get unique provinces with counts
      const pipeline = [
        {
          $group: {
            _id: {
              code: '$properties.PROVINCE_C',
              name: '$properties.PROVINCE_N'
            },
            districtCount: {
              $addToSet: '$properties.DISTRICT_C'
            },
            divisionCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id.code',
            name: '$_id.name',
            nameEn: '$_id.name',
            code: '$_id.code',
            districtCount: { $size: '$districtCount' },
            divisionCount: 1
          }
        },
        {
          $sort: { code: 1 }
        }
      ];

      const provinces = await collection.aggregate<Province>(pipeline).toArray();
      return provinces;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw new Error('Failed to fetch provinces from database');
    }
  }

  /**
   * Get province by ID (code)
   */
  async getProvinceById(provinceCode: string): Promise<Province | null> {
    try {
      const collection = this.dbService.getCollection();
      
      const pipeline = [
        {
          $match: { 'properties.PROVINCE_C': provinceCode }
        },
        {
          $group: {
            _id: {
              code: '$properties.PROVINCE_C',
              name: '$properties.PROVINCE_N'
            },
            districtCount: {
              $addToSet: '$properties.DISTRICT_C'
            },
            divisionCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id.code',
            name: '$_id.name',
            nameEn: '$_id.name',
            code: '$_id.code',
            districtCount: { $size: '$districtCount' },
            divisionCount: 1
          }
        }
      ];

      const result = await collection.aggregate<Province>(pipeline).toArray();
      return result.length > 0 ? result[0] || null : null;
    } catch (error) {
      console.error('Error fetching province by ID:', error);
      throw new Error('Failed to fetch province from database');
    }
  }

  /**
   * Get districts by province code
   */
  async getDistrictsByProvince(provinceCode: string): Promise<District[]> {
    try {
      const collection = this.dbService.getCollection();
      
      const pipeline = [
        {
          $match: { 'properties.PROVINCE_C': provinceCode }
        },
        {
          $group: {
            _id: {
              code: '$properties.DISTRICT_C',
              name: '$properties.DISTRICT_N',
              provinceCode: '$properties.PROVINCE_C',
              provinceName: '$properties.PROVINCE_N'
            },
            dsdCount: {
              $addToSet: '$properties.DSD_C'
            },
            divisionCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id.code',
            name: '$_id.name',
            nameEn: '$_id.name',
            code: '$_id.code',
            provinceId: '$_id.provinceCode',
            provinceName: '$_id.provinceName',
            dsdCount: { $size: '$dsdCount' },
            divisionCount: 1
          }
        },
        {
          $sort: { code: 1 }
        }
      ];

      const districts = await collection.aggregate<District>(pipeline).toArray();
      return districts;
    } catch (error) {
      console.error('Error fetching districts by province:', error);
      throw new Error('Failed to fetch districts from database');
    }
  }

  /**
   * Get province by name (case-insensitive)
   */
  async getProvinceByName(provinceName: string): Promise<Province | null> {
    try {
      const collection = this.dbService.getCollection();
      
      const pipeline = [
        {
          $match: { 
            'properties.PROVINCE_N': { 
              $regex: new RegExp(`^${provinceName}$`, 'i') 
            }
          }
        },
        {
          $group: {
            _id: {
              code: '$properties.PROVINCE_C',
              name: '$properties.PROVINCE_N'
            },
            districtCount: {
              $addToSet: '$properties.DISTRICT_C'
            },
            divisionCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id.code',
            name: '$_id.name',
            nameEn: '$_id.name',
            code: '$_id.code',
            districtCount: { $size: '$districtCount' },
            divisionCount: 1
          }
        }
      ];

      const result = await collection.aggregate<Province>(pipeline).toArray();
      return result.length > 0 ? result[0] || null : null;
    } catch (error) {
      console.error('Error fetching province by name:', error);
      throw new Error('Failed to fetch province from database');
    }
  }
}