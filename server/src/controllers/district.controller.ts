import { Request, Response } from 'express';
import { DistrictService } from '../services/district.service';
import { ApiResponse } from '../types/api/api.types';
import { District } from '../types/location.types';

export class DistrictController {
  private districtService: DistrictService;

  constructor() {
    this.districtService = new DistrictService();
  }

  /**
   * Get districts with optional province filter
   */
  getDistricts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { province } = req.query;
      
      let districts;
      if (province) {
        districts = await this.districtService.getDistrictsByProvince(province as string);
      } else {
        districts = await this.districtService.getAllDistricts();
      }

      const response: ApiResponse<District[]> = {
        success: true,
        data: districts,
        message: province 
          ? `Districts in ${province} province retrieved successfully`
          : 'All districts retrieved successfully',
        meta: {
          total: districts.length,
          filter: province ? { province } : null,
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching districts:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch districts'
      });
    }
  };

  /**
   * Get district by ID (code)
   */
  getDistrictById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const districtCode = id;

      if (!districtCode || districtCode.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Invalid district ID',
          message: 'District ID (code) is required'
        });
        return;
      }

      const district = await this.districtService.getDistrictById(districtCode);

      if (!district) {
        res.status(404).json({
          success: false,
          error: 'District not found',
          message: `District with code ${districtCode} does not exist`
        });
        return;
      }

      const response: ApiResponse<District> = {
        success: true,
        data: district,
        message: 'District retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching district:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch district'
      });
    }
  };

  /**
   * Get GN divisions by district
   */
  getDivisionsByDistrict = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const districtCode = id;
      const { includeGeometry = 'false' } = req.query;

      if (!districtCode || districtCode.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Invalid district ID',
          message: 'District ID (code) is required'
        });
        return;
      }

      const includeGeo = includeGeometry === 'true';
      const divisions = await this.districtService.getDivisionsByDistrict(districtCode, includeGeo);

      const response: ApiResponse<any[]> = {
        success: true,
        data: divisions,
        message: 'GN divisions retrieved successfully',
        meta: {
          total: divisions.length,
          districtCode,
          includeGeometry: includeGeo,
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching divisions by district:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch divisions'
      });
    }
  };
}
