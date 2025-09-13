import mongoose, { Schema, Document } from 'mongoose';

export interface IApiKey extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  keyPrefix: string;
  hashedKey: string;
  isActive: boolean;
  permissions: string[];
  rateLimit: {
    requestsPerHour: number;
    requestsPerDay: number;
    requestsPerMonth: number;
  };
  usage: {
    totalRequests: number;
    requestsToday: number;
    requestsThisMonth: number;
    lastUsed?: Date;
    lastUsedEndpoint?: string;
    lastUsedIP?: string;
  };
  restrictions: {
    allowedIPs?: string[];
    allowedDomains?: string[];
    allowedEndpoints?: string[];
  };
  metadata: {
    userAgent?: string;
    description?: string;
    environment: 'development' | 'staging' | 'production';
  };
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  incrementUsage(endpoint?: string, ip?: string): Promise<IApiKey>;
  resetDailyUsage(): Promise<IApiKey>;
  resetMonthlyUsage(): Promise<IApiKey>;
  isWithinRateLimit(): boolean;
  hasPermission(permission: string): boolean;
}

// Static methods interface
export interface IApiKeyModel extends mongoose.Model<IApiKey> {
  generateKey(): { key: string; keyPrefix: string };
  hashKey(key: string): string;
}

const ApiKeySchema = new Schema<IApiKey>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  keyPrefix: {
    type: String,
    required: true,
    index: true
  },
  hashedKey: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  permissions: [{
    type: String,
    enum: [
      'read:provinces',
      'read:districts', 
      'read:divisions',
      'read:dsds',
      'read:all',
      'write:data',
      'admin:all'
    ],
    default: ['read:all']
  }],
  rateLimit: {
    requestsPerHour: {
      type: Number,
      default: 1000
    },
    requestsPerDay: {
      type: Number,
      default: 10000
    },
    requestsPerMonth: {
      type: Number,
      default: 100000
    }
  },
  usage: {
    totalRequests: {
      type: Number,
      default: 0
    },
    requestsToday: {
      type: Number,
      default: 0
    },
    requestsThisMonth: {
      type: Number,
      default: 0
    },
    lastUsed: Date,
    lastUsedEndpoint: String,
    lastUsedIP: String
  },
  restrictions: {
    allowedIPs: [String],
    allowedDomains: [String],
    allowedEndpoints: [String]
  },
  metadata: {
    userAgent: String,
    description: String,
    environment: {
      type: String,
      enum: ['development', 'staging', 'production'],
      default: 'development'
    }
  },
  expiresAt: Date
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc: any, ret: any) {
      // Never return the full key or hashed key in JSON responses
      delete ret.key;
      delete ret.hashedKey;
      return ret;
    }
  }
});

// Indexes for performance
ApiKeySchema.index({ userId: 1, isActive: 1 });
ApiKeySchema.index({ keyPrefix: 1, isActive: 1 });
ApiKeySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save middleware to handle key expiration
ApiKeySchema.pre('save', function(next) {
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.isActive = false;
  }
  next();
});

// Instance methods
ApiKeySchema.methods['incrementUsage'] = function(endpoint?: string, ip?: string) {
  this['usage'].totalRequests += 1;
  this['usage'].requestsToday += 1;
  this['usage'].requestsThisMonth += 1;
  this['usage'].lastUsed = new Date();
  if (endpoint) this['usage'].lastUsedEndpoint = endpoint;
  if (ip) this['usage'].lastUsedIP = ip;
  return this['save']();
};

ApiKeySchema.methods['resetDailyUsage'] = function() {
  this['usage'].requestsToday = 0;
  return this['save']();
};

ApiKeySchema.methods['resetMonthlyUsage'] = function() {
  this['usage'].requestsThisMonth = 0;
  return this['save']();
};

ApiKeySchema.methods['isWithinRateLimit'] = function(): boolean {
  const { requestsPerDay, requestsPerMonth } = this['rateLimit'];
  const { requestsToday, requestsThisMonth } = this['usage'];
  
  return requestsToday < requestsPerDay && requestsThisMonth < requestsPerMonth;
};

ApiKeySchema.methods['hasPermission'] = function(permission: string): boolean {
  return this['permissions'].includes('admin:all') || 
         this['permissions'].includes('read:all') || 
         this['permissions'].includes(permission);
};

// Static methods
ApiKeySchema.statics['generateKey'] = function(): { key: string; keyPrefix: string } {
  const prefix = 'lk';
  const randomPart = require('crypto').randomBytes(16).toString('hex');
  const key = `${prefix}_${randomPart}`;
  return { key, keyPrefix: prefix };
};

ApiKeySchema.statics['hashKey'] = function(key: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(key).digest('hex');
};

export const ApiKey = mongoose.model<IApiKey, IApiKeyModel>('ApiKey', ApiKeySchema) as IApiKeyModel;
