import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  legacyId?: number;
  itemId: string; // Unique identifier e.g. ENG-0001
  itemName: string; // Category name e.g. Engine Oil
  brand: string;
  quantity: number;
  unitPrice: number; // Selling price
  buyingPrice: number; // Cost price
  supplierCode?: string;
  paymentMethod: 'Cash' | 'Credit' | 'Cheque';
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  legacyId: { type: Number, index: true },
  itemId: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  itemName: { type: String, required: true, trim: true, index: true },
  brand: { type: String, default: '', trim: true, index: true },
  quantity: { type: Number, required: true, default: 0, min: 0 },
  unitPrice: { type: Number, required: true, default: 0, min: 0 },
  buyingPrice: { type: Number, required: true, default: 0, min: 0 },
  supplierCode: { type: String, default: '', trim: true, index: true },
  paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Cheque'], default: 'Cash' },
  updatedAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
