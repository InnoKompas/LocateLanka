import mongoose, { Schema, Document } from 'mongoose';

export interface IUsageLog extends Document {
  apiKeyId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  requestSize?: number;
  responseSize?: number;
}

const UsageLogSchema: Schema = new Schema({
  apiKeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ApiKey',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },
  statusCode: {
    type: Number,
    required: true
  },
  responseTime: {
    type: Number,
    required: true // in milliseconds
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  requestSize: {
    type: Number // in bytes
  },
  responseSize: {
    type: Number // in bytes
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
UsageLogSchema.index({ userId: 1, timestamp: -1 });
UsageLogSchema.index({ apiKeyId: 1, timestamp: -1 });
UsageLogSchema.index({ endpoint: 1, timestamp: -1 });
UsageLogSchema.index({ userId: 1, endpoint: 1, timestamp: -1 });

// TTL index to automatically delete old logs (optional - keep logs for 1 year)
UsageLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 });

export const UsageLog = mongoose.model<IUsageLog>('UsageLog', UsageLogSchema);
