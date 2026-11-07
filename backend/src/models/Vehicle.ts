import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  legacyId?: number;
  customerId: mongoose.Types.ObjectId;
  vehicleNo: string;
  vehicleType: 'Car' | 'Bike' | 'Van' | 'Bus' | 'Lorry' | 'Others';
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  legacyId: { type: Number, index: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  vehicleNo: { type: String, required: true, trim: true, index: true },
  vehicleType: {
    type: String,
    enum: ['Car', 'Bike', 'Van', 'Bus', 'Lorry', 'Others'],
    default: 'Others',
    index: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

VehicleSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
