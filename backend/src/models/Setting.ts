import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: any;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true, trim: true },
  value: { type: Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema);
