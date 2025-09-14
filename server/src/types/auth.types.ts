import { Request } from 'express';
import { IUser } from './models/auth.types';

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}
