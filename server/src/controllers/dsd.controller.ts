import { Request, Response } from 'express';
import { DSDService } from '../services/dsd.service';
import { ApiResponse } from '../types/api/api.types';
import { DSD, Division } from '../types/location.types';

export class DSDController {
  private dsdService: DSDService;

  constructor() {
    this.dsdService = new DSDService();
  }

  /**
   * Get DSDs with optional filters
   */
  getDSDs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { district, province } = req.query;
      
      let dsds;
      if (district) {
        dsds = await this.dsdService.getDSDsByDistrict(district as string);
      } else if (province) {
        dsds = await this.dsdService.getDSDsByProvince(province as string);
      } else {
        dsds = await this.dsdService.getAllDSDs();
      }

      const response: ApiResponse<DSD[]> = {
        success: true,
        data: dsds,
        message: 'DSDs retrieved successfully',
        meta: {
          total: dsds.length,
          filters: {
            district: district as string || null,
            province: province as string || null
          },
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching DSDs:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch DSDs'
      });
    }
  };

  /**
   * Get DSD by ID (code)
   */
  getDSDById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Invalid DSD ID',
          message: 'DSD ID (code) is required'
        });
        return;
      }

      const dsd = await this.dsdService.getDSDById(id);

      if (!dsd) {
        res.status(404).json({
          success: false,
          error: 'DSD not found',
          message: `DSD with code ${id} does not exist`
        });
        return;
      }

      const response: ApiResponse<DSD> = {
        success: true,
        data: dsd,
        message: 'DSD retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching DSD:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch DSD'
      });
    }
  };

  /**
   * Get GN divisions by DSD
   */
  getDivisionsByDSD = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { includeGeometry = 'false' } = req.query;

      if (!id || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Invalid DSD ID',
          message: 'DSD ID (code) is required'
        });
        return;
      }

      const includeGeo = includeGeometry === 'true';
      const divisions = await this.dsdService.getDivisionsByDSD(id, includeGeo);

      const response: ApiResponse<Division[]> = {
        success: true,
        data: divisions,
        message: 'GN divisions retrieved successfully',
        meta: {
          total: divisions.length,
          dsdCode: id,
          includeGeometry: includeGeo,
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching divisions by DSD:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch divisions'
      });
    }
  };
}
