import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // not required for Google-only accounts
  phone?: string;
  googleId?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false }, // excluded from queries by default
    phone: { type: String, trim: true },
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);