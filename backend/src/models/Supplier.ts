import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  legacyId?: number;
  supplierCode: string; // e.g. SUP-0001
  name: string;
  contact: string;
  cashTotal: number;
  creditTotal: number;
  chequeTotal: number;
  invoice: string;
  createdAt: Date;
}

const SupplierSchema = new Schema<ISupplier>({
  legacyId: { type: Number, index: true },
  supplierCode: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  name: { type: String, required: true, trim: true, index: true },
  contact: { type: String, default: '', trim: true },
  cashTotal: { type: Number, default: 0 },
  creditTotal: { type: Number, default: 0 },
  chequeTotal: { type: Number, default: 0 },
  invoice: { type: String, default: '', trim: true },
  createdAt: { type: Date, default: Date.now },
});

export const Supplier = mongoose.model<ISupplier>('Supplier', SupplierSchema);
