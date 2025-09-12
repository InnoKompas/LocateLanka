import jwt from 'jsonwebtoken';
import { IAuthTokens, IDecodedToken, ILoginCredentials, IRegisterData, IUser } from '../types/models/auth.types';
import { User } from '../models/user.model';
import { RefreshToken } from '../models/refreshToken.model';

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env['JWT_REFRESH_SECRET'] || 'your-refresh-secret-key';

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
  }

  private static async generateTokens(user: IUser): Promise<IAuthTokens> {
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Save refresh token
    await RefreshToken.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): IDecodedToken {
    try {
      return jwt.verify(token, JWT_SECRET) as IDecodedToken;
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
