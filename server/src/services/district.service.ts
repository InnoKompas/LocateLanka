import { District, Division, DSD } from '../types/location.types';
import { DatabaseService } from './database.service';

export class DistrictService {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  /**
   * Get all districts
   */
  async getAllDistricts(): Promise<District[]> {
    try {
      const collection = this.dbService.getCollection();
      
      const pipeline = [
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
          $sort: { provinceId: 1, code: 1 }
        }
      ];

      const districts = await collection.aggregate<District>(pipeline).toArray();
      return districts;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw new Error('Failed to fetch districts from database');
    }
  }

  /**
   * Get districts by province name
   */
  async getDistrictsByProvince(provinceName: string): Promise<District[]> {
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
   * Get district by ID (code)
   */
  async getDistrictById(districtCode: string): Promise<District | null> {
    try {
      const collection = this.dbService.getCollection();
      
      const pipeline = [
        {
          $match: { 'properties.DISTRICT_C': districtCode }
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
        }
      ];

      const result = await collection.aggregate<District>(pipeline).toArray();
      return result.length > 0 ? result[0] || null : null;
    } catch (error) {
      console.error('Error fetching district by ID:', error);
      throw new Error('Failed to fetch district from database');
    }
  }

  /**
   * Get DSDs (Divisional Secretariat Divisions) by district
   */
  async getDSDsByDistrict(districtCode: string): Promise<DSD[]> {
    try {
      const collection = this.dbService.getCollection();
      
      const pipeline = [
        {
          $match: { 'properties.DISTRICT_C': districtCode }
        },
        {
          $group: {
            _id: {
              code: '$properties.DSD_C',
              name: '$properties.DSD_N',
              districtCode: '$properties.DISTRICT_C',
              districtName: '$properties.DISTRICT_N',
              provinceCode: '$properties.PROVINCE_C',
              provinceName: '$properties.PROVINCE_N'
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
            districtId: '$_id.districtCode',
            districtName: '$_id.districtName',
            provinceId: '$_id.provinceCode',
            provinceName: '$_id.provinceName',
            divisionCount: 1
          }
        },
        {
          $sort: { code: 1 }
        }
      ];

      const dsds = await collection.aggregate<DSD>(pipeline).toArray();
      return dsds;
    } catch (error) {
      console.error('Error fetching DSDs by district:', error);
      throw new Error('Failed to fetch DSDs from database');
    }
  }

  /**
   * Get GN divisions by district
   */
  async getDivisionsByDistrict(districtCode: string, includeGeometry: boolean = false): Promise<Division[]> {
    try {
      const collection = this.dbService.getCollection();
      
      const projection: any = {
        _id: 0,
        id: { $toString: '$_id' },
        name: '$properties.GND_N',
        nameEn: '$properties.GND_N',
        nameSi: '$properties.GND_NAME_G',
        gnNumber: '$properties.GND_NO',
        gnCode: '$properties.GND_C',
        adminCode: '$properties.ADMIN_CODE',
        dsdId: '$properties.DSD_C',
        dsdName: '$properties.DSD_N',
        districtId: '$properties.DISTRICT_C',
        districtName: '$properties.DISTRICT_N',
        provinceId: '$properties.PROVINCE_C',
        provinceName: '$properties.PROVINCE_N',
        gnOfficer: '$properties.GN_Officer',
        gnOfficerPhone: '$properties.GN_Offic_1',
        mcUcPcName: '$properties.MC_UC_PC_N',
        area: '$properties.Ext_SqKm',
        population: '$properties.Pop_2020',
        yearCreated: '$properties.YEAR_CREAT'
      };

      if (includeGeometry) {
        projection.geometry = '$geometry';
      }

      const pipeline = [
        {
          $match: { 'properties.DISTRICT_C': districtCode }
        },
        {
          $project: projection
        },
        {
          $sort: { gnNumber: 1 }
        }
      ];

      const divisions = await collection.aggregate<Division>(pipeline).toArray();
      return divisions;
    } catch (error) {
      console.error('Error fetching divisions by district:', error);
      throw new Error('Failed to fetch divisions from database');
    }
  }
}