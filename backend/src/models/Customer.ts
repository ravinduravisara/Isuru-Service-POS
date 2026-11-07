import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  legacyId?: number;
  name: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>({
  legacyId: { type: Number, index: true },
  name: { type: String, required: true, trim: true, index: true },
  phone: { type: String, default: '', trim: true, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CustomerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);
