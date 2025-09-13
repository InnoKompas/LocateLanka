import { DSD, Division } from '../types/location.types';
import { DatabaseService } from './database.service';

export class DSDService {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  /**
   * Get all DSDs
   */
  async getAllDSDs(): Promise<DSD[]> {
    try {
      const collection = this.dbService.getCollection();
      
      const pipeline = [
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
          $sort: { provinceId: 1, districtId: 1, code: 1 }
        }
      ];

      const dsds = await collection.aggregate<DSD>(pipeline).toArray();
      return dsds;
    } catch (error) {
      console.error('Error fetching DSDs:', error);
      throw new Error('Failed to fetch DSDs from database');
    }
  }

  /**
   * Get DSDs by district
   */
  async getDSDsByDistrict(districtIdentifier: string): Promise<DSD[]> {
    try {
      const collection = this.dbService.getCollection();
      
      // Try to match by district code or name
      const matchCondition = {
        $or: [
          { 'properties.DISTRICT_C': districtIdentifier },
          { 'properties.DISTRICT_N': { $regex: new RegExp(`^${districtIdentifier}$`, 'i') } }
        ]
      };

      const pipeline = [
        { $match: matchCondition },
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
   * Get DSDs by province
   */
  async getDSDsByProvince(provinceName: string): Promise<DSD[]> {
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
          $sort: { districtId: 1, code: 1 }
        }
      ];

      const dsds = await collection.aggregate<DSD>(pipeline).toArray();
      return dsds;
    } catch (error) {
      console.error('Error fetching DSDs by province:', error);
      throw new Error('Failed to fetch DSDs from database');
    }
  }

  /**
   * Get DSD by ID (code)
   */
  async getDSDById(dsdCode: string): Promise<DSD | null> {
    try {
      const collection = this.dbService.getCollection();
      
      const pipeline = [
        {
          $match: { 'properties.DSD_C': dsdCode }
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
        }
      ];

      const result = await collection.aggregate<DSD>(pipeline).toArray();
      return result.length > 0 ? result[0] || null : null;
    } catch (error) {
      console.error('Error fetching DSD by ID:', error);
      throw new Error('Failed to fetch DSD from database');
    }
  }

  /**
   * Get GN divisions by DSD
   */
  async getDivisionsByDSD(dsdCode: string, includeGeometry: boolean = false): Promise<Division[]> {
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
          $match: { 'properties.DSD_C': dsdCode }
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
      console.error('Error fetching divisions by DSD:', error);
      throw new Error('Failed to fetch divisions from database');
    }
  }
}
