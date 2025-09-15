import { Division, DivisionFilters } from '../types/location.types';
import { DatabaseService } from './database.service';
import { ObjectId } from 'mongodb';
import { District as DistrictModel } from '../models/District.model';
import { Province as ProvinceModel } from '../models/Province.model';

export class DivisionService {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = DatabaseService.getInstance();
  }

  /**
   * Get divisions with filters and pagination
   */
  async getDivisions(filters: DivisionFilters): Promise<{ divisions: Division[]; total: number }> {
    try {
      const collection = this.dbService.getCollection();
      
      // Build match conditions
      const matchConditions: any = {};
      
      // Handle province filter by looking up province ObjectId
      if (filters.province) {
        const province = await ProvinceModel.findOne({
          $or: [
            { code: filters.province.toUpperCase() },
            { name: { $regex: new RegExp(`^${filters.province}$`, 'i') } }
          ]
        }).lean();
        
        if (province) {
          matchConditions['properties.PROVINCE_C'] = province._id;
        } else {
          // If province not found, return empty results
          return { divisions: [], total: 0 };
        }
      }
      
      // Handle district filter by looking up district ObjectId
      if (filters.district) {
        const district = await DistrictModel.findOne({
          $or: [
            { code: filters.district.toUpperCase() },
            { name: { $regex: new RegExp(`^${filters.district}$`, 'i') } }
          ]
        }).lean();
        
        if (district) {
          matchConditions['properties.DISTRICT_C'] = district._id;
        } else {
          // If district not found, return empty results
          return { divisions: [], total: 0 };
        }
      }
      
      if (filters.dsd) {
        matchConditions['properties.DSD_N'] = { 
          $regex: new RegExp(`^${filters.dsd}$`, 'i') 
        };
      }
      
      if (filters.minPopulation || filters.maxPopulation) {
        matchConditions['properties.Pop_2020'] = {};
        if (filters.minPopulation) {
          matchConditions['properties.Pop_2020'].$gte = filters.minPopulation;
        }
        if (filters.maxPopulation) {
          matchConditions['properties.Pop_2020'].$lte = filters.maxPopulation;
        }
      }
      
      if (filters.minArea || filters.maxArea) {
        matchConditions['properties.Ext_SqKm'] = {};
        if (filters.minArea) {
          matchConditions['properties.Ext_SqKm'].$gte = filters.minArea;
        }
        if (filters.maxArea) {
          matchConditions['properties.Ext_SqKm'].$lte = filters.maxArea;
        }
      }

      // Build projection
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

      if (filters.includeGeometry) {
        projection.geometry = '$geometry';
      }

      // Build aggregation pipeline
      const pipeline: any[] = [];
      
      if (Object.keys(matchConditions).length > 0) {
        pipeline.push({ $match: matchConditions });
      }
      
      // Add lookups for district and province information
      pipeline.push({
        $lookup: {
          from: 'districts',
          localField: 'properties.DISTRICT_C',
          foreignField: '_id',
          as: 'district'
        }
      });
      
      pipeline.push({
        $lookup: {
          from: 'provinces',
          localField: 'properties.PROVINCE_C',
          foreignField: '_id',
          as: 'province'
        }
      });
      
      // Add district and province info to projection
      pipeline.push({
        $addFields: {
          districtInfo: { $arrayElemAt: ['$district', 0] },
          provinceInfo: { $arrayElemAt: ['$province', 0] }
        }
      });
      
      pipeline.push({
        $project: {
          ...projection,
          districtId: '$districtInfo.code',
          districtName: '$districtInfo.name',
          provinceId: '$provinceInfo.code',
          provinceName: '$provinceInfo.name'
        }
      });
      
      pipeline.push({ $sort: { gnNumber: 1 } });

      // Get total count
      const countPipeline = [...pipeline];
      countPipeline.push({ $count: 'total' });
      const countResult = await collection.aggregate(countPipeline).toArray();
      const total = countResult.length > 0 ? countResult[0]?.['total'] || 0 : 0;

      // Apply pagination
      const offset = filters.offset || 0;
      const limit = Math.min(filters.limit || 50, 100);
      
      pipeline.push({ $skip: offset });
      pipeline.push({ $limit: limit });

      const divisions = await collection.aggregate<Division>(pipeline).toArray();

      return { divisions, total };
    } catch (error) {
      console.error('Error fetching divisions:', error);
      throw new Error('Failed to fetch divisions from database');
    }
  }

  /**
   * Get division by ID
   */
  async getDivisionById(divisionId: string, includeGeometry: boolean = false): Promise<Division | null> {
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
          $match: { _id: new ObjectId(divisionId) }
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
        }
      ];

      const result = await collection.aggregate<Division>(pipeline).toArray();
      return result.length > 0 ? result[0] || null : null;
    } catch (error) {
      console.error('Error fetching division by ID:', error);
      throw new Error('Failed to fetch division from database');
    }
  }

  /**
   * Search divisions by name, GN number, or admin code
   */
  async searchDivisions(query: string, limit: number = 10, includeGeometry: boolean = false): Promise<Division[]> {
    try {
      const collection = this.dbService.getCollection();
      
      const searchConditions = {
        $or: [
          { 'properties.GND_N': { $regex: new RegExp(query, 'i') } },
          { 'properties.GND_NAME_Cen': { $regex: new RegExp(query, 'i') } },
          { 'properties.GND_NAME_Gaz': { $regex: new RegExp(query, 'i') } },
          { 'properties.GND_NO': { $regex: new RegExp(query, 'i') } }
        ]
      };

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
        { $match: searchConditions },
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
        { $sort: { gnNumber: 1 } },
        { $limit: Math.min(limit, 100) }
      ];

      const divisions = await collection.aggregate<Division>(pipeline).toArray();
      return divisions;
    } catch (error) {
      console.error('Error searching divisions:', error);
      throw new Error('Failed to search divisions in database');
    }
  }

  /**
   * Get divisions by DSD (Divisional Secretariat Division)
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