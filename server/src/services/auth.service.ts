import jwt from 'jsonwebtoken';
import { IAuthTokens, IDecodedToken, ILoginCredentials, IRegisterData, IUser } from '../types/models/auth.types';
import { User } from '../models/user.model';
import { RefreshToken } from '../models/refreshToken.model';

const JWT_ACCESS_SECRET = process.env['JWT_ACCESS_SECRET'] || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] || 'your-refresh-secret-key';

// Simple in-memory lock to prevent concurrent refresh token operations
const refreshLocks = new Map<string, Promise<IAuthTokens>>();

export class AuthService {
  static async register(data: IRegisterData): Promise<IUser> {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const user = new User(data);
    await user.save();
    return user;
  }

  static async login(credentials: ILoginCredentials): Promise<{ user: IUser } & IAuthTokens> {
    const user = await User.findOne({ email: credentials.email });
    if (!user || !(await user.comparePassword(credentials.password))) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is disabled');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const tokens = await this.generateTokens(user);
    return { user, ...tokens };
  }

  static async refreshToken(token: string): Promise<IAuthTokens> {
    // Check if there's already a refresh operation in progress for this token
    if (refreshLocks.has(token)) {
      return refreshLocks.get(token)!;
    }

    // Create a new refresh operation
    const refreshOperation = this.performRefreshToken(token);
    refreshLocks.set(token, refreshOperation);

    try {
      const result = await refreshOperation;
      return result;
    } finally {
      // Clean up the lock
      refreshLocks.delete(token);
    }
  }

  private static async performRefreshToken(token: string): Promise<IAuthTokens> {
    const refreshTokenDoc = await RefreshToken.findOne({ token, isRevoked: false });
    if (!refreshTokenDoc || refreshTokenDoc.expiresAt < new Date()) {
      throw new Error('Invalid refresh token');
    }

    const user = await User.findById(refreshTokenDoc.userId);
    if (!user || !user.isActive) {
      throw new Error('User not found or inactive');
    }

    // Revoke the old refresh token
    refreshTokenDoc.isRevoked = true;
    await refreshTokenDoc.save();

    // Generate new tokens
    return this.generateTokens(user);
  }

  static async logout(refreshToken: string): Promise<void> {
    await RefreshToken.updateOne({ token: refreshToken }, { isRevoked: true });
    
    // Clean up expired tokens periodically
    this.cleanupExpiredTokens();
  }

  private static async cleanupExpiredTokens(): Promise<void> {
    try {
      // Remove expired or revoked tokens older than 1 day
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      await RefreshToken.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { isRevoked: true, updatedAt: { $lt: oneDayAgo } }
        ]
      });
    } catch (error) {
      console.warn('Failed to cleanup expired tokens:', error);
    }
  }

  private static async generateTokens(user: IUser): Promise<IAuthTokens> {
    const accessToken = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      },
      JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    // Generate a unique refresh token by including timestamp and random value
    const refreshToken = jwt.sign(
      { 
        userId: user._id,
        iat: Math.floor(Date.now() / 1000),
        jti: Math.random().toString(36).substring(2, 15) // Random string for uniqueness
      },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token with error handling for duplicates
    try {
      await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      });
    } catch (error: any) {
      // If duplicate key error, try once more with a new token
      if (error.code === 11000) {
        const newRefreshToken = jwt.sign(
          { 
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),
            jti: Math.random().toString(36).substring(2, 15) + Date.now()
          },
          JWT_REFRESH_SECRET,
          { expiresIn: '7d' }
        );
        
        await RefreshToken.create({
          userId: user._id,
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });
        
        return { accessToken, refreshToken: newRefreshToken };
      }
      throw error;
    }

    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): IDecodedToken {
    try {
      return jwt.verify(token, JWT_ACCESS_SECRET) as IDecodedToken;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user || !(await user.comparePassword(oldPassword))) {
      throw new Error('Invalid current password');
    }

    user.password = newPassword;
    await user.save();

    // Revoke all refresh tokens for this user
    await RefreshToken.updateMany({ userId }, { isRevoked: true });
  }
}
