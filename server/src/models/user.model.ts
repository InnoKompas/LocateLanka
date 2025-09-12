import { Schema, model } from 'mongoose';
import { IUser, UserModel } from '../types/models/auth.types';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Compare password method
userSchema.methods['comparePassword'] = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this['password']);
};

// Don't return password in JSON
userSchema.set('toJSON', {
  transform: (_doc, ret: Record<string, any>) => {
    const { password, ...rest } = ret;
    return rest;
  }
});

export const User = model<IUser, UserModel>('User', userSchema);
