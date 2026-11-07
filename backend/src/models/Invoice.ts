import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  service: string;
  itemId?: string;
  description?: string;
  qty: number;
  rate: number;
  amount: number;
  buyingPrice: number;
}

export interface IInvoice extends Document {
  legacyId?: number;
  billNo: string;
  customerId: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  vehicleId: mongoose.Types.ObjectId;
  vehicleNo: string;
  vehicleType: string;
  dateTime: Date;
  subtotalAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Credit' | 'Cheque' | 'Card';
  paymentStatus: 'Paid' | 'Pending' | 'unpaid' | 'paid' | 'pending';
  paymentSettledAt?: Date | null;
  items: IInvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  service: { type: String, required: true },
  itemId: { type: String, default: '' },
  description: { type: String, default: '' },
  qty: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true, default: 0 },
  amount: { type: Number, required: true, default: 0 },
  buyingPrice: { type: Number, required: true, default: 0 },
});

const InvoiceSchema = new Schema<IInvoice>({
  legacyId: { type: Number, index: true },
  billNo: { type: String, required: true, unique: true, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  customerName: { type: String, required: true, index: true },
  customerPhone: { type: String, default: '' },
  vehicleId: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true, index: true },
  vehicleNo: { type: String, required: true, index: true },
  vehicleType: { type: String, default: 'Others' },
  dateTime: { type: Date, required: true, index: true },
  subtotalAmount: { type: Number, required: true, default: 0 },
  discountAmount: { type: Number, required: true, default: 0 },
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Credit', 'Cheque', 'Card'],
    default: 'Cash',
    index: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'unpaid', 'paid', 'pending'],
    default: 'Paid',
    index: true,
  },
  paymentSettledAt: { type: Date, default: null },
  items: [InvoiceItemSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
