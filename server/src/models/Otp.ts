import { Schema, model, Document } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

// Auto-delete expired OTPs from MongoDB
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = model<IOtp>("Otp", otpSchema);
