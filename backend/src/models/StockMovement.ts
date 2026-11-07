import mongoose, { Schema, Document } from 'mongoose';

export interface IStockMovement extends Document {
  legacyId?: number;
  itemId: string;
  supplierCode: string;
  quantity: number;
  unitPrice: number;
  buyingPrice: number;
  paymentMethod: 'Cash' | 'Credit' | 'Cheque';
  movedAt: Date;
  settledAt?: Date | null;
}

const StockMovementSchema = new Schema<IStockMovement>({
  legacyId: { type: Number, index: true },
  itemId: { type: String, required: true, trim: true, index: true },
  supplierCode: { type: String, default: '', trim: true, index: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, default: 0 },
  buyingPrice: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Cheque'], default: 'Cash' },
  movedAt: { type: Date, default: Date.now, index: true },
  settledAt: { type: Date, default: null },
});

export const StockMovement = mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);
