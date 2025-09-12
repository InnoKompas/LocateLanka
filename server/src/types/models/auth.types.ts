import { Model } from 'mongoose';

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
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
