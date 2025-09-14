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
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'cancelled', 'expired'],
      default: 'active'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date
    },
    rateLimit: {
      requestsPerHour: {
        type: Number,
        default: 100 // Free plan default
      },
      requestsPerDay: {
        type: Number,
        default: 1000 // Free plan default
      },
      requestsPerMonth: {
        type: Number,
        default: 10000 // Free plan default
      }
    }
  },
  usage: {
    currentHour: {
      count: {
        type: Number,
        default: 0
      },
      resetTime: {
        type: Date,
        default: Date.now
      }
    },
    currentDay: {
      count: {
        type: Number,
        default: 0
      },
      resetTime: {
        type: Date,
        default: Date.now
      }
    },
    currentMonth: {
      count: {
        type: Number,
        default: 0
      },
      resetTime: {
        type: Date,
        default: Date.now
      }
    }
  }
}, {
  timestamps: true
});

// Set rate limits based on subscription plan
userSchema.pre('save', async function(next) {
  // Hash password if modified
  if (this.isModified('password')) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (err: any) {
      return next(err);
    }
  }

  // Set rate limits based on subscription plan
  if (this.isModified('subscription.plan') || this.isNew) {
    const planLimits = {
      free: {
        requestsPerHour: 100,
        requestsPerDay: 1000,
        requestsPerMonth: 10000
      },
      pro: {
        requestsPerHour: 1000,
        requestsPerDay: 10000,
        requestsPerMonth: 100000
      },
      enterprise: {
        requestsPerHour: 10000,
        requestsPerDay: 100000,
        requestsPerMonth: 1000000
      }
    };

    const limits = planLimits[this.subscription.plan];
    if (limits) {
      this.subscription.rateLimit = limits;
    }
  }

  next();
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
