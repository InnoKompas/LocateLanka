import { Request, Response } from 'express';
import { ProvinceService } from '../services/province.service';
import { ApiResponse } from '../types/api/api.types';
import { Province } from '../types/location.types';

export class ProvinceController {
  private provinceService: ProvinceService;

  constructor() {
    this.provinceService = new ProvinceService();
  }

  /**
   * Get all provinces
   */
  getAllProvinces = async (_req: Request, res: Response): Promise<void> => {
    try {
      const provinces = await this.provinceService.getAllProvinces();
      
      const response: ApiResponse<Province[]> = {
        success: true,
        data: provinces,
        message: 'Provinces retrieved successfully',
        meta: {
          total: provinces.length,
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching provinces:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch provinces'
      });
    }
  };

  /**
   * Get province by ID (code)
   */
  getProvinceById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const provinceCode = id;

      if (!provinceCode || provinceCode.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Invalid province ID',
          message: 'Province ID (code) is required'
        });
        return;
      }

      const province = await this.provinceService.getProvinceById(provinceCode);

      if (!province) {
        res.status(404).json({
          success: false,
          error: 'Province not found',
          message: `Province with code ${provinceCode} does not exist`
        });
        return;
      }

      const response: ApiResponse<Province> = {
        success: true,
        data: province,
        message: 'Province retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching province:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch province'
      });
    }
  };

  /**
   * Get districts by province
   */
  getDistrictsByProvince = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const provinceCode = id;

      if (!provinceCode || provinceCode.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Invalid province ID',
          message: 'Province ID (code) is required'
        });
        return;
      }

      const districts = await this.provinceService.getDistrictsByProvince(provinceCode);

      const response: ApiResponse<any[]> = {
        success: true,
        data: districts,
        message: 'Districts retrieved successfully',
        meta: {
          total: districts.length,
          provinceCode,
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching districts by province:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch districts'
      });
    }
  };
}
