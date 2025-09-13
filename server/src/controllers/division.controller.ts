import { Request, Response } from 'express';
import { DivisionService } from '../services/division.service';
import { ApiResponse } from '../types/api/api.types';
import { Division, DivisionFilters } from '../types/location.types';

export class DivisionController {
  private divisionService: DivisionService;

  constructor() {
    this.divisionService = new DivisionService();
  }

  /**
   * Get divisions with optional filters
   */
  getDivisions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { 
        district, 
        province, 
        dsd, 
        gnOfficer, 
        minPopulation, 
        maxPopulation, 
        minArea, 
        maxArea, 
        yearCreated, 
        includeGeometry = 'false',
        limit = '50', 
        offset = '0' 
      } = req.query;
      
      const filters: DivisionFilters = {
        district: district as string,
        province: province as string,
        dsd: dsd as string,
        gnOfficer: gnOfficer as string,
        ...(minPopulation && { minPopulation: parseInt(minPopulation as string) }),
        ...(maxPopulation && { maxPopulation: parseInt(maxPopulation as string) }),
        ...(minArea && { minArea: parseFloat(minArea as string) }),
        ...(maxArea && { maxArea: parseFloat(maxArea as string) }),
        yearCreated: yearCreated as string,
        includeGeometry: includeGeometry === 'true',
        limit: Math.min(parseInt(limit as string) || 50, 100),
        offset: parseInt(offset as string) || 0
      };

      const result = await this.divisionService.getDivisions(filters);

      const response: ApiResponse<Division[]> = {
        success: true,
        data: result.divisions,
        message: 'GN divisions retrieved successfully',
        meta: {
          total: result.total,
          count: result.divisions.length,
          limit: filters.limit || 50,
          offset: filters.offset || 0,
          filters: {
            district: filters.district || null,
            province: filters.province || null,
            dsd: filters.dsd || null,
            gnOfficer: filters.gnOfficer || null,
            populationRange: filters.minPopulation || filters.maxPopulation ? {
              min: filters.minPopulation,
              max: filters.maxPopulation
            } : null,
            areaRange: filters.minArea || filters.maxArea ? {
              min: filters.minArea,
              max: filters.maxArea
            } : null,
            yearCreated: filters.yearCreated || null
          },
          includeGeometry: filters.includeGeometry,
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching divisions:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch divisions'
      });
    }
  };

  /**
   * Get division by ID
   */
  getDivisionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { includeGeometry = 'false' } = req.query;

      if (!id || id.trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Invalid division ID',
          message: 'Division ID is required'
        });
        return;
      }

      const includeGeo = includeGeometry === 'true';
      const division = await this.divisionService.getDivisionById(id, includeGeo);

      if (!division) {
        res.status(404).json({
          success: false,
          error: 'Division not found',
          message: `GN division with ID ${id} does not exist`
        });
        return;
      }

      const response: ApiResponse<Division> = {
        success: true,
        data: division,
        message: 'GN division retrieved successfully'
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching division:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to fetch division'
      });
    }
  };

  /**
   * Search divisions by name or code
   */
  searchDivisions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { q, limit = '10', includeGeometry = 'false' } = req.query;

      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        res.status(400).json({
          success: false,
          error: 'Invalid search query',
          message: 'Search query must be at least 2 characters long'
        });
        return;
      }

      const searchLimit = Math.min(parseInt(limit as string) || 10, 100);
      const includeGeo = includeGeometry === 'true';
      const divisions = await this.divisionService.searchDivisions(q.trim(), searchLimit, includeGeo);

      const response: ApiResponse<Division[]> = {
        success: true,
        data: divisions,
        message: `Search results for "${q}"`,
        meta: {
          query: q,
          count: divisions.length,
          limit: searchLimit,
          includeGeometry: includeGeo,
          timestamp: new Date().toISOString()
        }
      };

      res.json(response);
    } catch (error) {
      console.error('Error searching divisions:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to search divisions'
      });
    }
  };
}
