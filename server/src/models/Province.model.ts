import mongoose, { Schema, Document } from 'mongoose';

export interface IProvince extends Document {
  id: number;
  name: string;
  sinhala: string;
  tamil: string;
  code: string;
  capital: string;
  area: number;
  population: number;
  districts: mongoose.Types.ObjectId[]; // References to District documents
  createdAt: Date;
  updatedAt: Date;
}

const ProvinceSchema = new Schema<IProvince>({
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
  area: {
    type: Number,
    required: true,
    min: 0
  },
  population: {
    type: Number,
    required: true,
    min: 0
  },
  districts: [{
    type: Schema.Types.ObjectId,
    ref: 'District'
  }]
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
ProvinceSchema.index({ name: 1 });

export const Province = mongoose.model<IProvince>('Province', ProvinceSchema);
