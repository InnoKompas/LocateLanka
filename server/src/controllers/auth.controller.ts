import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ILoginCredentials, IRegisterData } from '../types/models/auth.types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      console.log('Registration request body:', req.body);
      const data = req.body as IRegisterData;
      const user = await AuthService.register(data);
      res.status(201).json(user);
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ error: error.message, details: error });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const credentials = req.body as ILoginCredentials;
      const result = await AuthService.login(credentials);
      
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        user: result.user,
        accessToken: result.accessToken
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (!refreshToken) {
        throw new Error('Refresh token required');
      }

      const tokens = await AuthService.refreshToken(refreshToken);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env['NODE_ENV'] === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ accessToken: tokens.accessToken });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies['refreshToken'];
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
      res.clearCookie('refreshToken');
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = (req as any).user.userId; // Set by auth middleware
      
      await AuthService.changePassword(userId, oldPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
