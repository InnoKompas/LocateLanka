import { Model } from 'mongoose';

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export interface IRateLimit {
  requestsPerHour: number;
  requestsPerDay: number;
  requestsPerMonth: number;
}

export interface IUsagePeriod {
  count: number;
  resetTime: Date;
}

export interface IUsage {
  currentHour: IUsagePeriod;
  currentDay: IUsagePeriod;
  currentMonth: IUsagePeriod;
}

export interface ISubscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  startDate: Date;
  endDate?: Date;
  rateLimit: IRateLimit;
}

export interface IUser {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  subscription: ISubscription;
  usage: IUsage;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserModel = Model<IUser, {}, IUserMethods>;

export interface IAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData extends ILoginCredentials {
  firstName: string;
  lastName: string;
}

export interface IRefreshToken {
  _id?: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt?: Date;
}

export interface IDecodedToken {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}
