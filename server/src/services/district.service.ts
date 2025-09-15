import { District, Division, DSD } from '../types/location.types';
import { DatabaseService } from './database.service';
import { District as DistrictModel } from '../models/District.model';

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
      const districts = await DistrictModel.find()
        .populate('provinceRef', 'name code')
        .sort({ province_id: 1, name: 1 })
        .lean();

      // Transform to match the expected District interface
      return districts.map(district => ({
        id: district.code,
        name: district.name,
        nameEn: district.name,
        nameSi: district.sinhala,
        nameTa: district.tamil,
        code: district.code,
        capital: district.capital,
        area: district.area,
        population: district.population,
        provinceId: (district.provinceRef as any)?.code || district.province_id.toString(),
        provinceName: (district.provinceRef as any)?.name || district.province
      }));
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
      const districts = await DistrictModel.find({
        $or: [
          { province: { $regex: new RegExp(`^${provinceName}$`, 'i') } },
          { 'provinceRef.name': { $regex: new RegExp(`^${provinceName}$`, 'i') } }
        ]
      })
        .populate('provinceRef', 'name code')
        .sort({ name: 1 })
        .lean();

      // Transform to match the expected District interface
      return districts.map(district => ({
        id: district.code,
        name: district.name,
        nameEn: district.name,
        nameSi: district.sinhala,
        nameTa: district.tamil,
        code: district.code,
        capital: district.capital,
        area: district.area,
        population: district.population,
        provinceId: (district.provinceRef as any)?.code || district.province_id.toString(),
        provinceName: (district.provinceRef as any)?.name || district.province
      }));
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
      const district = await DistrictModel.findOne({ code: districtCode.toUpperCase() })
        .populate('provinceRef', 'name code')
        .lean();

      if (!district) {
        return null;
      }

      // Transform to match the expected District interface
      return {
        id: district.code,
        name: district.name,
        nameEn: district.name,
        nameSi: district.sinhala,
        nameTa: district.tamil,
        code: district.code,
        capital: district.capital,
        area: district.area,
        population: district.population,
        provinceId: (district.provinceRef as any)?.code || district.province_id.toString(),
        provinceName: (district.provinceRef as any)?.name || district.province
      };
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
      // First get the district ObjectId
      const district = await DistrictModel.findOne({ code: districtCode.toUpperCase() }).lean();
      if (!district) {
        throw new Error(`District with code ${districtCode} not found`);
      }

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
          $match: { 'properties.DISTRICT_C': district._id }
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