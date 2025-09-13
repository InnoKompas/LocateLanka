import { Division, DivisionFilters } from '../types/location.types';
import { DatabaseService } from './database.service';
import { ObjectId } from 'mongodb';

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
      
      if (filters.province) {
        matchConditions['properties.PROVINCE_N'] = { 
          $regex: new RegExp(`^${filters.province}$`, 'i') 
        };
      }
      
      if (filters.district) {
        matchConditions['properties.DISTRICT_N'] = { 
          $regex: new RegExp(`^${filters.district}$`, 'i') 
        };
      }
      
      if (filters.dsd) {
        matchConditions['properties.DSD_N'] = { 
          $regex: new RegExp(`^${filters.dsd}$`, 'i') 
        };
      }
      
      if (filters.gnOfficer) {
        matchConditions['properties.GN_Officer'] = { 
          $regex: new RegExp(filters.gnOfficer, 'i') 
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
      
      if (filters.yearCreated) {
        matchConditions['properties.YEAR_CREAT'] = filters.yearCreated;
      }

      // Build projection
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

      if (filters.includeGeometry) {
        projection.geometry = '$geometry';
      }

      // Build aggregation pipeline
      const pipeline: any[] = [];
      
      if (Object.keys(matchConditions).length > 0) {
        pipeline.push({ $match: matchConditions });
      }
      
      pipeline.push({ $project: projection });
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
          $match: { _id: new ObjectId(divisionId) }
        },
        {
          $project: projection
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
          { 'properties.GND_NAME_C': { $regex: new RegExp(query, 'i') } },
          { 'properties.GND_NAME_G': { $regex: new RegExp(query, 'i') } },
          { 'properties.GND_NO': { $regex: new RegExp(query, 'i') } },
          { 'properties.GND_C': { $regex: new RegExp(query, 'i') } },
          { 'properties.ADMIN_CODE': isNaN(Number(query)) ? null : Number(query) }
        ].filter(condition => condition !== null)
      };

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
        { $match: searchConditions },
        { $project: projection },
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