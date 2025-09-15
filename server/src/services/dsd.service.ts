import { DSD, Division } from '../types/location.types';
import { DatabaseService } from './database.service';
import { District as DistrictModel } from '../models/District.model';
import { Province as ProvinceModel } from '../models/Province.model';

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
          $lookup: {
            from: 'districts',
            localField: 'properties.DISTRICT_C',
            foreignField: '_id',
            as: 'district'
          }
        },
        {
          $lookup: {
            from: 'provinces',
            localField: 'properties.PROVINCE_C',
            foreignField: '_id',
            as: 'province'
          }
        },
        {
          $group: {
            _id: {
              name: '$properties.DSD_N',
              district: { $arrayElemAt: ['$district', 0] },
              province: { $arrayElemAt: ['$province', 0] }
            },
            divisionCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id.name',
            name: '$_id.name',
            nameEn: '$_id.name',
            code: '$_id.name',
            districtId: '$_id.district.code',
            districtName: '$_id.district.name',
            provinceId: '$_id.province.code',
            provinceName: '$_id.province.name',
            divisionCount: 1
          }
        },
        {
          $sort: { provinceId: 1, districtId: 1, name: 1 }
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
      // First find the district
      const district = await DistrictModel.findOne({
        $or: [
          { code: districtIdentifier.toUpperCase() },
          { name: { $regex: new RegExp(`^${districtIdentifier}$`, 'i') } }
        ]
      }).lean();

      if (!district) {
        return [];
      }

      const collection = this.dbService.getCollection();
      
      const pipeline = [
        {
          $match: { 'properties.DISTRICT_C': district._id }
        },
        {
          $lookup: {
            from: 'districts',
            localField: 'properties.DISTRICT_C',
            foreignField: '_id',
            as: 'district'
          }
        },
        {
          $lookup: {
            from: 'provinces',
            localField: 'properties.PROVINCE_C',
            foreignField: '_id',
            as: 'province'
          }
        },
        {
          $group: {
            _id: {
              name: '$properties.DSD_N',
              district: { $arrayElemAt: ['$district', 0] },
              province: { $arrayElemAt: ['$province', 0] }
            },
            divisionCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id.name',
            name: '$_id.name',
            nameEn: '$_id.name',
            code: '$_id.name',
            districtId: '$_id.district.code',
            districtName: '$_id.district.name',
            provinceId: '$_id.province.code',
            provinceName: '$_id.province.name',
            divisionCount: 1
          }
        },
        {
          $sort: { name: 1 }
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
      // First find the province
      const province = await ProvinceModel.findOne({
        $or: [
          { code: provinceName.toUpperCase() },
          { name: { $regex: new RegExp(`^${provinceName}$`, 'i') } }
        ]
      }).lean();

      if (!province) {
        return [];
      }

      const collection = this.dbService.getCollection();
      
      const pipeline = [
        {
          $match: { 'properties.PROVINCE_C': province._id }
        },
        {
          $lookup: {
            from: 'districts',
            localField: 'properties.DISTRICT_C',
            foreignField: '_id',
            as: 'district'
          }
        },
        {
          $lookup: {
            from: 'provinces',
            localField: 'properties.PROVINCE_C',
            foreignField: '_id',
            as: 'province'
          }
        },
        {
          $group: {
            _id: {
              name: '$properties.DSD_N',
              district: { $arrayElemAt: ['$district', 0] },
              province: { $arrayElemAt: ['$province', 0] }
            },
            divisionCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id.name',
            name: '$_id.name',
            nameEn: '$_id.name',
            code: '$_id.name',
            districtId: '$_id.district.code',
            districtName: '$_id.district.name',
            provinceId: '$_id.province.code',
            provinceName: '$_id.province.name',
            divisionCount: 1
          }
        },
        {
          $sort: { districtId: 1, name: 1 }
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
   * Get DSD by ID (name, since there's no DSD code anymore)
   */
  async getDSDById(dsdName: string): Promise<DSD | null> {
    try {
      const collection = this.dbService.getCollection();
      
      const pipeline = [
        {
          $match: { 
            'properties.DSD_N': { 
              $regex: new RegExp(`^${dsdName}$`, 'i') 
            }
          }
        },
        {
          $lookup: {
            from: 'districts',
            localField: 'properties.DISTRICT_C',
            foreignField: '_id',
            as: 'district'
          }
        },
        {
          $lookup: {
            from: 'provinces',
            localField: 'properties.PROVINCE_C',
            foreignField: '_id',
            as: 'province'
          }
        },
        {
          $group: {
            _id: {
              name: '$properties.DSD_N',
              district: { $arrayElemAt: ['$district', 0] },
              province: { $arrayElemAt: ['$province', 0] }
            },
            divisionCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            id: '$_id.name',
            name: '$_id.name',
            nameEn: '$_id.name',
            code: '$_id.name',
            districtId: '$_id.district.code',
            districtName: '$_id.district.name',
            provinceId: '$_id.province.code',
            provinceName: '$_id.province.name',
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
   * Get GN divisions by DSD (using DSD name)
   */
  async getDivisionsByDSD(dsdName: string, includeGeometry: boolean = false): Promise<Division[]> {
    try {
      const collection = this.dbService.getCollection();
      
      const projection: any = {
        _id: 0,
        id: { $toString: '$_id' },
        name: '$properties.GND_N',
        nameEn: '$properties.GND_N',
        nameSi: '$properties.GND_NAME_Gaz',
        gnNumber: '$properties.GND_NO',
        dsdId: '$properties.DSD_N',
        dsdName: '$properties.DSD_N',
        area: '$properties.Ext_SqKm',
        population: '$properties.Pop_2020'
      };

      if (includeGeometry) {
        projection.geometry = '$geometry';
      }

      const pipeline = [
        {
          $match: { 
            'properties.DSD_N': { 
              $regex: new RegExp(`^${dsdName}$`, 'i') 
            }
          }
        },
        {
          $lookup: {
            from: 'districts',
            localField: 'properties.DISTRICT_C',
            foreignField: '_id',
            as: 'district'
          }
        },
        {
          $lookup: {
            from: 'provinces',
            localField: 'properties.PROVINCE_C',
            foreignField: '_id',
            as: 'province'
          }
        },
        {
          $addFields: {
            districtInfo: { $arrayElemAt: ['$district', 0] },
            provinceInfo: { $arrayElemAt: ['$province', 0] }
          }
        },
        {
          $project: {
            ...projection,
            districtId: '$districtInfo.code',
            districtName: '$districtInfo.name',
            provinceId: '$provinceInfo.code',
            provinceName: '$provinceInfo.name'
          }
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
