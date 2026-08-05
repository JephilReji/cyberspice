import { Schema, model, Document } from "mongoose";

export interface IAddress {
  label: string;
  fullName: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  googleId?: string;
  isVerified: boolean;
  photoUrl?: string;
  savedAddresses: IAddress[];
  createdAt: Date;
}

const addressSchema = new Schema<IAddress>({
  label: { type: String, default: "Home" },
  fullName: { type: String, required: true },
  company: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    phone: { type: String, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
    photoUrl: { type: String },
    savedAddresses: [addressSchema],
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
