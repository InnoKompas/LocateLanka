import { Province, District } from '../types/location.types';
import { Province as ProvinceModel } from '../models/Province.model';

export class ProvinceService {
  constructor() {}

  /**
   * Get all provinces from the database
   */
  async getAllProvinces(): Promise<Province[]> {
    try {
      const provinces = await ProvinceModel.find()
        .populate('districts', 'name code')
        .sort({ name: 1 })
        .lean();

      // Transform to match the expected Province interface
      return provinces.map(province => ({
        id: province.code,
        name: province.name,
        nameEn: province.name,
        nameSi: province.sinhala,
        nameTa: province.tamil,
        code: province.code,
        capital: province.capital,
        area: province.area,
        population: province.population,
        districtCount: province.districts.length
      }));
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
      const province = await ProvinceModel.findOne({ code: provinceCode.toUpperCase() })
        .populate('districts', 'name code')
        .lean();

      if (!province) {
        return null;
      }

      // Transform to match the expected Province interface
      return {
        id: province.code,
        name: province.name,
        nameEn: province.name,
        nameSi: province.sinhala,
        nameTa: province.tamil,
        code: province.code,
        capital: province.capital,
        area: province.area,
        population: province.population,
        districtCount: province.districts.length
      };
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
      // First get the province
      const province = await ProvinceModel.findOne({ code: provinceCode.toUpperCase() })
        .populate('districts')
        .lean();

      if (!province) {
        return [];
      }

      // Transform districts to match expected interface
      return (province.districts as any[]).map(district => ({
        id: district.code,
        name: district.name,
        nameEn: district.name,
        nameSi: district.sinhala,
        nameTa: district.tamil,
        code: district.code,
        capital: district.capital,
        area: district.area,
        population: district.population,
        provinceId: province.code,
        provinceName: province.name
      }));
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
      const province = await ProvinceModel.findOne({ 
        name: { $regex: new RegExp(`^${provinceName}$`, 'i') }
      })
        .populate('districts', 'name code')
        .lean();

      if (!province) {
        return null;
      }

      // Transform to match the expected Province interface
      return {
        id: province.code,
        name: province.name,
        nameEn: province.name,
        nameSi: province.sinhala,
        nameTa: province.tamil,
        code: province.code,
        capital: province.capital,
        area: province.area,
        population: province.population,
        districtCount: province.districts.length
      };
    } catch (error) {
      console.error('Error fetching province by name:', error);
      throw new Error('Failed to fetch province from database');
    }
  }
}