import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { AdminService } from '../services/admin.service';
import { handleApiError } from '../utils/errorHandler';

export class AdminController {
  // Dashboard Overview
  static async getDashboardStats(_req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await AdminService.getDashboardStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  static async getRecentActivity(req: AuthenticatedRequest, res: Response) {
    try {
      const limit = parseInt(req.query['limit'] as string) || 10;
      const activity = await AdminService.getRecentActivity(limit);
      
      res.json({
        success: true,
        data: activity
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  // User Management
  static async getAllUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;
      const search = req.query['search'] as string;
      const role = req.query['role'] as string;
      const status = req.query['status'] as string;

      const result = await AdminService.getAllUsers(page, limit, search, role, status);
      
      res.json({
        success: true,
        data: result.users,
        pagination: result.pagination
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  static async updateUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'User ID is required'
          }
        });
        return;
      }
      const updates = req.body;

      // Prevent admins from demoting themselves
      if (userId === req.user!._id.toString() && updates.role && updates.role !== 'admin') {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_OPERATION',
            message: 'Cannot change your own admin role'
          }
        });
        return;
      }

      const user = await AdminService.updateUser(userId, updates);
      
      res.json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'User ID is required'
          }
        });
        return;
      }

      // Prevent admins from deleting themselves
      if (userId === req.user!._id.toString()) {
        res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_OPERATION',
            message: 'Cannot delete your own account'
          }
        });
        return;
      }

      // Soft delete by deactivating
      const user = await AdminService.updateUser(userId, { isActive: false });
      
      res.json({
        success: true,
        data: user,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  // API Key Management
  static async getAllApiKeys(req: AuthenticatedRequest, res: Response) {
    try {
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || 20;
      const search = req.query['search'] as string;
      const status = req.query['status'] as string;

      const result = await AdminService.getAllApiKeys(page, limit, search, status);
      
      res.json({
        success: true,
        data: result.keys,
        pagination: result.pagination
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  static async updateApiKey(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { keyId } = req.params;
      if (!keyId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'Key ID is required'
          }
        });
        return;
      }
      const updates = req.body;

      const key = await AdminService.updateApiKey(keyId, updates);
      
      res.json({
        success: true,
        data: key,
        message: 'API key updated successfully'
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  static async revokeApiKey(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { keyId } = req.params;
      if (!keyId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'Key ID is required'
          }
        });
        return;
      }

      const key = await AdminService.updateApiKey(keyId, { 
        isActive: false,
        revokedAt: new Date(),
        revokedBy: req.user!._id
      });
      
      res.json({
        success: true,
        data: key,
        message: 'API key revoked successfully'
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  // Usage Analytics
  static async getUsageAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      const period = (req.query['period'] as 'daily' | 'weekly' | 'monthly') || 'daily';
      const days = parseInt(req.query['days'] as string) || 30;

      const analytics = await AdminService.getUsageAnalytics(period, days);
      
      res.json({
        success: true,
        data: analytics
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  // System Settings
  static async getSystemSettings(_req: AuthenticatedRequest, res: Response) {
    try {
      const settings = await AdminService.getSystemSettings();
      
      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }

  static async updateSystemSettings(req: AuthenticatedRequest, res: Response) {
    try {
      const settings = req.body;
      const updatedSettings = await AdminService.updateSystemSettings(settings);
      
      res.json({
        success: true,
        data: updatedSettings,
        message: 'System settings updated successfully'
      });
    } catch (error) {
      handleApiError(error, res);
    }
  }
}
