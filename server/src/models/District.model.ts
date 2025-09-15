import mongoose, { Schema, Document } from 'mongoose';

export interface IDistrict extends Document {
  id: number;
  name: string;
  sinhala: string;
  tamil: string;
  code: string;
  capital: string;
  province: string; // Province name for reference
  province_id: number; // Original province ID from JSON
  provinceRef: mongoose.Types.ObjectId; // Reference to Province document (will be set later)
  area: number;
  population: number;
  createdAt: Date;
  updatedAt: Date;
}

const DistrictSchema = new Schema<IDistrict>({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  sinhala: {
    type: String,
    required: true,
    trim: true
  },
  tamil: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  capital: {
    type: String,
    required: true,
    trim: true
  },
  province: {
    type: String,
    required: true,
    trim: true
  },
  province_id: {
    type: Number,
    required: true
  },
  provinceRef: {
    type: Schema.Types.ObjectId,
    ref: 'Province',
    required: false // Will be set after provinces are created
  },
  area: {
    type: Number,
    required: true,
    min: 0
  },
  population: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret: any) {
      ret._id = ret._id.toString();
      return ret;
    }
  }
});

// Indexes for performance (code and id already have unique indexes)
DistrictSchema.index({ name: 1 });
DistrictSchema.index({ province_id: 1 });
DistrictSchema.index({ provinceRef: 1 });

export const District = mongoose.model<IDistrict>('District', DistrictSchema);
