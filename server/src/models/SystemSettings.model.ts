import { Schema, model } from 'mongoose';

export interface IRateLimit {
  requestsPerHour: number;
  requestsPerDay: number;
  requestsPerMonth: number;
}

export interface IApiKeyLimits {
  free: number;
  pro: number;
  enterprise: number;
}

export interface ISystemSettings {
  _id?: string;
  rateLimits: {
    free: IRateLimit;
    pro: IRateLimit;
    enterprise: IRateLimit;
  };
  apiKeyLimits: IApiKeyLimits;
  maintenanceMode: boolean;
  globalAnnouncement?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const rateLimitSchema = new Schema({
  requestsPerHour: {
    type: Number,
    required: true,
    min: 0
  },
  requestsPerDay: {
    type: Number,
    required: true,
    min: 0
  },
  requestsPerMonth: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const systemSettingsSchema = new Schema<ISystemSettings>({
  rateLimits: {
    free: {
      type: rateLimitSchema,
      required: true,
      default: {
        requestsPerHour: 100,
        requestsPerDay: 1000,
        requestsPerMonth: 10000
      }
    },
    pro: {
      type: rateLimitSchema,
      required: true,
      default: {
        requestsPerHour: 1000,
        requestsPerDay: 10000,
        requestsPerMonth: 100000
      }
    },
    enterprise: {
      type: rateLimitSchema,
      required: true,
      default: {
        requestsPerHour: 10000,
        requestsPerDay: 100000,
        requestsPerMonth: 1000000
      }
    }
  },
  apiKeyLimits: {
    free: {
      type: Number,
      default: 2
    },
    pro: {
      type: Number,
      default: 10
    },
    enterprise: {
      type: Number,
      default: -1 // Unlimited
    }
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  globalAnnouncement: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
systemSettingsSchema.index({}, { unique: true });

export const SystemSettings = model<ISystemSettings>('SystemSettings', systemSettingsSchema);
