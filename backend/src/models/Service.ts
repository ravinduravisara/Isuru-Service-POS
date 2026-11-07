import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  legacyId?: number;
  category: 'Car' | 'Bike' | 'Van' | 'Bus' | 'Lorry' | 'Others';
  name: string;
  price: number;
  description: string;
  createdAt: Date;
}

const ServiceSchema = new Schema<IService>({
  legacyId: { type: Number, index: true },
  category: {
    type: String,
    enum: ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'],
    default: 'Others',
    required: true,
    index: true,
  },
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0, default: 0 },
  description: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now },
});

// Unique compound index so a category cannot have duplicate service names
ServiceSchema.index({ category: 1, name: 1 }, { unique: true });

export const Service = mongoose.model<IService>('Service', ServiceSchema);
