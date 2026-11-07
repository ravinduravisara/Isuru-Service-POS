import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplyInvoice extends Document {
  legacyId?: number;
  invoiceNo: string;
  supplierCode: string;
  itemId: string;
  buyingPrice: number;
  quantity: number;
  paymentStatus: 'Cash' | 'Credit' | 'Cheque';
  chequeNo?: string;
  branchCode?: string;
  bankCode?: string;
  valueDate?: Date | null;
  settledAt?: Date | null;
  createdAt: Date;
}

const SupplyInvoiceSchema = new Schema<ISupplyInvoice>({
  legacyId: { type: Number, index: true },
  invoiceNo: { type: String, required: true, trim: true, index: true },
  supplierCode: { type: String, required: true, trim: true, index: true },
  itemId: { type: String, required: true, trim: true, index: true },
  buyingPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  paymentStatus: { type: String, enum: ['Cash', 'Credit', 'Cheque'], default: 'Cash', index: true },
  chequeNo: { type: String, default: '' },
  branchCode: { type: String, default: '' },
  bankCode: { type: String, default: '' },
  valueDate: { type: Date, default: null },
  settledAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const SupplyInvoice = mongoose.model<ISupplyInvoice>('SupplyInvoice', SupplyInvoiceSchema);
